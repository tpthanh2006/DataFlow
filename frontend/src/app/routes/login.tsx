import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { AppDispatch } from "@/state/store";
import useRedirectUser from "@/customHooks/useRedirectUser";
import { logIn } from "@/state/auth/authSlice";
import Loader from "@/components/Loader";
import loginImg from "../../assets/login1.png";
import orgLogo from "../../assets/logo.png";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { session, isLoading } = useRedirectUser();

  // Log user in
  const loginUser = async () => {
    try {
      await dispatch(logIn()).unwrap();
    } catch (error) {
      console.error("Log in failed:", error);
      toast.error("Log in failed");
    }
  };

  // Handle redirect when session exists
  useEffect(() => {
    if (!isLoading && session) {
      navigate("/dashboard");
      toast.success("Log in successful");
    }
  }, [session, isLoading, navigate]);

  // Show login button
  return (
    <>
      {isLoading && <Loader />}
      <div className="h-screen flex flex-col md:flex-row">
        {/* Image Column */}
        <div className="flex-1 relative overflow-hidden h-2/5 md:h-full">
          <img
            src={loginImg}
            alt="Happy children"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Column */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 gap-6 md:gap-8 h-3/5 md:h-full">
          <img
            src={orgLogo}
            alt="ISF Cambodia logo"
            className="w-[150px] md:w-[200px] h-auto"
          />

          <p className="text-xl md:text-2xl font-normal text-black text-center m-0">
            Hi! Welcome back 👋
          </p>

          <button
            onClick={loginUser}
            className="w-[150px] md:w-[200px] px-6 py-3 text-base font-medium bg-[#4285F4] text-white border-none rounded-lg cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#3367D6] focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:ring-offset-2"
          >
            Login With Google
          </button>

          <code className="text-xs md:text-sm font-normal text-gray-600 text-center max-w-[250px] md:max-w-[400px] leading-relaxed">
            ⭐ Please sign in with an ISF domain email ⭐
          </code>
        </div>
      </div>
    </>
  );
};
