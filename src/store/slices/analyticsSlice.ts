import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AnalyticsState } from '../../types';
import { generateAnalyticsData } from '../../utils/mockData';

const initialState: AnalyticsState = {
  metrics: [],
  admissionsData: [],
  departmentData: [],
  revenueData: [],
  patientSatisfaction: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchAnalytics = createAsyncThunk<
  Omit<AnalyticsState, 'loading' | 'error' | 'initialized'>,
  void,
  { rejectValue: string }
>('analytics/fetch', async (_, { rejectWithValue }) => {
  try {
    await new Promise((res) => setTimeout(res, 600));
    return generateAnalyticsData();
  } catch {
    return rejectWithValue('Failed to load analytics data. Please try again.');
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics;
        state.admissionsData = action.payload.admissionsData;
        state.departmentData = action.payload.departmentData;
        state.revenueData = action.payload.revenueData;
        state.patientSatisfaction = action.payload.patientSatisfaction;
        state.initialized = true;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error.';
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
