import React, { useState } from "react";
import { Toast } from "../../components/ui/toast"; // Assuming Toast component path is correct

interface PublishStepProps {
  formName: string;
  saveStatus: "unsaved" | "saving" | "saved";
  onSaveAndContinue: () => void; // To maintain consistency with wizard flow
  // pass moer stuff in the future if needed
}

// Local storage key for publish status
const PUBLISH_STATUS_LOCAL_STORAGE_KEY = "formPublishStatus";
const FORM_URL_LOCAL_STORAGE_KEY = "formPublishedURL";

export const PublishStep: React.FC<PublishStepProps> = ({
  formName,
  saveStatus,
  onSaveAndContinue,
}) => {
  const [publishMode, setPublishMode] = useState<"publish" | "integrate">(
    "publish",
  );
  const [isPublished, setIsPublished] = useState<boolean>(() => {
    // Initialize from local storage
    return localStorage.getItem(PUBLISH_STATUS_LOCAL_STORAGE_KEY) === "true";
  });
  const [publishedUrl, setPublishedUrl] = useState<string>(() => {
    return localStorage.getItem(FORM_URL_LOCAL_STORAGE_KEY) || "";
  });
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

  const handlePublishForm = async () => {
    // Simulate API call to publish the form
    showTimedToast("Publishing form...", "info");
    // In a real application, you'd send your entire form configuration to your backend
    // The backend would then process it, potentially create a database entry, and generate a URL.

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success
    const mockGeneratedUrl = `https://forms.example.com/${formName.toLowerCase().replace(/\s/g, "-")}-${Date.now().toString().slice(-4)}`;
    setIsPublished(true);
    setPublishedUrl(mockGeneratedUrl);
    localStorage.setItem(PUBLISH_STATUS_LOCAL_STORAGE_KEY, "true");
    localStorage.setItem(FORM_URL_LOCAL_STORAGE_KEY, mockGeneratedUrl);

    showTimedToast("Form published successfully!", "success");
  };

  const handleUnpublishForm = async () => {
    // Simulate API call to unpublish the form
    showTimedToast("Unpublishing form...", "info");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsPublished(false);
    setPublishedUrl("");
    localStorage.setItem(PUBLISH_STATUS_LOCAL_STORAGE_KEY, "false");
    localStorage.removeItem(FORM_URL_LOCAL_STORAGE_KEY);

    showTimedToast("Form unpublished.", "info");
  };

  return (
    <>
      {/* Form Name and Save Status*/}
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

      <h2 className="text-2xl font-bold mb-2">Publish</h2>
      <p className="text-gray-600 mb-6">
        Review, deploy and share your form with others.
      </p>

      {/* General Warning Message Box */}
      <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg mb-6 text-gray-700 text-sm">
        <strong className="block mb-1 text-red-700">
          Warning: Publishing a form makes it publicly accessible.
        </strong>
        Ensure all sensitive information and configurations are correct before
        proceeding.
      </div>

      {/* Form Summary Box (Placeholder ) */}
      <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg mb-6 text-gray-700 text-sm">
        <strong className="block mb-2">Form Summary:</strong>
        <ul className="list-disc pl-5">
          <li>Form Name: {formName || "N/A"}</li>
          <li>Data Source: Airtable (Mock)</li>
          <li>Fields Configured: {formName ? "Yes" : "No"}</li>
          {/* Add more */}
        </ul>
      </div>

      {/* Publish/Integrate Toggle */}
      <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setPublishMode("publish")}
            className={`p-4 text-center font-semibold text-lg transition-colors duration-200 ${
              publishMode === "publish"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Publish Form
          </button>
          <button
            onClick={() => setPublishMode("integrate")}
            className={`p-4 text-center font-semibold text-lg transition-colors duration-200 ${
              publishMode === "integrate"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Integration Options
          </button>
        </div>

        <div className="p-6 bg-white">
          {publishMode === "publish" && (
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Make Your Form Available Online
              </h3>
              <p className="text-gray-600 mb-4">
                Create a dedicated URL for your form.
              </p>

              <div className="mb-4">
                <p className="text-md font-medium">
                  Current Status:{" "}
                  <span
                    className={isPublished ? "text-green-600" : "text-red-600"}
                  >
                    {isPublished ? "Published" : "Not Published"}
                  </span>
                </p>
                {isPublished && publishedUrl && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="font-semibold">URL:</span>
                    <a
                      href={publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {publishedUrl}
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(publishedUrl);
                        showTimedToast("URL copied!", "info");
                      }}
                      className="ml-2 p-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 text-sm"
                      title="Copy URL"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {!isPublished ? (
                <button
                  onClick={handlePublishForm}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  Publish Form
                </button>
              ) : (
                <button
                  onClick={handleUnpublishForm}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-200 shadow-md"
                >
                  Unpublish Form
                </button>
              )}
              <p className="text-gray-500 text-sm mt-3">
                This will make your form accessible from the dashboard and{" "}
                {isPublished ? "its current" : "generate a"} shareable link.
              </p>
            </div>
          )}

          {publishMode === "integrate" && (
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Integration Options
              </h3>
              {!isPublished ? (
                <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-lg text-gray-700 font-medium mb-4">
                    Please publish your form to access integration options.
                  </p>
                  <button
                    onClick={() => setPublishMode("publish")}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
                  >
                    Go to Publish Tab
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Your form is published! Here are options to integrate it
                    into your website or share it.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        Direct Link
                      </h4>
                      <div className="flex items-center bg-gray-100 p-3 rounded-md border border-gray-200">
                        <input
                          type="text"
                          readOnly
                          value={publishedUrl}
                          className="flex-grow bg-transparent outline-none text-sm text-gray-700"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(publishedUrl);
                            showTimedToast("URL copied!", "info");
                          }}
                          className="ml-2 p-1 bg-white rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300 text-sm"
                          title="Copy URL"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        Embed Code (iFrame)
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Copy this code to embed the form directly into your
                        webpage.
                      </p>
                      <div className="bg-gray-100 p-3 rounded-md border border-gray-200 relative">
                        <pre className="whitespace-pre-wrap break-all text-xs text-gray-700">
                          {`<iframe src="${publishedUrl}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`}
                        </pre>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `<iframe src="${publishedUrl}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`,
                            );
                            showTimedToast("Embed code copied!", "info");
                          }}
                          className="absolute top-2 right-2 p-1 bg-white rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300 text-xs"
                          title="Copy Embed Code"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* QR code?? */}
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        Share via QR Code
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Scan this QR code to access your form on mobile devices.
                      </p>
                      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md">
                        QR Code Here
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
          {saveStatus === "saving" ? "Saving..." : "Finish"}
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
