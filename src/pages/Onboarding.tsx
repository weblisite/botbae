import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useEffect } from "react";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/account/signin');
    }
  }, [user, navigate]);

  const handleOnboardingComplete = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <OnboardingFlow onComplete={handleOnboardingComplete} />
  );
} 