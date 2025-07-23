import { useAuth } from "@/contexts/auth-context";
import { PermissionName } from "@/types/permissions";

/**
 * Custom hook for permission checking functionality
 * Provides convenient access to user permissions and checking functions
 */
export function usePermissions() {
  const { 
    userPermissions, 
    userData, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions 
  } = useAuth();

  // Check if user is admin (either super admin or has any admin permissions)
  const isAdmin = userData?.isSuperAdmin || userPermissions.length > 0;

  // Check if user is super admin
  const isSuperAdmin = userData?.isSuperAdmin || false;

  return {
    /** Array of user's permissions */
    permissions: userPermissions,
    
    /** Check if user has a specific permission */
    hasPermission,
    
    /** Check if user has any of the specified permissions */
    hasAnyPermission,
    
    /** Check if user has all of the specified permissions */
    hasAllPermissions,
    
    /** Check if user is an admin (super admin or has permissions) */
    isAdmin,
    
    /** Check if user is a super admin */
    isSuperAdmin,
    
    /** Convenient permission checkers for common operations */
    can: {
      // User management
      readUsers: () => hasPermission('users.read' as PermissionName),
      editUsers: () => hasPermission('users.edit' as PermissionName),
      deleteUsers: () => hasPermission('users.delete' as PermissionName),
      
      // Market
      readMarket: () => hasPermission('market.read' as PermissionName),
      writeMarket: () => hasPermission('market.write' as PermissionName),
      
      // Messages
      readMessages: () => hasPermission('messages.read' as PermissionName),
      writeMessages: () => hasPermission('messages.write' as PermissionName),
      
      // Financial
      readFinancial: () => hasPermission('financial.read' as PermissionName),
      writeFinancial: () => hasPermission('financial.write' as PermissionName),
      
      // Administrative
      manageAdmins: () => hasPermission('admins.manage' as PermissionName),
      manageGroups: () => hasPermission('groups.manage' as PermissionName),
      manageSettings: () => hasPermission('settings.manage' as PermissionName),
    }
  };
}