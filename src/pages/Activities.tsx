import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { useBotbaeData } from "@/hooks/useBotbaeData";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, MessageSquare, Rocket, ArrowRight, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function Activities() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { botbaeConfig, userMemory } = useBotbaeData();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("18:00");

  // Activities data
  const activities = [
    {
      id: "virtual-date",
      title: "Virtual Date",
      description: "Spend quality time with deep conversation topics and shared activities",
      icon: <MapPin className="h-5 w-5" />,
      duration: "30-60 minutes",
      premium: false
    },
    {
      id: "role-play",
      title: "Role Play Scenario",
      description: "Immerse yourself in creative scenarios and storylines together",
      icon: <Rocket className="h-5 w-5" />,
      duration: "15-30 minutes",
      premium: true
    },
    {
      id: "daily-check-in",
      title: "Daily Check-in",
      description: "Share your day and get meaningful responses",
      icon: <MessageSquare className="h-5 w-5" />,
      duration: "10-15 minutes",
      premium: false
    },
    {
      id: "relationship-discussion",
      title: "Relationship Discussion",
      description: "Explore feelings, expectations and deepen your connection",
      icon: <Clock className="h-5 w-5" />,
      duration: "20-30 minutes", 
      premium: true
    }
  ];

  // Handle scheduling an activity
  const handleScheduleActivity = () => {
    if (!selectedActivity || !date || !selectedTime) {
      toast.error("Please select an activity, date and time");
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setShowActivityDialog(false);
      toast.success("Activity scheduled successfully!");
    }, 1000);
  };

  // Show loading state
  if (!userMemory || !botbaeConfig) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-botbae-accent mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-white">Loading activities...</h2>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold mb-6">Activities with {botbaeConfig.name}</h1>
            
            <Tabs defaultValue="calendar">
              <TabsList className="mb-6">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Calendar</CardTitle>
                    <CardDescription>
                      Schedule and manage your activities with {botbaeConfig.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button onClick={() => setShowActivityDialog(true)}>
                          Schedule New Activity
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">Upcoming Activities</h3>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Virtual Date</h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(date!.getTime() + 24 * 60 * 60 * 1000), "PPP")} at 7:00 PM
                              </p>
                            </div>
                            <Button variant="outline" size="sm">Reschedule</Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Daily Check-in</h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(date!.getTime() + 2 * 24 * 60 * 60 * 1000), "PPP")} at 9:00 AM
                              </p>
                            </div>
                            <Button variant="outline" size="sm">Reschedule</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Activities</CardTitle>
                    <CardDescription>
                      Choose from various activities to enhance your relationship
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activities.map((activity) => (
                        <Card key={activity.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {activity.icon}
                                <CardTitle className="text-base">{activity.title}</CardTitle>
                              </div>
                              {activity.premium && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2 pb-4">
                            <p className="text-sm text-muted-foreground mb-2">
                              {activity.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Duration: {activity.duration}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button 
                              className="w-full" 
                              size="sm" 
                              onClick={() => {
                                setSelectedActivity(activity.id);
                                setShowActivityDialog(true);
                              }}
                            >
                              Schedule <ArrowRight size={14} className="ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                    <CardDescription>
                      Past activities and experiences with {botbaeConfig.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Virtual Date</h4>
                            <p className="text-sm text-muted-foreground">
                              One week ago
                            </p>
                            <p className="text-sm mt-2">
                              You discussed travel destinations and shared stories about your favorite trips.
                            </p>
                          </div>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Daily Check-in</h4>
                            <p className="text-sm text-muted-foreground">
                              Two weeks ago
                            </p>
                            <p className="text-sm mt-2">
                              You shared about your day and {botbaeConfig.name} offered supportive advice.
                            </p>
                          </div>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Schedule Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule an Activity</DialogTitle>
            <DialogDescription>
              Schedule time with {botbaeConfig.name} for a special activity.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="activity" className="text-right">
                Activity
              </label>
              <select 
                id="activity" 
                className="col-span-3 p-2 rounded-md border" 
                value={selectedActivity || ''} 
                onChange={(e) => setSelectedActivity(e.target.value)}
              >
                <option value="">Select an activity</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                Date
              </label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="time" className="text-right">
                Time
              </label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right">
                Notes
              </label>
              <Input
                id="notes"
                placeholder="Optional notes for this activity"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleScheduleActivity}>
              Schedule Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
