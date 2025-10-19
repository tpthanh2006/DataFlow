import React from "react";

interface SidebarItem {
  id: number;
  label: string;
}

interface SidebarProps {
  activeStep: number;
  visitedSteps: Set<number>;
  onStepClick: (stepId: number) => void;
  maxReachableStep: number;
  topPosition: string; // Passed from StaticAdmin for its fixed positioning
}

const Sidebar: React.FC<SidebarProps> = ({
  activeStep,
  visitedSteps,
  onStepClick,
  maxReachableStep,
  topPosition,
}) => {
  const sidebarItems: SidebarItem[] = [
    { id: 0, label: "Form Info" },
    { id: 1, label: "Data Source" },
    { id: 2, label: "Field Selection" },
    { id: 3, label: "Configuration" },
    { id: 4, label: "Preview" },
    { id: 5, label: "Publish" },
  ];

  return (
    // This div is the fixed sidebar navigation container.
    // It has the specified dimensions and positioning.
    <div
      className="fixed left-[25px] w-[262px] h-[431px] bg-white
                 flex flex-col gap-[10px] p-4 rounded-lg shadow-lg
                 box-border z-30"
      style={{
        top: topPosition,
        width: "262px",
        height: "431px",
        opacity: 1,
        transform: "rotate(0deg)",
      }}
    >
      {/* Navigation Links */}
      {sidebarItems.map((item) => {
        const isClickable = item.id <= maxReachableStep;
        let itemClasses =
          "py-2 px-4 rounded-md text-base font-medium transition-colors duration-200";

        if (isClickable) {
          itemClasses += " cursor-pointer";
        } else {
          itemClasses += " cursor-not-allowed";
        }

        if (item.id === activeStep) {
          itemClasses += " bg-gray-300 text-black"; // Active state: gray background, black text
        } else if (visitedSteps.has(item.id)) {
          itemClasses += " bg-white text-black"; // Visited state: white background, black text
          if (isClickable) {
            itemClasses += " hover:bg-gray-100";
          }
        } else {
          itemClasses += " bg-white text-gray-500"; // Unvisited state: white background, gray text
          if (isClickable) {
            itemClasses += " hover:bg-gray-100";
          }
        }

        return (
          <div
            key={item.id}
            className={itemClasses}
            onClick={() => isClickable && onStepClick(item.id)}
            onKeyDown={(e) =>
              isClickable &&
              (e.key === "Enter" || e.key === " ") &&
              onStepClick(item.id)
            }
            role="button"
            tabIndex={0}
            title={
              !isClickable
                ? "Please 'Save and Continue' to enable this step"
                : item.label
            }
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
