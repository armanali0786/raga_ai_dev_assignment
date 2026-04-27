import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchAnalytics } from '../store/slices/analyticsSlice';

export function useAnalytics() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.analytics);
  const fetchCalled = useRef(false);

  useEffect(() => {
    if (!fetchCalled.current && !state.initialized && !state.loading) {
      fetchCalled.current = true;
      dispatch(fetchAnalytics());
    }
  }, [dispatch, state.initialized, state.loading]);

  return {
    metrics: state.metrics,
    admissionsData: state.admissionsData,
    departmentData: state.departmentData,
    revenueData: state.revenueData,
    patientSatisfaction: state.patientSatisfaction,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
    refetch: () => dispatch(fetchAnalytics()),
  };
}
