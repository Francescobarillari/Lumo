export interface Event {
  id: number;
  title: string;
  description: string;
  nPartecipants: number;
  city: string;
  date: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  costPerPerson?: number;
  isParticipating?: boolean;
  isSaved?: boolean;
  savedCount?: number;
  participationStatus?: 'NONE' | 'PENDING' | 'ACCEPTED';
  organizerName?: string;
  organizerImage?: string;
  isApproved?: boolean;
  creatorId?: number;
  pendingUsersList?: import('./user').User[];
  acceptedUsersList?: import('./user').User[];
  occupiedSpots?: number;
}
