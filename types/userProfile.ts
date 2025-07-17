export interface UserProfile {
  userId: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  age: number;
  phone: string;
  gender: 'male' | 'female' | 'unknown';
  // Field from user_roles
  isSuperAdmin: boolean;
}
