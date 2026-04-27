import React from 'react';
import { usePatients } from '../hooks/usePatients';
import { PatientCard } from '../components/patients/PatientCard';
import { PatientFilters, Pagination } from '../components/patients/PatientFilters';
import { LoadingSpinner, PatientCardSkeleton } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorBoundary';
import { PatientStatus, ViewMode } from '../types';

const PatientsPage: React.FC = () => {
  const {
    patients,
    totalCount,
    loading,
    error,
    viewMode,
    searchQuery,
    filterStatus,
    filterDepartment,
    departments,
    currentPage,
    totalPages,
    setViewMode,
    setSearchQuery,
    setFilterStatus,
    setFilterDepartment,
    setCurrentPage,
    refetch,
  } = usePatients();

  if (error) {
    return <ErrorState message={error} onRetry={refetch} title="Failed to Load Patients" />;
  }

  return (
    <div className="patients-page">
      <PatientFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onStatusChange={(s) => setFilterStatus(s as PatientStatus | 'all')}
        filterDepartment={filterDepartment}
        onDepartmentChange={setFilterDepartment}
        departments={departments}
        viewMode={viewMode}
        onViewModeChange={(m) => setViewMode(m as ViewMode)}
        totalCount={totalCount}
      />

      {loading ? (
        viewMode === 'grid' ? (
          <div className="patients-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <PatientCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="patients-list-wrap">
            <LoadingSpinner size="md" message="Loading patients…" />
          </div>
        )
      ) : patients.length === 0 ? (
        <div className="patients-empty">
          <div className="patients-empty__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h3 className="patients-empty__title">No patients found</h3>
          <p className="patients-empty__message">
            Try adjusting your search query or filters.
          </p>
          <button
            className="btn btn--outline btn--sm"
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterDepartment('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="patients-grid" role="list" aria-label="Patient cards">
          {patients.map((patient) => (
            <div key={patient.id} role="listitem">
              <PatientCard patient={patient} viewMode="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="patients-list-wrap" role="table" aria-label="Patient list">
          <div className="patients-list-header" role="row">
            <span role="columnheader">Patient</span>
            <span role="columnheader">ID</span>
            <span role="columnheader">Age / Gender</span>
            <span role="columnheader">Department</span>
            <span role="columnheader">Doctor</span>
            <span role="columnheader">Diagnosis</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Last Visit</span>
          </div>
          <div className="patients-list" role="rowgroup">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} viewMode="list" />
            ))}
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PatientsPage;
