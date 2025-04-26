export interface UserProfile {
  userId: string;
  name: string;
  phone: string;
  email: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  age: number;
  // Field from user_roles
  isSuperAdmin: boolean;
}
