import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { initializeAuth } from '../store/slices/authSlice';

/**
 * AppInitializer handles the global booting logic for the application.
 * It ensures Firebase Auth is initialized before the routes start rendering.
 */
export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector((s) => s.auth);
  const initCalled = useRef(false);

  useEffect(() => {
    if (!initCalled.current && !initialized) {
      initCalled.current = true;
      dispatch(initializeAuth());
    }
  }, [dispatch, initialized]);

  return <>{children}</>;
};
