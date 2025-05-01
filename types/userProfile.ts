export interface UserProfile {
  userId: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  age: number;
  phone: string;
  // Field from user_roles
  isSuperAdmin: boolean;
}
