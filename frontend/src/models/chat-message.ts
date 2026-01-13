export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  senderName: string;
  senderImage?: string;
}
