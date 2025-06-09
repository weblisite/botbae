
import { SignInForm } from "@/components/auth/SignInForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function SignIn() {
  const { user } = useAuth();
  
  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4">
      <SignInForm />
    </div>
  );
}
