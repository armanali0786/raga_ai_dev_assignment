import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Toast } from '../../types';

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: 'dark',
  toasts: [],
};

function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload;
    },
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({
        ...action.payload,
        id: generateToastId(),
      });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions;
export default uiSlice.reducer;
