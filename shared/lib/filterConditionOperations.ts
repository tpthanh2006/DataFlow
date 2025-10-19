// ----- MULTIPLE RECORDS LINKS (multipleRecordLinks) -----

import { type AirtableField } from "../types/airtableFieldType";

export const multipleRecordLinksContains: (
  field: AirtableField,
  conditionValue: unknown,
) => string = (field: AirtableField, conditionValue: unknown) => {
  if (typeof conditionValue !== "string") {
    // Might be better to throw an error here
    return "";
  }

  /**
   * ARRAYJOIN(array, delimiter) => the array of items is transformed into a string
   * FIND() => searches strings and returns the index position if it finds it
   *
   * For multipleRecordLinks, the array will be the values in the primaryField for each record
   * (e.g. some name or ID)
   *
   * Therefore, conditionValue must be a string and should be one of the values in the primaryField
   */
  const filterString = `FIND("${conditionValue}",ARRAYJOIN({${field.name}},","))`;
  return encodeURIComponent(filterString);
};

export const multipleRecordLinksDoesNotContain: (
  field: AirtableField,
  conditionValue: unknown,
) => string = (field: AirtableField, conditionValue: unknown) => {
  if (typeof conditionValue !== "string") {
    // Might be better to throw an error here
    return "";
  }

  /**
   * ARRAYJOIN(array, delimiter) => the array of items is transformed into a string
   * FIND() => searches strings and returns the index position if it finds it
   * NOT() => Self-explanatory logical operator
   *
   * For multipleRecordLinks, the array will be the values in the primaryField for each record
   * (e.g. some name or ID)
   *
   * Therefore, conditionValue must be a string and should be one of the values in the primaryField
   * we don't want
   */
  const filterString = `NOT(FIND("${conditionValue}",ARRAYJOIN({${field.name}},",")))`;
  return encodeURIComponent(filterString);
};

// ----- SINGLE LINE TEXT (singleLineText) ----

export const singleLineTextIs = (
  field: AirtableField,
  conditionValue: unknown,
) => {
  if (typeof conditionValue !== "string") {
    // Might be better to throw an error here but this is fine for now
    return "";
  }

  const filterString = `{${field.name}}="${conditionValue}"`;
  return encodeURIComponent(filterString);
};

export const singleLineTextIsNot = (
  field: AirtableField,
  conditionValue: unknown,
) => {
  if (typeof conditionValue !== "string") {
    // Might be better to throw an error here but this is fine for now
    return "";
  }

  const filterString = `NOT({${field.name}}="${conditionValue})"`;
  return encodeURIComponent(filterString);
};

// TODO: Add more operations!
/**
 * In general structure an operation like this:
 *
 * Parameters:
 * - field: The field we're trying to check the condition against
 * - conditionValue: (optional) The value we compare the field's value to
 *
 * Type check to ensure conditionValue is the proper type (if not, just return false for now)
 *
 * Do the condition check and you're done :)
 */
