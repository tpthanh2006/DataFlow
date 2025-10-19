import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "../ui/badge";
import { type FormConfigType } from "@shared/types/formTypes";

const formTypeBadgeVariants = cva("py-1 rounded-lg", {
  variants: {
    variant: {
      create: "bg-cyan-600",
      update: "bg-indigo-600",
      multiRecord: "bg-pink-600",
    } as const satisfies Record<FormConfigType, string>,
  },
  defaultVariants: {
    variant: "create",
  },
});

export const FormTypeBadge = ({
  variant,
}: VariantProps<typeof formTypeBadgeVariants>) => {
  return (
    // TODO: This should display human-readable names instead of the type from FormConfig object
    <Badge className={formTypeBadgeVariants({ variant })}>{variant}</Badge>
  );
};
