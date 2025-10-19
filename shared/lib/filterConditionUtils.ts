import {
  AIRFIELD_TYPES_WITH_CONDITIONS,
  type FilterCondition,
  operations,
} from "../types/filterConditionTypes";

// # BUILD FILTER QUERY

/**
 * Given a filter condition, this will give the encoded query to pass to the Airtable API's `filterByFormula`
 * @param filterCondition A filter condition object (field to act on, operation to do, optional value to use in condition)
 * @returns A filter string to be passed to `filterByFormula` when retrieving records from Airtable API
 */
export const getFilterQuery: (filterCondition: FilterCondition) => string = (
  filterCondition,
) => {
  const callback =
    operations[filterCondition.field.type][filterCondition.operation];
  // TODO: I think this is actually wrong-- I think we pass .value instead of .operation but not certain until we actually use this
  const filterQuery = callback(
    filterCondition.field,
    filterCondition.operation,
  );
  return filterQuery;
};

// These below 2 functions are utilites for buildFilter
// Each individual query should already encoded so we don't have to worry about encoding
const buildAndGroup: (filterQueries: string[]) => string = (filterQueries) => {
  if (filterQueries.length === 1) return filterQueries[0];
  return filterQueries.reduce((acc, query) => `AND(${acc}%2C${query})`);
};

const buildOrGroup: (filterQueries: string[]) => string = (filterQueries) => {
  if (filterQueries.length === 1) return filterQueries[0];
  return filterQueries.reduce((acc, query) => `OR(${acc}%2C${query})`);
};

/**
 * Given a list of filter conditions, this will combine them into an encoded query to pass to the Airtable API's `filterByFormula`
 * @param filterConditions List of filter conditions-- The first filter condition's
 * @returns A filter string to be passed to `filterByFormula` parameter when retrieving records from Airtable API
 */
export const buildFilter: (filterConditions: FilterCondition[]) => string = (
  filterConditions,
) => {
  // This function is mostly AI generated, but I was able to verify it works correctly in that it
  // respects operator inheritance (AND before OR) and returns the same value as it would if written
  // as a normal condition (e.g. conditions written like c1 || c2 && c3 return the same boolean value)
  if (filterConditions.length === 0) return "";
  if (filterConditions.length === 1) return getFilterQuery(filterConditions[0]);

  // These both store incomplete queries that make up the overall filter query
  const orGroups: string[] = [];
  let currentAndGroup: string[] = [getFilterQuery(filterConditions[0])];

  for (let i = 1; i < filterConditions.length; i++) {
    const { logicalOperator } = filterConditions[i];
    const currentFilterQuery = getFilterQuery(filterConditions[i]);

    if (logicalOperator === "and") {
      // If it's being AND'd, we queue it to be combined into a single AND query later
      currentAndGroup.push(currentFilterQuery);
    } else {
      // If it's being OR'd, we combine all the AND'd filter conditions into a single AND query
      // Then, we queue it to be combined into a single OR query later
      orGroups.push(buildAndGroup(currentAndGroup));
      currentAndGroup = [currentFilterQuery];
    }
  }

  // Need to get last AND group
  orGroups.push(buildAndGroup(currentAndGroup));

  // Build a single OR query
  return buildOrGroup(orGroups);
};

// # MISC UTILS

/**
 * Get array of valid filter condition operations
 * @param fieldType A field's type
 * @returns Array of valid filter condition operations based on the field type (if it has any)
 */
export const getValidOperations = (fieldType: string) => {
  if (!AIRFIELD_TYPES_WITH_CONDITIONS.find((key) => key === fieldType)) {
    // If unspported type, just return empty array
    return [];
  }
  // If we know type is supported we can assert it properly and grab all the proper keys (e.g. operations is has)
  return Object.keys(operations[fieldType as keyof typeof operations]);
};

/**
 * Returns a filter condition's operator as a human readable string (if it's valid, otherwise just returns raw string)
 * @param operator A filter condition's operator (e.g. "is", "isNot")
 * @returns Formatted operator
 */
export const formatOperator = (operator: string): string => {
  switch (operator) {
    case "is":
      return "is";
    case "isNot":
      return "is not";
    case "contains":
      return "contains";
    case "doesNotContain":
      return "does not contain";
    default:
      return operator;
  }
};
