import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Customize from "./pages/Customize";
import Relationship from "./pages/Relationship";
import Activities from "./pages/Activities";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/auth/RequireAuth";
import About from "./pages/about";
import Careers from "./pages/careers";
import Contact from "./pages/contact";
import Blog from "./pages/blog";
import HelpCenter from "./pages/help-center";
import Tutorials from "./pages/tutorials";
import Documentation from "./pages/documentation";
import API from "./pages/api";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import Cookies from "./pages/cookies";
import GDPR from "./pages/gdpr";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/api" element={<API />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/account/signin" element={<SignIn />} />
            <Route path="/account/signup" element={<SignUp />} />
            <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/dashboard/customize" element={<RequireAuth><Customize /></RequireAuth>} />
            <Route path="/dashboard/relationship" element={<RequireAuth><Relationship /></RequireAuth>} />
            <Route path="/dashboard/activities" element={<RequireAuth><Activities /></RequireAuth>} />
            <Route path="/dashboard/insights" element={<RequireAuth><Insights /></RequireAuth>} />
            <Route path="/dashboard/settings" element={<RequireAuth><Settings /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
