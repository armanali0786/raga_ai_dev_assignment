import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PatientsState, Patient, ViewMode, PatientStatus } from '../../types';
import { generateMockPatients } from '../../utils/mockData';

const ITEMS_PER_PAGE = 9;

const initialState: PatientsState = {
  list: [],
  selectedPatient: null,
  viewMode: 'grid',
  loading: false,
  error: null,
  searchQuery: '',
  filterStatus: 'all',
  filterDepartment: 'all',
  currentPage: 1,
  totalPages: 1,
  initialized: false,
};

// ─── Thunks ────────────────────────────────────────────────────────────────────

export const fetchPatients = createAsyncThunk<Patient[], void, { rejectValue: string }>(
  'patients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate network delay — single call, data cached in Redux
      await new Promise((res) => setTimeout(res, 800));
      return generateMockPatients(30);
    } catch {
      return rejectWithValue('Failed to load patient data. Please try again.');
    }
  }
);

export const fetchPatientById = createAsyncThunk<Patient, string, { rejectValue: string; state: { patients: PatientsState } }>(
  'patients/fetchById',
  async (id, { rejectWithValue, getState }) => {
    // Check if already in store — avoid duplicate calls
    const existing = getState().patients.list.find((p) => p.id === id);
    if (existing) return existing;

    try {
      await new Promise((res) => setTimeout(res, 400));
      const all = generateMockPatients(30);
      const patient = all.find((p) => p.id === id);
      if (!patient) return rejectWithValue('Patient not found.');
      return patient;
    } catch {
      return rejectWithValue('Failed to load patient details.');
    }
  }
);

// ─── Helper ────────────────────────────────────────────────────────────────────

function computeTotalPages(total: number): number {
  return Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
}

// ─── Slice ─────────────────────────────────────────────────────────────────────

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      const filtered = state.list.filter(filterPatients(action.payload, state.filterStatus, state.filterDepartment));
      state.totalPages = computeTotalPages(filtered.length);
    },
    setFilterStatus(state, action: PayloadAction<PatientStatus | 'all'>) {
      state.filterStatus = action.payload;
      state.currentPage = 1;
      const filtered = state.list.filter(filterPatients(state.searchQuery, action.payload, state.filterDepartment));
      state.totalPages = computeTotalPages(filtered.length);
    },
    setFilterDepartment(state, action: PayloadAction<string>) {
      state.filterDepartment = action.payload;
      state.currentPage = 1;
      const filtered = state.list.filter(filterPatients(state.searchQuery, state.filterStatus, action.payload));
      state.totalPages = computeTotalPages(filtered.length);
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setSelectedPatient(state, action: PayloadAction<Patient | null>) {
      state.selectedPatient = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.totalPages = computeTotalPages(action.payload.length);
        state.initialized = true;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error.';
      });

    builder
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPatient = action.payload;
        // Merge into list if not already present
        const idx = state.list.findIndex((p) => p.id === action.payload.id);
        if (idx === -1) {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error.';
      });
  },
});

// ─── Selector Helpers ──────────────────────────────────────────────────────────

export function filterPatients(
  query: string,
  status: PatientStatus | 'all',
  department: string
) {
  return (patient: Patient): boolean => {
    const matchesQuery =
      !query ||
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.id.toLowerCase().includes(query.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(query.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = status === 'all' || patient.status === status;
    const matchesDept = department === 'all' || patient.department === department;

    return matchesQuery && matchesStatus && matchesDept;
  };
}

export const {
  setViewMode,
  setSearchQuery,
  setFilterStatus,
  setFilterDepartment,
  setCurrentPage,
  setSelectedPatient,
  clearError,
} = patientsSlice.actions;

export default patientsSlice.reducer;
