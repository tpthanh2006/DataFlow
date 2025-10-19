import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
}

export interface StaffEmailsRow {
  Name: string;
  Email: string;
}

export interface UserGroup {
  group_name: string;
  group_description: string;
  user_emails: string[];
}

/**
 * Fetch all user groups from the user_groups table
 */
export const getUserGroups = async (): Promise<UserGroup[]> => {
  try {
    const { data, error } = await supabase
      .from("user_groups")
      .select("group_name, group_description, user_emails");

    if (error) {
      console.error("Error fetching user groups:", error);
      throw new Error(`Failed to fetch user groups: ${error.message}`);
    }

    if (!data) {
      console.warn("No user groups found");
      return [];
    }

    console.log("📋 Fetched user groups:", data);
    return data;
  } catch (error) {
    console.error("Error in getUserGroups:", error);
    throw error;
  }
};

/**
 * Save user groups to Supabase
 */
export const saveUserGroups = async (groups: UserGroup[]): Promise<void> => {
  try {
    // First, delete all existing groups
    const { error: deleteError } = await supabase
      .from("user_groups")
      .delete()
      .neq("group_name", null); // Delete all rows (explicit and robust)

    if (deleteError) {
      console.error("Error deleting existing groups:", deleteError);
      throw new Error(
        `Failed to delete existing groups: ${deleteError.message}`,
      );
    }

    // Then insert all groups
    if (groups.length > 0) {
      const { error: insertError } = await supabase
        .from("user_groups")
        .insert(groups);

      if (insertError) {
        console.error("Error inserting groups:", insertError);
        throw new Error(`Failed to insert groups: ${insertError.message}`);
      }
    }

    console.log("✅ Successfully saved user groups to Supabase");
  } catch (error) {
    console.error("Error in saveUserGroups:", error);
    throw error;
  }
};

/**
 * Fetch all staff users from the isf_staff_emails table
 * This provides the complete list of available staff members
 */
export const getStaffUsers = async (): Promise<StaffUser[]> => {
  try {
    const { data, error } = await supabase
      .from("isf_staff_emails")
      .select("Name, Email");

    if (error) {
      console.error("Error fetching staff users:", error);
      throw new Error(`Failed to fetch staff users: ${error.message}`);
    }

    if (!data) {
      console.warn("No staff users found");
      return [];
    }

    // Transform the data to match our StaffUser interface
    const staffUsers: StaffUser[] = data.map(
      (row: StaffEmailsRow, index: number) => ({
        id: `staff-${index + 1}`,
        name: row.Name,
        email: row.Email,
      }),
    );

    console.log("📋 Fetched staff users:", staffUsers);
    return staffUsers;
  } catch (error) {
    console.error("Error in getStaffUsers:", error);
    throw error;
  }
};

/**
 * React Query hook for fetching staff users
 */
export const useStaffUsers = () => {
  return useQuery({
    queryKey: ["staffUsers"],
    queryFn: getStaffUsers,
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for more frequent updates
    retry: 2,
  });
};

/**
 * React Query hook for fetching user groups
 */
export const useUserGroups = () => {
  return useQuery({
    queryKey: ["userGroups"],
    queryFn: getUserGroups,
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for more frequent updates
    retry: 2,
  });
};
