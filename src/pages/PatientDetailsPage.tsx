import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientDetails } from '../hooks/usePatients';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorBoundary';
import type { PatientStatus } from '../types';

const STATUS_CONFIG: Record<PatientStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'status--active' },
  inactive: { label: 'Inactive', className: 'status--inactive' },
  critical: { label: 'Critical', className: 'status--critical' },
  recovered: { label: 'Recovered', className: 'status--recovered' },
};

type TabId = 'overview' | 'vitals' | 'appointments';

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patient, loading, error } = usePatientDetails(id || '');
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="lg" message="Loading patient details…" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <ErrorState
        message={error || 'Patient not found.'}
        onRetry={() => navigate('/patients')}
        title="Patient Not Found"
      />
    );
  }

  const statusCfg = STATUS_CONFIG[patient.status];

  const TABS: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'vitals', label: 'Vitals' },
    { id: 'appointments', label: `Appointments (${patient.appointments.length})` },
  ];

  const completedAppts = patient.appointments.filter((a) => a.status === 'completed').length;
  const scheduledAppts = patient.appointments.filter((a) => a.status === 'scheduled').length;

  return (
    <div className="patient-details">
      {/* Back Button */}
      <button className="patient-details__back" onClick={() => navigate('/patients')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Patients
      </button>

      {/* Profile Card */}
      <div className="patient-details__profile">
        <div className="patient-details__avatar-wrap">
          <div className="patient-details__avatar">
            <img
              src={patient.avatar}
              alt=""
              aria-hidden="true"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="patient-details__avatar-initials">
              {patient.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
            </span>
          </div>
          <span className={`status-badge status-badge--lg ${statusCfg.className}`}>{statusCfg.label}</span>
        </div>

        <div className="patient-details__profile-info">
          <div>
            <h2 className="patient-details__name">{patient.name}</h2>
            <p className="patient-details__id">{patient.id}</p>
          </div>
          <div className="patient-details__profile-meta">
            <div className="detail-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {patient.age}y · {patient.gender}
            </div>
            <div className="detail-chip detail-chip--blood">
              {patient.bloodGroup}
            </div>
            <div className="detail-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
              </svg>
              {patient.phone}
            </div>
            <div className="detail-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {patient.email}
            </div>
          </div>
          <div className="patient-details__profile-doctors">
            <div className="detail-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {patient.department}
            </div>
            <div className="detail-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {patient.doctor}
            </div>
          </div>
        </div>

        <div className="patient-details__profile-stats">
          <div className="profile-stat">
            <span className="profile-stat__label">Admission</span>
            <span className="profile-stat__value">{new Date(patient.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__label">Last Visit</span>
            <span className="profile-stat__value">{new Date(patient.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          {patient.nextAppointment && (
            <div className="profile-stat">
              <span className="profile-stat__label">Next Appointment</span>
              <span className="profile-stat__value profile-stat__value--next">
                {new Date(patient.nextAppointment).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}
          <div className="profile-stat">
            <span className="profile-stat__label">Diagnosis</span>
            <span className="profile-stat__value profile-stat__value--diagnosis">{patient.diagnosis}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="patient-details__tabs" role="tablist" aria-label="Patient information tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            className={`patient-details__tab ${activeTab === tab.id ? 'patient-details__tab--active' : ''}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div
        id={`tab-panel-overview`}
        role="tabpanel"
        aria-labelledby="tab-overview"
        hidden={activeTab !== 'overview'}
      >
        {activeTab === 'overview' && (
          <div className="patient-details__overview">
            <div className="details-section">
              <h3 className="details-section__title">Personal Information</h3>
              <div className="details-grid">
                <div className="details-item">
                  <span className="details-item__label">Full Name</span>
                  <span className="details-item__value">{patient.name}</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Age</span>
                  <span className="details-item__value">{patient.age} years</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Gender</span>
                  <span className="details-item__value">{patient.gender}</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Blood Group</span>
                  <span className="details-item__value details-item__value--highlight">{patient.bloodGroup}</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Email</span>
                  <span className="details-item__value">{patient.email}</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Phone</span>
                  <span className="details-item__value">{patient.phone}</span>
                </div>
                <div className="details-item details-item--full">
                  <span className="details-item__label">Address</span>
                  <span className="details-item__value">{patient.address}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3 className="details-section__title">Medical Information</h3>
              <div className="details-grid">
                <div className="details-item">
                  <span className="details-item__label">Primary Diagnosis</span>
                  <span className="details-item__value">{patient.diagnosis}</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Department</span>
                  <span className="details-item__value">{patient.department}</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Assigned Doctor</span>
                  <span className="details-item__value">{patient.doctor}</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Patient Status</span>
                  <span className={`status-badge ${statusCfg.className}`}>{statusCfg.label}</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Admission Date</span>
                  <span className="details-item__value">{new Date(patient.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="details-item">
                  <span className="details-item__label">Total Appointments</span>
                  <span className="details-item__value">{patient.appointments.length} ({completedAppts} completed, {scheduledAppts} upcoming)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        id="tab-panel-vitals"
        role="tabpanel"
        aria-labelledby="tab-vitals"
        hidden={activeTab !== 'vitals'}
      >
        {activeTab === 'vitals' && (
          <div className="patient-details__vitals">
            <div className="vitals-grid">
              {[
                {
                  label: 'Heart Rate',
                  value: `${patient.vitals.heartRate} bpm`,
                  status: patient.vitals.heartRate < 60 || patient.vitals.heartRate > 100 ? 'warning' : 'normal',
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
                },
                {
                  label: 'Blood Pressure',
                  value: patient.vitals.bloodPressure + ' mmHg',
                  status: 'normal',
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
                },
                {
                  label: 'Temperature',
                  value: `${patient.vitals.temperature}°F`,
                  status: patient.vitals.temperature > 99 ? 'warning' : 'normal',
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" /></svg>,
                },
                {
                  label: 'O₂ Saturation',
                  value: `${patient.vitals.oxygenSaturation}%`,
                  status: patient.vitals.oxygenSaturation < 94 ? 'critical' : 'normal',
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>,
                },
                {
                  label: 'Weight',
                  value: `${patient.vitals.weight} kg`,
                  status: 'normal',
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>,
                },
                {
                  label: 'Height',
                  value: `${patient.vitals.height} cm`,
                  status: 'normal',
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
                },
              ].map((vital) => (
                <div key={vital.label} className={`vital-card vital-card--${vital.status}`}>
                  <div className="vital-card__icon">{vital.icon}</div>
                  <div className="vital-card__content">
                    <span className="vital-card__label">{vital.label}</span>
                    <span className="vital-card__value">{vital.value}</span>
                    <span className={`vital-card__status vital-card__status--${vital.status}`}>
                      {vital.status === 'normal' ? 'Normal' : vital.status === 'warning' ? 'Elevated' : 'Critical'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* BMI */}
            <div className="bmi-card">
              <h4 className="bmi-card__title">Body Mass Index (BMI)</h4>
              {(() => {
                const bmi = patient.vitals.weight / Math.pow(patient.vitals.height / 100, 2);
                const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
                const pct = Math.min(100, ((bmi - 10) / 30) * 100);
                return (
                  <>
                    <div className="bmi-card__value">{bmi.toFixed(1)} <span>kg/m²</span></div>
                    <div className="bmi-card__bar-wrap" role="progressbar" aria-valuenow={bmi} aria-valuemin={10} aria-valuemax={40} aria-label={`BMI: ${bmi.toFixed(1)}`}>
                      <div className="bmi-card__bar" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="bmi-card__labels">
                      <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                    </div>
                    <p className="bmi-card__category">{category}</p>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      <div
        id="tab-panel-appointments"
        role="tabpanel"
        aria-labelledby="tab-appointments"
        hidden={activeTab !== 'appointments'}
      >
        {activeTab === 'appointments' && (
          <div className="patient-details__appointments">
            <div className="appt-summary">
              <div className="appt-summary__item appt-summary__item--total">
                <span className="appt-summary__count">{patient.appointments.length}</span>
                <span className="appt-summary__label">Total</span>
              </div>
              <div className="appt-summary__item appt-summary__item--completed">
                <span className="appt-summary__count">{completedAppts}</span>
                <span className="appt-summary__label">Completed</span>
              </div>
              <div className="appt-summary__item appt-summary__item--scheduled">
                <span className="appt-summary__count">{scheduledAppts}</span>
                <span className="appt-summary__label">Scheduled</span>
              </div>
              <div className="appt-summary__item appt-summary__item--cancelled">
                <span className="appt-summary__count">{patient.appointments.filter((a) => a.status === 'cancelled').length}</span>
                <span className="appt-summary__label">Cancelled</span>
              </div>
            </div>

            <div className="appt-list">
              {[...patient.appointments]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((appt) => (
                  <div key={appt.id} className={`appt-row appt-row--${appt.status}`}>
                    <div className="appt-row__date-block">
                      <span className="appt-row__day">{new Date(appt.date).getDate()}</span>
                      <span className="appt-row__month">{new Date(appt.date).toLocaleDateString('en-IN', { month: 'short' })}</span>
                    </div>
                    <div className="appt-row__info">
                      <p className="appt-row__type">{appt.type}</p>
                      <p className="appt-row__meta">{appt.doctor} · {appt.department}</p>
                    </div>
                    <div className="appt-row__time">{appt.time}</div>
                    <span className={`status-badge ${
                      appt.status === 'completed' ? 'status--recovered' :
                      appt.status === 'scheduled' ? 'status--active' : 'status--inactive'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsPage;
