import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireAuthProps {
  children: JSX.Element;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/account/signin" state={{ from: location }} replace />;
  }

  return children;
}
