import {
  multipleRecordLinksContains,
  multipleRecordLinksDoesNotContain,
  singleLineTextIs,
  singleLineTextIsNot,
} from "../lib/filterConditionOperations";
import {
  type AirtableField,
  type AirtableFieldTypes,
  type LinkedRecordField,
  type SingleLineTextField,
} from "./airtableFieldType";

export const operators = [
  "is",
  "isNot",

  "contains",
  "doesNotContain",

  // TODO: Add more operators for the necessary field types later
] as const;

// These types are mostly for readability in defining the operations below
export type FilterOperationKey = (typeof operators)[number];
// TODO: Since we're using filterByFormula we might not need recordValue (the API will auto-fill the values)
// - But we still most likely need fieldInfo (like its name and maybe ID)
type FilterOperationCallback =
  | ((field: AirtableField, conditionValue: unknown) => string)
  | ((field: AirtableField) => string);
type FilterValidOperations = Partial<
  Record<FilterOperationKey, FilterOperationCallback>
>;

// Map Airtable Field Types to the their proper condition operations
// TODO: If this is ever updated, make sure you also update ...
export const operations = {
  multipleRecordLinks: {
    // contains/doesNotContain can be used for single values or multiple values
    // There's no way to differentiate between a singled linked record and multiple linked records
    // so we can't really use "is" or "isNot" in for this :/
    contains: multipleRecordLinksContains,
    doesNotContain: multipleRecordLinksDoesNotContain,
  },
  singleLineText: {
    is: singleLineTextIs,
    isNot: singleLineTextIsNot,
  },
  // TODO: Needs more field types and callbacks
} as const satisfies Partial<Record<AirtableFieldTypes, FilterValidOperations>>;

// This lists all Airfield Field Types that we can use for filtering
// If a field's type is not in this list, we have to ignore it
export const AIRFIELD_TYPES_WITH_CONDITIONS = Object.keys(operations);

// A single condition
interface BaseCondition {
  field: AirtableField;
  operation: string;
  value?: unknown;
  logicalOperator?: "and" | "or";
}

type LinkedRecordOperators = keyof typeof operations.multipleRecordLinks;
export interface LinkedRecordCondition extends BaseCondition {
  field: LinkedRecordField;
  operation: LinkedRecordOperators;
  value?: string[];
}

type SingleLineTextOperators = keyof typeof operations.singleLineText;
export interface SingleLineTextCondition extends BaseCondition {
  field: SingleLineTextField;
  operation: SingleLineTextOperators;
  value?: string;
}

// TODO: More condition types for all the field types we need?

export type FilterCondition = LinkedRecordCondition | SingleLineTextCondition;
