import type { ComponentProps } from "react";
import {
  Select as ShadcnSelect,
  SelectGroup as ShadcnSelectGroup,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
  SelectContent as ShadcnSelectContent,
  SelectLabel as ShadcnSelectLabel,
  SelectItem as ShadcnSelectItem,
  SelectSeparator as ShadcnSelectSeparator,
  SelectScrollUpButton as ShadcnSelectScrollUpButton,
  SelectScrollDownButton as ShadcnSelectScrollDownButton,
} from "../ui/select";
import { useFieldContext } from "@/hooks/formContext";
import { cn } from "@/lib/utils";

// These are the only two things we need to set up with Tanstack
export const Select = ({ ...props }: ComponentProps<typeof ShadcnSelect>) => {
  const field = useFieldContext<string>();

  return (
    <ShadcnSelect
      onValueChange={(value) => field.handleChange(value)}
      value={field.state.value}
      {...props}
    />
  );
};

export const SelectTrigger = ({
  className,
  ...props
}: ComponentProps<typeof ShadcnSelectTrigger>) => {
  const field = useFieldContext();

  return (
    <ShadcnSelectTrigger
      id={field.name}
      name={field.name}
      aria-invalid={!field.state.meta.isValid}
      className={cn("w-full", className)}
      {...props}
    />
  );
};

// Every other component is being exported just incase we need to customize them for our forms
export const SelectGroup = ({
  ...props
}: ComponentProps<typeof ShadcnSelectGroup>) => {
  return <ShadcnSelectGroup {...props} />;
};

export const SelectValue = ({
  ...props
}: ComponentProps<typeof ShadcnSelectValue>) => {
  return <ShadcnSelectValue {...props} />;
};

export const SelectContent = ({
  ...props
}: ComponentProps<typeof ShadcnSelectContent>) => {
  return <ShadcnSelectContent {...props} />;
};

export const SelectLabel = ({
  ...props
}: ComponentProps<typeof ShadcnSelectLabel>) => {
  return <ShadcnSelectLabel {...props} />;
};

export const SelectItem = ({
  ...props
}: ComponentProps<typeof ShadcnSelectItem>) => {
  return <ShadcnSelectItem {...props} />;
};

export const SelectSeparator = ({
  ...props
}: ComponentProps<typeof ShadcnSelectSeparator>) => {
  return <ShadcnSelectSeparator {...props} />;
};

export const SelectScrollUpButton = ({
  ...props
}: ComponentProps<typeof ShadcnSelectScrollUpButton>) => {
  return <ShadcnSelectScrollUpButton {...props} />;
};

export const SelectScrollDownButton = ({
  ...props
}: ComponentProps<typeof ShadcnSelectScrollDownButton>) => {
  return <ShadcnSelectScrollDownButton {...props} />;
};
