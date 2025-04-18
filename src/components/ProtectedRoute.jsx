import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // 👈 wait until user is loaded

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <div className="text-center text-red-500 p-4">Access Denied</div>;
  }

  return children;
}
