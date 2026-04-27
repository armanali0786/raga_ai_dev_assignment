import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  seedInitialNotifications,
  requestNotificationPermission,
  registerServiceWorker,
  sendLocalNotification,
} from '../store/slices/notificationsSlice';
import { NotificationType } from '../types';

export function useNotifications() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(seedInitialNotifications());
    dispatch(registerServiceWorker());
    // Ask for permission on first load
    if (Notification.permission === 'default') {
      dispatch(requestNotificationPermission());
    } else if (Notification.permission === 'granted') {
      // Already granted, update state
      dispatch(requestNotificationPermission());
    }
  }, [dispatch]);

  const notify = (title: string, message: string, type: NotificationType = 'info') => {
    dispatch(addNotification({ title, message, type }));
    // Also show OS notification
    dispatch(sendLocalNotification({ title, message, type }));
  };

  return {
    notifications: state.items,
    unreadCount: state.unreadCount,
    permissionGranted: state.permissionGranted,
    serviceWorkerReady: state.serviceWorkerReady,
    notify,
    markAsRead: (id: string) => dispatch(markAsRead(id)),
    markAllAsRead: () => dispatch(markAllAsRead()),
    remove: (id: string) => dispatch(removeNotification(id)),
    requestPermission: () => dispatch(requestNotificationPermission()),
  };
}
