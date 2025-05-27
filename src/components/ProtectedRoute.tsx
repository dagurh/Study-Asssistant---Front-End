import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { mode } = useAuth();

  if (mode === "user" || mode === "demo") {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
}
