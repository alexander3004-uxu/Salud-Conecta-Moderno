export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  role: 'patient' | 'admin' | 'provider';
  membership: 'free' | 'premium';
  createdAt: string;
}

export interface Clinic {
  id: string;
  name: string;
  type: 'clinic' | 'pharmacy' | 'emergency';
  sector: 'public' | 'private';
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  inStock?: boolean;
  open24h?: boolean;
  phone?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  clinicId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  serviceType: string;
  updatedAt: string;
  doctorName?: string;
  location?: string;
  notes?: string;
}

export interface TriageRecord {
  id: string;
  userId: string;
  symptoms: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  recommendation: string;
  medication?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  createdAt: string;
}
