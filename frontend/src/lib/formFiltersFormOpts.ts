import {
  formFiltersSchema,
  type FormFilters as FormFiltersType,
} from "@shared/schema/formCreationSchemas";
import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

const defaultValues: FormFiltersType = {
  formFilters: [],
};

// Because making form filters requires components which require withForm(), which itself
// requires formOpts often, this reusable formOpts exists
export const formFiltersFormOpts = formOptions({
  defaultValues: defaultValues,
  validators: {
    onSubmit: formFiltersSchema.superRefine((data, ctx) => {
      data.formFilters.forEach((filter, i) => {
        // TODO: Need to do check if value is empty when required :(
        // TODO: Might need validation for logical operator (e.g. and/or)
        // If no field or operation selected
        if (!filter.field.id || !filter.operation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Form filter information is required",
            path: [`formFilters[${i}]`],
          });
        }
      });
    }),
  },
});
