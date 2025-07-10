export interface UserRegistration {
  id: number;
  userId: string;
  editionId: number;
  church: string;
  churchOther: string;
  churchContact?: string;
  payTaxTo: string;
  transport: string;
  preferences?: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
  startDate: Date;
  endDate: Date;
  isConfirmed: boolean;
  amountPaid: number;
  paymentUpdatedAt?: Date;
  paymentUpdatedBy?: string;
  withFamilyMember: boolean;
  // Fields from user_registration_roles
  isAdmin: boolean;
}