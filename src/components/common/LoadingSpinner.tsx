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
  const sizeMap = { sm: 24, md: 40, lg: 64 };
  const px = sizeMap[size];

  const spinner = (
    <div className={`spinner spinner--${size}`} aria-label={message} role="status">
      <svg width={px} height={px} viewBox="0 0 50 50" fill="none">
        <circle cx="25" cy="25" r="20" stroke="var(--color-primary-300)" strokeWidth="4" />
        <circle
          cx="25" cy="25" r="20"
          stroke="var(--color-primary-500)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 45"
        />
      </svg>
      {message && <span className="spinner__label">{message}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="spinner-overlay" aria-busy="true">
        {spinner}
      </div>
    );
  }

  return spinner;
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
