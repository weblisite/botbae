import { EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BotbaeAvatar } from "@/components/chat/Avatar";

interface BotbaeConfig {
  name: string;
  gender: string;
  ethnicity: string;
  style: string;
  bodyType: string;
  hairType: string;
  hairColor?: string | null;
  bodyShape?: string | null;
  profession?: string | null;
  accessories?: {
    earrings: boolean;
    glasses: boolean;
    necklace: boolean;
    bracelet: boolean;
  } | null;
  avatar_url?: string | null;
  personality: {
    humor: number;
    empathy: number;
    intellect: number;
    confidence: number;
    creativity: number;
    curiosity: number;
  };
}

interface CompanionCardProps {
  botbaeConfig: BotbaeConfig;
  relationshipStage: string;
  relationshipProgress: number;
  onCustomizeClick: () => void;
  onDeepenBond: () => void;
}

export function CompanionCard({
  botbaeConfig,
  relationshipStage,
  relationshipProgress,
  onCustomizeClick,
  onDeepenBond,
}: CompanionCardProps) {
  // Get relationship color based on stage
  const getRelationshipColor = () => {
    switch (relationshipStage) {
      case "New Friend":
        return "bg-blue-500";
      case "Close Friend":
        return "bg-green-500";
      case "Best Friend":
        return "bg-yellow-500";
      case "Romantic Interest":
        return "bg-pink-500";
      case "Dating":
        return "bg-red-500";
      case "Committed Partner":
        return "bg-purple-500";
      case "Soulmate":
        return "bg-botbae-accent";
      default:
        return "bg-blue-500";
    }
  };

  // Get description text including new customizations
  const getDescription = () => {
    const parts = [
      botbaeConfig.gender,
      botbaeConfig.ethnicity,
      botbaeConfig.profession || botbaeConfig.style
    ].filter(Boolean);
    
    if (botbaeConfig.hairColor && botbaeConfig.hairType) {
      parts.push(`${botbaeConfig.hairColor} ${botbaeConfig.hairType.toLowerCase()} hair`);
    }
    
    return parts.join(" • ");
  };

  return (
    <div className="botbae-glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Botbae</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-botbae-accent"
          onClick={onCustomizeClick}
        >
          <EditIcon size={18} className="mr-1" />
          Customize
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <BotbaeAvatar
            botbae={{
              name: botbaeConfig.name,
              avatar_url: botbaeConfig.avatar_url,
              gender: botbaeConfig.gender,
              ethnicity: botbaeConfig.ethnicity,
            }}
            mood="friendly"
            size="xl"
            className="shadow-lg"
          />
          <div className={cn(
            "absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-card",
            getRelationshipColor()
          )}></div>
        </div>
        
        {/* Info */}
        <div className="flex-grow space-y-4">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold">{botbaeConfig.name}</h3>
            <p className="text-muted-foreground">
              {getDescription()}
            </p>
            
            {/* Show accessories if any are selected */}
            {botbaeConfig.accessories && Object.values(botbaeConfig.accessories).some(Boolean) && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(botbaeConfig.accessories)
                  .filter(([_, enabled]) => enabled)
                  .map(([accessory, _]) => (
                    <span
                      key={accessory}
                      className="text-xs bg-botbae-accent/20 text-botbae-accent px-2 py-1 rounded-full capitalize"
                    >
                      {accessory}
                    </span>
                  ))}
              </div>
            )}
          </div>
          
          {/* Personality traits */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Humor</p>
              <Progress value={botbaeConfig.personality.humor} className="h-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Empathy</p>
              <Progress value={botbaeConfig.personality.empathy} className="h-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Intellect</p>
              <Progress value={botbaeConfig.personality.intellect} className="h-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence</p>
              <Progress value={botbaeConfig.personality.confidence} className="h-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Creativity</p>
              <Progress value={botbaeConfig.personality.creativity} className="h-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Curiosity</p>
              <Progress value={botbaeConfig.personality.curiosity} className="h-2" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Relationship status */}
      <div className="mt-6 pt-4 border-t border-muted">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-muted-foreground">Relationship</p>
            <p className="font-medium">{relationshipStage}</p>
          </div>
          <Button 
            className="botbae-button"
            onClick={onDeepenBond}
          >
            Deepen Our Bond
          </Button>
        </div>
        <Progress value={relationshipProgress} className="h-2" />
      </div>
    </div>
  );
}
