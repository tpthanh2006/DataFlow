import { buildFilter } from "../lib/filterConditionUtils";
import { FilterCondition, operations } from "./filterConditionTypes";

// # Example #1 - Single filter condition

// Given a filter condition (users construct this through the frontend UI)
const classFilterCondition: FilterCondition = {
  field: {
    id: "",
    name: "Class",
    type: "multipleRecordLinks",
    options: {
      linkedTableId: "blahblahblah",
    },
  },
  operation: "contains",
  value: ["recx4gIvxC2rLcDrL"], // The record ID for the class we want
};

// Grab the correct callback
const callback =
  operations[classFilterCondition.field.type][classFilterCondition.operation];

// The callback gives us a string to add to the filterByFormula query in our API request
const filterQuery = callback(
  classFilterCondition.field,
  classFilterCondition.operation,
);

// Make the API request
const url = `https://api.airtable.com/v0/baseId/tableId?filterByFormula=${filterQuery}`;
const records = fetch(url)
  .then((response) => response.json())
  .then((data) => data);
console.log(records);

// # Example #2 - Multiple filter conditions

const conditions: FilterCondition[] = [
  {
    field: {
      id: "",
      name: "Class",
      type: "multipleRecordLinks",
      options: {
        linkedTableId: "blahblahblah",
      },
    },
    operation: "contains",
    value: ["recx4gIvxC2rLcDrL"], // The record ID for the class we want
  },
  {
    field: {
      id: "",
      name: "Name",
      type: "singleLineText",
    },
    operation: "is",
    value: "Agustin Angulo", // The name of the student we want
  },
];

const multipleFiltersQuery = buildFilter(conditions);
const multipleFiltersUrl = `https://api.airtable.com/v0/baseId/tableId?filterByFormula=${multipleFiltersQuery}`;
const multipleFiltersRecords = fetch(multipleFiltersUrl)
  .then((response) => response.json())
  .then((data) => data);
console.log(multipleFiltersRecords);
