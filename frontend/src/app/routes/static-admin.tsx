import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../../features/staticFormCreate/static-admin-sidebar";
import { useNavigate } from "react-router-dom";
import { FormInfoStep } from "../../features/staticFormCreate/static-admin-form-info-step";
import { Toast } from "../../components/ui/toast";
import { DataSourceStep } from "../../features/staticFormCreate/static-admin-data-source-step";
import { FieldSelectionStep } from "../../features/staticFormCreate/static-admin-field-selection-step";
import { ConfigurationStep } from "../../features/staticFormCreate/static-admin-configuration-step";
import { PreviewStep } from "../../features/staticFormCreate/static-admin-preview-step";
import { PublishStep } from "../../features/staticFormCreate/static-admin-publish-step";
import StaticAdminHeader from "@/features/staticFormCreate/static-admin-header";
import { useSelector } from "react-redux";
import { selectRole, selectUser } from "@/state/auth/authSlice";

// Key for local storage for all admin form data
const LOCAL_STORAGE_KEY = "adminWizardData";

// Define a consistent type for a field object across steps
export interface WizardField {
  id: string;
  name: string;
  type: string;
  backendId: string;
  isEditable: boolean;
  isRequired: boolean;
}

export const StaticAdmin = () => {
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [maxReachableStep, setMaxReachableStep] = useState<number>(0);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(""); // Global search term for header

  // States for Form Info data
  const [formName, setFormName] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");

  // States for Data Source data
  const [airtableBase, setAirtableBase] = useState<string>("");
  const [airtableTable, setAirtableTable] = useState<string>("");
  // Removed unused airtableConnectionStatus
  const [airtableNumberOfFields, setAirtableNumberOfFields] =
    useState<number>(2); // Default to 2, will be dynamic based on mock or backend

  // States for Field Selection & Configuration data
  // Initialize with default false for editable/required for new fields
  const [selectedAirtableFields, setSelectedAirtableFields] = useState<
    WizardField[]
  >([]);

  const [saveStatus, setSaveStatus] = useState<"unsaved" | "saving" | "saved">(
    "unsaved",
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success",
  );

  const contentRef = useRef<HTMLDivElement>(null); // Ref for global highlighting

  const totalSteps = 6;

  const navigate = useNavigate();

  // --- Load data from local storage on initial mount ---
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormName(parsedData.formName || "");
        setFormDescription(parsedData.formDescription || "");
        setAirtableBase(parsedData.airtableBase || "");
        setAirtableTable(parsedData.airtableTable || "");
        setAirtableNumberOfFields(parsedData.airtableNumberOfFields ?? 2); // Use saved count or default

        // Make sure selected fields also have isEditable and isRequired, default to true/false if missing
        // Loaded fields need to conform to WizardField interface
        setSelectedAirtableFields(
          (parsedData.selectedAirtableFields || []).map((f: WizardField) => ({
            id: f.id,
            name: f.name,
            type: f.type,
            backendId: f.backendId,
            isEditable: f.isEditable ?? true, // Default to true if not set
            isRequired: f.isRequired ?? false, // Default to false if not set
          })),
        );

        setSaveStatus("saved"); // If data was loaded, it's considered saved
        //setAirtableConnectionStatus(parsedData.airtableBase && parsedData.airtableTable ? 'connected' : 'idle');
      } catch (error) {
        console.error("Failed to parse wizard data from local storage:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear potentially corrupted data
        setSaveStatus("unsaved"); // Need to make sure status reflects potential data loss
      }
    }
  }, []);

  // Update save status when any relevant form data changes for the given/active step
  useEffect(() => {
    const isUnsaved = () => {
      // Get currently saved data to compare against
      const currentSavedData = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "{}",
      );

      switch (activeStep) {
        case 0: // Form Info
          return (
            formName !== (currentSavedData.formName || "") ||
            formDescription !== (currentSavedData.formDescription || "")
          );
        case 1: // Data Source
          return (
            airtableBase !== (currentSavedData.airtableBase || "") ||
            airtableTable !== (currentSavedData.airtableTable || "")
          );
        case 2: {
          // Field Selection
          // Compare selected fields IDs
          const currentSelectedIds = new Set(
            selectedAirtableFields.map((f) => f.id),
          );
          const savedSelectedIds = new Set(
            (currentSavedData.selectedAirtableFields || []).map(
              (f: WizardField) => f.id,
            ),
          );
          if (currentSelectedIds.size !== savedSelectedIds.size) return true;
          for (const id of currentSelectedIds) {
            if (!savedSelectedIds.has(id)) return true;
          }
          return false;
        }
        case 3: {
          // Configuration Step
          // Compare selected fields including isEditable and isRequired
          const currentConfiguredFields = selectedAirtableFields.map(
            ({ id, isEditable, isRequired }) => ({
              id,
              isEditable,
              isRequired,
            }),
          );
          const savedConfiguredFields = (
            currentSavedData.selectedAirtableFields || []
          ).map(({ id, isEditable, isRequired }: WizardField) => ({
            id,
            isEditable,
            isRequired,
          }));
          return (
            JSON.stringify(
              currentConfiguredFields.sort((a, b) => a.id.localeCompare(b.id)),
            ) !==
            JSON.stringify(
              savedConfiguredFields.sort(
                (a: { id: string }, b: { id: string }) =>
                  a.id.localeCompare(b.id),
              ),
            )
          );
        }

        default:
          return false; // For other steps, assume unsaved or not managed here yet
      }
    };

    if (isUnsaved()) {
      setSaveStatus("unsaved");
    } else {
      setSaveStatus("saved"); // If no changes, set to saved (after load or manual save)
    }
  }, [
    formName,
    formDescription,
    airtableBase,
    airtableTable,
    selectedAirtableFields,
    activeStep,
  ]);

  const handleBackToHomepage = () => {
    navigate("/dashboard");
  };

  const showTimedToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Toast for 3 seconds
  };

  const handleSaveAndContinue = async () => {
    console.log(`Attempting to save data for step: ${activeStep}`);

    // Set saving status for the button
    setSaveStatus("saving");
    setShowToast(false); // Hide any previous toast

    let success = false;
    let message = "";
    let type: "success" | "error" | "info" = "success";

    // Promise to have a small delay for the moment, ideally we'd have an API call
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 seconds delay

    const currentFormData = {
      formName,
      formDescription,
      airtableBase,
      airtableTable,
      airtableNumberOfFields,
      selectedAirtableFields, // includes isEditable and isRequired
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentFormData));
      setSaveStatus("saved");
      success = true;

      if (activeStep === 0) {
        message = "Form Information Saved!";
      } else if (activeStep === 1) {
        message = "Data Source Configuration Saved!";
      } else if (activeStep === 2) {
        message = "Field Selection Saved!";
      } else if (activeStep === 3) {
        message = "Field Configuration Saved!";
      }
    } catch (error) {
      console.error("Failed to save wizard data to local storage:", error);
      setSaveStatus("unsaved"); // Revert to unsaved on error
      success = false;
      message = "Failed to save data. Please try again.";
      type = "error";
    }

    showTimedToast(message, type);

    // Proceed to next step only after toast shows (or immediately if save failed)
    if (success) {
      setTimeout(
        () => {
          if (activeStep < totalSteps - 1) {
            const nextStep = activeStep + 1;
            setActiveStep(nextStep);
            setVisitedSteps((prev) => new Set(prev).add(nextStep));
            setMaxReachableStep(nextStep);
            console.log(
              `Moved to next step via Save and Continue: ${nextStep}`,
            );
          } else {
            console.log(
              "You are on the last step: Publish. Final save/publish action initiated.",
            );
          }
        },
        type === "success" ? 2000 : 0,
      ); // Wait 2s for success toast
    } else {
      // If save failed, don't auto-advance!!
    }
  };

  const handleSidebarItemClick = (stepId: number) => {
    if (stepId <= maxReachableStep) {
      setActiveStep(stepId);
      setVisitedSteps((prev) => new Set(prev).add(stepId));
      console.log(`Clicked sidebar item: ${stepId}`);
    } else {
      console.warn(
        `Attempted to click disabled step: ${stepId}. Must use "Save and Continue".`,
      );
    }
  };

  // Highlighting Logic for Search
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
    (element: HTMLElement, searchTerm: string) => {
      if (!element) return;
      clearHighlights(element);

      if (!searchTerm) {
        return;
      }

      const escapedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
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
  }, [currentSearchTerm, activeStep, applyHighlights]);

  const handleAdminHeaderSearch = useCallback((term: string) => {
    setCurrentSearchTerm(term);
  }, []);

  // Define constants for positioning - NEED TO CREATE A STYLESHEET AT SOME POINT!!
  const HEADER_HEIGHT_PX = 64;
  const BACK_BUTTON_HEIGHT_PX = 40;
  const VERTICAL_SPACING_HEADER_BUTTON = 20;
  const VERTICAL_SPACING_BUTTON_SIDEBAR = 20;

  const sidebarTopPosition = `${
    HEADER_HEIGHT_PX +
    VERTICAL_SPACING_HEADER_BUTTON +
    BACK_BUTTON_HEIGHT_PX +
    VERTICAL_SPACING_BUTTON_SIDEBAR
  }px`;

  const MAIN_CONTENT_PADDING_TOP = `${HEADER_HEIGHT_PX + BACK_BUTTON_HEIGHT_PX + VERTICAL_SPACING_HEADER_BUTTON + VERTICAL_SPACING_BUTTON_SIDEBAR / 2}px`;

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <StaticAdminHeader
        user={user}
        role={role}
        onSearch={handleAdminHeaderSearch}
      />

      <button
        onClick={handleBackToHomepage}
        className="absolute px-4 py-2 bg-blue-600 text-white rounded-md
                    hover:bg-blue-700 transition-colors duration-200 text-sm z-40"
        style={{
          top: `${HEADER_HEIGHT_PX + VERTICAL_SPACING_HEADER_BUTTON / 2}px`,
          left: "25px",
        }}
      >
        Back to Homepage
      </button>

      <Sidebar
        activeStep={activeStep}
        visitedSteps={visitedSteps}
        onStepClick={handleSidebarItemClick}
        maxReachableStep={maxReachableStep}
        topPosition={sidebarTopPosition}
      />

      <div
        ref={contentRef} // ref for global highlighting
        className="ml-[290px] p-8"
        style={{ paddingTop: MAIN_CONTENT_PADDING_TOP }}
      >
        {/* The main heading is handled by individual step components */}
        {activeStep !== 0 &&
          activeStep !== 1 &&
          activeStep !== 2 &&
          activeStep !== 3 && ( // Only show generic header if not step 0, 1, 2 or 3
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          )}

        <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
          {activeStep === 0 && (
            <FormInfoStep
              formName={formName}
              setFormName={setFormName}
              formDescription={formDescription}
              setFormDescription={setFormDescription}
              saveStatus={saveStatus}
            />
          )}
          {activeStep === 1 && (
            <DataSourceStep
              formName={formName}
              saveStatus={saveStatus}
              // Data source config props (uncomment when backend connected)
              // airtableBase={airtableBase}
              // setAirtableBase={setAirtableBase}
              // airtableTable={airtableTable}
              // setAirtableTable={setAirtableTable}
              // airtableBasesOptions={[]}
              // airtableTablesOptions={[]}
              // connectionStatus={airtableConnectionStatus}
              // numberOfFields={airtableNumberOfFields}
              // handleConnectAirtable={() => { /* backend logic */ }}
            />
          )}
          {activeStep === 2 && (
            <FieldSelectionStep
              formName={formName}
              saveStatus={saveStatus}
              totalAvailableFields={airtableNumberOfFields}
              selectedFields={selectedAirtableFields}
              setSelectedFields={(fields) =>
                setSelectedAirtableFields(
                  fields.map((f) => ({
                    ...f,
                    isEditable: f.isEditable ?? true,
                    isRequired: f.isRequired ?? false,
                  })),
                )
              }
              currentSearchTerm={currentSearchTerm}
            />
          )}
          {activeStep === 3 && (
            <ConfigurationStep
              formName={formName}
              saveStatus={saveStatus}
              selectedFields={selectedAirtableFields} // Pass selected fields to configure
              setSelectedFields={setSelectedAirtableFields} // Configuration step updates these properties
              currentSearchTerm={currentSearchTerm}
            />
          )}
          {activeStep === 4 && (
            <PreviewStep
              formName={formName}
              saveStatus={saveStatus}
              selectedFields={selectedAirtableFields} // Pass the configured fields
              onSaveAndContinue={handleSaveAndContinue} // Pass the general save and continue handler
            />
          )}
          {activeStep === 5 && (
            <>
              <PublishStep
                formName={formName}
                saveStatus={saveStatus}
                onSaveAndContinue={handleSaveAndContinue} // Pass this to maintain the final wizard flow
              />
              <div>
                <h1>PUBLISH STEP</h1>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={handleSaveAndContinue}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md
                        hover:bg-blue-700 transition-colors duration-200 shadow-md"
            disabled={saveStatus === "saving" || activeStep === totalSteps - 1}
          >
            {activeStep === totalSteps - 1
              ? "Finish"
              : saveStatus === "saving"
                ? "Saving..."
                : "Save and Continue"}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
