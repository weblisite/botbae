import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSubscription } from "./UserSubscription";
import { PolarCheckout } from "@/components/payments/PolarCheckout";
import { NotificationsSettings } from "./NotificationsSettings";
import { SecuritySettings } from "./SecuritySettings";

const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Plan configurations matching the message limits
const PLAN_CONFIGS = {
  basic: {
    name: "Basic",
    messageLimit: 3, // Keep 3 for testing, will be 10 in production
    subscriptionStatus: "free" as const,
    isPremium: false
  },
  pro: {
    name: "Pro", 
    messageLimit: 1000,
    subscriptionStatus: "pro" as const,
    isPremium: true
  },
  elite: {
    name: "Elite",
    messageLimit: -1, // -1 means unlimited
    subscriptionStatus: "elite" as const,
    isPremium: true
  }
};

export default function SettingsForm() {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Get default tab from navigation state
  const defaultTab = location.state?.defaultTab || "profile";

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
    },
  });

  // Handle payment success callback
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const planId = urlParams.get('plan');
      const canceled = urlParams.get('canceled');

      if (canceled) {
        toast.error("Payment was canceled");
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }

      if (success && planId && user) {
        const planConfig = PLAN_CONFIGS[planId as keyof typeof PLAN_CONFIGS];
        
        if (!planConfig) {
          toast.error("Invalid subscription plan");
          return;
        }

        try {
          // Update user's subscription in database
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: planConfig.subscriptionStatus,
              message_limit: planConfig.messageLimit === -1 ? 999999 : planConfig.messageLimit, // Store large number for unlimited
              messages_used: 0, // Reset message count on upgrade
              is_premium: planConfig.isPremium,
              subscription_plan: planConfig.name,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (error) throw error;

          toast.success(`🎉 Successfully upgraded to ${planConfig.name} plan! Your message limit has been ${planConfig.messageLimit === -1 ? 'removed' : `increased to ${planConfig.messageLimit}`}.`);
          
          // Refresh profile data
          await fetchProfile();
          
          // Clean up URL parameters
          window.history.replaceState({}, '', window.location.pathname);
          
        } catch (error) {
          console.error('Error updating subscription:', error);
          toast.error("Payment successful but failed to update your account. Please contact support.");
        }
      }
    };

    handlePaymentSuccess();
  }, [user]);

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      setProfile(data);
      form.setValue("fullName", data.full_name || "");
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Failed to load profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8 h-auto p-1">
        <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 py-2">Profile</TabsTrigger>
        <TabsTrigger value="subscription" className="text-xs sm:text-sm px-2 py-2">Subscription</TabsTrigger>
        <TabsTrigger value="notifications" className="text-xs sm:text-sm px-2 py-2">Notifications</TabsTrigger>
        <TabsTrigger value="security" className="text-xs sm:text-sm px-2 py-2">Security</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account profile information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="Your email address" {...field} />
                      </FormControl>
                      <FormDescription>
                        Email cannot be changed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="subscription">
        <div className="space-y-6">
          <div data-component="polar-checkout">
            <PolarCheckout profile={profile} />
          </div>
          <div className="border-t pt-6">
            <UserSubscription profile={profile} />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsSettings />
      </TabsContent>
      
      <TabsContent value="security">
        <SecuritySettings />
      </TabsContent>
    </Tabs>
  );
}
