import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
