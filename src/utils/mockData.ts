import { Patient, PatientStatus, BloodGroup, Appointment } from '../types';

const DEPARTMENTS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Oncology',
  'Pediatrics', 'Dermatology', 'Gastroenterology', 'Endocrinology',
];

const DOCTORS = [
  'Dr. Sarah Mitchell', 'Dr. James Carter', 'Dr. Priya Sharma', 'Dr. Robert Chen',
  'Dr. Emily Thompson', 'Dr. Michael Rodriguez', 'Dr. Aisha Patel', 'Dr. David Kim',
];

const DIAGNOSES = [
  'Hypertension', 'Type 2 Diabetes', 'Coronary Artery Disease', 'Asthma',
  'Migraine', 'Arthritis', 'Thyroid Disorder', 'Anxiety Disorder',
  'Lower Back Pain', 'Anemia', 'GERD', 'Sleep Apnea',
];

const STATUSES: PatientStatus[] = ['active', 'inactive', 'critical', 'recovered'];
const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const NAMES = [
  'Arjun Mehta', 'Priya Nair', 'Rahul Gupta', 'Sneha Joshi', 'Vikram Singh',
  'Ananya Das', 'Rohan Kapoor', 'Meera Pillai', 'Aditya Sharma', 'Kavita Reddy',
  'Karan Malhotra', 'Deepika Rao', 'Suresh Verma', 'Pooja Iyer', 'Nikhil Bose',
  'Rohini Shah', 'Manish Tiwari', 'Sunita Krishnan', 'Aarav Jain', 'Divya Nambiar',
  'Harsh Pandey', 'Sanya Oberoi', 'Varun Khanna', 'Ishita Chatterjee', 'Rajesh Kumar',
  'Nandini Bajaj', 'Sameer Mathur', 'Tanvi Saxena', 'Rohit Deshmukh', 'Anjali Shetty',
];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAppointments(count: number): Appointment[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `appt-${Date.now()}-${i}`,
    date: new Date(Date.now() - randomInt(0, 90) * 86400000).toISOString().split('T')[0],
    time: `${randomInt(8, 17).toString().padStart(2, '0')}:${randomPick(['00', '15', '30', '45'])}`,
    doctor: randomPick(DOCTORS),
    department: randomPick(DEPARTMENTS),
    type: randomPick(['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup']),
    status: randomPick(['scheduled', 'completed', 'cancelled'] as const),
  }));
}

export function generateMockPatients(count: number = 30): Patient[] {
  return Array.from({ length: count }, (_, i) => {
    const name = NAMES[i % NAMES.length];
    const department = randomPick(DEPARTMENTS);
    return {
      id: `patient-${(i + 1).toString().padStart(4, '0')}`,
      name,
      age: randomInt(18, 85),
      gender: randomPick(['Male', 'Female'] as const),
      bloodGroup: randomPick(BLOOD_GROUPS),
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: `+91 ${randomInt(7000000000, 9999999999)}`,
      address: `${randomInt(1, 999)}, ${randomPick(['MG Road', 'Linking Road', 'Park Street', 'Nehru Nagar', 'Gandhi Avenue'])}, ${randomPick(['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'])}`,
      status: randomPick(STATUSES),
      diagnosis: randomPick(DIAGNOSES),
      department,
      doctor: randomPick(DOCTORS),
      admissionDate: new Date(Date.now() - randomInt(1, 365) * 86400000).toISOString().split('T')[0],
      lastVisit: new Date(Date.now() - randomInt(0, 30) * 86400000).toISOString().split('T')[0],
      nextAppointment: Math.random() > 0.3
        ? new Date(Date.now() + randomInt(1, 60) * 86400000).toISOString().split('T')[0]
        : null,
      vitals: {
        heartRate: randomInt(60, 110),
        bloodPressure: `${randomInt(110, 150)}/${randomInt(70, 95)}`,
        temperature: parseFloat((randomInt(970, 1010) / 10).toFixed(1)),
        oxygenSaturation: randomInt(92, 100),
        weight: randomInt(45, 120),
        height: randomInt(150, 195),
      },
      appointments: generateAppointments(randomInt(1, 8)),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    };
  });
}

export function generateAnalyticsData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => months[(currentMonth - 5 + i + 12) % 12]);

  return {
    metrics: [
      { label: 'Total Patients', value: 2847, change: 12.5, changeType: 'increase' as const, unit: '' },
      { label: 'Active Cases', value: 384, change: 8.2, changeType: 'increase' as const, unit: '' },
      { label: 'Critical Cases', value: 23, change: 4.3, changeType: 'decrease' as const, unit: '' },
      { label: 'Monthly Revenue', value: 4280000, change: 15.8, changeType: 'increase' as const, unit: '₹' },
      { label: 'Avg. Recovery Time', value: 8.4, change: 2.1, changeType: 'decrease' as const, unit: 'days' },
      { label: 'Patient Satisfaction', value: 94, change: 1.3, changeType: 'increase' as const, unit: '%' },
    ],
    admissionsData: last6Months.map((name) => ({
      name,
      value: randomInt(180, 420),
      secondary: randomInt(140, 380),
    })),
    departmentData: DEPARTMENTS.slice(0, 6).map((name) => ({
      name: name.substring(0, 8),
      value: randomInt(40, 250),
    })),
    revenueData: last6Months.map((name) => ({
      name,
      value: randomInt(3000000, 6000000),
      secondary: randomInt(2000000, 4500000),
    })),
    patientSatisfaction: [
      { name: 'Excellent', value: 48 },
      { name: 'Good', value: 31 },
      { name: 'Average', value: 14 },
      { name: 'Poor', value: 7 },
    ],
  };
}
