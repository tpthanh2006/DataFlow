import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid"; // For the refresh icon
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Mock data for available fields (replace with actual data from backend)
const MOCK_FIELDS = [
  {
    id: "fld1",
    name: "Record ID",
    type: "Formula",
    backendId: "recId123",
    isRequired: true,
    isEditable: true,
  },
  {
    id: "fld2",
    name: "Full Name",
    type: "Single line text",
    backendId: "name456",
    isRequired: false,
    isEditable: true,
  },
  {
    id: "fld3",
    name: "Email Address",
    type: "Email",
    backendId: "email789",
    isRequired: false,
    isEditable: true,
  },
  {
    id: "fld4",
    name: "Project Status",
    type: "Single select",
    backendId: "status101",
    isRequired: false,
    isEditable: true,
  },
  {
    id: "fld5",
    name: "Last Modified",
    type: "Last modified time",
    backendId: "modified202",
    isRequired: false,
    isEditable: false,
  },
  // Add more mock fields to test scrolling and search
  {
    id: "fld6",
    name: "Description",
    type: "Long text",
    backendId: "desc303",
    isRequired: false,
    isEditable: true,
  },
  {
    id: "fld7",
    name: "Attachments",
    type: "Attachments",
    backendId: "attach404",
    isRequired: false,
    isEditable: true,
  },
  {
    id: "fld8",
    name: "Due Date",
    type: "Date",
    backendId: "date505",
    isRequired: false,
    isEditable: true,
  },
  {
    id: "fld9",
    name: "Assigned To",
    type: "User",
    backendId: "user606",
    isRequired: false,
    isEditable: true,
  },
];

interface Field {
  isRequired: boolean;
  isEditable: boolean;
  id: string;
  name: string;
  type: string;
  backendId: string; // Placeholder for actual backend ID like Airtable Field ID
  order?: number; // order property for drag-and-drop
}

interface FieldSelectionStepProps {
  formName: string;
  saveStatus: "unsaved" | "saving" | "saved";
  totalAvailableFields: number; // Total fields count passed from StaticAdmin (from previous step)
  selectedFields: Field[]; // Array of selected field objects
  setSelectedFields: (fields: Field[]) => void; // Function to update selected fields in parent
  currentSearchTerm: string; // Global search term for highlighting
}

export const FieldSelectionStep: React.FC<FieldSelectionStepProps> = ({
  formName,
  saveStatus,
  totalAvailableFields,
  selectedFields,
  setSelectedFields,
  //currentSearchTerm, // Receive global search term
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectAllToggled, setSelectAllToggled] = useState<boolean>(false);

  // We'll manage the actual available fields here, derived from mock data for now
  // ideally, this would come from an API call
  const [availableFields, setAvailableFields] = useState<Field[]>(MOCK_FIELDS);

  // Ref for the content area to apply global highlights
  const availableFieldsRef = useRef<HTMLDivElement>(null);

  //  Highlighting Logic for Field Names (Adapted from StaticAdmin)
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
      if (!element) return; // Ensure element exists
      clearHighlights(element);

      if (!term) {
        return;
      }

      const escapedSearchTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedSearchTerm})`, "gi");

      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          const parent = node.parentNode;
          // Reject if already inside a highlight span or a script/style tag
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
          regex.lastIndex = 0; // Reset regex lastIndex before each exec call

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

  // Apply highlighting when search term or available fields change
  useEffect(() => {
    if (availableFieldsRef.current) {
      applyHighlights(availableFieldsRef.current, searchTerm); // Use local search term for filtering
    }
  }, [searchTerm, availableFields, applyHighlights]); // Re-apply if fields or term changes

  // Update selected fields state based on parent selectedFields prop
  useEffect(() => {
    // This effect ensures our internal checkboxes match the parent's selectedFields
    setAvailableFields((prevFields) =>
      prevFields.map((field) => ({
        ...field,
        selected: selectedFields.some((sf) => sf.id === field.id),
      })),
    );
  }, [selectedFields]);

  // Effect to update selectAllToggled when selectedFields or availableFields change
  useEffect(() => {
    if (
      availableFields.length > 0 &&
      selectedFields.length === availableFields.length
    ) {
      setSelectAllToggled(true);
    } else {
      setSelectAllToggled(false);
    }
  }, [selectedFields, availableFields]);

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

  const handleFieldToggle = (field: Field) => {
    const isSelected = selectedFields.some((sf) => sf.id === field.id);
    if (isSelected) {
      setSelectedFields(selectedFields.filter((sf) => sf.id !== field.id));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleSelectAllToggle = () => {
    if (selectAllToggled) {
      setSelectedFields([]); // Deselect all
      setSelectAllToggled(false);
    } else {
      setSelectedFields(filteredFields); // Select all currently filtered fields
      setSelectAllToggled(true);
    }
  };

  const handleRefreshFields = () => {
    console.log("Refreshing fields from backend...");
    // --- Backend Integration:
    // This is where you would make an API call to your backend
    // to re-fetch the fields from Airtable based on the selected base and table
    // from the previous step.
    // Example:
    // fetch('/api/airtable/fields?baseId=<selectedBaseId>&tableId=<selectedTableId>')
    //   .then(res => res.json())
    //   .then(data => {
    //     setAvailableFields(data.fields.map(f => ({ id: f.id, name: f.name, type: f.type, backendId: f.id })));
    //     // Ensure existing selections are maintained after refresh
    //     const refreshedSelected = data.fields.filter(f => selectedFields.some(sf => sf.id === f.id));
    //     setSelectedFields(refreshedSelected);
    //     // Update totalAvailableFields in parent state if necessary, if it changed on refresh
    //   })
    //   .catch(error => console.error('Failed to refresh fields:', error));
    // ---
    // For now, let's just re-set mock fields to simulate a refresh
    setAvailableFields([...MOCK_FIELDS]);
    console.log("Mock fields refreshed.");
  };

  const filteredFields = availableFields.filter(
    (field) =>
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Drag and Drop handler
  const handleDragEnd = (result: import("react-beautiful-dnd").DropResult) => {
    if (!result.destination) return;

    const reorderedFields = Array.from(filteredFields);
    const [movedField] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, movedField);

    // Update the availableFields state with the new order
    setAvailableFields((prevFields) =>
      prevFields.map((field) => {
        const updatedField = reorderedFields.find((f) => f.id === field.id);
        return updatedField ? { ...field, order: updatedField?.order } : field;
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Topmost Heading: Form Name and Save Status */}
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">
          {formName || "Default"} {/* Display formName or 'Default' */}
        </h1>
        {getStatusIndicator()}
      </div>

      {/* Field Selection Section */}
      <h2 className="text-2xl font-semibold mb-2">Field Selection</h2>
      <p className="text-gray-600 mb-6">
        Select fields from your data source to include in your form. You'll be
        able to configure field properties in the next step.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
        {/* Available Fields Header with Refresh Button */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Available Fields
            </h3>
            <p className="text-gray-600 text-sm">
              Click on fields to include or exclude them from your form.
            </p>
          </div>
          <button
            onClick={handleRefreshFields}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>

        {/* Search, Select All, and Count Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Search Bar */}
          <div className="md:col-span-1 p-3 rounded-lg border border-gray-200 shadow-sm">
            <label htmlFor="field-search" className="sr-only">
              Search fields
            </label>
            <input
              type="text"
              id="field-search"
              className="block w-full px-2 py-1 border-0 focus:ring-0 focus:outline-none sm:text-base"
              placeholder="Search fields"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Select All Button */}
          <div className="md:col-span-1 p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
            <button
              onClick={handleSelectAllToggle}
              className={`w-full py-1 rounded-md transition-colors duration-200 text-sm font-medium
                ${selectAllToggled ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {selectAllToggled ? "Deselect All" : "Select All"}
            </button>
          </div>

          {/* Selection Count */}
          <div className="md:col-span-1 p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center bg-gray-50 text-gray-800 font-semibold text-lg">
            <span>
              {selectedFields.length}/{totalAvailableFields} Selected
            </span>
          </div>
        </div>

        {/* Field List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {filteredFields.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...(provided.dragHandleProps
                          ? provided.dragHandleProps
                          : {})}
                        className={`p-4 rounded-lg border ${selectedFields.some((sf) => sf.id === field.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"} shadow-sm flex items-start space-x-3 cursor-pointer transition-all duration-150 ease-in-out hover:shadow-md`}
                        onClick={() => handleFieldToggle(field)}
                        onKeyDown={(e) =>
                          (e.key === "Enter" || e.key === " ") &&
                          handleFieldToggle(field)
                        }
                        role="button"
                        tabIndex={0}
                        aria-pressed={selectedFields.some(
                          (sf) => sf.id === field.id,
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedFields.some(
                            (sf) => sf.id === field.id,
                          )}
                          onChange={() => handleFieldToggle(field)} // Handle change for direct checkbox clicks
                        />
                        <div>
                          <strong className="text-lg text-gray-900">
                            {field.name}
                          </strong>
                          <p className="text-sm text-gray-600">
                            Type: {field.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {field.backendId}
                          </p>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
