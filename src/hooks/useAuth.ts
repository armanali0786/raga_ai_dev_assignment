import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { initializeAuth, loginWithEmail, logoutUser, clearError } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, loading, error, initialized } = useAppSelector((s) => s.auth);
  const initCalled = useRef(false);

  useEffect(() => {
    if (!initCalled.current && !initialized) {
      initCalled.current = true;
      dispatch(initializeAuth());
    }
  }, [dispatch, initialized]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await dispatch(loginWithEmail({ email, password }));
    if (loginWithEmail.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Login successful. Welcome back!', type: 'success' }));
      return true;
    }
    return false;
  };

  const logout = async (): Promise<void> => {
    await dispatch(logoutUser());
    dispatch(addToast({ message: 'You have been signed out.', type: 'info' }));
  };

  const dismissError = () => dispatch(clearError());

  return { user, loading, error, initialized, login, logout, dismissError };
}
