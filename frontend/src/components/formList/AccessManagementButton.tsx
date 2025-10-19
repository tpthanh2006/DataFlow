import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { FormAccessOverlay } from "@/components/test/FormAccessOverlay";
import { useSaveFormAccess } from "@/hooks/formAccess";
import type { FormAccessUpdateRequest } from "@/hooks/formAccess";
import type { Form } from "@shared/types/formTypes";

interface AccessManagementButtonProps {
  form: Form;
}

export const AccessManagementButton = ({
  form,
}: AccessManagementButtonProps) => {
  const [isAccessOverlayOpen, setIsAccessOverlayOpen] = useState(false);
  const saveFormAccessMutation = useSaveFormAccess();

  const handleAccessUpdate = async (
    formId: string,
    accessData: FormAccessUpdateRequest,
  ) => {
    console.log("📝 Access updated for form:", formId);
    console.log("📝 Access data:", accessData);

    try {
      console.log("🚀 Calling saveFormAccessMutation with:", {
        formId,
        accessData,
      });
      const result = await saveFormAccessMutation.mutateAsync({
        formId,
        accessData,
      });
      console.log("✅ Save successful, result:", result);
    } catch (error) {
      console.error("❌ Failed to save form access:", error);
      // You could add a toast notification here to show the error to the user
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsAccessOverlayOpen(true)}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Manage Access
      </Button>

      <FormAccessOverlay
        isOpen={isAccessOverlayOpen}
        onClose={() => setIsAccessOverlayOpen(false)}
        form={form}
        onAccessUpdate={handleAccessUpdate}
      />
    </>
  );
};
