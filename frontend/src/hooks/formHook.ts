import {
  FieldDescription,
  FieldErrors,
  FieldLabel,
} from "@/components/form/Form";
import { Input } from "@/components/form/Input";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./formContext";
import { Textarea } from "@/components/form/Textarea";
import { Select, SelectTrigger } from "@/components/form/Select";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FieldLabel,
    FieldDescription,
    FieldErrors,
    Input,
    Textarea,
    Select,
    SelectTrigger,
  },
  formComponents: {},
});
