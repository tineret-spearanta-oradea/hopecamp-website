"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  getAllPermissions,
  getUserPermissions,
  grantPermission,
  revokePermission,
  grantMultiplePermissions
} from "@/lib/supabase/database/permissions";
import {
  PERMISSIONS,
  PERMISSION_CATEGORIES,
  PERMISSION_DESCRIPTIONS,
  PermissionName,
  PermissionCategory
} from "@/types/permissions";
import { UserProfile } from "@/types/userProfile";
import { useAuth } from "@/contexts/auth-context";

interface PermissionsManagerProps {
  selectedUser: {
    userId: string;
    name: string;
    isSuperAdmin?: boolean;
  } | null;
  onClose: () => void;
}

export function PermissionsManager({ selectedUser, onClose }: PermissionsManagerProps) {
  const { userData: currentUser } = useAuth();
  const [allPermissions, setAllPermissions] = useState<{ [key: string]: any }>({});
  const [userPermissions, setUserPermissions] = useState<PermissionName[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch permissions data
  useEffect(() => {
    if (!selectedUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [permissions, userPerms] = await Promise.all([
          getAllPermissions(),
          getUserPermissions(selectedUser.userId)
        ]);

        // Group permissions by category
        const grouped = permissions.reduce((acc, perm) => {
          if (!acc[perm.category]) {
            acc[perm.category] = [];
          }
          acc[perm.category].push(perm);
          return acc;
        }, {} as { [key: string]: any[] });

        setAllPermissions(grouped);
        setUserPermissions(userPerms as PermissionName[]);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast.error("Eroare la încărcarea permisiunilor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUser]);

  const handlePermissionToggle = async (permissionName: PermissionName, isGranted: boolean) => {
    if (!selectedUser || !currentUser) return;

    setSaving(true);
    try {
      if (isGranted) {
        await grantPermission(selectedUser.userId, permissionName, currentUser.userId);
        setUserPermissions([...userPermissions, permissionName]);
        toast.success(`Permisiunea "${PERMISSION_DESCRIPTIONS[permissionName]}" a fost acordată`);
      } else {
        await revokePermission(selectedUser.userId, permissionName);
        setUserPermissions(userPermissions.filter(p => p !== permissionName));
        toast.success(`Permisiunea "${PERMISSION_DESCRIPTIONS[permissionName]}" a fost revocată`);
      }
    } catch (error) {
      console.error('Error toggling permission:', error);
      toast.error("Eroare la actualizarea permisiunii");
    } finally {
      setSaving(false);
    }
  };

  const handleGrantAllInCategory = async (category: PermissionCategory) => {
    if (!selectedUser || !currentUser) return;

    const categoryPermissions = allPermissions[category]?.map((p: any) => p.name as PermissionName) || [];
    const permissionsToGrant = categoryPermissions.filter(p => !userPermissions.includes(p));

    if (permissionsToGrant.length === 0) {
      toast.info("Utilizatorul are deja toate permisiunile din această categorie");
      return;
    }

    setSaving(true);
    try {
      await grantMultiplePermissions(selectedUser.userId, permissionsToGrant, currentUser.userId);
      setUserPermissions([...userPermissions, ...permissionsToGrant]);
      toast.success(`Toate permisiunile din categoria "${PERMISSION_CATEGORIES[category]}" au fost acordate`);
    } catch (error) {
      console.error('Error granting category permissions:', error);
      toast.error("Eroare la acordarea permisiunilor");
    } finally {
      setSaving(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">
                Gestionare permisiuni pentru {selectedUser.name}
              </CardTitle>
              {selectedUser.isSuperAdmin && (
                <Badge variant="secondary" className="mt-2">
                  Super Admin - Are toate permisiunile automat
                </Badge>
              )}
            </div>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <span>Se încarcă permisiunile...</span>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {Object.entries(allPermissions).map(([category, permissions]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">
                          {PERMISSION_CATEGORIES[category as PermissionCategory]}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGrantAllInCategory(category as PermissionCategory)}
                          disabled={saving || selectedUser.isSuperAdmin}
                        >
                          Acordă toate
                        </Button>
                      </div>

                      <div className="grid gap-3">
                        {permissions.map((permission: any) => {
                          const isGranted = userPermissions.includes(permission.name) || selectedUser.isSuperAdmin;
                          
                          return (
                            <div
                              key={permission.name}
                              className="flex items-start space-x-3 p-3 border rounded-lg"
                            >
                              <Checkbox
                                id={permission.name}
                                checked={isGranted}
                                disabled={saving || selectedUser.isSuperAdmin}
                                onCheckedChange={(checked) =>
                                  handlePermissionToggle(permission.name, checked as boolean)
                                }
                              />
                              <div className="flex-1 space-y-1">
                                <label
                                  htmlFor={permission.name}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {PERMISSION_DESCRIPTIONS[permission.name as PermissionName]}
                                </label>
                                <p className="text-xs text-muted-foreground">
                                  {permission.name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <Separator />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Închide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}