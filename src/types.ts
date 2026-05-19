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
  type:
    | 'hospital-national'
    | 'hospital-regional'
    | 'hospital-primary'
    | 'hospital'
    | 'emergency'
    | 'health-center'
    | 'health-post'
    | 'pharmacy'
    | 'clinic'
    | 'laboratory'
    | 'dental'
    | 'mental-health';
  sector: 'public' | 'private';
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  inStock?: boolean;
  open24h?: boolean;
  isOpen?: boolean;
  distance?: number;
  phone?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  services?: string[];
  // Rich detail fields from Google Places API
  placeId?: string;
  website?: string;
  photos?: string[];           // Array of photo URLs (resolved via Places photo references)
  openingHours?: {             // Weekly schedule from Google Places
    isOpen?: boolean;          // Current open/closed status
    periods?: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
    weekdayText?: string[];    // Human-readable: ["Lunes: 8:00 a.m. – 5:00 p.m.", ...]
  };
  wheelchairAccessible?: boolean;
  priceLevel?: 0 | 1 | 2 | 3 | 4; // 0=free, 1=inexpensive, 2=moderate, 3=expensive, 4=very expensive
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
