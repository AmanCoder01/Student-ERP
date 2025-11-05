import React from "react";

const SearchBar = ({ search, setSearch, setCurrentPage }) => {
  return (
    <div className="mt-4 sm:mt-0 flex items-center justify-end w-full sm:w-auto">
      <div className="relative w-full sm:w-80">
        {/* Search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>

        <input
          type="search"
          placeholder="Search by name, student ID, or roll no..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                 pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                 transition-all duration-200 shadow-sm"
        />

        {/* Clear button */}
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setCurrentPage(1);
            }}
            className="absolute right-3 top-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
            title="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
