import { UserPermissions, PermissionAction } from '@/types/permissions';

/**
 * Check if user has a specific permission
 * @param permissions - User permissions object
 * @param permissionKey - Key of the permission to check (e.g., 'manageProducts')
 * @param action - Action to check (view, create, update, delete)
 * @returns boolean - true if user has the permission
 */
export const hasPermission = (
  permissions: UserPermissions | null | undefined,
  permissionKey: string,
  action: PermissionAction = 'view'
): boolean => {
  if (!permissions || !permissionKey) return false;
  
  const permission = permissions[permissionKey];
  if (!permission) return false;
  
  return permission[action] === true;
};

/**
 * Check if user has view permission (most common check for menu items)
 * @param permissions - User permissions object
 * @param permissionKey - Key of the permission to check
 * @returns boolean - true if user can view
 */
export const canView = (
  permissions: UserPermissions | null | undefined,
  permissionKey: string
): boolean => {
  return hasPermission(permissions, permissionKey, 'view');
};

/**
 * Filter dashboard links based on permissions
 * @param links - Array of dashboard links
 * @param permissions - User permissions object
 * @returns Filtered array of links
 */
export const filterLinksByPermissions = <T extends { permissionKey?: string }>(
  links: T[],
  permissions: UserPermissions | null | undefined
): T[] => {
  if (!permissions) return links;
  
  return links.filter(link => {
    if (!link.permissionKey) return true;
    return canView(permissions, link.permissionKey);
  });
};

