import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorBoundary';

const CHART_COLORS = ['#4F46E5', '#7C3AED', '#059669', '#DC2626', '#0284C7', '#D97706'];
const PIE_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const CustomTooltip: React.FC<{ active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip__label">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="chart-tooltip__item" style={{ color: entry.color }}>
          {entry.name}: <strong>{typeof entry.value === 'number' && entry.value > 100000
            ? `₹${(entry.value / 100000).toFixed(1)}L`
            : entry.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const { metrics, admissionsData, departmentData, revenueData, patientSatisfaction, loading, error, refetch } = useAnalytics();

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="lg" message="Loading analytics data…" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} title="Analytics Unavailable" />;
  }

  return (
    <div className="analytics-page">
      {/* Metric Cards */}
      <div className="analytics-page__metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="analytics-metric-card">
            <p className="analytics-metric-card__label">{metric.label}</p>
            <p className="analytics-metric-card__value">
              {metric.unit === '₹'
                ? `₹${(metric.value / 100000).toFixed(1)}L`
                : `${metric.value.toLocaleString()}${metric.unit || ''}`}
            </p>
            <div className={`analytics-metric-card__change analytics-metric-card__change--${metric.changeType}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {metric.changeType === 'increase' ? (
                  <polyline points="18 15 12 9 6 15" />
                ) : (
                  <polyline points="6 9 12 15 18 9" />
                )}
              </svg>
              {metric.change}% vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="analytics-page__charts">
        {/* Admissions Area Chart */}
        <div className="chart-card chart-card--wide">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Patient Admissions (6 Months)</h3>
            <span className="chart-card__subtitle">Admissions vs Discharges</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={admissionsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="admGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="admGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, color: '#64748b' }} />
              <Area type="monotone" dataKey="value" name="Admissions" stroke="#4F46E5" fill="url(#admGrad1)" strokeWidth={2.5} dot={{ r: 4, fill: '#4F46E5' }} />
              <Area type="monotone" dataKey="secondary" name="Discharges" stroke="#10B981" fill="url(#admGrad2)" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Satisfaction Pie */}
        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Patient Satisfaction</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={patientSatisfaction}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {patientSatisfaction.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-card__legend">
            {patientSatisfaction.map((entry, i) => (
              <div key={entry.name} className="chart-card__legend-item">
                <span className="chart-card__legend-dot" style={{ background: PIE_COLORS[i] }} />
                <span>{entry.name}</span>
                <strong>{entry.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="analytics-page__charts">
        {/* Revenue Line Chart */}
        <div className="chart-card chart-card--wide">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Revenue Overview (6 Months)</h3>
            <span className="chart-card__subtitle">Revenue vs Expenses (INR)</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, color: '#64748b' }} />
              <Line type="monotone" dataKey="value" name="Revenue" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 5, fill: '#4F46E5', strokeWidth: 2 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="secondary" name="Expenses" stroke="#EF4444" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 5, fill: '#EF4444', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Bar Chart */}
        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Patients by Department</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} width={72} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Patients" radius={[0, 4, 4, 0]}>
                {departmentData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
