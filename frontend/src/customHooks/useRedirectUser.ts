import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSession, SET_SESSION } from "@/state/auth/authSlice";
import { supabase } from "@/lib/supabase";
import type { AppDispatch, RootState } from "@/state/store";

const useRedirectUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { session, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Get session on mount
    dispatch(fetchSession());

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(SET_SESSION(session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  // Return the current auth state so components can use it
  return { session, isLoading };
};

export default useRedirectUser;
