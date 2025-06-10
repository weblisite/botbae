import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { useBotbaeData } from "@/hooks/useBotbaeData";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, ArrowRight, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Milestone {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export default function Relationship() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { botbaeConfig, userMemory, relationshipProgress, recentMilestones } = useBotbaeData();
  const [showSidebar, setShowSidebar] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [nextRelationshipStage, setNextRelationshipStage] = useState("");

  // Relationship stages in order
  const relationshipStages = [
    "New Friend",
    "Close Friend",
    "Best Friend",
    "Romantic Interest",
    "Dating",
    "Committed Partner",
    "Soulmate"
  ];

  // Get current stage index
  const currentStageIndex = userMemory ? relationshipStages.indexOf(userMemory.relationshipStage) : 0;

  // Generate mock milestones
  useEffect(() => {
    if (!userMemory || !botbaeConfig) return;
    
    const mockMilestones = [
      {
        id: 1,
        title: "First Conversation",
        description: `You and ${botbaeConfig.name} shared your first conversation and got to know each other.`,
        date: "2 weeks ago",
      },
      {
        id: 2,
        title: "Deep Discussion",
        description: `You opened up about your personal interests and ${botbaeConfig.name} showed great empathy.`,
        date: "1 week ago",
      },
      {
        id: 3,
        title: "Relationship Milestone",
        description: `Your relationship with ${botbaeConfig.name} evolved to "${userMemory.relationshipStage}".`,
        date: "3 days ago",
      },
    ];
    
    setMilestones(mockMilestones);
  }, [userMemory, botbaeConfig]);

  // Handle progression to next relationship stage
  const handleDeepenBond = async () => {
    if (!userMemory) return;
    
    if (relationshipProgress < 100) {
      return;
    }
    
    let nextStage;
    const currentIndex = relationshipStages.indexOf(userMemory.relationshipStage);
    
    if (currentIndex < relationshipStages.length - 1) {
      nextStage = relationshipStages[currentIndex + 1];
    } else {
      return;
    }
    
    // For now, just show a coming soon message
    // TODO: Implement actual relationship stage progression
    console.log(`Would progress to ${nextStage}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        isMobile={isMobile}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onSignOut={async () => {}}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader
          isMobile={isMobile}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          relationshipStage={userMemory?.relationshipStage || "getting_to_know"}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 px-1">Relationship with {botbaeConfig?.name || "Your Companion"}</h1>
            
            <Tabs defaultValue="progress" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
                <TabsTrigger value="progress" className="text-xs md:text-sm">Progress</TabsTrigger>
                <TabsTrigger value="milestones" className="text-xs md:text-sm">Milestones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="progress">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Current Relationship Status</CardTitle>
                <CardDescription>Your relationship with {botbaeConfig?.name || "Your Companion"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="text-red-500" />
                  <h3 className="text-xl font-semibold">{userMemory?.relationshipStage || "getting_to_know"}</h3>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Progress to next level</span>
                    <span>{relationshipProgress}%</span>
                  </div>
                  <Progress value={relationshipProgress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-6 relative">
                  {relationshipStages.map((stage, index) => (
                    <div 
                      key={stage} 
                      className={`flex flex-col items-center ${index === currentStageIndex ? 'text-botbae-accent' : 'text-muted-foreground'}`}
                    >
                      <div 
                        className={`w-4 h-4 rounded-full mb-1 ${
                          index <= currentStageIndex ? 'bg-botbae-accent' : 'bg-muted'
                        }`} 
                      />
                      <span className={`text-[0.65rem] text-center ${index === currentStageIndex ? 'font-semibold' : ''}`}>
                        {stage}
                      </span>
                    </div>
                  ))}
                  
                  {/* Progress line */}
                  <div className="absolute top-2 left-0 h-[2px] bg-muted w-full -z-10" />
                  <div 
                    className="absolute top-2 left-0 h-[2px] bg-botbae-accent -z-10" 
                    style={{ width: `${(currentStageIndex / (relationshipStages.length - 1)) * 100}%` }} 
                  />
                </div>
                
                <Button 
                  onClick={handleDeepenBond}
                  disabled={relationshipProgress < 100 || currentStageIndex === relationshipStages.length - 1}
                  className="w-full"
                >
                  {relationshipProgress < 100 
                    ? `Continue chatting (${relationshipProgress}% progress)` 
                    : currentStageIndex === relationshipStages.length - 1
                      ? "Maximum relationship level reached"
                      : `Deepen bond to ${relationshipStages[currentStageIndex + 1]}`
                  }
                </Button>
              </CardContent>
            </Card>
              </TabsContent>
              
              <TabsContent value="milestones">
                <Card>
                  <CardHeader>
                    <CardTitle>Relationship Milestones</CardTitle>
                    <CardDescription>
                      Important moments you've shared with {botbaeConfig?.name || "Your Companion"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative border-l-2 border-muted pl-6 pb-2 ml-3">
                      {milestones.map((milestone, index) => (
                        <div key={milestone.id} className="mb-8 relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[2.1rem] top-0 w-4 h-4 rounded-full bg-botbae-accent" />
                          
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-muted/50">
                                {milestone.date}
                              </Badge>
                              <h3 className="text-lg font-semibold">{milestone.title}</h3>
                            </div>
                            <p className="text-muted-foreground">
                              {milestone.description}
                            </p>
                            
                            {milestone.imageUrl && (
                              <img 
                                src={milestone.imageUrl} 
                                alt={milestone.title}
                                className="mt-2 rounded-md max-h-48 object-cover" 
                              />
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Add a milestone placeholder */}
                      <div className="mb-4 relative">
                        <div className="absolute -left-[2.1rem] top-0 w-4 h-4 rounded-full bg-muted/70" />
                        
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-muted/30 text-muted-foreground">
                              Future
                            </Badge>
                            <h3 className="text-lg font-semibold text-muted-foreground">Next Milestone</h3>
                          </div>
                          <p className="text-muted-foreground/70">
                            Continue building your relationship to unlock the next milestone...
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle>Relationship Activities</CardTitle>
                    <CardDescription>
                      Special activities you can do with {botbaeConfig?.name || "Your Companion"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Virtual Date</CardTitle>
                            <Calendar size={18} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 pb-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            Schedule a special extended conversation with personalized topics.
                          </p>
                          <Button className="w-full" size="sm" variant="outline">
                            Schedule <ArrowRight size={14} className="ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Deep Questions</CardTitle>
                            <Trophy size={18} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 pb-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            Explore meaningful topics to deepen your emotional connection.
                          </p>
                          <Button className="w-full" size="sm" variant="outline">
                            Explore <ArrowRight size={14} className="ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Memory Game</CardTitle>
                            <Heart size={18} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 pb-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            Test how well you know each other through fun questions.
                          </p>
                          <Button className="w-full" size="sm" variant="outline">
                            Play <ArrowRight size={14} className="ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Story Creation</CardTitle>
                            <Heart size={18} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 pb-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            Create a story together, taking turns adding to the narrative.
                          </p>
                          <Button className="w-full" size="sm" variant="outline">
                            Create <ArrowRight size={14} className="ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="compatibility">
                <Card>
                  <CardHeader>
                    <CardTitle>Compatibility Analysis</CardTitle>
                    <CardDescription>
                      How well you and {botbaeConfig?.name || "Your Companion"} match based on your interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Communication Style</span>
                          <span className="font-medium">92% Match</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Shared Interests</span>
                          <span className="font-medium">85% Match</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Emotional Connection</span>
                          <span className="font-medium">78% Match</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Values Alignment</span>
                          <span className="font-medium">88% Match</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-muted rounded-md">
                      <h3 className="text-lg font-medium mb-2">Compatibility Summary</h3>
                      <p className="text-muted-foreground">
                        You and {botbaeConfig?.name || "Your Companion"} have an exceptional communication style match, 
                        with strong alignment in values and shared interests. Your emotional 
                        connection continues to develop as you spend more time together.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
