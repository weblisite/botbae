import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, BellOff } from "lucide-react";

const notificationsFormSchema = z.object({
  isEnabled: z.boolean(),
  phoneNumber: z.string().optional(),
  morningTime: z.string().optional(),
  eveningTime: z.string().optional(),
  notificationTypes: z.array(z.string()).optional(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

const notificationItems = [
  { id: "good_morning", label: "Good Morning Messages" },
  { id: "good_night", label: "Good Night Messages" },
  { id: "relationship_milestones", label: "Relationship Milestones" },
  { id: "special_occasions", label: "Special Occasions" },
];

export function NotificationsSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<any>(null);

  // Create form
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      isEnabled: false,
      phoneNumber: "",
      morningTime: "08:00",
      eveningTime: "22:00",
      notificationTypes: [],
    },
  });

  // Fetch notification preferences
  useEffect(() => {
    async function fetchPreferences() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('sms_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setPreferences(data);
          form.setValue("isEnabled", data.is_enabled || false);
          form.setValue("phoneNumber", data.phone_number || "");
          form.setValue("morningTime", data.morning_time || "08:00");
          form.setValue("eveningTime", data.evening_time || "22:00");
          form.setValue("notificationTypes", data.notifications_types || []);
        }
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
      }
    }
    
    fetchPreferences();
  }, [user, form]);

  // Save notification preferences
  async function onSubmit(data: NotificationsFormValues) {
    if (!user) return;
    
    setLoading(true);
    try {
      // If we have preferences, update them
      if (preferences) {
        const { error } = await supabase
          .from('sms_preferences')
          .update({
            is_enabled: data.isEnabled,
            phone_number: data.phoneNumber,
            morning_time: data.morningTime,
            evening_time: data.eveningTime,
            notifications_types: data.notificationTypes,
          })
          .eq('id', preferences.id);
          
        if (error) throw error;
      } else {
        // Otherwise, insert new preferences
        const { error } = await supabase
          .from('sms_preferences')
          .insert({
            user_id: user.id,
            is_enabled: data.isEnabled,
            phone_number: data.phoneNumber,
            morning_time: data.morningTime,
            evening_time: data.eveningTime,
            notifications_types: data.notificationTypes,
          });
          
        if (error) throw error;
      }
      
      toast.success("Notification settings saved successfully");
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error("Failed to save notification settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how and when you want to receive notifications from your Botbae.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="space-y-0.5">
                <h3 className="text-lg font-medium">SMS Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Enable or disable SMS notifications from your Botbae.
                </p>
              </div>
              <FormField
                control={form.control}
                name="isEnabled"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {field.value ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {form.watch("isEnabled") && (
              <>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your phone number with country code.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="morningTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Morning Message Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="eveningTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evening Message Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notificationTypes"
                  render={() => (
                    <FormItem>
                      <FormLabel>Notification Types</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {notificationItems.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="notificationTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value || [], item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Notification Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
