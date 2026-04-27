import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchPatients, fetchPatientById, setViewMode, setSearchQuery, setFilterStatus, setFilterDepartment, setCurrentPage, filterPatients } from '../store/slices/patientsSlice';
import { Patient, PatientStatus, ViewMode } from '../types';

const ITEMS_PER_PAGE = 9;

export function usePatients() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.patients);
  const fetchCalled = useRef(false);

  // Fetch once — guard against re-fetching
  useEffect(() => {
    if (!fetchCalled.current && !state.initialized && !state.loading) {
      fetchCalled.current = true;
      dispatch(fetchPatients());
    }
  }, [dispatch, state.initialized, state.loading]);

  // Derived filtered + paginated list
  const filtered = state.list.filter(
    filterPatients(state.searchQuery, state.filterStatus, state.filterDepartment)
  );
  const totalFilteredPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const start = (state.currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPatients = filtered.slice(start, start + ITEMS_PER_PAGE);

  const departments = ['all', ...Array.from(new Set(state.list.map((p) => p.department))).sort()];

  return {
    patients: paginatedPatients,
    allPatients: state.list,
    totalCount: filtered.length,
    loading: state.loading,
    error: state.error,
    viewMode: state.viewMode,
    searchQuery: state.searchQuery,
    filterStatus: state.filterStatus,
    filterDepartment: state.filterDepartment,
    currentPage: state.currentPage,
    totalPages: totalFilteredPages,
    departments,
    initialized: state.initialized,

    setViewMode: (mode: ViewMode) => dispatch(setViewMode(mode)),
    setSearchQuery: (q: string) => dispatch(setSearchQuery(q)),
    setFilterStatus: (s: PatientStatus | 'all') => dispatch(setFilterStatus(s)),
    setFilterDepartment: (d: string) => dispatch(setFilterDepartment(d)),
    setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
    refetch: () => dispatch(fetchPatients()),
  };
}

export function usePatientDetails(id: string) {
  const dispatch = useAppDispatch();
  const { list, selectedPatient, loading, error } = useAppSelector((s) => s.patients);
  const fetchCalled = useRef(false);

  const patientInList = list.find((p) => p.id === id) as Patient | undefined;

  useEffect(() => {
    if (!fetchCalled.current && !patientInList) {
      fetchCalled.current = true;
      dispatch(fetchPatientById(id));
    }
  }, [dispatch, id, patientInList]);

  const patient = patientInList ?? selectedPatient;

  return { patient, loading: loading && !patient, error };
}
