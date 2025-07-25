import { supabaseBrowserClient } from "@/lib/supabase/client";

export interface AdminPermission {
  id: number;
  name: string;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  user_id: string;
  permission_id: number;
  granted_by: string | null;
  granted_at: string;
  permission: AdminPermission;
}

// Permission constants for type safety
export const PERMISSIONS = {
  // User management
  USERS_READ: 'users.read',
  USERS_EDIT: 'users.edit', 
  USERS_DELETE: 'users.delete',
  
  // Market/Store
  MARKET_READ: 'market.read',
  MARKET_WRITE: 'market.write',
  
  // Messaging
  MESSAGES_READ: 'messages.read',
  MESSAGES_WRITE: 'messages.write',
  
  // Financial
  FINANCIAL_READ: 'financial.read',
  FINANCIAL_WRITE: 'financial.write',
  
  // Administrative
  ADMINS_MANAGE: 'admins.manage',
  GROUPS_MANAGE: 'groups.manage',
  SETTINGS_MANAGE: 'settings.manage'
} as const;

export type PermissionName = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Get all available admin permissions
 */
export async function getAllPermissions(): Promise<AdminPermission[]> {
  const { data, error } = await supabaseBrowserClient
    .from('admin_permissions')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get permissions for a specific user
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const { data, error } = await supabaseBrowserClient
    .rpc('get_user_permissions', { p_user_id: userId });

  if (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }

  return data?.map((row: { permission_name: string }) => row.permission_name) || [];
}

/**
 * Check if a user has a specific permission
 */
export async function userHasPermission(userId: string, permission: PermissionName): Promise<boolean> {
  const { data, error } = await supabaseBrowserClient
    .rpc('user_has_permission', { 
      p_user_id: userId, 
      p_permission: permission 
    });

  if (error) {
    console.error('Error checking user permission:', error);
    throw error;
  }

  return data || false;
}

/**
 * Check if a user has any of the specified permissions
 */
export async function userHasAnyPermission(userId: string, permissions: PermissionName[]): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId);
  return permissions.some(permission => userPermissions.includes(permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export async function userHasAllPermissions(userId: string, permissions: PermissionName[]): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId);
  return permissions.every(permission => userPermissions.includes(permission));
}

/**
 * Grant a permission to a user
 */
export async function grantPermission(
  userId: string, 
  permission: PermissionName, 
  grantedBy: string
): Promise<void> {
  // First get the permission ID
  const { data: permissionData, error: permissionError } = await supabaseBrowserClient
    .from('admin_permissions')
    .select('id')
    .eq('name', permission)
    .single();

  if (permissionError) {
    console.error('Error fetching permission:', permissionError);
    throw permissionError;
  }

  // Grant the permission
  const { error } = await supabaseBrowserClient
    .from('user_permissions')
    .insert({
      user_id: userId,
      permission_id: permissionData.id,
      granted_by: grantedBy
    });

  if (error) {
    console.error('Error granting permission:', error);
    throw error;
  }
}

/**
 * Revoke a permission from a user
 */
export async function revokePermission(
  userId: string, 
  permission: PermissionName
): Promise<void> {
  // First get the permission ID
  const { data: permissionData, error: permissionError } = await supabaseBrowserClient
    .from('admin_permissions')
    .select('id')
    .eq('name', permission)
    .single();

  if (permissionError) {
    console.error('Error fetching permission:', permissionError);
    throw permissionError;
  }

  // Revoke the permission
  const { error } = await supabaseBrowserClient
    .from('user_permissions')
    .delete()
    .eq('user_id', userId)
    .eq('permission_id', permissionData.id);

  if (error) {
    console.error('Error revoking permission:', error);
    throw error;
  }
}

/**
 * Get all users with their permissions
 */
export async function getUsersWithPermissions(): Promise<{
  user_id: string;
  name: string;
  permissions: string[];
}[]> {
  const { data, error } = await supabaseBrowserClient
    .from('user_permissions')
    .select(`
      user_id,
      user_profiles!inner(name),
      admin_permissions!inner(name)
    `);

  if (error) {
    console.error('Error fetching users with permissions:', error);
    throw error;
  }

  // Group permissions by user
  const userMap = new Map<string, { user_id: string; name: string; permissions: string[] }>();
  
  data?.forEach((row: any) => {
    const userId = row.user_id;
    const userName = row.user_profiles.name;
    const permissionName = row.admin_permissions.name;

    if (!userMap.has(userId)) {
      userMap.set(userId, {
        user_id: userId,
        name: userName,
        permissions: []
      });
    }

    userMap.get(userId)!.permissions.push(permissionName);
  });

  return Array.from(userMap.values());
}

/**
 * Grant multiple permissions to a user
 */
export async function grantMultiplePermissions(
  userId: string,
  permissions: PermissionName[],
  grantedBy: string
): Promise<void> {
  // Get permission IDs
  const { data: permissionData, error: permissionError } = await supabaseBrowserClient
    .from('admin_permissions')
    .select('id, name')
    .in('name', permissions);

  if (permissionError) {
    console.error('Error fetching permissions:', permissionError);
    throw permissionError;
  }

  // Create user permission records
  const userPermissions = permissionData.map(permission => ({
    user_id: userId,
    permission_id: permission.id,
    granted_by: grantedBy
  }));

  const { error } = await supabaseBrowserClient
    .from('user_permissions')
    .insert(userPermissions);

  if (error) {
    console.error('Error granting multiple permissions:', error);
    throw error;
  }
}