import React, { useEffect, useCallback, useRef } from "react";
import { ArrowPathIcon, Bars3Icon } from "@heroicons/react/20/solid"; // Refresh and Drag icons

// Define the structure for a field in this step
interface ConfigurableField {
  id: string;
  name: string;
  type: string;
  backendId: string;
  isEditable: boolean;
  isRequired: boolean;
}

interface ConfigurationStepProps {
  formName: string;
  saveStatus: "unsaved" | "saving" | "saved";
  selectedFields: ConfigurableField[]; // Fields passed from FieldSelectionStep (from StaticAdmin state)
  setSelectedFields: React.Dispatch<React.SetStateAction<ConfigurableField[]>>; // Correct type for a useState setter
  currentSearchTerm: string; // For global highlighting
}

export const ConfigurationStep: React.FC<ConfigurationStepProps> = ({
  formName,
  saveStatus,
  selectedFields, // includes isEditable, isRequired if loaded from storage
  setSelectedFields,
  currentSearchTerm,
}) => {
  // Use a ref for the component's main content area for global highlighting
  const contentRef = useRef<HTMLDivElement>(null);

  // Highlighting Logic (re-used) -> might wanna put this under the ui folder ngl
  const HIGHLIGHT_CLASS_NAME = "highlight-text-match";

  const clearHighlights = useCallback((element: HTMLElement) => {
    const highlights = element.querySelectorAll(`span.${HIGHLIGHT_CLASS_NAME}`);
    highlights.forEach((span) => {
      const parent = span.parentNode;
      if (parent instanceof HTMLElement) {
        parent.replaceChild(
          document.createTextNode(span.textContent || ""),
          span,
        );
      }
    });
    element.normalize();
  }, []);

  const applyHighlights = useCallback(
    (element: HTMLElement, term: string) => {
      if (!element) return;
      clearHighlights(element);

      if (!term) {
        return;
      }

      const escapedSearchTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedSearchTerm})`, "gi");

      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          const parent = node.parentNode;
          if (
            (parent instanceof HTMLElement &&
              parent.classList.contains(HIGHLIGHT_CLASS_NAME)) ||
            parent?.nodeName === "SCRIPT" ||
            parent?.nodeName === "STYLE"
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      let node;
      const textNodesToProcess: Text[] = [];

      while ((node = walker.nextNode())) {
        textNodesToProcess.push(node as Text);
      }

      textNodesToProcess.forEach((textNode) => {
        const nodeValue = textNode.nodeValue;
        if (nodeValue && regex.test(nodeValue)) {
          regex.lastIndex = 0;

          const fragment = document.createDocumentFragment();
          let lastIndex = 0;
          let match;

          while ((match = regex.exec(nodeValue)) !== null) {
            if (match.index > lastIndex) {
              fragment.appendChild(
                document.createTextNode(
                  nodeValue.substring(lastIndex, match.index),
                ),
              );
            }

            const span = document.createElement("span");
            span.className = `${HIGHLIGHT_CLASS_NAME} bg-yellow-300 font-bold`;
            span.textContent = match[0];
            fragment.appendChild(span);

            lastIndex = regex.lastIndex;
          }

          if (lastIndex < nodeValue.length) {
            fragment.appendChild(
              document.createTextNode(nodeValue.substring(lastIndex)),
            );
          }

          if (textNode.parentNode) {
            textNode.parentNode.replaceChild(fragment, textNode);
          }
        }
      });
    },
    [clearHighlights],
  );

  useEffect(() => {
    if (contentRef.current) {
      applyHighlights(contentRef.current, currentSearchTerm);
    }
  }, [currentSearchTerm, applyHighlights]);
  //highlight ends here, so... def need to put this in a separate file later

  // Determine the text and style for the save status indicator -> need stylesheet
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

  const handleFieldPropertyChange = (
    fieldId: string,
    property: "isEditable" | "isRequired",
    value: boolean,
  ) => {
    setSelectedFields((prevFields: ConfigurableField[]) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, [property]: value } : field,
      ),
    );
  };

  const handleRefreshFields = () => {
    console.log("Refreshing field configurations from backend...");
    // using some help from copilot:
    // This is where you would make an API call to your backend
    // to re-fetch the configuration (e.g., whether fields are editable/required by default)
    // or to update field order.
    // This is less about fetching new fields, and more about updating properties
    // or possibly re-syncing if Airtable types have changed (though that's rare)
    // You might also use this to refresh auto-generated field detection.
    //
    // For now, we'll just simulate an animation and toast.
    //
    // Example:
    // fetch('/api/airtable/field-configs?baseId=<base>&tableId=<table>')
    //   .then(res => res.json())
    //   .then(data => {
    //     // Merge new config with existing selectedFields, keeping user's changes where possible
    //     const updatedFields = selectedFields.map(existingField => {
    //       const newConfig = data.find(f => f.id === existingField.id);
    //       return newConfig ? {
    //         ...existingField,
    //         isEditable: newConfig.isEditable ?? existingField.isEditable, // Preserve if not provided
    //         isRequired: newConfig.isRequired ?? existingField.isRequired,
    //         // Potentially update field type/name if it changed on Airtable, but be careful
    //       } : existingField;
    //     });
    //     setSelectedFields(updatedFields);
    //     // You might also update the auto-generated count here based on new data
    //     // setAutoGeneratedFieldsCount(...);
    //   })
    //   .catch(error => console.error('Failed to refresh field configurations:', error));

    // animation
    const button = document.getElementById("refresh-fields-button");
    if (button) {
      button.classList.add("animate-spin-once"); // Add a class for animation, need to define in css
      setTimeout(() => {
        button.classList.remove("animate-spin-once");
      }, 1000);
    }
    // toast
    alert("Fields refreshed!"); // Simple alert for now, real toast comes from StaticAdmin
    console.log("Mock refresh animation and toast triggered.");
  };

  // Identify auto-generated fields (Formula, Lookup, Count, Rollup, AutoNumber)
  const autoGeneratedFields = selectedFields.filter((field) =>
    ["Formula", "Lookup", "Count", "Rollup", "AutoNumber"].includes(field.type),
  );

  return (
    <div className="space-y-6" ref={contentRef}>
      {/* Topmost Heading: Form Name and Save Status */}
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">{formName || "Default"}</h1>
        {getStatusIndicator()}
      </div>

      {/* Configuration Section */}
      <h2 className="text-2xl font-semibold mb-2">Configuration</h2>
      <p className="text-gray-600 mb-6">
        Select fields from your data source to include in your form. You'll be
        able to configure field properties in the next step.
      </p>

      {/* Special Field Types Info Box */}
      {autoGeneratedFields.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg text-black text-sm font-semibold mb-6">
          Special Field Types: {autoGeneratedFields.length} auto-generated field
          {autoGeneratedFields.length !== 1 ? "s" : ""} detected (Formula,
          Lookup, Count, Rollup, AutoNumber). These fields cannot be edited or
          required.
        </div>
      )}

      {/* Form Fields Header with Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Form Fields</h3>
        <button
          id="refresh-fields-button"
          onClick={handleRefreshFields}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Field Configuration Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2"
              >
                Field
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
              >
                Editable
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
              >
                Required
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {selectedFields.length > 0 ? (
              selectedFields.map((field) => {
                const isAutoGenerated = [
                  "Formula",
                  "Lookup",
                  "Count",
                  "Rollup",
                  "AutoNumber",
                ].includes(field.type);
                return (
                  <tr key={field.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center space-x-3">
                        <Bars3Icon
                          className="h-5 w-5 text-gray-400 cursor-grab"
                          title="Drag to reorder"
                        />
                        <div>
                          <strong className="block text-base">
                            {field.name}
                          </strong>
                          <span className="block text-xs text-gray-500">
                            {field.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) =>
                          handleFieldPropertyChange(
                            field.id,
                            "isEditable",
                            e.target.checked,
                          )
                        }
                        title={
                          isAutoGenerated
                            ? "Auto-generated fields cannot be edited"
                            : ""
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) =>
                          handleFieldPropertyChange(
                            field.id,
                            "isRequired",
                            e.target.checked,
                          )
                        }
                        title={
                          isAutoGenerated
                            ? "Auto-generated fields cannot be required"
                            : ""
                        }
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No fields selected. Please go to the "Field Selection" step to
                  select fields.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
