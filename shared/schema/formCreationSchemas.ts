import { z } from "zod";
import {
  BaseFormSchema,
  FilterConditionSchema,
  SingleRecordEditFormSchema,
} from "./schema";

// Typescript has issues computing these types when created in our React app, so we have to
// precompute the in shared/ and then export for usage in our form creation process :)

// # Base form schemas
export const formInfoSchema = BaseFormSchema.pick({
  name: true,
  description: true,
});
export type FormInfo = z.infer<typeof formInfoSchema>;

export const fieldSelectionSchema = BaseFormSchema.pick({
  selectedFields: true,
});
export type FieldSelection = z.infer<typeof fieldSelectionSchema>;

export const dataSourceSchema = BaseFormSchema.pick({
  base: true,
  targetTable: true,
});
export type DataSource = z.infer<typeof dataSourceSchema>;

export const singleRecordEditFormFilters = SingleRecordEditFormSchema.pick({
  formFilters: true,
});
export type SingleRecordEditFormFilters = z.infer<
  typeof singleRecordEditFormFilters
>;

// Generalized form filters schema, only works if the overall form schema contains
// this exact line for formFilters (e.g. z.array(FilterConditionSchema))
// Theoretically, this should work for dynamic forms as well
export const FormWithFormFiltersSchema = z.object({
  ...BaseFormSchema.shape,
  formFilters: z.array(FilterConditionSchema),
});
export type FormWithFormFilters = z.infer<typeof FormWithFormFiltersSchema>;

export const formFiltersSchema = FormWithFormFiltersSchema.pick({
  formFilters: true,
});
export type FormFilters = z.infer<typeof formFiltersSchema>;
