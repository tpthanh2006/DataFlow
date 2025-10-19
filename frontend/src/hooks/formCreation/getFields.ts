import type { AirtableField } from "@shared/schema/schema";
import { AIRTABLE_UNSUPPORTED_FIELD_TYPES } from "@shared/types/airtableFieldType";

export const useFields = (fields: AirtableField[] | undefined) => {
  const unsupportedFields: AirtableField[] = [];
  const fieldOptions: AirtableField[] = [];
  // Filter out fields into 2 categories
  if (fields && fields.length) {
    fields.forEach((field) => {
      if (
        AIRTABLE_UNSUPPORTED_FIELD_TYPES.find((type) => type === field.type)
      ) {
        unsupportedFields.push(field);
      } else {
        fieldOptions.push(field);
      }
    });
  }
  // Return the categories
  return { fieldOptions, unsupportedFields };
};
