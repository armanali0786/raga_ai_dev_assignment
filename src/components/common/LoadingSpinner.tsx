import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading…',
  fullPage = false,
}) => {
  const sizeMap = { sm: 24, md: 40, lg: 56 };
  const sw = { sm: 3, md: 3.5, lg: 4 };
  const px = sizeMap[size];
  const stroke = sw[size];

  if (fullPage) {
    return (
      <div className="spinner-overlay" role="status" aria-label="Loading application" aria-busy="true">
        {/* Brand */}
        <div className="spinner-overlay__brand">
          <div className="spinner-overlay__logo">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <path d="M16 6v20M6 16h20" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="spinner-overlay__name">MedCore</p>
            <p className="spinner-overlay__sub">Healthcare SaaS Platform</p>
          </div>
        </div>

        {/* Arc spinner */}
        <div className="spinner-overlay__track">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="22" stroke="var(--color-primary-100)" strokeWidth="4" />
            <circle
              cx="28" cy="28" r="22"
              stroke="var(--color-primary-500)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="90 50"
            />
          </svg>
        </div>

        <p className="spinner-overlay__message">{message}</p>

        {/* Pulsing dots */}
        <div className="spinner-overlay__dots" aria-hidden="true">
          <span className="spinner-overlay__dot" />
          <span className="spinner-overlay__dot" />
          <span className="spinner-overlay__dot" />
        </div>
      </div>
    );
  }

  return (
    <div className={`spinner spinner--${size}`} role="status" aria-label={message}>
      <svg width={px} height={px} viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="22" stroke="var(--color-primary-100)" strokeWidth={stroke} />
        <circle
          cx="28" cy="28" r="22"
          stroke="var(--color-primary-500)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray="90 50"
        />
      </svg>
      {message && <span className="spinner__label">{message}</span>}
    </div>
  );
};

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '0.375rem',
  count = 1,
  className = '',
}) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`skeleton ${className}`}
        style={{ width, height, borderRadius }}
        aria-hidden="true"
      />
    ))}
  </>
);

export const PatientCardSkeleton: React.FC = () => (
  <div className="patient-card patient-card--skeleton">
    <div className="patient-card__header">
      <Skeleton width="56px" height="56px" borderRadius="50%" />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="1rem" />
        <Skeleton width="40%" height="0.75rem" className="mt-2" />
      </div>
    </div>
    <Skeleton height="0.75rem" count={3} className="mt-2" />
  </div>
);
