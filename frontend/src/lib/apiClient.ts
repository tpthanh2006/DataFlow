import { selectSession } from "@/state/auth/authSlice";
import { store } from "@/state/store";
import ky, { type BeforeRequestHook } from "ky";

const authHook: BeforeRequestHook = (request) => {
  // Use the Supabase Auth access token for our own API
  const token = selectSession(store.getState())?.access_token;

  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
};

// TODO: A possible enhancement to this is to have an afterResponse hook that gives a notification
// if there's an error automatically *and* maybe redirects to login if the error is about authentication

// This is an API client that simplifies making API calls
// Ky is similar to Axios but has a smaller bundle size and is allegedly performs better
// Unlike Axios, this throws HTTP errors when requests go wrong
export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  hooks: {
    beforeRequest: [authHook],
  },
});
