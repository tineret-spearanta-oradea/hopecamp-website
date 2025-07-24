// Permission types for the admin system

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
  permission?: AdminPermission;
}

// Permission constants for type safety and consistency
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

// Permission categories for UI organization
export const PERMISSION_CATEGORIES = {
  users: 'Gestionare utilizatori',
  market: 'Market/Magazin',
  messages: 'Mesaje',
  financial: 'Financiar',
  admin: 'Administrare',
  groups: 'Grupuri mici',
  settings: 'Configurări'
} as const;

export type PermissionCategory = keyof typeof PERMISSION_CATEGORIES;

// Permission descriptions in Romanian for UI
export const PERMISSION_DESCRIPTIONS = {
  [PERMISSIONS.USERS_READ]: 'Vizualizare listă utilizatori și profiluri',
  [PERMISSIONS.USERS_EDIT]: 'Editare profiluri și date înregistrare utilizatori',
  [PERMISSIONS.USERS_DELETE]: 'Ștergere utilizatori (doar super admin)',
  [PERMISSIONS.MARKET_READ]: 'Vizualizare tranzacții și rezumate market',
  [PERMISSIONS.MARKET_WRITE]: 'Creare și editare tranzacții market',
  [PERMISSIONS.MESSAGES_READ]: 'Vizualizare mesaje și comunicări',
  [PERMISSIONS.MESSAGES_WRITE]: 'Trimitere mesaje către utilizatori',
  [PERMISSIONS.FINANCIAL_READ]: 'Vizualizare date financiare și rapoarte',
  [PERMISSIONS.FINANCIAL_WRITE]: 'Gestionare date financiare și cheltuieli',
  [PERMISSIONS.ADMINS_MANAGE]: 'Gestionare administratori și permisiuni',
  [PERMISSIONS.GROUPS_MANAGE]: 'Gestionare grupuri mici și atribuiri',
  [PERMISSIONS.SETTINGS_MANAGE]: 'Gestionare configurări sistem'
} as const;