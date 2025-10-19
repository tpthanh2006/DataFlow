import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";

export interface FormAccessData {
  form_id: number;
  user_groups_with_access: Array<{
    group_name: string;
    group_description: string;
    user_emails: string[];
    hasAccess: boolean;
  }>;
  created_at: string | null;
}

export interface FormAccessUpdateRequest {
  groups: Array<{
    group_name: string;
    group_description: string;
    user_emails: string[];
    hasAccess: boolean;
  }>;
}

/**
 * Save form access permissions to the database
 */
export const saveFormAccess = async (
  formId: string,
  accessData: FormAccessUpdateRequest,
): Promise<FormAccessData> => {
  console.log("🚀 Making API call to save form access:", {
    formId,
    accessData,
  });

  try {
    const response = await api
      .post(`forms/${formId}/access`, {
        json: accessData,
      })
      .json<{ success: boolean; data: FormAccessData }>();

    console.log("✅ API response received:", response);

    if (!response.success) {
      throw new Error("Failed to save form access");
    }

    return response.data;
  } catch (error) {
    console.error("❌ API call failed:", error);
    throw error;
  }
};

/**
 * Get form access permissions from the database
 */
export const getFormAccess = async (
  formId: string,
): Promise<FormAccessData> => {
  const response = await api
    .get(`forms/${formId}/access`)
    .json<{ success: boolean; data: FormAccessData }>();

  if (!response.success) {
    throw new Error("Failed to fetch form access");
  }

  return response.data;
};

/**
 * React Query hook for saving form access
 */
export const useSaveFormAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formId,
      accessData,
    }: {
      formId: string;
      accessData: FormAccessUpdateRequest;
    }) => saveFormAccess(formId, accessData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch form access data
      queryClient.invalidateQueries({
        queryKey: ["formAccess", variables.formId],
      });
      console.log("✅ Form access saved successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error saving form access:", error);
    },
  });
};

/**
 * React Query hook for fetching form access
 */
export const useFormAccess = (formId: string) => {
  return useQuery({
    queryKey: ["formAccess", formId],
    queryFn: () => getFormAccess(formId),
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
};
