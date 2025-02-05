// ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "../hooks/ContextHooks";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
