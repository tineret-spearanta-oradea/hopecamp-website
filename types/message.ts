// Base message type for user-facing scenarios (minimal data)
export interface UserMessage {
  id: number;
  registrationId: number; // Link back to the registration
  text: string;
  sentDate: Date;
  isRead: boolean;
  readAt?: Date;
}

// Extended message type for admin scenarios (includes sender/reader details)
export interface AdminMessage extends UserMessage {
  userId: string; // Sender's user ID
  userName: string; // Sender's name
  phone: string; // Sender's phone
  readByUserId?: string; // ID of the user who read the message
  readByUserName?: string; // Name of the user who read the message
}
