export type UserRole = "admin" | "staff" | null;

export interface CustomClaims {
  user_role: UserRole;
}
