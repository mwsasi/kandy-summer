
export interface Attendee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  ticketCount: number;
  idProof: string; // Base64 or Blob URL
  notes?: string;
  registrationDate: string;
  isVerified?: boolean;
}

export interface Organizer {
  email: string;
  password?: string;
  name: string;
}

export type AppView = 'home' | 'register' | 'login' | 'signup' | 'dashboard';
