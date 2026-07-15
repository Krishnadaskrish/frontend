import { useAuth } from "../context/AuthContext";

export const Can = ({ perform, children }) => {
  const { hasPermission } = useAuth();
  return hasPermission(perform) ? <>{children}</> : null;
};

export default Can;
