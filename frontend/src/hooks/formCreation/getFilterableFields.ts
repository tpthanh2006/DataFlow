import type { AirtableField } from "@shared/schema/schema";
import { AIRFIELD_TYPES_WITH_CONDITIONS } from "@shared/types/filterConditionTypes";

export const useFilterableFields = (fields: AirtableField[] | undefined) => {
  const unsupportedFields: AirtableField[] = [];
  const fieldOptions: AirtableField[] = [];
  // Filter out fields into 2 categories
  if (fields && fields.length) {
    fields.forEach((field) => {
      if (AIRFIELD_TYPES_WITH_CONDITIONS.find((type) => type === field.type)) {
        fieldOptions.push(field);
      } else {
        unsupportedFields.push(field);
      }
    });
  }
  // Return the categories
  return { fieldOptions, unsupportedFields };
};
