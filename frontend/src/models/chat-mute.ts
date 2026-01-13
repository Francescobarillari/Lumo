export interface ChatMute {
  userId: number;
  userName: string;
  mutedAt: string;
  mutedById?: number | null;
  reason?: string | null;
}
