import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { usePatients } from '../hooks/usePatients';
import { useAnalytics } from '../hooks/useAnalytics';
import { useNotifications } from '../hooks/useNotifications';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Patient, PatientStatus } from '../types';

const STAT_CARDS = [
  {
    title: 'Total Patients',
    key: 'total',
    color: 'var(--color-primary-500)',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Active Cases',
    key: 'active',
    color: 'var(--color-success)',
    gradient: 'linear-gradient(135deg, #059669, #10B981)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: 'Critical Cases',
    key: 'critical',
    color: 'var(--color-danger)',
    gradient: 'linear-gradient(135deg, #DC2626, #EF4444)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Recovered',
    key: 'recovered',
    color: 'var(--color-info)',
    gradient: 'linear-gradient(135deg, #0284C7, #38BDF8)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

const STATUS_COLORS: Record<PatientStatus, string> = {
  active: 'status--active',
  inactive: 'status--inactive',
  critical: 'status--critical',
  recovered: 'status--recovered',
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { allPatients, loading: patientsLoading } = usePatients();
  const { metrics, loading: analyticsLoading } = useAnalytics();
  const { notifications, unreadCount, notify } = useNotifications();

  const counts = {
    total: allPatients.length,
    active: allPatients.filter((p) => p.status === 'active').length,
    critical: allPatients.filter((p) => p.status === 'critical').length,
    recovered: allPatients.filter((p) => p.status === 'recovered').length,
  };

  const recentPatients = [...allPatients]
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .slice(0, 5);

  const criticalPatients = allPatients.filter((p) => p.status === 'critical').slice(0, 3);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin';

  const handleSendTestNotification = () => {
    notify('Dashboard Alert', 'System health check completed successfully.', 'success');
  };

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="dashboard__welcome">
        <div className="dashboard__welcome-text">
          <h2 className="dashboard__greeting">
            {getGreeting()}, {displayName}
          </h2>
          <p className="dashboard__date">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <div className="dashboard__welcome-actions">
          <button className="btn btn--ghost btn--sm" onClick={handleSendTestNotification}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            Test Notification
          </button>
          <button className="btn btn--primary btn--sm" onClick={() => navigate('/patients')}>
            View All Patients
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard__stats">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="stat-card"
            style={{ '--card-gradient': card.gradient } as React.CSSProperties}
          >
            <div className="stat-card__icon" style={{ background: card.gradient }}>
              {card.icon}
            </div>
            <div className="stat-card__content">
              <p className="stat-card__title">{card.title}</p>
              {patientsLoading ? (
                <div className="skeleton" style={{ width: '60px', height: '2rem', borderRadius: '4px' }} />
              ) : (
                <p className="stat-card__value">
                  {counts[card.key as keyof typeof counts].toLocaleString()}
                </p>
              )}
            </div>
            <div className="stat-card__bg-icon" aria-hidden="true">{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="dashboard__grid">
        {/* Recent Patients */}
        <div className="dashboard__panel">
          <div className="panel__header">
            <h3 className="panel__title">Recent Patients</h3>
            <button className="btn--link" onClick={() => navigate('/patients')}>
              View all
            </button>
          </div>
          <div className="panel__body">
            {patientsLoading ? (
              <div className="spinner-wrap">
                <LoadingSpinner size="sm" message="Loading patients…" />
              </div>
            ) : recentPatients.length === 0 ? (
              <p className="panel__empty">No patients found.</p>
            ) : (
              <div className="recent-patients">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="recent-patient-row"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${patient.name}`}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/patients/${patient.id}`)}
                  >
                    <div className="recent-patient-row__avatar">
                      {patient.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="recent-patient-row__info">
                      <span className="recent-patient-row__name">{patient.name}</span>
                      <span className="recent-patient-row__meta">{patient.diagnosis} · {patient.department}</span>
                    </div>
                    <span className={`status-badge ${STATUS_COLORS[patient.status as PatientStatus]}`}>
                      {patient.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="dashboard__panel">
          <div className="panel__header">
            <h3 className="panel__title">Critical Alerts</h3>
            <span className="badge badge--danger">{criticalPatients.length}</span>
          </div>
          <div className="panel__body">
            {patientsLoading ? (
              <LoadingSpinner size="sm" message="" />
            ) : criticalPatients.length === 0 ? (
              <div className="panel__empty-state">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p>No critical cases</p>
              </div>
            ) : (
              criticalPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="critical-alert-card"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/patients/${patient.id}`)}
                >
                  <div className="critical-alert-card__pulse" aria-hidden="true" />
                  <div className="critical-alert-card__info">
                    <p className="critical-alert-card__name">{patient.name}</p>
                    <p className="critical-alert-card__meta">
                      O₂: {patient.vitals.oxygenSaturation}% · HR: {patient.vitals.heartRate} bpm · BP: {patient.vitals.bloodPressure}
                    </p>
                    <p className="critical-alert-card__doctor">{patient.doctor} · {patient.department}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="dashboard__panel">
          <div className="panel__header">
            <h3 className="panel__title">Recent Notifications</h3>
            {unreadCount > 0 && <span className="badge badge--primary">{unreadCount} new</span>}
          </div>
          <div className="panel__body">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className={`notif-row ${!n.read ? 'notif-row--unread' : ''}`}>
                <span className={`notif-row__dot notif-row__dot--${n.type}`} />
                <div className="notif-row__content">
                  <p className="notif-row__title">{n.title}</p>
                  <p className="notif-row__message">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="dashboard__panel dashboard__panel--wide">
          <div className="panel__header">
            <h3 className="panel__title">Key Metrics</h3>
            <button className="btn--link" onClick={() => navigate('/analytics')}>
              Full Analytics
            </button>
          </div>
          <div className="panel__body">
            {analyticsLoading ? (
              <LoadingSpinner size="sm" message="Loading metrics…" />
            ) : (
              <div className="metrics-grid">
                {metrics.slice(0, 6).map((metric) => (
                  <div key={metric.label} className="metric-item">
                    <p className="metric-item__label">{metric.label}</p>
                    <p className="metric-item__value">
                      {metric.unit === '₹'
                        ? `₹${(metric.value / 100000).toFixed(1)}L`
                        : `${metric.value.toLocaleString()}${metric.unit || ''}`}
                    </p>
                    <span className={`metric-item__change metric-item__change--${metric.changeType}`}>
                      {metric.changeType === 'increase' ? '↑' : '↓'} {metric.change}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
