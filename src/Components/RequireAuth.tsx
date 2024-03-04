import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth) {
    // Redirige vers la page de connexion si non authentifié
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
