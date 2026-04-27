// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

// ─── Patient Types ─────────────────────────────────────────────────────────────
export type PatientStatus = 'active' | 'inactive' | 'critical' | 'recovered';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type ViewMode = 'grid' | 'list';

export interface Vitals {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  email: string;
  phone: string;
  address: string;
  status: PatientStatus;
  diagnosis: string;
  department: string;
  doctor: string;
  admissionDate: string;
  lastVisit: string;
  nextAppointment: string | null;
  vitals: Vitals;
  appointments: Appointment[];
  avatar: string;
}

export interface PatientsState {
  list: Patient[];
  selectedPatient: Patient | null;
  viewMode: ViewMode;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterStatus: PatientStatus | 'all';
  filterDepartment: string;
  currentPage: number;
  totalPages: number;
  initialized: boolean;
}

// ─── Analytics Types ────────────────────────────────────────────────────────────
export interface AnalyticsMetric {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  unit?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  secondary?: number;
}

export interface AnalyticsState {
  metrics: AnalyticsMetric[];
  admissionsData: ChartDataPoint[];
  departmentData: ChartDataPoint[];
  revenueData: ChartDataPoint[];
  patientSatisfaction: ChartDataPoint[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

// ─── Notification Types ─────────────────────────────────────────────────────────
export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'critical';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  patientId?: string;
}

export interface NotificationsState {
  items: AppNotification[];
  unreadCount: number;
  permissionGranted: boolean;
  serviceWorkerReady: boolean;
}

// ─── UI Types ──────────────────────────────────────────────────────────────────
export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  toasts: Toast[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
