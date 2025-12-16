export interface Event {
  id: number;
  title: string;
  description: string;
  nPartecipants: number;
  city: string;
  date: string;       // ISO date
  startTime: string;  // HH:mm:ss or HH:mm
  endTime: string;    // HH:mm:ss or HH:mm
  createdAt: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  costPerPerson?: number;
  isParticipating?: boolean;
  isSaved?: boolean;
  isApproved?: boolean;
}
