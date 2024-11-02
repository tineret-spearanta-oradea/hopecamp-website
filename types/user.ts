export interface User {
  uid: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  phone?: string;
  church?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isConfirmed?: boolean;
  startDate?: Date;
  endDate?: Date;
  transport?: string;
  preferences?: string;
  amountPaid?: number;
  payTaxTo?: string;
  age?: number;
  withFamilyMember?: boolean;
}
