export interface Message {
  id: number;
  userId: string;
  userName: string;
  phone: string;
  text: string;
  sentDate: Date;
  isRead: boolean;
  readByUserId?: string;
  readAt?: Date;
}
