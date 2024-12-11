export interface Message {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  text: string;
  sentDate: Date;
  isRead: boolean;
  readBy?: {
    userId: string;
    readAt: Date;
  };
}
