import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import type { AuthState, AuthUser } from '../../types';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

// ─── Thunks ────────────────────────────────────────────────────────────────────

export const loginWithEmail = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginWithEmail', async ({ email, password }, { rejectWithValue }) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const { uid, email: userEmail, displayName, photoURL } = credential.user;
    return { uid, email: userEmail, displayName, photoURL };
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'Invalid email address format.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Account temporarily locked.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    };
    const message = firebaseError.code
      ? errorMessages[firebaseError.code] || 'Login failed. Please try again.'
      : 'An unexpected error occurred.';
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch {
      return rejectWithValue('Failed to sign out. Please try again.');
    }
  }
);

export const initializeAuth = createAsyncThunk<AuthUser | null, void>(
  'auth/initialize',
  () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        unsubscribe();
        if (firebaseUser) {
          const { uid, email, displayName, photoURL } = firebaseUser;
          resolve({ uid, email, displayName, photoURL });
        } else {
          resolve(null);
        }
      });
    });
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed.';
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Logout failed.';
      });

    // Init
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
