import type { JSX } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useRedirectUser from "@/customHooks/useRedirectUser";
import { selectRole } from "@/state/auth/authSlice";
import type { UserRole } from "@/lib/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: UserRole[]; // Set the user's roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  // Depends on how you check the logged in users' role
  const { session, isLoading } = useRedirectUser();
  const role = useSelector(selectRole);
  const navigate = useNavigate();

  // Handle navigation when there's no session
  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/");
      toast.info("No active session. Please log in");
    }
  }, [session, navigate, isLoading]);

  // If no session, return null to prevent rendering
  if (!session) {
    return null;
  }

  // Check if user is authenticated but not allowed to access that page -- status 403
  if (role && !allowedRoles.includes(role as UserRole)) {
    return (
      <>
        <div>
          <h1> Error 403 -- User Not Authorized</h1>
        </div>
      </>
    );
  }

  return children; // Return the right page if user is cleared.
};

export default ProtectedRoute;
