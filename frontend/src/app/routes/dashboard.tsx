import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import type { AppDispatch } from "@/state/store";
import useRedirectUser from "@/customHooks/useRedirectUser";
import { logOut } from "@/state/auth/authSlice";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { session, isLoading } = useRedirectUser();

  // Log user out
  const logout = async () => {
    try {
      await dispatch(logOut()).unwrap();
    } catch (error) {
      console.error("Log out failed:", error);
      toast.error("Log out failed");
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <h1 className="h1">Dashboard</h1>
        <p>Hello, {session?.user?.email}!</p>

        <div className="flex flex-col gap-2 mt-4">
          <Button asChild>
            <Link to="/static-admin">Static Admin Form</Link>
          </Button>
          <Button asChild>
            <Link to="/create-form/create-single-record/form-info">
              Single Record Create
            </Link>
          </Button>
          <Button asChild>
            <Link to="/create-form/edit-single-record/form-info">
              Single Record Edit
            </Link>
          </Button>
          <Button variant="outline" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </>
  );
};
