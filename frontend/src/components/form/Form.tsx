import { useFieldContext } from "@/hooks/formContext";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { TriangleAlert } from "lucide-react";
import type { StandardSchemaV1Issue } from "@tanstack/react-form";

/**
 * Label component for a form field. By default, `htmlFor` is set to `{field.name}`.
 *
 * @param props
 */
export const FieldLabel = ({
  className,
  ...props
}: ComponentProps<typeof Label>) => {
  const field = useFieldContext();

  return (
    <Label
      data-slot="form-label"
      data-error={!field.state.meta.isValid}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={field.name}
      {...props}
    />
  );
};

/**
 * Description component for a form field. By default, the `id` to be used in
 * `aria-describedby` is `{field.name}-description`.
 *
 * @param props Accepts the same props of a `<p/>` element
 */
export const FieldDescription = ({
  className,
  ...props
}: ComponentProps<"p">) => {
  const field = useFieldContext();

  return (
    <p
      data-slot="form-description"
      id={`${field.name}-description`}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

/**
 * Displays multiple errors from Tanstack. By default, the `id` to be used in
 * `aria-describedby` is `{field.name}-errors`
 *
 * Because of this component, all errors should have a `error.path` and `error.message`
 *
 * @param props Accepts the same props of a `<div/>` element
 */
export const FieldErrors = ({ className, ...props }: ComponentProps<"div">) => {
  const field = useFieldContext();

  // This component assumes every error is a StandardSchemaIssue (like those returned by Zod).
  // Because of this, every custom error we make should be the same {path?: string, message: string}
  return (
    <div
      className={cn("text-destructive text-sm", className)}
      id={`${field.name}-errors`}
      aria-live="polite" // For accessibility/aria-live, the parent container should always be rendered
      {...props}
    >
      {!field.state.meta.isValid &&
        field.state.meta.errors.map((error: StandardSchemaV1Issue) => (
          <div
            className="flex items-center gap-1"
            key={`${error.path}-${error.message}`}
          >
            <TriangleAlert className="w-3 h-3" />
            <p>{error.message}</p>
          </div>
        ))}
    </div>
  );
};

/**
 * Basic layout for when using FieldLabel, FieldDescription, and FieldErrors with an input element
 * @param props Accepts the same props of a `<div/>` element
 */
export const FieldLayout = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
};

type FieldProps = {
  label?: string;
  description?: string;
  children: ReactNode;
};

/**
 * Wrapper containing components for a field's label, description, and error messages
 *
 * When using this, remember to use `aria-describedby` on the field input element for accessibility
 * with its description (`{field.name}-description`) and error messages (`{field.name}-errors`).
 *
 * __NOTE__: only use `aria-describedby` for the description if a `description` is actually passed
 *
 * @param label Field label
 * @param description Field description
 * @param children The field input element (e.g. <input/>, <select/>, etc.)
 * @returns
 */
export const Field = ({ label, description, children }: FieldProps) => {
  return (
    <FieldLayout>
      {label && <FieldLabel>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}
      {children}
      <FieldErrors />
    </FieldLayout>
  );
};

/**
 * Basic layout for a form
 *
 * @param props Accepts the same props of a `<form/>` element
 */
export const FormLayout = ({
  className,
  onSubmit,
  ...props
}: ComponentProps<"form">) => {
  return (
    <form
      className={cn(
        "flex flex-col px-4 py-6 border border-border rounded-lg gap-3 shadow-sm w-full",
        className,
      )}
      onSubmit={(e) => {
        // I'm actually not certain if this would work but here's hoping
        e.preventDefault();
        if (onSubmit) {
          onSubmit(e);
        }
      }}
      {...props}
    />
  );
};
