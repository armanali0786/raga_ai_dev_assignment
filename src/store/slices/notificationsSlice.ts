import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { NotificationsState, AppNotification, NotificationType } from '../../types';

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  permissionGranted: false,
  serviceWorkerReady: false,
};

// ─── Thunks ────────────────────────────────────────────────────────────────────

export const requestNotificationPermission = createAsyncThunk<boolean, void>(
  'notifications/requestPermission',
  async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
);

export const registerServiceWorker = createAsyncThunk<boolean, void>(
  'notifications/registerSW',
  async () => {
    if (!('serviceWorker' in navigator)) return false;
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.info('[SW] Registered:', registration.scope);
      return true;
    } catch (err) {
      console.error('[SW] Registration failed:', err);
      return false;
    }
  }
);

export const sendLocalNotification = createAsyncThunk<
  void,
  { title: string; message: string; type?: NotificationType }
>('notifications/sendLocal', async ({ title, message }) => {
  if (Notification.permission !== 'granted') return;

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body: message,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: 'healthcare-notification',
      renotify: true,
    } as any);
  } else {
    new Notification(title, { body: message, icon: '/vite.svg' });
  }
});

// ─── Slice ─────────────────────────────────────────────────────────────────────

function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(
      state,
      action: PayloadAction<Omit<AppNotification, 'id' | 'timestamp' | 'read'>>
    ) {
      const notification: AppNotification = {
        ...action.payload,
        id: generateId(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.items.unshift(notification);
      state.unreadCount += 1;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.items.forEach((n) => { n.read = true; });
      state.unreadCount = 0;
    },
    removeNotification(state, action: PayloadAction<string>) {
      const idx = state.items.findIndex((n) => n.id === action.payload);
      if (idx !== -1) {
        if (!state.items[idx].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items.splice(idx, 1);
      }
    },
    seedInitialNotifications(state) {
      if (state.items.length > 0) return;
      const seeds: Omit<AppNotification, 'id' | 'timestamp' | 'read'>[] = [
        { title: 'Critical Alert', message: 'Patient Arjun Mehta — O₂ saturation at 88%. Immediate attention required.', type: 'critical' },
        { title: 'Appointment Reminder', message: 'Dr. Priya Sharma has 3 scheduled appointments today starting at 09:00.', type: 'info' },
        { title: 'Lab Results Ready', message: "Patient Sneha Joshi's blood work results are now available for review.", type: 'success' },
        { title: 'Prescription Renewal', message: 'Patient Vikram Singh requires prescription renewal for hypertension medication.', type: 'warning' },
        { title: 'System Update', message: 'Scheduled maintenance tonight 02:00–04:00 IST. Save your work.', type: 'info' },
      ];
      const now = Date.now();
      seeds.forEach((s, i) => {
        state.items.push({
          ...s,
          id: generateId(),
          timestamp: new Date(now - i * 3600000).toISOString(),
          read: false,
        });
      });
      state.unreadCount = seeds.length;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestNotificationPermission.fulfilled, (state, action) => {
      state.permissionGranted = action.payload;
    });
    builder.addCase(registerServiceWorker.fulfilled, (state, action) => {
      state.serviceWorkerReady = action.payload;
    });
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  seedInitialNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
