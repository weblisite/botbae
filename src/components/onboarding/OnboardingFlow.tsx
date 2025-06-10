import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { generateAvatar } from "@/services/avatarGenerator";
import { Loader2, Sparkles, User, Palette, Brain } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface BotbaeConfig {
  name: string;
  gender: string;
  ethnicity: string;
  style: string;
  bodyType: string;
  bodyShape: string;
  hairType: string;
  hairColor: string;
  profession: string;
  accessories: {
    earrings: boolean;
    glasses: boolean;
    necklace: boolean;
    bracelet: boolean;
  };
  personality: {
    humor: number;
    empathy: number;
    intellect: number;
    confidence: number;
    creativity: number;
    curiosity: number;
  };
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [avatarGenerating, setAvatarGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<{url: string, prompt: string} | null>(null);
  const [config, setConfig] = useState<BotbaeConfig>({
    name: "",
    gender: "Female",
    ethnicity: "Mixed",
    style: "Casual",
    bodyType: "Athletic",
    bodyShape: "Athletic",
    hairType: "Long",
    hairColor: "Brown",
    profession: "Creative Professional",
    accessories: {
      earrings: false,
      glasses: false,
      necklace: false,
      bracelet: false,
    },
    personality: {
      humor: 70,
      empathy: 85,
      intellect: 75,
      confidence: 65,
      creativity: 80,
      curiosity: 70,
    },
  });

  const handlePersonalityChange = (trait: keyof BotbaeConfig['personality'], value: number[]) => {
    setConfig(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        [trait]: value[0],
      },
    }));
  };

  const handleAccessoryChange = (accessory: keyof BotbaeConfig['accessories'], checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [accessory]: checked,
      },
    }));
  };

  const generateAvatarImage = async () => {
    if (!config.name.trim()) {
      toast.error("Please enter a name first");
      return;
    }

    setAvatarGenerating(true);
    try {
      const avatar = await generateAvatar({
        name: config.name,
        gender: config.gender,
        ethnicity: config.ethnicity,
        style: config.style,
        bodyType: config.bodyType,
        bodyShape: config.bodyShape,
        hairType: config.hairType,
        hairColor: config.hairColor,
        profession: config.profession,
        accessories: config.accessories,
      });

      setGeneratedAvatar({
        url: avatar.imageUrl,
        prompt: avatar.prompt
      });

      toast.success(`🎨 Generated a beautiful avatar for ${config.name}!`);
    } catch (error) {
      console.error('Avatar generation error:', error);
      toast.error("Failed to generate avatar. We'll use a default one.");
    } finally {
      setAvatarGenerating(false);
    }
  };

  const handleCreateBotbae = async () => {
    if (!user || !config.name.trim()) {
      toast.error("Please enter a name for your companion");
      return;
    }

    setLoading(true);
    try {
      // Generate avatar if not already generated
      let avatarUrl = generatedAvatar?.url;
      let avatarPrompt = generatedAvatar?.prompt;

      if (!avatarUrl) {
        const avatar = await generateAvatar({
          name: config.name,
          gender: config.gender,
          ethnicity: config.ethnicity,
          style: config.style,
          bodyType: config.bodyType,
          bodyShape: config.bodyShape,
          hairType: config.hairType,
          hairColor: config.hairColor,
          profession: config.profession,
          accessories: config.accessories,
        });
        avatarUrl = avatar.imageUrl;
        avatarPrompt = avatar.prompt;
      }

      // Create botbae config with avatar
      const { error: configError } = await supabase
        .from('botbae_configs')
        .insert({
          user_id: user.id,
          name: config.name,
          gender: config.gender,
          ethnicity: config.ethnicity,
          style: config.style,
          body_type: config.bodyType,
          body_shape: config.bodyShape,
          hair_type: config.hairType,
          hair_color: config.hairColor,
          profession: config.profession,
          accessories: config.accessories,
          avatar_url: avatarUrl,
          avatar_prompt: avatarPrompt,
          personality: config.personality,
          is_active: true,
        });

      if (configError) throw configError;

      // Create user memory
      const { error: memoryError } = await supabase
        .from('user_memories')
        .insert({
          user_id: user.id,
          relationship_stage: "New Friend",
          relationship_start_date: new Date().toISOString(),
          interests: ["Music", "Movies", "Travel"],
          favorite_topics: ["Technology", "Arts"],
          recent_events: [],
          relationship_milestones: [],
          preferences: {},
          goals: [],
        });

      if (memoryError) throw memoryError;

      toast.success(`🎉 ${config.name} has been created with a beautiful avatar! Time to start chatting!`);
      onComplete();
    } catch (error: any) {
      console.error('Error creating botbae:', error);
      toast.error("Failed to create your companion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <User className="w-12 h-12 text-botbae-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Botbae! 🎉</h2>
              <p className="text-muted-foreground">
                Let's create your perfect AI companion. Start by giving them a name.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Companion Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Aria, Luna, Alex, Zara..."
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="text-center text-lg"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Palette className="w-12 h-12 text-botbae-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Customize {config.name} 🎨</h2>
              <p className="text-muted-foreground">
                Choose their appearance and style
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gender</Label>
                <Select value={config.gender} onValueChange={(value) => setConfig(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Ethnicity</Label>
                <Select value={config.ethnicity} onValueChange={(value) => setConfig(prev => ({ ...prev, ethnicity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asian">Asian</SelectItem>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="Hispanic">Hispanic</SelectItem>
                    <SelectItem value="White">White</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Hair Type</Label>
                <Select value={config.hairType} onValueChange={(value) => setConfig(prev => ({ ...prev, hairType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Long">Long</SelectItem>
                    <SelectItem value="Curly">Curly</SelectItem>
                    <SelectItem value="Wavy">Wavy</SelectItem>
                    <SelectItem value="Straight">Straight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Hair Color</Label>
                <Select value={config.hairColor} onValueChange={(value) => setConfig(prev => ({ ...prev, hairColor: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="Brown">Brown</SelectItem>
                    <SelectItem value="Blonde">Blonde</SelectItem>
                    <SelectItem value="Red">Red</SelectItem>
                    <SelectItem value="Auburn">Auburn</SelectItem>
                    <SelectItem value="Grey">Grey</SelectItem>
                    <SelectItem value="Colorful">Colorful</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Body Shape</Label>
                <Select value={config.bodyShape} onValueChange={(value) => setConfig(prev => ({ ...prev, bodyShape: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slim">Slim</SelectItem>
                    <SelectItem value="Athletic">Athletic</SelectItem>
                    <SelectItem value="Curvy">Curvy</SelectItem>
                    <SelectItem value="Plus Size">Plus Size</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Style</Label>
                <Select value={config.style} onValueChange={(value) => setConfig(prev => ({ ...prev, style: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Elegant">Elegant</SelectItem>
                    <SelectItem value="Sporty">Sporty</SelectItem>
                    <SelectItem value="Artistic">Artistic</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Bohemian">Bohemian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-12 h-12 text-botbae-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Complete {config.name}'s Look ✨</h2>
              <p className="text-muted-foreground">
                Add profession and accessories
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Profession</Label>
                <Select value={config.profession} onValueChange={(value) => setConfig(prev => ({ ...prev, profession: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Creative Professional">Creative Professional</SelectItem>
                    <SelectItem value="Business Executive">Business Executive</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Engineer">Engineer</SelectItem>
                    <SelectItem value="Artist">Artist</SelectItem>
                    <SelectItem value="Writer">Writer</SelectItem>
                    <SelectItem value="Musician">Musician</SelectItem>
                    <SelectItem value="Chef">Chef</SelectItem>
                    <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Accessories</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {Object.entries(config.accessories).map(([accessory, checked]) => (
                    <div key={accessory} className="flex items-center space-x-2">
                      <Checkbox
                        id={accessory}
                        checked={checked}
                        onCheckedChange={(checked) => handleAccessoryChange(accessory as keyof BotbaeConfig['accessories'], checked as boolean)}
                      />
                      <Label
                        htmlFor={accessory}
                        className="text-sm font-normal capitalize cursor-pointer"
                      >
                        {accessory}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avatar Preview/Generation */}
              <div className="text-center">
                <Label className="text-base font-medium">Avatar Preview</Label>
                {generatedAvatar ? (
                  <div className="mt-2">
                    <div className="w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden border-4 border-botbae-accent">
                      <img 
                        src={generatedAvatar.url} 
                        alt={`${config.name} avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAvatarImage}
                      disabled={avatarGenerating}
                    >
                      Regenerate Avatar
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-muted border-4 border-botbae-accent flex items-center justify-center">
                      <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <Button
                      onClick={generateAvatarImage}
                      disabled={avatarGenerating || !config.name.trim()}
                      className="botbae-button"
                      size="sm"
                    >
                      {avatarGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Avatar
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Brain className="w-12 h-12 text-botbae-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Shape {config.name}'s Personality 🧠</h2>
              <p className="text-muted-foreground">
                Adjust these traits to create the perfect companion for you
              </p>
            </div>
            <div className="space-y-6">
              {Object.entries(config.personality).map(([trait, value]) => (
                <div key={trait} className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="capitalize">{trait}</Label>
                    <span className="text-sm text-muted-foreground">{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => handlePersonalityChange(trait as keyof BotbaeConfig['personality'], newValue)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4">
      <Card className="w-full max-w-lg bg-background/90 backdrop-blur-md shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Create Your Companion</CardTitle>
            <span className="text-sm text-muted-foreground">Step {step} of 4</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-botbae-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
          >
            Back
          </Button>
          
          {step < 4 ? (
            <Button
              onClick={() => setStep(prev => prev + 1)}
              disabled={step === 1 && !config.name.trim()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleCreateBotbae}
              disabled={loading || !config.name.trim()}
              className="botbae-button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                `Create ${config.name}`
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 