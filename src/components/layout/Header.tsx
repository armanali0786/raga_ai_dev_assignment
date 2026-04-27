import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { markAllAsRead, markAsRead } from '../../store/slices/notificationsSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useNotifications } from '../../hooks/useNotifications';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((s) => s.auth);
  const { notifications, unreadCount, notify } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/analytics': 'Analytics',
    '/patients': 'Patient Management',
  };
  const pageTitle = pageTitles[location.pathname] || 'Healthcare SaaS';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await dispatch(logoutUser());
    dispatch(addToast({ message: 'You have been signed out.', type: 'info' }));
    navigate('/login');
  };

  const handleTestNotification = () => {
    notify('Patient Alert', 'Patient John Doe vitals require review.', 'warning');
    setNotifOpen(false);
  };

  const typeColors: Record<string, string> = {
    critical: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    success: 'var(--color-success)',
    error: 'var(--color-danger)',
    info: 'var(--color-primary-400)',
  };

  return (
    <header className="header">
      <div className="header__left">
        <button
          className="header__menu-btn"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="header__title">{pageTitle}</h1>
      </div>

      <div className="header__right">
        {/* Notification Bell */}
        <div className="header__notif-wrapper" ref={notifRef}>
          <button
            className="header__icon-btn"
            onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); }}
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="badge badge--danger">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-dropdown" role="dialog" aria-label="Notifications">
              <div className="notif-dropdown__header">
                <span className="notif-dropdown__title">Notifications</span>
                <div className="notif-dropdown__actions">
                  <button className="btn--link" onClick={handleTestNotification}>
                    Test Alert
                  </button>
                  <button className="btn--link" onClick={() => dispatch(markAllAsRead())}>
                    Mark all read
                  </button>
                </div>
              </div>
              <div className="notif-dropdown__list">
                {notifications.length === 0 ? (
                  <div className="notif-dropdown__empty">No notifications</div>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                      onClick={() => dispatch(markAsRead(n.id))}
                    >
                      <span
                        className="notif-item__dot"
                        style={{ background: typeColors[n.type] }}
                      />
                      <div className="notif-item__body">
                        <p className="notif-item__title">{n.title}</p>
                        <p className="notif-item__message">{n.message}</p>
                        <span className="notif-item__time">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="header__user-wrapper" ref={userRef}>
          <button
            className="header__user-btn"
            onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false); }}
            aria-label="User menu"
          >
            <div className="header__avatar">
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="header__user-info">
              <span className="header__user-name">{user?.displayName || 'Admin User'}</span>
              <span className="header__user-email">{user?.email || 'admin@healthcare.com'}</span>
            </div>
          </button>

          {userMenuOpen && (
            <div className="user-menu" role="menu">
              <div className="user-menu__info">
                <div className="user-menu__avatar">
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="user-menu__name">{user?.displayName || 'Admin User'}</p>
                  <p className="user-menu__email">{user?.email || 'admin@healthcare.com'}</p>
                </div>
              </div>
              <div className="user-menu__divider" />
              <button className="user-menu__item" role="menuitem" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
