import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-sand-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-moss-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    const hasAny = permissions.some(perm => hasPermission(perm));

    if (!hasAny) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-sand-50 px-4 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ember-500">403</h1>
          <p className="mt-2 text-xl font-bold text-forest-950">Access Denied</p>
          <p className="mt-1 max-w-sm text-sm text-forest-500">
            You do not have the required permission ({permissions.join(" or ")}) to access this page.
          </p>
          <a
            href="/dashboard"
            className="mt-6 rounded-lg bg-forest-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss-500"
          >
            Return to Dashboard
          </a>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
