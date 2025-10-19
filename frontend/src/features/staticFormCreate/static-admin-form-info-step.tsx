import React from "react";

// Define the props interface for FormInfoStep
interface FormInfoStepProps {
  formName: string;
  setFormName: (name: string) => void;
  formDescription: string;
  setFormDescription: (description: string) => void;
  saveStatus: "unsaved" | "saving" | "saved";
}

export const FormInfoStep: React.FC<FormInfoStepProps> = ({
  formName,
  setFormName,
  formDescription,
  setFormDescription,
  saveStatus,
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

  return (
    <div className="space-y-6">
      {/* Default Heading and Save Status Indicator */}
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">
          {formName || "Untitled Form"} {/* Display formName or default */}
        </h1>
        {getStatusIndicator()}
      </div>

      {/* Form Information Section */}
      <h2 className="text-2xl font-semibold mb-4">Form Information</h2>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="mb-6">
          <label
            htmlFor="form-name"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Form Name
          </label>
          <input
            type="text"
            id="form-name"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter your form's name"
          />
        </div>

        <div>
          <label
            htmlFor="form-description"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Form Description
          </label>
          <textarea
            id="form-description"
            rows={4} // Makes the textarea long
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base resize-y"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Provide a detailed description of your form..."
          ></textarea>
        </div>
      </div>

      {/* Record Editing Form Information */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Record Editing Form
        </h3>
        <p className="text-gray-600">
          This form is configured for editing existing records. Users will need
          to search for a record before they can edit it.
        </p>
      </div>
    </div>
  );
};
