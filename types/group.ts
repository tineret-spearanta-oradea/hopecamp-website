export interface Group {
  id: number;
  editionId: number;
  name: string;
  leaderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  id: number;
  userId: string;
  groupId: number;
  createdAt: Date;
}

export interface GroupWithDetails extends Group {
  leader: {
    userId: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'unknown';
  };
  members: Array<{
    userId: string;
    registrationId: number;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'unknown';
  }>;
  memberCount: number;
  statistics: GroupStatistics;
}

export interface UserForGroupAssignment {
  userId: string;
  registrationId: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'unknown';
  isConfirmed: boolean;
}

export interface GroupAssignmentRequest {
  selectedLeaderIds: number[]; // Now using registration IDs
}

export interface GroupAssignmentResult {
  success: boolean;
  groups: GroupWithDetails[];
  message: string;
}

export interface GroupStatistics {
  totalMembers: number;
  genderDistribution: {
    male: number;
    female: number;
    unknown: number;
  };
  averageAge: number;
}