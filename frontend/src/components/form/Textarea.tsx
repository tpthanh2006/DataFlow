import type { ComponentProps } from "react";
import { Textarea as ShadcnTextarea } from "../ui/textarea";
import { useFieldContext } from "@/hooks/formContext";

type TextareaProps = ComponentProps<typeof ShadcnTextarea>;

export const Textarea = ({ ...props }: TextareaProps) => {
  const field = useFieldContext<string>();

  return (
    <ShadcnTextarea
      name={field.name}
      id={field.name}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={field.state.meta.errors.length > 0}
      {...props}
    />
  );
};
