import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { RequiredClaims, User } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: User;
  userRole?: string;
}

// JWT token interface to match frontend
interface CustomClaims {
  user_role?: string;
}

// Helper function to decode JWT and get user role
function getUserRoleFromToken(accessToken: string): string | null {
  try {
    const decoded = jwt.decode(accessToken) as RequiredClaims & CustomClaims;
    return decoded?.user_role || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: User;
  userRole?: string;
}

// Auth middleware to verify user is authenticated
export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Extract role from JWT token
    const userRole = getUserRoleFromToken(token);

    // Store user data and role in request for use in other middleware/routes
    req.user = data.user;
    req.userRole = userRole || undefined;
    next();
  } catch {
    return res.status(500).json({ error: "Authentication error" });
  }
};

// Admin authorization middleware
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Extract role from JWT token
    const userRole = getUserRoleFromToken(token);

    // Check if user has admin role
    if (userRole !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Store user data in request for use in other middleware/routes
    req.user = data.user;
    req.userRole = userRole;
    next();
  } catch {
    return res.status(500).json({ error: "Authorization error" });
  }
};

// Staff or admin authorization middleware
export const requireStaffOrAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Extract role from JWT token
    const userRole = getUserRoleFromToken(token);

    // Check if user has admin or staff role
    if (userRole !== "admin" && userRole !== "staff") {
      return res.status(403).json({ error: "Staff or admin access required" });
    }

    // Store user data in request for use in other middleware/routes
    req.user = data.user;
    req.userRole = userRole;
    next();
  } catch {
    return res.status(500).json({ error: "Authorization error" });
  }
};
