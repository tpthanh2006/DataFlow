import React, { useState } from "react";

interface AdminHeaderProps {
  user:
    | {
        user_metadata?: {
          avatar_url?: string;
          full_name?: string;
        };
        email?: string;
      }
    | null
    | undefined;
  role: string | null | undefined;
  // Callback function to send the search term to the parent
  onSearch: (searchTerm: string) => void;
}

const StaticAdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  role,
  onSearch,
}) => {
  const [showResources, setShowResources] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleResources = () => {
    setShowResources(!showResources);
  };

  // When the search button is clicked or Enter is pressed
  const handleInitiateSearch = () => {
    // Only call onSearch if there's a non-empty search term
    // The parent (StaticAdmin) will handle the actual highlighting logic
    onSearch(searchTerm);
  };

  // Placeholder resources data
  const resources = [
    { name: "Documentation", url: "https://supabase.com/docs" },
  ];

  const profilePic =
    user?.user_metadata?.avatar_url ||
    "https://via.placeholder.com/150/CCCCCC/808080?text=NA";
  const userName = user?.user_metadata?.full_name || "Guest";
  const userEmail = user?.email || "N/A";
  const userRole = role || "User";

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-gray-700 text-white p-4 shadow-md flex items-center justify-between z-50">
      <div className="flex items-center flex-shrink-0">
        <img
          src={profilePic}
          alt="User Profile"
          className="w-10 h-10 rounded-full border-2 border-white mr-3 object-cover"
        />
        <div>
          <p className="text-lg font-semibold leading-tight">
            {userName}{" "}
            <span className="text-sm text-gray-300">({userRole})</span>
          </p>
          <p className="text-sm text-gray-400">{userEmail}</p>
        </div>
      </div>

      <div className="flex-grow flex justify-center mx-4 relative">
        <div className="flex items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Type a command or search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update state
            className="flex-grow p-2 rounded-l-md border border-gray-400
                       bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                       placeholder-gray-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleInitiateSearch(); // Trigger search on Enter
              }
            }}
          />
          <button
            onClick={handleInitiateSearch} // Trigger search on click
            className="p-2 rounded-r-md bg-gray-500 text-white
                       hover:bg-gray-600 transition-colors duration-200 flex-shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative flex-shrink-0">
        <button
          onClick={toggleResources}
          className="flex items-center px-4 py-2 bg-blue-600 rounded-md
                     hover:bg-blue-700 transition-colors duration-200"
        >
          Resources
          <svg
            className={`w-4 h-4 ml-2 transition-transform duration-200 ${showResources ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        {showResources && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            onMouseLeave={() => setShowResources(false)}
          >
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setShowResources(false)}
              >
                {resource.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default StaticAdminHeader;
