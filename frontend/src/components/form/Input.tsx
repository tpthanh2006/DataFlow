import type { ComponentProps } from "react";
import { Input as ShadcnInput } from "../ui/input";
import { useFieldContext } from "@/hooks/formContext";

// In this Input component, we use the shadcn component as our base and provide it with the necessary
// configuration from Tanstack form:
// - value and onChange are necessary for Tanstack
// - name and id are necessary for how we handle our custom components
export const Input = ({ ...props }: ComponentProps<typeof ShadcnInput>) => {
  const field = useFieldContext<string>();

  return (
    <ShadcnInput
      // Tanstack Form registration
      name={field.name}
      id={field.name}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      // Accessibility + Used to change input styles when an error occurs
      aria-invalid={!field.state.meta.isValid}
      {...props}
    />
  );
};
