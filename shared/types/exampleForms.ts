import { CreateFormConfig, UpdateSingleRecordFormConfig } from "./formTypes";

// Example 1: Create Form - User Registration
export const userRegistrationFormExample: CreateFormConfig = {
  type: "create",
  id: "user-registration-form",
  name: "User Registration",
  description: "Form for new users to register their account",
  dataSource: {
    base: {
      id: "12345",
      name: "User Management",
      tables: [
        /* Pretend some tables are here */
      ],
    },
    targetTable: {
      id: "12345",
      name: "Users",
      primaryFieldId: "fullName",
      fields: [
        {
          id: "fullName",
          name: "Full Name",
          type: "singleLineText",
        },
        {
          id: "email",
          name: "Email Address",
          type: "email",
        },
        {
          id: "phone",
          name: "Phone Number",
          type: "phoneNumber",
        },
        {
          id: "department",
          name: "Department",
          type: "singleSelect",
          options: {
            choices: [
              {
                id: "engineering",
                name: "Engineering",
                color: "blueBright",
              },
              {
                id: "compSci",
                name: "Computer Science",
                color: "greenBright",
              },
            ],
          },
        },
      ],
    },
  },
  selectedFields: [
    {
      original: {
        id: "fullName",
        name: "Full Name",
        type: "singleLineText",
      },
      isRequired: true,
      isEditable: true,
      defaultValue: "John",
      placeholder: "Enter your full name",
    },
    {
      original: {
        id: "email",
        name: "Email Address",
        type: "email",
      },
      isRequired: true,
      isEditable: true,
      placeholder: "Enter your email address",
    },
    {
      original: {
        id: "phone",
        name: "Phone Number",
        type: "phoneNumber",
      },
      isRequired: false,
      isEditable: true,
      placeholder: "Enter your phone number",
    },
    {
      original: {
        id: "department",
        name: "Department",
        type: "singleSelect",
        options: {
          choices: [
            {
              id: "engineering",
              name: "Engineering",
              color: "blueBright",
            },
            {
              id: "compSci",
              name: "Computer Science",
              color: "greenBright",
            },
          ],
        },
      },
      isRequired: true,
      isEditable: true,
    },
  ],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
};

// Example 2: Update Single Record Form - User Profile Edit
export const userProfileEditFormExample: UpdateSingleRecordFormConfig = {
  type: "update",
  id: "user-profile-edit-form",
  name: "Edit User Profile",
  description: "Form for users to update their profile information",
  dataSource: {
    base: {
      id: "12345",
      name: "User Management",
      tables: [
        /* Pretend some tables are here */
      ],
    },
    targetTable: {
      id: "12345",
      name: "Users",
      primaryFieldId: "fullName",
      fields: [
        {
          id: "fullName",
          name: "Full Name",
          type: "singleLineText",
        },
        {
          id: "email",
          name: "Email Address",
          type: "email",
        },
        {
          id: "phone",
          name: "Phone Number",
          type: "phoneNumber",
        },
        {
          id: "department",
          name: "Department",
          type: "singleSelect",
          options: {
            choices: [
              {
                id: "engineering",
                name: "Engineering",
                color: "blueBright",
              },
              {
                id: "compSci",
                name: "Computer Science",
                color: "greenBright",
              },
            ],
          },
        },
      ],
    },
  },
  selectedFields: [
    {
      original: {
        id: "fullName",
        name: "Full Name",
        type: "singleLineText",
      },
      isRequired: true,
      isEditable: true,
      placeholder: "Enter your full name",
    },
    {
      original: {
        id: "bio",
        name: "Biography",
        type: "richText",
      },
      isRequired: false,
      isEditable: true,
      placeholder: "Tell us about yourself",
    },
  ],
  createdAt: "2024-01-15T11:00:00Z",
  updatedAt: "2024-01-15T11:00:00Z",
};

// Example 3: Multi Record Form - Product Inventory Management
// TODO: Create a new multi record form for when we get to it
// export const productInventoryFormExample: MultiRecordFormConfig = {
//   type: "multiRecord",
//   id: "product-inventory-form",
//   name: "Product Inventory Management",
//   description: "Form for managing multiple product records at once",
//   dataSource: {
//     baseName: "Inventory System",
//     tableName: "Products",
//   },
//   selectedFields: {
//     productName: {
//       id: "productName",
//       name: "Product Name",
//       dataType: "Single line text",
//       sourceId: "fldProductName",
//       isRequired: true,
//       isEditable: true,
//       validation: {
//         required: true,
//         minLength: 1,
//         maxLength: 200,
//       },
//       placeholder: "Enter product name",
//     },
//     sku: {
//       id: "sku",
//       name: "SKU",
//       dataType: "Single line text",
//       sourceId: "fldSKU",
//       isRequired: true,
//       isEditable: true,
//       validation: {
//         required: true,
//         pattern: "^[A-Z0-9]{6,12}$",
//       },
//       placeholder: "Enter SKU code",
//     },
//     price: {
//       id: "price",
//       name: "Price",
//       dataType: "Number",
//       sourceId: "fldPrice",
//       isRequired: true,
//       isEditable: true,
//       validation: {
//         required: true,
//         min: 0,
//         max: 999999.99,
//       },
//       placeholder: "0.00",
//     },
//     quantity: {
//       id: "quantity",
//       name: "Quantity",
//       dataType: "Number",
//       sourceId: "fldQuantity",
//       isRequired: true,
//       isEditable: true,
//       validation: {
//         required: true,
//         min: 0,
//       },
//       placeholder: "0",
//     },
//     category: {
//       id: "category",
//       name: "Category",
//       dataType: "Single select",
//       sourceId: "fldCategory",
//       isRequired: true,
//       isEditable: true,
//       validation: {
//         required: true,
//       },
//       defaultValue: "General",
//     },
//     isActive: {
//       id: "isActive",
//       name: "Active Status",
//       dataType: "Checkbox",
//       sourceId: "fldIsActive",
//       isRequired: false,
//       isEditable: true,
//       validation: {
//         required: false,
//       },
//       defaultValue: true,
//     },
//   },
//   fieldOrder: [
//     "productName",
//     "sku",
//     "price",
//     "quantity",
//     "category",
//     "isActive",
//   ],
//   createdAt: "2024-01-15T12:00:00Z",
//   updatedAt: "2024-01-15T12:00:00Z",
// };

// Example draft forms (incomplete forms saved locally)
// TODO: New example drafts
// export const draftFormExample: CreateFormConfig = {
//   type: "create",
//   id: "draft-user-registration",
//   name: "User Registration (Draft)",
//   description: "Incomplete user registration form",
//   dataSource: {
//     baseName: "User Management",
//     tableName: "Users",
//   },
//   selectedFields: {
//     fullName: {
//       id: "fullName",
//       name: "Full Name",
//       dataType: "Single line text",
//       sourceId: "fldFullName",
//       isRequired: true,
//       isEditable: true,
//       validation: {
//         required: true,
//         minLength: 2,
//         maxLength: 100,
//       },
//       placeholder: "Enter your full name",
//     },
//     email: {
//       id: "email",
//       name: "Email Address",
//       dataType: "Email",
//       sourceId: "fldEmail",
//       isRequired: true,
//       isEditable: true,
//       validation: {
//         required: true,
//         emailFormat: true,
//       },
//       placeholder: "Enter your email address",
//     },
//   },
//   fieldOrder: ["fullName", "email"],
//   createdAt: "2024-01-15T13:00:00Z",
//   updatedAt: "2024-01-15T13:30:00Z",
// };

// Example form drafts using the FormDraft interface
// TODO: Likely need new examples FormDrafts too
// export const exampleFormDrafts: FormDraft[] = [
//   {
//     id: "draft-001",
//     formId: "user-registration-form",
//     userId: "user123",
//     createdAt: "2024-01-15T13:00:00Z",
//     updatedAt: "2024-01-15T13:30:00Z",
//     lastSavedAt: "2024-01-15T13:30:00Z",
//     completionStatus: "in_progress",
//     progressPercentage: 50,
//     completedSections: ["personal-info"],
//     draftData: {
//       fullName: "John Doe",
//       email: "john.doe@example.com",
//     },
//     autoSaveEnabled: true,
//     version: 1,
//     isLocal: true,
//   },
//   {
//     id: "draft-002",
//     formId: "product-inventory-form",
//     userId: "admin456",
//     createdAt: "2024-01-15T14:00:00Z",
//     updatedAt: "2024-01-15T14:45:00Z",
//     lastSavedAt: "2024-01-15T14:45:00Z",
//     completionStatus: "draft",
//     progressPercentage: 25,
//     completedSections: [],
//     draftData: {
//       productName: "Wireless Headphones",
//       // Other fields not yet filled
//     },
//     autoSaveEnabled: true,
//     version: 3,
//     isLocal: false,
//   },
// ];

// Array of all example forms for easy testing
// export const exampleForms: FormConfig[] = [
//   userRegistrationFormExample,
//   userProfileEditFormExample,
//   productInventoryFormExample,
// ];

// Example form submissions
// TODO: Maybe need new examples here as well
// export const exampleSubmissions = [
//   {
//     id: "submission-001",
//     formId: "user-registration-form",
//     submittedBy: "user123",
//     submittedAt: "2024-01-15T14:30:00Z",
//     data: {
//       fullName: "John Doe",
//       email: "john.doe@example.com",
//       phone: "+1-555-0123",
//       department: "Engineering",
//     },
//     status: "success" as const,
//   },
//   {
//     id: "submission-002",
//     formId: "user-profile-edit-form",
//     submittedBy: "user456",
//     submittedAt: "2024-01-15T15:45:00Z",
//     data: {
//       fullName: "Jane Smith",
//       bio: "Software engineer with 5 years of experience in web development.",
//       avatar: "avatar-jane-smith.jpg",
//     },
//     status: "success" as const,
//   },
//   {
//     id: "submission-003",
//     formId: "product-inventory-form",
//     submittedBy: "admin789",
//     submittedAt: "2024-01-15T16:20:00Z",
//     data: {
//       productName: "Wireless Headphones",
//       sku: "WH001",
//       price: 99.99,
//       quantity: 50,
//       category: "Electronics",
//       isActive: true,
//     },
//     status: "success" as const,
//   },
// ];
