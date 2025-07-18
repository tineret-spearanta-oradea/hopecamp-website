"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Users, UserCheck, Shuffle, Trash2, Crown, Users2, Check, X, Search, MoreVertical, Download, UserMinus, UserPlus } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { GroupWithDetails, UserForGroupAssignment } from "@/types/group";
import { useAuth } from "@/contexts/auth-context";
import { getActiveEdition } from "@/lib/supabase/database/edition";
import { useGroups } from "@/hooks/useGroups";
import { useRegistrations } from "@/hooks/use-registrations";
import { cn } from "@/lib/utils";
import { RegistrationWithProfile } from "@/types/registrationWithProfile";

export default function AssignGroupsPage() {
  const { userData } = useAuth();
  const searchParams = useSearchParams();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const [selectedLeaderIds, setSelectedLeaderIds] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { 
    groups, 
    unassignedUsers,
    isLoading, 
    hasGroups, 
    loadGroupsForEdition, 
    generateGroups, 
    deleteGroups,
    removeUserFromGroup,
    assignUserToGroup
  } = useGroups();
  
  const { registrations, isLoading: isLoadingRegistrations, error: registrationsError, fetchRegistrations } = useRegistrations();

  useEffect(() => {
    // Check if user is super admin
    if (!userData?.isSuperAdmin) {
      toast.error("Acces refuzat", {
        description: "Ai nevoie de permisiuni de super admin pentru a accesa această pagină.",
      });
      return;
    }

    // Get active edition
    const initializeEdition = async () => {
      try {
        const activeEdition = await getActiveEdition();
        if (activeEdition) {
          setSelectedEditionId(activeEdition.id);
        }
      } catch (error) {
        console.error("Error fetching active edition:", error);
      }
    };

    initializeEdition();
    fetchRegistrations(); // Fetch registrations data
  }, [userData, fetchRegistrations]);

  useEffect(() => {
    if (selectedEditionId) {
      loadGroupsForEdition(selectedEditionId);
    }
  }, [selectedEditionId, loadGroupsForEdition]);

  const handleLeaderSelection = (registrationId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedLeaderIds(prev => [...prev, registrationId]);
    } else {
      setSelectedLeaderIds(prev => prev.filter(id => id !== registrationId));
    }
  };

  const handleLeaderAdd = (user: RegistrationWithProfile) => {
    if (!selectedLeaderIds.includes(user.id)) {
      setSelectedLeaderIds(prev => [...prev, user.id]);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const handleLeaderRemove = (registrationId: number) => {
    setSelectedLeaderIds(prev => prev.filter(id => id !== registrationId));
  };

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  // Filter users based on search query and exclude already selected leaders
  const filteredUsers = (registrations || []).filter(user => 
    !selectedLeaderIds.includes(user.id) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.userId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get selected leaders data
  const selectedLeaders = (registrations || []).filter(user => 
    selectedLeaderIds.includes(user.id)
  );

  const handleGenerateGroups = async () => {
    if (!selectedEditionId) return;
    
    setIsGenerating(true);
    const success = await generateGroups(selectedEditionId, selectedLeaderIds);
    if (success) {
      setSelectedLeaderIds([]);
    }
    setIsGenerating(false);
  };

  const handleDeleteGroups = async () => {
    if (!selectedEditionId) return;
    await deleteGroups(selectedEditionId);
  };

  const handleRemoveFromGroup = async (registrationId: number) => {
    if (!selectedEditionId) return;
    await removeUserFromGroup(registrationId, selectedEditionId);
  };

  const handleAssignToGroup = async (registrationId: number, groupId: number) => {
    if (!selectedEditionId) return;
    await assignUserToGroup(registrationId, groupId, selectedEditionId);
  };

  const exportGroupsToCSV = () => {
    if (groups.length === 0) return;

    // Find the maximum number of members in any group (including leader)
    const maxMembers = Math.max(...groups.map(group => group.memberCount + 1));

    // Create headers: Group 1, , , Group 2, , , etc.
    const headers = groups.flatMap(group => [group.name, '', '']).join(',');
    
    // Create subheaders: Leader name, age, gender, Leader name, age, gender, etc.
    const subHeaders = groups.flatMap(() => ['Leader name', 'age', 'gender']).join(',');

    // Create data rows
    const rows = [];
    for (let i = 0; i < maxMembers; i++) {
      const row = groups.flatMap(group => {
        let person;
        if (i === 0) {
          // First row is always the leader
          person = group.leader;
        } else if (i <= group.memberCount) {
          // Subsequent rows are members (sorted by age)
          const sortedMembers = [...group.members].sort((a, b) => a.age - b.age);
          person = sortedMembers[i - 1];
        } else {
          // Empty cells for groups with fewer members
          return ['', '', ''];
        }
        
        if (person) {
          return [`"${person.name}"`, person.age, person.gender];
        }
        return ['', '', ''];
      });
      rows.push(row.join(','));
    }

    const csv = [headers, subHeaders, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `groups_edition_${selectedEditionId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return <span className="text-blue-600">M</span>;
      case 'female':
        return <span className="text-pink-600">F</span>;
      case 'unknown':
        return <span className="text-gray-500">N/A</span>;
      default:
        return <span className="text-gray-500">?</span>;
    }
  };

  const getGenderBadgeColor = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'bg-blue-100 text-blue-800';
      case 'female':
        return 'bg-pink-100 text-pink-800';
      case 'unknown':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!userData?.isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="max-w-md">
          <AlertDescription>
            Ai nevoie de permisiuni de super admin pentru a accesa această pagină.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Grupuri mici</h1>
        {hasGroups && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isLoading || isLoadingRegistrations} className="flex items-center gap-2">
                <MoreVertical className="h-4 w-4" />
                Acțiuni
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportGroupsToCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportă în CSV
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Șterge Toate Grupurile
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Șterge Toate Grupurile</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ești sigur că vrei să ștergi toate grupurile pentru această ediție? Această acțiune nu poate fi anulată și va elimina toate asignările de grup.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anulează</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteGroups} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Șterge Toate Grupurile
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {(isLoading || isLoadingRegistrations) && (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {registrationsError && (
        <div className="flex items-center justify-center h-64 text-red-500">
          Error loading registrations: {registrationsError.message}
        </div>
      )}

      {!isLoading && !isLoadingRegistrations && !registrationsError && selectedEditionId && (
        <>
          {hasGroups ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <Users2 className="h-4 w-4" />
                  {groups.length} Grupuri
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {groups.reduce((total, group) => total + group.memberCount + 1, 0)} Total Persoane Asignate
                </Badge>
                {unassignedUsers.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-2 text-orange-600 border-orange-600">
                    <UserCheck className="h-4 w-4" />
                    {unassignedUsers.length} Fără Grup
                  </Badge>
                )}
              </div>

              {/* Unassigned Users Section */}
              {unassignedUsers.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-orange-800">
                      <span>Utilizatori Fără Grup</span>
                      <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                        {unassignedUsers.length} utilizatori
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 max-h-40 overflow-y-auto">
                      {unassignedUsers.map((user) => (
                        <div key={user.registrationId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.age} ani</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getGenderBadgeColor(user.gender)}>
                              {getGenderIcon(user.gender)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {groups.map((group) => (
                                  <DropdownMenuItem
                                    key={group.id}
                                    onClick={() => handleAssignToGroup(user.registrationId, group.id)}
                                    className="flex items-center gap-2"
                                  >
                                    Asignează la {group.name} (Lider: {group.leader.name})
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>{group.name}</span>
                        <Badge variant="secondary">
                          {group.memberCount + 1} membri
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Leader */}
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <Crown className="h-4 w-4 text-amber-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{group.leader.name}</span>
                            <Badge className={`text-xs ${getGenderBadgeColor(group.leader.gender)}`}>
                              {getGenderIcon(group.leader.gender)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Lider • {group.leader.age} ani
                          </div>
                        </div>
                      </div>

                      {/* Members */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Membri:</div>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {group.members
                            .sort((a, b) => a.age - b.age) // Sort by age ascending
                            .map((member) => (
                                <div key={member.userId} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                  <span>{member.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">{member.age}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${getGenderBadgeColor(member.gender)}`}>
                                      {getGenderIcon(member.gender)}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveFromGroup(member.registrationId)}
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <UserMinus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                            ))}
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="pt-3 border-t space-y-3">
                        <div className="text-center">
                          <div className="flex justify-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              M: {group.statistics.genderDistribution.male}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              F: {group.statistics.genderDistribution.female}
                            </Badge>
                            {group.statistics.genderDistribution.unknown > 0 && (
                              <Badge variant="outline" className="text-xs">
                                ?: {group.statistics.genderDistribution.unknown}
                              </Badge>
                            )}
                            <Badge variant="default" className="text-xs font-medium">
                            {group.statistics.averageAge > 0 ? `${group.statistics.averageAge} ani` : 'N/A'}
                          </Badge>
                          </div>
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Selectează Liderii de Grup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Selectează cel puțin 1 lider din {(registrations || []).length} înregistrări pentru a crea grupuri.
                      </p>
                      <Badge variant="outline">
                        {selectedLeaderIds.length} selectați
                      </Badge>
                    </div>

                    {/* Search and Add Leaders */}
                    <div className="grid gap-2">
                      <Label>Adaugă Lideri</Label>
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Caută lideri..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setShowDropdown(true);
                            }}
                            onFocus={handleSearchFocus}
                            className="pl-10"
                          />
                        </div>
                        {showDropdown && searchQuery && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md max-h-[200px] overflow-auto z-50">
                            {filteredUsers.length === 0 ? (
                              <div className="p-3 text-sm text-muted-foreground">
                                Nu s-au găsit utilizatori
                              </div>
                            ) : (
                              filteredUsers.map((user) => (
                                <div
                                  key={user.id}
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
                                  onClick={() => handleLeaderAdd(user)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <div className="font-medium">{user.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {user.age} ani
                                      </div>
                                    </div>
                                  </div>
                                  <Badge className={getGenderBadgeColor(user.gender)}>
                                    {getGenderIcon(user.gender)}
                                  </Badge>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Leaders List */}
                    {selectedLeaders.length > 0 && (
                      <div className="space-y-3">
                        <Label>Lideri Selectați ({selectedLeaders.length})</Label>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {selectedLeaders.map((leader) => (
                            <div
                              key={leader.id}
                              className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <Crown className="h-4 w-4 text-amber-600" />
                                <div>
                                  <div className="font-medium">{leader.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {leader.age} ani
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getGenderBadgeColor(leader.gender)}>
                                  {getGenderIcon(leader.gender)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLeaderRemove(leader.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-end">
                      <Button
                        onClick={handleGenerateGroups}
                        disabled={selectedLeaderIds.length < 1 || isGenerating}
                        className="flex items-center gap-2"
                      >
                        <Shuffle className="h-4 w-4" />
                        {isGenerating ? "Se generează..." : "Generează Grupuri"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}