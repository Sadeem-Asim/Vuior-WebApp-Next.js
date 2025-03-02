import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
// import { User } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  // console.log("kraw sadem")
  if (!user) {
    console.log("", {
      user,
    });
    return <Navigate to={"/login"} state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
