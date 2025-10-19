import { createFormHookContexts } from "@tanstack/react-form";

// Separated from formHooks.ts because of a circular dependency
// (The Field components depend on this, but formHooks.ts depends on the components, so also
// including this creates an issue)
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
