import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Brain, Sparkles } from "lucide-react";
import { RelationshipAwareAI } from "@/services/relationshipAwareAI";

interface ConversationSuggestionsProps {
  relationshipStage: string;
  onSuggestionClick: (suggestion: string) => void;
}

export const ConversationSuggestions: React.FC<ConversationSuggestionsProps> = ({
  relationshipStage,
  onSuggestionClick,
}) => {
  
  // Get relationship-aware conversation starters
  const suggestions = RelationshipAwareAI.generateStageAppropriateStarters(relationshipStage);
  const emotionalContext = RelationshipAwareAI.getEmotionalContext(relationshipStage);

  // Define stage-specific styling and icons
  const getStageConfig = (stage: string) => {
    switch (stage) {
      case "New Friend":
        return {
          icon: MessageCircle,
          color: "text-blue-500",
          gradient: "from-blue-50 to-indigo-50",
          buttonStyle: "border-blue-200 hover:bg-blue-50",
        };
      case "Close Friend":
        return {
          icon: Heart,
          color: "text-green-500", 
          gradient: "from-green-50 to-emerald-50",
          buttonStyle: "border-green-200 hover:bg-green-50",
        };
      case "Best Friend":
        return {
          icon: Brain,
          color: "text-purple-500",
          gradient: "from-purple-50 to-violet-50", 
          buttonStyle: "border-purple-200 hover:bg-purple-50",
        };
      case "Romantic Interest":
        return {
          icon: Heart,
          color: "text-pink-500",
          gradient: "from-pink-50 to-rose-50",
          buttonStyle: "border-pink-200 hover:bg-pink-50",
        };
      case "Dating":
        return {
          icon: Heart,
          color: "text-red-500",
          gradient: "from-red-50 to-pink-50",
          buttonStyle: "border-red-200 hover:bg-red-50",
        };
      case "Committed Partner":
        return {
          icon: Sparkles,
          color: "text-purple-600",
          gradient: "from-purple-50 to-pink-50",
          buttonStyle: "border-purple-300 hover:bg-purple-50",
        };
      case "Soulmate":
        return {
          icon: Sparkles,
          color: "text-violet-600",
          gradient: "from-violet-50 to-purple-50",
          buttonStyle: "border-violet-300 hover:bg-violet-50",
        };
      default:
        return {
          icon: MessageCircle,
          color: "text-gray-500",
          gradient: "from-gray-50 to-slate-50",
          buttonStyle: "border-gray-200 hover:bg-gray-50",
        };
    }
  };

  const stageConfig = getStageConfig(relationshipStage);
  const IconComponent = stageConfig.icon;

  return (
    <Card className={`bg-gradient-to-br ${stageConfig.gradient} border-0 shadow-sm`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IconComponent className={`h-5 w-5 ${stageConfig.color}`} />
          Conversation Starters
          <span className="text-sm font-normal text-gray-600 ml-auto">
            {emotionalContext.affectionLevel}
          </span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          {emotionalContext.responseStyle} • Stage: {relationshipStage}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full text-left justify-start h-auto py-3 px-4 ${stageConfig.buttonStyle} text-gray-700 hover:text-gray-900 transition-colors`}
            onClick={() => onSuggestionClick(suggestion)}
          >
            <span className="text-sm leading-relaxed">{suggestion}</span>
          </Button>
        ))}
        
        <div className="mt-4 p-3 bg-white/60 rounded-lg border border-white/40">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-medium">Conversation Mood:</span> {emotionalContext.primaryEmotions.join(", ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 