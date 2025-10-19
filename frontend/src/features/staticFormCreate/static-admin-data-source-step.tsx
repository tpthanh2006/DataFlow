import React from "react";

// Define the props interface for DataSourceStep
interface DataSourceStepProps {
  formName: string; // To display the form name from the previous step
  saveStatus: "unsaved" | "saving" | "saved"; // To display the save status
  //props for backend using some copilot help:
  // airtableBase: string; // Current selected Airtable base ID/name
  // setAirtableBase: (base: string) => void; // Function to update Airtable base
  // airtableTable: string; // Current selected Airtable table ID/name
  // setAirtableTable: (table: string) => void; // Function to update Airtable table
  // airtableBasesOptions: { value: string; label: string }[]; // Options for the base dropdown
  // airtableTablesOptions: { value: string; label: string }[]; // Options for the table dropdown (depends on selected base)
  // connectionStatus: 'idle' | 'connecting' | 'connected' | 'error'; // Status of Airtable connection
  // numberOfFields: number | null; // Number of fields found after connection
  // handleConnectAirtable: () => void; // Function to initiate Airtable connection
}

export const DataSourceStep: React.FC<DataSourceStepProps> = ({
  formName,
  saveStatus,
  // Destructure props for future backend integration
  // airtableBase,
  // setAirtableBase,
  // airtableTable,
  // setAirtableTable,
  // airtableBasesOptions,
  // airtableTablesOptions,
  // connectionStatus,
  // numberOfFields,
  // handleConnectAirtable,
}) => {
  // Determine the text and style for the save status indicator
  const getStatusIndicator = () => {
    switch (saveStatus) {
      case "unsaved":
        return (
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            Unsaved
          </span>
        );
      case "saving":
        return (
          <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            Saving...
          </span>
        );
      case "saved":
        return (
          <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Saved
          </span>
        );
      default:
        return null;
    }
  };

  // --- Placeholder states for dropdowns until backend integration ---
  const [selectedBase, setSelectedBase] = React.useState("");
  const [selectedTable, setSelectedTable] = React.useState("");

  return (
    <div className="space-y-6">
      {/* Topmost Heading: Form Name and Save Status */}
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">
          {formName || "Default"} {/* Display formName or 'Default' */}
        </h1>
        {getStatusIndicator()}
      </div>

      {/* Data Source Section */}
      <h2 className="text-2xl font-semibold mb-2">Data Source</h2>
      <p className="text-gray-600 mb-6">
        Connect your form to an Airtable data source.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
        {/* Airtable Base Selection */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Airtable Base
          </h3>
          <div className="mb-4">
            <label htmlFor="airtable-base-select" className="sr-only">
              Select an Airtable Base
            </label>
            <select
              id="airtable-base-select"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
              value={selectedBase} // Use internal state for now
              onChange={(e) => {
                setSelectedBase(e.target.value);
                // --- Backend Integration: Update parent state for Airtable base ---
                // setAirtableBase(e.target.value);
                // --- Important: When base changes, clear selected table and fetch new tables ---
                // setAirtableTable('');
                // handleFetchAirtableTables(e.target.value);
              }}
            >
              <option value="">Select an option</option>
              {/* --- Backend Integration: Map actual Airtable bases here --- */}
              {/* {airtableBasesOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))} */}
              <option value="default_base">Default Base (Placeholder)</option>{" "}
              {/* Placeholder */}
              <option value="another_base">
                Another Base (Placeholder)
              </option>{" "}
              {/* Placeholder */}
            </select>
            {/* --- Backend Integration: Loading/error indicator for bases ---
            {connectionStatus === 'connecting' && <p className="text-blue-500 text-sm mt-1">Loading bases...</p>}
            {connectionStatus === 'error' && <p className="text-red-500 text-sm mt-1">Failed to load bases.</p>}
            */}
          </div>
        </div>

        {/* Airtable Table Selection */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Table</h3>
          <div className="mb-4">
            <label htmlFor="airtable-table-select" className="sr-only">
              Select an Airtable Table
            </label>
            <select
              id="airtable-table-select"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
              value={selectedTable} // Use internal state for now
              onChange={(e) => {
                setSelectedTable(e.target.value);
                // --- Backend Integration: Update parent state for Airtable table ---
                // setAirtableTable(e.target.value);
              }}
              disabled={!selectedBase} // Disable table selection until a base is chosen
            >
              <option value="">Select an option</option>
              {/* --- Backend Integration: Map actual Airtable tables here --- */}
              {/* {airtableTablesOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))} */}
              <option value="default_table" disabled={!selectedBase}>
                Default Table (Placeholder)
              </option>{" "}
              {/* Placeholder */}
              <option value="another_table" disabled={!selectedBase}>
                Another Table (Placeholder)
              </option>{" "}
              {/* Placeholder */}
            </select>
            {/* --- Backend Integration: Loading/error indicator for tables ---
             {connectionStatus === 'connecting' && selectedBase && <p className="text-blue-500 text-sm mt-1">Loading tables...</p>}
             */}
          </div>
        </div>

        {/* Connection Status Placeholder */}
        {selectedBase && selectedTable && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200 text-gray-700">
            {/* --- Backend Integration: Dynamically show connection status and fields --- */}
            {/* {connectionStatus === 'connected' && (
              <p className="font-semibold text-green-700">
                Successfully connected to Airtable. Found {numberOfFields} fields.
              </p>
            )}
            {connectionStatus === 'connecting' && (
              <p className="font-semibold text-blue-700 animate-pulse">
                Connecting to Airtable...
              </p>
            )}
            {connectionStatus === 'error' && (
              <p className="font-semibold text-red-700">
                Failed to connect to Airtable. Please check your credentials.
              </p>
            )}
            */}
            {/* Placeholder text for now */}
            <p className="font-semibold">
              Placeholder: Successfully connected to Airtable. Found 7 fields.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
