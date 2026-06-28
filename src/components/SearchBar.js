'use client';

export default function SearchBar({ searchQuery, setSearchQuery, resultCount, totalCount }) {
  return (
    <div className="search-section">
      <div className="card">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="student-search"
            type="text"
            className="search-input"
            placeholder="Search by student name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="search-results-count">
            Showing {resultCount} of {totalCount} students
          </p>
        )}
      </div>
    </div>
  );
}
