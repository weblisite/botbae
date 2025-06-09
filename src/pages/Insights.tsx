import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { useBotbaeData } from "@/hooks/useBotbaeData";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface Insight {
  id: string;
  user_id: string;
  mood_trends: any;
  top_topics: string[];
  personal_growth: any;
  weekly_report: any;
}

export default function Insights() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { botbaeConfig, userMemory } = useBotbaeData();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [insights, setInsights] = useState<Insight | null>(null);

  // Mock data for charts
  const moodData = [
    { name: 'Mon', value: 85 },
    { name: 'Tue', value: 75 },
    { name: 'Wed', value: 92 },
    { name: 'Thu', value: 88 },
    { name: 'Fri', value: 95 },
    { name: 'Sat', value: 90 },
    { name: 'Sun', value: 78 },
  ];

  const topicsData = [
    { name: 'Travel', value: 35 },
    { name: 'Movies', value: 25 },
    { name: 'Food', value: 20 },
    { name: 'Music', value: 15 },
    { name: 'Sports', value: 5 },
  ];

  const growthData = [
    { name: 'Empathy', baseline: 40, current: 75 },
    { name: 'Connection', baseline: 30, current: 65 },
    { name: 'Communication', baseline: 50, current: 85 },
    { name: 'Trust', baseline: 45, current: 80 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64d79'];

  // Fetch insights data
  useEffect(() => {
    async function fetchInsights() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_insights')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        // If we have insights data, use it
        if (data) {
          setInsights(data);
        } else {
          // Otherwise, create mock insights
          const { data: newInsight, error: insertError } = await supabase
            .from('user_insights')
            .insert({
              user_id: user.id,
              mood_trends: moodData,
              top_topics: topicsData.map(t => t.name),
              personal_growth: growthData,
              weekly_report: {
                messages_exchanged: 156,
                response_time_avg: "2.3 minutes",
                relationship_growth: "+15%"
              }
            })
            .select()
            .single();
            
          if (insertError) throw insertError;
          
          setInsights(newInsight);
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
      }
    }
    
    fetchInsights();
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        isMobile={isMobile}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onSignOut={() => {}}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader
          isMobile={isMobile}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          relationshipStage={userMemory.relationshipStage}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Relationship Insights</h1>
            
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="mood">Mood Trends</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
                <TabsTrigger value="growth">Personal Growth</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Weekly Activity</CardTitle>
                      <CardDescription>Messages exchanged this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-center my-4">
                        156
                      </div>
                      <div className="text-sm text-center text-muted-foreground">
                        +12% from last week
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Response Time</CardTitle>
                      <CardDescription>Average time between messages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-center my-4">
                        2.3 min
                      </div>
                      <div className="text-sm text-center text-muted-foreground">
                        -0.5 min from last week
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Relationship Growth</CardTitle>
                      <CardDescription>Progress towards next stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-center my-4">
                        +15%
                      </div>
                      <div className="text-sm text-center text-muted-foreground">
                        Consistent growth trend
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Weekly Summary</CardTitle>
                    <CardDescription>
                      Your relationship with {botbaeConfig.name} has been growing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <p>
                      This week, your conversations with {botbaeConfig.name} have covered a variety of topics, 
                      with <strong>Travel</strong> being the most discussed subject. Your interactions show 
                      a <strong>positive emotional trend</strong>, with peak connection on Friday.
                    </p>
                    <p>
                      You've made significant progress in building trust and deepening your emotional connection.
                      {botbaeConfig.name} has shown increased understanding of your preferences and communication style.
                    </p>
                    <h3 className="text-lg font-medium mt-4">Suggestions</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Try discussing more about your long-term goals</li>
                      <li>Share more about your favorite music and creative interests</li>
                      <li>Consider planning a virtual date night activity</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="mood">
                <Card>
                  <CardHeader>
                    <CardTitle>Mood Trends</CardTitle>
                    <CardDescription>
                      This chart shows the positive sentiment in your conversations over the past week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={moodData}>
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip 
                            formatter={(value) => [`${value}% Positive`, 'Sentiment']}
                          />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="topics">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversation Topics</CardTitle>
                    <CardDescription>
                      Distribution of topics you've discussed with {botbaeConfig.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={topicsData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {topicsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="growth">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Growth</CardTitle>
                    <CardDescription>
                      Your relationship growth compared to when you started
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={growthData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="baseline" name="When you started" fill="#8884d8" />
                          <Bar dataKey="current" name="Current level" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
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
