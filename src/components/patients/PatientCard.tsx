import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient, PatientStatus } from '../../types';

const STATUS_CONFIG: Record<PatientStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'status--active' },
  inactive: { label: 'Inactive', className: 'status--inactive' },
  critical: { label: 'Critical', className: 'status--critical' },
  recovered: { label: 'Recovered', className: 'status--recovered' },
};

interface PatientCardProps {
  patient: Patient;
  viewMode: 'grid' | 'list';
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, viewMode }) => {
  const navigate = useNavigate();
  const statusCfg = STATUS_CONFIG[patient.status];

  const handleClick = () => navigate(`/patients/${patient.id}`);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        className="patient-list-row"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${patient.name}`}
      >
        <div className="patient-list-row__avatar">
          <img
            src={patient.avatar}
            alt=""
            aria-hidden="true"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="patient-list-row__initials">
            {patient.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
          </span>
        </div>
        <div className="patient-list-row__info">
          <span className="patient-list-row__name">{patient.name}</span>
          <span className="patient-list-row__id">{patient.id}</span>
        </div>
        <div className="patient-list-row__detail">{patient.age}y · {patient.gender}</div>
        <div className="patient-list-row__department">{patient.department}</div>
        <div className="patient-list-row__doctor">{patient.doctor}</div>
        <div className="patient-list-row__diagnosis">{patient.diagnosis}</div>
        <div className="patient-list-row__status">
          <span className={`status-badge ${statusCfg.className}`}>{statusCfg.label}</span>
        </div>
        <div className="patient-list-row__visit">
          {new Date(patient.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>
    );
  }

  return (
    <div
      className="patient-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${patient.name}`}
    >
      <div className="patient-card__header">
        <div className="patient-card__avatar">
          <img
            src={patient.avatar}
            alt=""
            aria-hidden="true"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="patient-card__initials">
            {patient.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
          </span>
        </div>
        <div className="patient-card__title-group">
          <h3 className="patient-card__name">{patient.name}</h3>
          <span className="patient-card__id">{patient.id}</span>
        </div>
        <span className={`status-badge ${statusCfg.className}`}>{statusCfg.label}</span>
      </div>

      <div className="patient-card__body">
        <div className="patient-card__row">
          <span className="patient-card__label">Age / Gender</span>
          <span className="patient-card__value">{patient.age}y · {patient.gender}</span>
        </div>
        <div className="patient-card__row">
          <span className="patient-card__label">Blood Group</span>
          <span className="patient-card__value patient-card__value--highlight">{patient.bloodGroup}</span>
        </div>
        <div className="patient-card__row">
          <span className="patient-card__label">Diagnosis</span>
          <span className="patient-card__value">{patient.diagnosis}</span>
        </div>
        <div className="patient-card__row">
          <span className="patient-card__label">Department</span>
          <span className="patient-card__value">{patient.department}</span>
        </div>
        <div className="patient-card__row">
          <span className="patient-card__label">Doctor</span>
          <span className="patient-card__value">{patient.doctor}</span>
        </div>
      </div>

      <div className="patient-card__footer">
        <div className="patient-card__footer-item">
          <span className="patient-card__label">Last Visit</span>
          <span className="patient-card__value">
            {new Date(patient.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </span>
        </div>
        {patient.nextAppointment && (
          <div className="patient-card__footer-item">
            <span className="patient-card__label">Next</span>
            <span className="patient-card__value patient-card__value--next">
              {new Date(patient.nextAppointment).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        )}
        <div className="patient-card__vitals">
          <span className="vital-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {patient.vitals.heartRate} bpm
          </span>
          <span className="vital-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            {patient.vitals.oxygenSaturation}% O₂
          </span>
        </div>
      </div>
    </div>
  );
};
