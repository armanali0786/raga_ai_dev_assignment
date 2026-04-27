import React from 'react';


interface PatientFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterStatus: string;
  onStatusChange: (s: string) => void;
  filterDepartment: string;
  onDepartmentChange: (d: string) => void;
  departments: string[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalCount: number;
}

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterDepartment,
  onDepartmentChange,
  departments,
  viewMode,
  onViewModeChange,
  totalCount,
}) => {
  return (
    <div className="patient-filters">
      <div className="patient-filters__search-wrap">
        <svg className="patient-filters__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          id="patient-search"
          className="patient-filters__search"
          placeholder="Search by name, ID, diagnosis, or doctor…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search patients"
        />
        {searchQuery && (
          <button
            className="patient-filters__clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="patient-filters__controls">
        <select
          id="status-filter"
          className="patient-filters__select"
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="critical">Critical</option>
          <option value="recovered">Recovered</option>
        </select>

        <select
          id="department-filter"
          className="patient-filters__select"
          value={filterDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="all">All Departments</option>
          {departments.filter((d) => d !== 'all').map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <span className="patient-filters__count">
          {totalCount} patient{totalCount !== 1 ? 's' : ''}
        </span>

        {/* View Toggle */}
        <div className="view-toggle" role="group" aria-label="View mode">
          <button
            className={`view-toggle__btn ${viewMode === 'grid' ? 'view-toggle__btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            aria-pressed={viewMode === 'grid'}
            aria-label="Grid view"
            title="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            className={`view-toggle__btn ${viewMode === 'list' ? 'view-toggle__btn--active' : ''}`}
            onClick={() => onViewModeChange('list')}
            aria-pressed={viewMode === 'list'}
            aria-label="List view"
            title="List view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
        ) : (
          <button
            key={page}
            className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
            onClick={() => onPageChange(page as number)}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
};
