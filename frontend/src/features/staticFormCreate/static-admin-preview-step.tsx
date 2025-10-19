import React, { useState, useEffect, useCallback } from "react";
import { Toast } from "../../components/ui/toast"; // Assuming Toast component path is correct
import type { WizardField } from "../../app/routes/static-admin"; // Import WizardField interface

// Define a type for a mock record
interface MockRecord {
  id: string;
  name: string;
  [key: string]: unknown; // Allow for dynamic fields based on WizardField
}

interface PreviewStepProps {
  formName: string;
  saveStatus: "unsaved" | "saving" | "saved";
  selectedFields: WizardField[]; // The configured fields from previous step
  onSaveAndContinue: () => void; // Function to advance to the next step
}

// Local storage key for mock Airtable data
const MOCK_RECORDS_LOCAL_STORAGE_KEY = "mockAirtableRecords";

// Helper to generate a unique ID for mock records
const generateUniqueId = () => `rec_${Math.random().toString(36).substr(2, 9)}`;

export const PreviewStep: React.FC<PreviewStepProps> = ({
  formName,
  saveStatus,
  selectedFields,
  onSaveAndContinue,
}) => {
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [displayMode, setDisplayMode] = useState<"search" | "form">("search");
  const [mockRecords, setMockRecords] = useState<MockRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<MockRecord | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: unknown }>({}); // State to hold form data for editing
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success",
  );

  const showTimedToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Load mock records from local storage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem(MOCK_RECORDS_LOCAL_STORAGE_KEY);
    if (savedRecords) {
      try {
        setMockRecords(JSON.parse(savedRecords));
      } catch (error) {
        console.error(
          "Failed to parse mock records from local storage:",
          error,
        );
        localStorage.removeItem(MOCK_RECORDS_LOCAL_STORAGE_KEY);
      }
    } else {
      // Initialize with some dummy data if nothing is in local storage
      const initialRecords = [
        {
          id: generateUniqueId(),
          name: "Project Alpha",
          "Record Class": "Development",
          "Record ID": "PRJ-001",
          // Populate other fields based on selectedFields if needed, or leave dynamic
          ...Object.fromEntries(
            selectedFields.map((field) => [
              field.name,
              `Value for ${field.name}`,
            ]),
          ),
        },
        {
          id: generateUniqueId(),
          name: "Task Beta",
          "Record Class": "Marketing",
          "Record ID": "TSK-002",
          ...Object.fromEntries(
            selectedFields.map((field) => [
              field.name,
              `Value for ${field.name}`,
            ]),
          ),
        },
      ];
      setMockRecords(initialRecords);
      localStorage.setItem(
        MOCK_RECORDS_LOCAL_STORAGE_KEY,
        JSON.stringify(initialRecords),
      );
    }
  }, [selectedFields]); // Re-run if selectedFields change to update dummy data schema

  // Update local storage whenever mockRecords change
  useEffect(() => {
    localStorage.setItem(
      MOCK_RECORDS_LOCAL_STORAGE_KEY,
      JSON.stringify(mockRecords),
    );
  }, [mockRecords]);

  const handleEditRecord = (record: MockRecord) => {
    setEditingRecord(record);
    // Initialize form data with the record's current values
    const initialFormData: { [key: string]: unknown } = {};
    selectedFields.forEach((field) => {
      initialFormData[field.name] =
        record[field.name] !== undefined ? record[field.name] : "";
    });
    setFormData(initialFormData);
    setDisplayMode("form");
  };

  const handleCreateNewRecord = () => {
    setEditingRecord(null); // Clear editing record
    const newEmptyRecord: { [key: string]: unknown } = {};
    selectedFields.forEach((field) => {
      newEmptyRecord[field.name] = ""; // Start with empty values
    });
    setFormData(newEmptyRecord);
    setDisplayMode("form");
  };

  const handleFormInputChange = (fieldName: string, value: unknown) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleUpdateRecord = async () => {
    // Simulate API call
    showTimedToast("Updating record...", "info");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let updatedMessage = "Record updated successfully!";
    const updatedType: "success" | "error" = "success";

    // Mock Backend / Local Storage Update Logic
    setMockRecords((prevRecords) => {
      const existingRecordIndex = prevRecords.findIndex(
        (r) => r.id === editingRecord?.id,
      );

      if (editingRecord && existingRecordIndex !== -1) {
        // Update existing record
        const updatedRecords = [...prevRecords];
        updatedRecords[existingRecordIndex] = {
          ...editingRecord,
          ...formData,
          // Ensure other fixed fields like 'name', 'Record Class', 'Record ID' are preserved if not in formData
          name:
            typeof formData["name"] === "string"
              ? formData["name"]
              : (editingRecord["name"] ?? ""),
          "Record Class":
            formData["Record Class"] !== undefined
              ? formData["Record Class"]
              : editingRecord["Record Class"],
          "Record ID":
            formData["Record ID"] !== undefined
              ? formData["Record ID"]
              : editingRecord["Record ID"],
        };
        showTimedToast(updatedMessage, updatedType);
        return updatedRecords;
      } else {
        // Create new record
        const newRecord: MockRecord = {
          id: generateUniqueId(),
          ...formData,
          // Assign default values for 'name', 'Record Class', 'Record ID' if not provided in form data
          name:
            typeof formData["name"] === "string" &&
            formData["name"].trim() !== ""
              ? (formData["name"] as string)
              : `New Record ${mockRecords.length + 1}`,
          "Record Class": formData["Record Class"] || "Uncategorized",
          "Record ID": formData["Record ID"] || `NEW-${mockRecords.length + 1}`,
        };
        updatedMessage = "New record created successfully!";
        showTimedToast(updatedMessage, updatedType);
        return [...prevRecords, newRecord];
      }
    });

    setDisplayMode("search"); // Go back to search view after update
    setEditingRecord(null); // Clear editing record
    setFormData({}); // Clear form data
  };

  const getFieldValueOptions = useCallback(
    (fieldName: string): string[] => {
      // This is a mock for getting dropdown options.
      // In a real scenario, you'd fetch distinct values for this column from Airtable.
      const allValuesForField = mockRecords
        .map((record) => record[fieldName])
        .filter((v): v is string => typeof v === "string" && v.length > 0); // Only strings, non-empty
      return Array.from(new Set(allValuesForField)).sort(); // Get unique sorted values
    },
    [mockRecords],
  );

  const renderFormField = (field: WizardField) => {
    const value = formData[field.name] || ""; // Default to empty string if undefined
    const isRequired = field.isRequired;
    const isEditable = field.isEditable;
    const options = getFieldValueOptions(field.name);

    if (!isEditable) {
      return (
        <div key={field.id} className="mb-4">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700"
          >
            {field.name} {isRequired && <span className="text-red-500">*</span>}
            <span className="text-gray-500 text-xs ml-2">({field.type})</span>
          </label>
          <p
            id={field.id}
            className="mt-1 p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
          >
            {typeof value === "string" || typeof value === "number" ? (
              value
            ) : value ? (
              String(value)
            ) : (
              <em>Not set</em>
            )}
          </p>
        </div>
      );
    }

    switch (field.type) {
      case "text":
      case "string":
      case "number":
        return (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.name}{" "}
              {isRequired && <span className="text-red-500">*</span>}
              <span className="text-gray-500 text-xs ml-2">({field.type})</span>
            </label>
            <input
              type={field.type === "number" ? "number" : "text"}
              id={field.id}
              name={field.name}
              value={
                typeof value === "string"
                  ? value
                  : value !== undefined && value !== null
                    ? String(value)
                    : ""
              }
              onChange={(e) =>
                handleFormInputChange(field.name, e.target.value)
              }
              required={isRequired}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      case "long text":
        return (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.name}{" "}
              {isRequired && <span className="text-red-500">*</span>}
              <span className="text-gray-500 text-xs ml-2">({field.type})</span>
            </label>
            <textarea
              id={field.id}
              name={field.name}
              value={
                typeof value === "string" || typeof value === "number"
                  ? value
                  : value !== undefined && value !== null
                    ? String(value)
                    : ""
              }
              onChange={(e) =>
                handleFormInputChange(field.name, e.target.value)
              }
              required={isRequired}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        );
      case "single select":
      case "multiselect": // Treat multiselect as single select for simplicity in mock, could be enhanced
        return (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.name}{" "}
              {isRequired && <span className="text-red-500">*</span>}
              <span className="text-gray-500 text-xs ml-2">({field.type})</span>
            </label>
            <select
              id={field.id}
              name={field.name}
              value={
                typeof value === "string" || typeof value === "number"
                  ? value
                  : value !== undefined && value !== null
                    ? String(value)
                    : ""
              }
              onChange={(e) =>
                handleFormInputChange(field.name, e.target.value)
              }
              required={isRequired}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      case "checkbox":
      case "boolean":
        return (
          <div key={field.id} className="mb-4 flex items-center">
            <input
              type="checkbox"
              id={field.id}
              name={field.name}
              checked={!!value} // Convert to boolean
              onChange={(e) =>
                handleFormInputChange(field.name, e.target.checked)
              }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={field.id}
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              {field.name}{" "}
              {isRequired && <span className="text-red-500">*</span>}
              <span className="text-gray-500 text-xs ml-2">({field.type})</span>
            </label>
          </div>
        );
      case "date":
        return (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.name}{" "}
              {isRequired && <span className="text-red-500">*</span>}
              <span className="text-gray-500 text-xs ml-2">({field.type})</span>
            </label>
            <input
              type="date"
              id={field.id}
              name={field.name}
              value={
                typeof value === "string" || typeof value === "number"
                  ? value
                  : value !== undefined && value !== null
                    ? String(value)
                    : ""
              }
              onChange={(e) =>
                handleFormInputChange(field.name, e.target.value)
              }
              required={isRequired}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      case "datetime":
        return (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.name}{" "}
              {isRequired && <span className="text-red-500">*</span>}
              <span className="text-gray-500 text-xs ml-2">({field.type})</span>
            </label>
            <input
              type="datetime-local"
              id={field.id}
              name={field.name}
              value={
                typeof value === "string" || typeof value === "number"
                  ? value
                  : value !== undefined && value !== null
                    ? String(value)
                    : ""
              }
              onChange={(e) =>
                handleFormInputChange(field.name, e.target.value)
              }
              required={isRequired}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      default:
        // Fallback for unhandled types, treat as text
        return (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.name}{" "}
              {isRequired && <span className="text-red-500">*</span>}
              <span className="text-gray-500 text-xs ml-2">
                ({field.type} - Default Text Input)
              </span>
            </label>
            <input
              type="text"
              id={field.id}
              name={field.name}
              value={
                typeof value === "string" || typeof value === "number"
                  ? value
                  : value !== undefined && value !== null
                    ? String(value)
                    : ""
              }
              onChange={(e) =>
                handleFormInputChange(field.name, e.target.value)
              }
              required={isRequired}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {formName || "Untitled Form"}
          </h1>
          <p className="text-sm text-gray-500">
            Save Status:{" "}
            <span
              className={
                saveStatus === "saved"
                  ? "text-green-600"
                  : saveStatus === "saving"
                    ? "text-yellow-600"
                    : "text-red-600"
              }
            >
              {saveStatus.charAt(0).toUpperCase() + saveStatus.slice(1)}
            </span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">Preview</h2>
      <p className="text-gray-600 mb-6">
        Test your form by submitting data directly to Airtable. Verify that your
        form works as expected before deployment.
      </p>

      <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg mb-6 text-gray-700 text-sm">
        <strong className="block mb-1">
          This is a live testing environment
        </strong>
        Any data submitted in this step will be sent to your Airtable base. Use
        test data to avoid polluting your production data.
      </div>

      <div className="mb-6">
        <label
          htmlFor="preview-mode-group"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Preview Mode:
        </label>
        <div className="sr-only">
          <input
            type="radio"
            id="preview-mode-desktop"
            name="preview-mode-group"
            checked={previewMode === "desktop"}
            onChange={() => setPreviewMode("desktop")}
          />
          <input
            type="radio"
            id="preview-mode-tablet"
            name="preview-mode-group"
            checked={previewMode === "tablet"}
            onChange={() => setPreviewMode("tablet")}
          />
          <input
            type="radio"
            id="preview-mode-mobile"
            name="preview-mode-group"
            checked={previewMode === "mobile"}
            onChange={() => setPreviewMode("mobile")}
          />
        </div>
        <div
          className="flex items-center space-x-4"
          role="radiogroup"
          aria-labelledby="preview-mode-label"
        >
          <button
            type="button"
            role="radio"
            aria-checked={previewMode === "desktop"}
            aria-label="Desktop Preview Mode"
            onClick={() => setPreviewMode("desktop")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              previewMode === "desktop"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={previewMode === "tablet"}
            aria-label="Tablet Preview Mode"
            onClick={() => setPreviewMode("tablet")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              previewMode === "tablet"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tablet
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={previewMode === "mobile"}
            aria-label="Mobile Preview Mode"
            onClick={() => setPreviewMode("mobile")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              previewMode === "mobile"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Mobile
          </button>
        </div>
        {/*  slider  */}
        <div className="mt-2 text-gray-500 text-xs"></div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setDisplayMode("search")}
            className={`p-4 text-center font-semibold text-lg transition-colors duration-200 ${
              displayMode === "search"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setDisplayMode("form")}
            className={`p-4 text-center font-semibold text-lg transition-colors duration-200 ${
              displayMode === "form"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Form
          </button>
        </div>

        <div className="p-6 bg-white">
          {displayMode === "search" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">All Records</h3>
                <button
                  onClick={handleCreateNewRecord}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  Create New Record
                </button>
              </div>

              {mockRecords.length === 0 ? (
                <p className="text-gray-500">
                  No records found. Create a new one to get started!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Record Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Record Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Record ID
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof record["Record Class"] === "string" ||
                            typeof record["Record Class"] === "number" ? (
                              record["Record Class"]
                            ) : record["Record Class"] !== undefined &&
                              record["Record Class"] !== null ? (
                              String(record["Record Class"])
                            ) : (
                              <em>Not set</em>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof record["Record ID"] === "string" ||
                            typeof record["Record ID"] === "number" ? (
                              record["Record ID"]
                            ) : record["Record ID"] !== undefined &&
                              record["Record ID"] !== null ? (
                              String(record["Record ID"])
                            ) : (
                              <em>Not set</em>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditRecord(record)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit Record
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {displayMode === "form" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editingRecord ? "Edit Record" : "Create New Record"}
                </h3>
                <button
                  onClick={() => setDisplayMode("search")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                >
                  Back to Search
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateRecord();
                }}
              >
                {/* Dynamically render fields based on selectedAirtableFields */}
                {selectedFields.length > 0 ? (
                  selectedFields.map(renderFormField)
                ) : (
                  <p className="text-gray-500">
                    No fields selected for this form. Please configure fields in
                    the previous step.
                  </p>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
                  >
                    {editingRecord ? "Update Record" : "Create Record"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Save and Continue Button */}
      <div className="mt-8 text-right">
        <button
          onClick={onSaveAndContinue}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" ? "Saving..." : "Save and Continue"}
        </button>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

// Using some copilot help here oops
// Mock Backend API Logic Placeholder (for future integration)
/*
const mockAirtableApi = {
  fetchRecords: async (baseId: string, tableId: string) => {
    console.log(`[Backend Mock] Fetching records from Base: ${baseId}, Table: ${tableId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    // In a real scenario, this would be an actual API call to Airtable
    // For now, it will load from local storage or return dummy data
    const stored = localStorage.getItem(MOCK_RECORDS_LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [
        { id: 'rec1', name: 'Mock Item 1', 'Record Class': 'Type A', 'Record ID': 'XYZ-001', 'Description': 'This is a test description.' },
        { id: 'rec2', name: 'Mock Item 2', 'Record Class': 'Type B', 'Record ID': 'XYZ-002', 'Is Active': true, 'Date': '2023-01-15' },
    ];
  },

  updateRecord: async (baseId: string, tableId: string, recordId: string, data: unknown) => {
    console.log(`[Backend Mock] Updating record ${recordId} in Base: ${baseId}, Table: ${tableId} with data:`, data);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    let records = JSON.parse(localStorage.getItem(MOCK_RECORDS_LOCAL_STORAGE_KEY) || '[]');
    const index = records.findIndex((r: MockRecord) => r.id === recordId);
    if (index !== -1) {
      records[index] = { ...records[index], ...data };
      localStorage.setItem(MOCK_RECORDS_LOCAL_STORAGE_KEY, JSON.stringify(records));
      return { success: true, message: 'Record updated successfully.' };
    }
    return { success: false, message: 'Record not found.' };
  },

  createRecord: async (baseId: string, tableId: string, data: unknown) => {
    console.log(`[Backend Mock] Creating record in Base: ${baseId}, Table: ${tableId} with data:`, data);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    let records = JSON.parse(localStorage.getItem(MOCK_RECORDS_LOCAL_STORAGE_KEY) || '[]');
    const newRecord = { id: generateUniqueId(), ...data };
    records.push(newRecord);
    localStorage.setItem(MOCK_RECORDS_LOCAL_STORAGE_KEY, JSON.stringify(records));
    return { success: true, message: 'Record created successfully.', record: newRecord };
  }
};
*/
