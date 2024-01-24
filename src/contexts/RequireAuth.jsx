import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "./ContextProvider";

const RequireAuth = ({ allowedRoles }) => {
  const { token, user } = useStateContext();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  } else if (token && !allowedRoles?.includes(user.role_id)) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
