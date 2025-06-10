import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Trophy, MessageCircle, Clock, Sparkles } from "lucide-react";
import { type MilestoneEvent } from "@/services/relationshipProgressionService";

interface MilestoneDisplayProps {
  milestones: MilestoneEvent[];
  companionName: string;
  className?: string;
}

export function MilestoneDisplay({
  milestones,
  companionName,
  className = ""
}: MilestoneDisplayProps) {
  
  const getMilestoneIcon = (type: MilestoneEvent['type']) => {
    switch (type) {
      case 'emotional':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'intimate':
        return <Sparkles className="h-4 w-4 text-pink-500" />;
      case 'conversation':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'time':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'activity':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMilestoneColor = (type: MilestoneEvent['type']) => {
    switch (type) {
      case 'emotional':
        return 'destructive';
      case 'intimate':
        return 'secondary';
      case 'conversation':
        return 'default';
      case 'time':
        return 'outline';
      case 'activity':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Sort milestones by date (newest first)
  const sortedMilestones = [...milestones].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Card className={`botbae-glass ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-botbae-accent" />
          Recent Milestones
        </CardTitle>
        <CardDescription>
          Special moments you've shared with {companionName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedMilestones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No milestones yet</p>
            <p className="text-xs">Keep chatting to unlock special moments!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMilestones.slice(0, 5).map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex-shrink-0 mt-1">
                  {getMilestoneIcon(milestone.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{milestone.title}</h4>
                    <Badge variant={getMilestoneColor(milestone.type)} className="text-xs">
                      +{milestone.progressBonus}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {milestone.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {formatDate(milestone.date)}
                    </Badge>
                    {milestone.stageUnlocked && (
                      <Badge variant="default" className="text-xs">
                        Unlocked: {milestone.stageUnlocked}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {sortedMilestones.length > 5 && (
              <div className="text-center pt-3 border-t border-muted">
                <p className="text-xs text-muted-foreground">
                  +{sortedMilestones.length - 5} more milestones
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 