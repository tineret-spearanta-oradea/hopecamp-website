import { UserForGroupAssignment } from "@/types/group";

export interface GroupAssignmentOptions {
  minGroupSize?: number;
  maxGroupSize?: number;
  balanceGender?: boolean;
  balanceAge?: boolean;
}

export interface AssignedGroup {
  name: string;
  leaderId: number;
  secondaryLeaderId?: number | null;
  memberIds: number[];
  members: UserForGroupAssignment[];
  statistics: {
    totalMembers: number;
    genderDistribution: { male: number; female: number; unknown: number };
    averageAge: number;
  };
}

const DEFAULT_OPTIONS: GroupAssignmentOptions = {
  balanceGender: true,
  balanceAge: false
};

export function generateBalancedGroups(
  allUsers: UserForGroupAssignment[],
  selectedLeaderIds: number[],
  options: Partial<GroupAssignmentOptions> = {},
  selectedSecondaryLeaderIds: number[] = [],
  leaderPairs?: Array<{primaryLeaderId: number; secondaryLeaderId?: number | null}>
): AssignedGroup[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Validate input
  if (selectedLeaderIds.length < 1) {
    throw new Error("At least one leader must be selected");
  }

  // Separate leaders and secondary leaders from regular members
  const leaders = allUsers.filter(user => selectedLeaderIds.includes(user.registrationId));
  const excludedIds = [...selectedLeaderIds, ...selectedSecondaryLeaderIds];
  const availableMembers = allUsers.filter(user => !excludedIds.includes(user.registrationId));

  if (leaders.length !== selectedLeaderIds.length) {
    throw new Error("Some selected leaders are not found in the user list");
  }

  // Calculate group distribution
  const totalMembers = availableMembers.length;
  const numGroups = leaders.length;
  const targetGroupSize = Math.floor(totalMembers / numGroups);
  const remainder = totalMembers % numGroups;

  // Create initial groups with leaders and their paired secondary leaders
  const groups: AssignedGroup[] = leaders.map((leader, index) => {
    // Find the corresponding secondary leader from the pairs (if using pairs)
    let secondaryLeaderId: number | null = null;
    if (leaderPairs) {
      const pair = leaderPairs.find(p => p.primaryLeaderId === leader.registrationId);
      secondaryLeaderId = pair?.secondaryLeaderId || null;
    } else {
      // Fallback to the old method for backward compatibility
      secondaryLeaderId = index < selectedSecondaryLeaderIds.length ? selectedSecondaryLeaderIds[index] : null;
    }
    
    return {
      name: `Group ${index + 1}`,
      leaderId: leader.registrationId,
      secondaryLeaderId,
      memberIds: [],
      members: [],
      statistics: {
        totalMembers: 0,
        genderDistribution: { male: 0, female: 0, unknown: 0 },
        averageAge: 0
      }
    };
  });

  // Sort members for better age distribution
  // First, separate into age groups to ensure good distribution
  const sortedMembers = [...availableMembers].sort((a, b) => {
    // Sort by age to enable better age distribution
    return a.age - b.age;
  });

  // Create alternating age distribution (youngest, oldest, second youngest, second oldest, etc.)
  const redistributedMembers = [];
  const membersCopy = [...sortedMembers];
  let takeFromStart = true;
  
  while (membersCopy.length > 0) {
    if (takeFromStart) {
      redistributedMembers.push(membersCopy.shift()!);
    } else {
      redistributedMembers.push(membersCopy.pop()!);
    }
    takeFromStart = !takeFromStart;
  }

  // Distribute members using strict round-robin for size balance, then optimize
  // First pass: strict round-robin to ensure equal distribution
  let currentGroupIndex = 0;
  for (let i = 0; i < redistributedMembers.length; i++) {
    const member = redistributedMembers[i];
    
    // Add member to current group
    groups[currentGroupIndex].members.push(member);
    groups[currentGroupIndex].memberIds.push(member.registrationId);
    
    // Update statistics
    updateGroupStatistics(groups[currentGroupIndex]);
    
    // Move to next group (round-robin)
    currentGroupIndex = (currentGroupIndex + 1) % groups.length;
  }
  
  // Second pass: minor optimization for age/gender balance within size constraints
  if (opts.balanceAge || opts.balanceGender) {
    optimizeWithinSizeConstraints(groups, opts);
  }

  // Final rebalancing if needed
  rebalanceGroups(groups, opts);
  
  // Additional age balancing pass
  if (opts.balanceAge) {
    balanceAgesAcrossGroups(groups);
  }

  return groups;
}

function optimizeWithinSizeConstraints(groups: AssignedGroup[], options: GroupAssignmentOptions): void {
  // Only make swaps that don't affect group sizes (1-for-1 member swaps)
  let hasChanges = true;
  let iterations = 0;
  const maxIterations = 5; // Limited iterations to avoid disrupting size balance
  
  while (hasChanges && iterations < maxIterations) {
    hasChanges = false;
    iterations++;
    
    // Try swapping members between groups to improve age/gender balance
    for (let i = 0; i < groups.length - 1; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const group1 = groups[i];
        const group2 = groups[j];
        
        // Only proceed if groups have members to swap
        if (group1.members.length === 0 || group2.members.length === 0) continue;
        
        // Try swapping each member from group1 with each member from group2
        for (let m1 = 0; m1 < group1.members.length; m1++) {
          for (let m2 = 0; m2 < group2.members.length; m2++) {
            const member1 = group1.members[m1];
            const member2 = group2.members[m2];
            
            // Calculate current balance scores
            const currentScore1 = options.balanceAge ? calculateAgeScore(group1) : 0;
            const currentScore2 = options.balanceAge ? calculateAgeScore(group2) : 0;
            const currentGenderScore1 = options.balanceGender ? calculateGenderScore(group1) : 0;
            const currentGenderScore2 = options.balanceGender ? calculateGenderScore(group2) : 0;
            const currentTotal = currentScore1 + currentScore2 + currentGenderScore1 + currentGenderScore2;
            
            // Simulate the swap
            group1.members[m1] = member2;
            group2.members[m2] = member1;
            group1.memberIds[m1] = member2.registrationId;
            group2.memberIds[m2] = member1.registrationId;
            updateGroupStatistics(group1);
            updateGroupStatistics(group2);
            
            // Calculate new balance scores
            const newScore1 = options.balanceAge ? calculateAgeScore(group1) : 0;
            const newScore2 = options.balanceAge ? calculateAgeScore(group2) : 0;
            const newGenderScore1 = options.balanceGender ? calculateGenderScore(group1) : 0;
            const newGenderScore2 = options.balanceGender ? calculateGenderScore(group2) : 0;
            const newTotal = newScore1 + newScore2 + newGenderScore1 + newGenderScore2;
            
            // If the swap improves balance, keep it
            if (newTotal > currentTotal + 0.1) { // Small threshold to avoid tiny improvements
              hasChanges = true;
            } else {
              // Revert the swap
              group1.members[m1] = member1;
              group2.members[m2] = member2;
              group1.memberIds[m1] = member1.registrationId;
              group2.memberIds[m2] = member2.registrationId;
              updateGroupStatistics(group1);
              updateGroupStatistics(group2);
            }
          }
        }
      }
    }
  }
}

function calculateAgeScore(group: AssignedGroup): number {
  if (group.members.length <= 1) return 1;
  
  const ages = group.members.map(m => m.age);
  const min = Math.min(...ages);
  const max = Math.max(...ages);
  const range = max - min;
  
  // Lower range is better (score closer to 1)
  return Math.max(0, 1 - range / 20); // 20 years max penalty
}

function calculateGenderScore(group: AssignedGroup): number {
  const genderCounts = group.statistics.genderDistribution;
  const total = group.members.length;
  
  if (total === 0) return 1;
  
  const maleRatio = genderCounts.male / total;
  const femaleRatio = genderCounts.female / total;
  const targetRatio = 0.5;
  
  // Better balance (closer to 50/50) gives higher score
  return 1 - (Math.abs(maleRatio - targetRatio) + Math.abs(femaleRatio - targetRatio)) / 2;
}

function findBestGroupForMember(
  member: UserForGroupAssignment,
  groups: AssignedGroup[],
  options: GroupAssignmentOptions
): number {
  let bestScore = -1;
  let bestGroupIndex = 0;

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const score = calculateGroupScore(member, group, options);
    
    if (score > bestScore) {
      bestScore = score;
      bestGroupIndex = i;
    }
  }

  return bestGroupIndex;
}

function calculateGroupScore(
  member: UserForGroupAssignment,
  group: AssignedGroup,
  options: GroupAssignmentOptions
): number {
  let score = 0;
  
  // GROUP SIZE BALANCE - HIGHEST PRIORITY
  // Heavily prefer groups with fewer members to ensure equal distribution
  const sizeScore = (options.maxGroupSize! - group.members.length) / options.maxGroupSize!;
  score += sizeScore * 100; // Dramatically increased weight for size balance

  // Age balance score (second priority)
  if (group.members.length > 0) {
    const ages = group.members.map(m => m.age);
    const currentMin = Math.min(...ages);
    const currentMax = Math.max(...ages);
    const currentRange = currentMax - currentMin;
    
    // Calculate what the new range would be if we add this member
    const newMin = Math.min(currentMin, member.age);
    const newMax = Math.max(currentMax, member.age);
    const newRange = newMax - newMin;
    
    // Prefer adding members that don't significantly increase the age range
    // Or fill gaps in the current age distribution
    const rangeScore = currentRange === 0 ? 1 : Math.max(0, 1 - (newRange - currentRange) / 10);
    score += rangeScore * 5; // Reduced weight compared to size balance
    
    // Bonus for filling age gaps (prefer ages closer to the current average)
    const currentAverage = group.statistics.averageAge;
    const ageDifferenceFromAverage = Math.abs(member.age - currentAverage);
    const ageProximityScore = Math.max(0, 1 - ageDifferenceFromAverage / 15); // 15 years max penalty
    score += ageProximityScore * 2; // Reduced weight
  }

  // Gender balance score (lowest priority)
  if (options.balanceGender) {
    const genderCounts = group.statistics.genderDistribution;
    const currentGenderCount = genderCounts[member.gender as keyof typeof genderCounts] || 0;
    const totalMembers = group.members.length;
    
    if (totalMembers > 0) {
      const currentGenderRatio = currentGenderCount / totalMembers;
      const targetRatio = 0.5; // Ideal 50/50 split
      const genderScore = 1 - Math.abs(currentGenderRatio - targetRatio);
      score += genderScore * 1; // Lowest weight - only minor influence
    }
  }

  return score;
}

function updateGroupStatistics(group: AssignedGroup): void {
  const stats = group.statistics;
  
  // Reset statistics
  stats.totalMembers = group.members.length;
  stats.genderDistribution = { male: 0, female: 0, unknown: 0 };
  
  let totalAge = 0;
  
  for (const member of group.members) {
    // Gender distribution
    stats.genderDistribution[member.gender]++;
    totalAge += member.age;
  }
  
  // Calculate average age
  stats.averageAge = stats.totalMembers > 0 ? totalAge / stats.totalMembers : 0;
}

function balanceAgesAcrossGroups(groups: AssignedGroup[]): void {
  // Calculate age statistics for each group
  const groupAgeStats = groups.map(group => {
    // Only use member ages since we can't easily get leader age here
    const allAges = group.members.map(m => m.age);
    if (allAges.length === 0) return null; // Skip groups with no members
    
    return {
      group,
      average: allAges.reduce((sum, age) => sum + age, 0) / allAges.length,
      range: Math.max(...allAges) - Math.min(...allAges),
      min: Math.min(...allAges),
      max: Math.max(...allAges)
    };
  }).filter(stat => stat !== null) as Array<{
    group: AssignedGroup;
    average: number;
    range: number;
    min: number;
    max: number;
  }>;

  // Sort by age imbalance (groups with extreme averages first)
  const overallAverage = groupAgeStats.reduce((sum, stat) => sum + stat.average, 0) / groupAgeStats.length;
  groupAgeStats.sort((a, b) => Math.abs(b.average - overallAverage) - Math.abs(a.average - overallAverage));

  // Try to balance by swapping members between groups
  let swapsMade = true;
  let iterations = 0;
  const maxIterations = 5;

  while (swapsMade && iterations < maxIterations) {
    swapsMade = false;
    iterations++;

    for (let i = 0; i < groupAgeStats.length - 1; i++) {
      for (let j = i + 1; j < groupAgeStats.length; j++) {
        const group1 = groupAgeStats[i].group;
        const group2 = groupAgeStats[j].group;

        // Try swapping members to improve age balance
        for (let m1 = 0; m1 < group1.members.length; m1++) {
          for (let m2 = 0; m2 < group2.members.length; m2++) {
            const member1 = group1.members[m1];
            const member2 = group2.members[m2];

            // Calculate current age differences from overall average
            const currentDiff1 = Math.abs(groupAgeStats[i].average - overallAverage);
            const currentDiff2 = Math.abs(groupAgeStats[j].average - overallAverage);

            // Calculate what the new averages would be after swap
            const group1NewAvg = (groupAgeStats[i].average * group1.members.length - member1.age + member2.age) / group1.members.length;
            const group2NewAvg = (groupAgeStats[j].average * group2.members.length - member2.age + member1.age) / group2.members.length;

            const newDiff1 = Math.abs(group1NewAvg - overallAverage);
            const newDiff2 = Math.abs(group2NewAvg - overallAverage);

            // If swap improves balance, do it
            if (newDiff1 + newDiff2 < currentDiff1 + currentDiff2 - 0.5) { // -0.5 threshold to avoid tiny swaps
              // Perform the swap
              group1.members[m1] = member2;
              group2.members[m2] = member1;
              
              // Update member IDs
              group1.memberIds[m1] = member2.registrationId;
              group2.memberIds[m2] = member1.registrationId;

              // Update statistics
              updateGroupStatistics(group1);
              updateGroupStatistics(group2);
              groupAgeStats[i].average = group1NewAvg;
              groupAgeStats[j].average = group2NewAvg;

              swapsMade = true;
            }
          }
        }
      }
    }
  }
}

function rebalanceGroups(groups: AssignedGroup[], options: GroupAssignmentOptions): void {
  // Aggressive rebalancing: ensure groups have as equal sizes as possible
  const totalMembers = groups.reduce((sum, group) => sum + group.members.length, 0);
  const numGroups = groups.length;
  const targetGroupSize = Math.floor(totalMembers / numGroups);
  const remainder = totalMembers % numGroups;
  
  let hasChanges = true;
  let iterations = 0;
  const maxIterations = 20; // Increased iterations for more thorough balancing
  
  while (hasChanges && iterations < maxIterations) {
    hasChanges = false;
    iterations++;
    
    // Sort groups by size (largest first) to identify imbalances
    const groupsWithIndex = groups.map((group, index) => ({ group, index, size: group.members.length }));
    groupsWithIndex.sort((a, b) => b.size - a.size);
    
    // Find groups that are significantly larger or smaller than target
    for (let i = 0; i < groupsWithIndex.length; i++) {
      const largerGroup = groupsWithIndex[i];
      const targetSizeForThisGroup = targetGroupSize + (i < remainder ? 1 : 0);
      
      // If this group is too large, move members to smaller groups
      if (largerGroup.size > targetSizeForThisGroup) {
        // Find the smallest group that can accept a member
        for (let j = groupsWithIndex.length - 1; j >= 0; j--) {
          const smallerGroup = groupsWithIndex[j];
          const targetSizeForSmallerGroup = targetGroupSize + (j < remainder ? 1 : 0);
          
          if (smallerGroup.size < targetSizeForSmallerGroup && largerGroup.size > targetSizeForThisGroup) {
            // Move a member from larger to smaller group
            const memberToMove = largerGroup.group.members.pop();
            if (memberToMove) {
              largerGroup.group.memberIds.pop();
              smallerGroup.group.members.push(memberToMove);
              smallerGroup.group.memberIds.push(memberToMove.registrationId);
              
              // Update sizes in our tracking arrays
              largerGroup.size--;
              smallerGroup.size++;
              
              // Update statistics
              updateGroupStatistics(largerGroup.group);
              updateGroupStatistics(smallerGroup.group);
              
              hasChanges = true;
            }
          }
        }
      }
    }
  }
}

export function validateGroupAssignment(
  groups: AssignedGroup[],
  options: Partial<GroupAssignmentOptions> = {}
): { isValid: boolean; issues: string[] } {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const issues: string[] = [];
  
  for (const group of groups) {
    // Check group size
    if (group.members.length < opts.minGroupSize!) {
      issues.push(`${group.name} has ${group.members.length} members, minimum is ${opts.minGroupSize}`);
    }
    
    if (group.members.length > opts.maxGroupSize!) {
      issues.push(`${group.name} has ${group.members.length} members, maximum is ${opts.maxGroupSize}`);
    }
    
    // Check for leader in members (should not happen)
    if (group.memberIds.includes(group.leaderId)) {
      issues.push(`${group.name} has leader as a member`);
    }
    
    // Check for secondary leader in members (should not happen)
    if (group.secondaryLeaderId && group.memberIds.includes(group.secondaryLeaderId)) {
      issues.push(`${group.name} has secondary leader as a member`);
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}