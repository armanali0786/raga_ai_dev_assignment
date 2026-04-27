import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return errors;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error, dismissError } = useAuth();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validateForm({ ...form, [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
    if (error) dismissError();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validateForm(form);
    setFieldErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errors = validateForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const success = await login(form.email, form.password);
    if (success) navigate('/dashboard');
  };

  const handleDemoLogin = async () => {
    const demoEmail = 'demo@medcore.health';
    const demoPassword = 'Demo@123';
    setForm({ email: demoEmail, password: demoPassword });
    const success = await login(demoEmail, demoPassword);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="login-page" aria-labelledby="login-heading">
      <div className="login-page__bg">
        <div className="login-page__blob login-page__blob--1" aria-hidden="true" />
        <div className="login-page__blob login-page__blob--2" aria-hidden="true" />
        <div className="login-page__grid" aria-hidden="true" />
      </div>

      <div className="login-page__card">
        {/* Brand */}
        <div className="login-page__brand">
          <div className="login-page__logo">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#loginGrad)" />
              <path d="M16 8v16M8 16h16" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="loginGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h2 className="login-page__brand-name">MedCore</h2>
            <p className="login-page__brand-sub">Healthcare SaaS Platform</p>
          </div>
        </div>

        <h1 id="login-heading" className="login-page__heading">Welcome back</h1>
        <p className="login-page__subheading">Sign in to your account to continue</p>

        {/* Firebase Error */}
        {error && (
          <div className="login-page__error" role="alert" aria-live="polite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span>{error}</span>
            <button onClick={dismissError} aria-label="Dismiss error" className="login-page__error-close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <form id="login-form" className="login-page__form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className={`form-field ${fieldErrors.email ? 'form-field--error' : ''}`}>
            <label htmlFor="email" className="form-field__label">
              Email Address
            </label>
            <div className="form-field__input-wrap">
              <svg className="form-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                className="form-field__input"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                autoFocus
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                aria-invalid={!!fieldErrors.email}
                disabled={loading}
              />
            </div>
            {fieldErrors.email && (
              <span id="email-error" className="form-field__error" role="alert">{fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className={`form-field ${fieldErrors.password ? 'form-field--error' : ''}`}>
            <label htmlFor="password" className="form-field__label">
              Password
            </label>
            <div className="form-field__input-wrap">
              <svg className="form-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-field__input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                aria-invalid={!!fieldErrors.password}
                disabled={loading}
              />
              <button
                type="button"
                className="form-field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <span id="password-error" className="form-field__error" role="alert">{fieldErrors.password}</span>
            )}
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="btn__spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-page__divider" aria-hidden="true">
          <span>or</span>
        </div>

        <button
          id="demo-login"
          type="button"
          className="btn btn--outline btn--full"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Try Demo Account
        </button>

        <p className="login-page__hint">
          Demo credentials: <code>demo@medcore.health</code> / <code>Demo@123</code>
        </p>

        <p className="login-page__firebase-note">
          Note: Firebase Authentication is integrated. Configure your project credentials in{' '}
          <code>.env</code> for production use.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
