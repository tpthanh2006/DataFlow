// Structure of core objects for storing forms and fields

import { type AirtableField } from "./airtableFieldType";
import { type FilterCondition } from "./filterConditionTypes";

export interface Table {
  id: string;
  name: string;
  primaryFieldId: string; // I don't know if this matters for us, but including it anyway
  description?: string; // Same for this as well
  fields: AirtableField[];
}

export interface Base {
  id: string;
  name: string;
  tables?: Table[]; // Optional, because the API doesn't come with them
}

// Field definition needed for rendering and validation
export interface FormField {
  original: AirtableField; // The original field object from the Airtable API
  isRequired: boolean;
  isEditable: boolean;
  defaultValue?: unknown;
  placeholder?: string;
}

// Base form configuration with common properties
// This config handles the static form for single record creation use case
export interface BaseForm {
  id: string;
  type: string;
  name: string;
  description?: string;
  base: Base;
  targetTable: Table; // Naming this targetTable to avoid confusion with reference table later
  selectedFields: FormField[];
  createdAt: Date | string; // Both of these may be Date objects OR Date strings (the safest bet is to just wrap in new Date() when working with them)
  updatedAt: Date | string;
}

// Create form - for creating new records
export interface SingleRecordCreateForm extends BaseForm {
  type: "singleRecordCreate";
  // TODO: Create-specific properties
}

// Update form - for editing existing records
export interface SingleRecordEditForm extends BaseForm {
  type: "singleRecordEdit";
  formFilters: FilterCondition[];
}

// This config is for dynamically generated forms used to create new records
export interface MultiRecordCreateForm extends BaseForm {
  type: "multiRecordCreate";
  referenceTable: Table;
  fieldMapping: {
    linkedRecordField: AirtableField; // This is the field in targetTable linking to another table; this field get automatically filled out so we don't care about CoreFormField attributes
    referenceField: AirtableField; // This is the field in referenceTable the above field maps to
  };
  sharedFields?: FormField[];
  preFilterCondition?: FilterCondition; // For now, we will only support a single filter condition
  triggerField?: {
    field: FormField; // The field in targetTable; it's value is used to construct the condition
    referenceField: AirtableField; // The field in referenceTable we'll be filtering based off of
    filterCondition: FilterCondition; // For now, we will only support a single filter condition for trigger fields
  };
}

// Union type for all form configurations
export type Form =
  | SingleRecordCreateForm
  | SingleRecordEditForm
  | MultiRecordCreateForm;

export type FormConfigType = Form["type"];

// Type guards for form types
export function isCreateForm(config: Form): config is SingleRecordCreateForm {
  return config.type === "singleRecordCreate";
}

export function isSingleRecordEditForm(
  config: Form,
): config is SingleRecordEditForm {
  return config.type === "singleRecordEdit";
}

export function isMultiRecordCreateForm(
  config: Form,
): config is MultiRecordCreateForm {
  return config.type === "multiRecordCreate";
}

// Utility function to get form-specific properties
export function getFormSpecificProps(config: Form) {
  switch (config.type) {
    case "singleRecordCreate":
      return {
        // Create forms don't have specific properties anymore
        // They inherit everything from BaseFormConfig
      };
    case "singleRecordEdit":
      return {
        // Update forms don't have specific properties yet
        // Add properties here when you define them
      };
    case "multiRecordCreate":
      return {
        // MultiRecord forms don't have specific properties yet
        // Add properties here when you define them
      };
  }
}

// TODO: The below may need to be edited depending on the direction of our project

// Form submission tracking
export interface FormSubmission {
  id: string;
  formId: string;
  submittedBy: string; // User ID who submitted the form
  submittedAt: string;
  data: Record<string, unknown>; // The actual form data submitted
  status: "success" | "error" | "pending";
  errorMessage?: string;
}

// Form draft and progress tracking
export interface FormDraft {
  id: string;
  formId: string;
  userId: string; // User who created the draft
  createdAt: string;
  updatedAt: string;
  lastSavedAt: string;
  completionStatus: "draft" | "in_progress" | "complete";
  progressPercentage: number; // 0-100
  completedSections: string[]; // Array of completed section IDs
  draftData: Record<string, unknown>; // Partial form data
  autoSaveEnabled: boolean;
  version: number; // Draft version for conflict resolution
  isLocal?: boolean; // Whether this is stored locally vs server
}

// Form section tracking for complex forms
export interface FormSection {
  id: string;
  name: string;
  description?: string;
  fieldIds: string[]; // Fields in this section
  isRequired: boolean;
  isCompleted: boolean;
  completionPercentage: number; // 0-100 for this section
}
