import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BotbaeConfig {
  name: string;
  gender: string;
  ethnicity: string;
  style: string;
  bodyType: string;
  hairType: string;
  personality: {
    humor: number;
    empathy: number;
    intellect: number;
    confidence: number;
    creativity: number;
    curiosity: number;
  };
}

interface CustomizationFormProps {
  botbaeConfig: BotbaeConfig;
  updateBotbaeConfig: (newConfig: Partial<BotbaeConfig>) => Promise<void>;
  onSave: () => Promise<void> | void;
  onCancel: () => Promise<void> | void;
}

export function CustomizationForm({
  botbaeConfig,
  updateBotbaeConfig,
  onSave,
  onCancel,
}: CustomizationFormProps) {
  const [localConfig, setLocalConfig] = useState<BotbaeConfig>({...botbaeConfig});
  
  const updatePersonality = (trait: keyof typeof localConfig.personality, value: number) => {
    setLocalConfig({
      ...localConfig,
      personality: {
        ...localConfig.personality,
        [trait]: value,
      },
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBotbaeConfig(localConfig);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <p className="text-muted-foreground">
          Personalize your AI companion's appearance and personality to match your preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Appearance</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={localConfig.name}
              onChange={(e) => setLocalConfig({ ...localConfig, name: e.target.value })}
              className="botbae-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={localConfig.gender}
              onValueChange={(value) => setLocalConfig({ ...localConfig, gender: value })}
            >
              <SelectTrigger className="botbae-input">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Non-binary">Non-binary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ethnicity">Ethnicity</Label>
            <Select
              value={localConfig.ethnicity}
              onValueChange={(value) => setLocalConfig({ ...localConfig, ethnicity: value })}
            >
              <SelectTrigger className="botbae-input">
                <SelectValue placeholder="Select ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asian">Asian</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
                <SelectItem value="Hispanic">Hispanic</SelectItem>
                <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select
              value={localConfig.style}
              onValueChange={(value) => setLocalConfig({ ...localConfig, style: value })}
            >
              <SelectTrigger className="botbae-input">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Athletic">Athletic</SelectItem>
                <SelectItem value="Artistic">Artistic</SelectItem>
                <SelectItem value="Elegant">Elegant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bodyType">Body Type</Label>
            <Select
              value={localConfig.bodyType}
              onValueChange={(value) => setLocalConfig({ ...localConfig, bodyType: value })}
            >
              <SelectTrigger className="botbae-input">
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Athletic">Athletic</SelectItem>
                <SelectItem value="Slim">Slim</SelectItem>
                <SelectItem value="Curvy">Curvy</SelectItem>
                <SelectItem value="Muscular">Muscular</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hairType">Hair Type</Label>
            <Select
              value={localConfig.hairType}
              onValueChange={(value) => setLocalConfig({ ...localConfig, hairType: value })}
            >
              <SelectTrigger className="botbae-input">
                <SelectValue placeholder="Select hair type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Straight">Straight</SelectItem>
                <SelectItem value="Wavy">Wavy</SelectItem>
                <SelectItem value="Curly">Curly</SelectItem>
                <SelectItem value="Coiled">Coiled</SelectItem>
                <SelectItem value="Kinky">Kinky</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personality</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="humor">Humor</Label>
                <span className="text-sm">{localConfig.personality.humor}%</span>
              </div>
              <Slider
                id="humor"
                min={0}
                max={100}
                step={5}
                value={[localConfig.personality.humor]}
                onValueChange={([value]) => updatePersonality("humor", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Serious</span>
                <span>Playful</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="empathy">Empathy</Label>
                <span className="text-sm">{localConfig.personality.empathy}%</span>
              </div>
              <Slider
                id="empathy"
                min={0}
                max={100}
                step={5}
                value={[localConfig.personality.empathy]}
                onValueChange={([value]) => updatePersonality("empathy", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Rational</span>
                <span>Compassionate</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="intellect">Intellect</Label>
                <span className="text-sm">{localConfig.personality.intellect}%</span>
              </div>
              <Slider
                id="intellect"
                min={0}
                max={100}
                step={5}
                value={[localConfig.personality.intellect]}
                onValueChange={([value]) => updatePersonality("intellect", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Casual</span>
                <span>Intellectual</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="confidence">Confidence</Label>
                <span className="text-sm">{localConfig.personality.confidence}%</span>
              </div>
              <Slider
                id="confidence"
                min={0}
                max={100}
                step={5}
                value={[localConfig.personality.confidence]}
                onValueChange={([value]) => updatePersonality("confidence", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Reserved</span>
                <span>Confident</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="creativity">Creativity</Label>
                <span className="text-sm">{localConfig.personality.creativity}%</span>
              </div>
              <Slider
                id="creativity"
                min={0}
                max={100}
                step={5}
                value={[localConfig.personality.creativity]}
                onValueChange={([value]) => updatePersonality("creativity", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Practical</span>
                <span>Creative</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="curiosity">Curiosity</Label>
                <span className="text-sm">{localConfig.personality.curiosity}%</span>
              </div>
              <Slider
                id="curiosity"
                min={0}
                max={100}
                step={5}
                value={[localConfig.personality.curiosity]}
                onValueChange={([value]) => updatePersonality("curiosity", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Content</span>
                <span>Curious</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t border-muted">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="botbae-button">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
