import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/api/store/authStore";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
