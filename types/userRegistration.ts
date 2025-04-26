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
    slopeActivity: string;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    endDate: Date;
    isConfirmed: boolean;
    amountPaid: number;
    withFamilyMember: boolean;
    // Fields from user_registration_roles
    isAdmin: boolean;
}