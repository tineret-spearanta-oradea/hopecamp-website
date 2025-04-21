export interface UserProfile {
  userId: string;
  name: string;
  isSuperAdmin: boolean;
  phone: string;
  email: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  age?: number;
}
