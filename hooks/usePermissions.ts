"use client"

import { useEffect, useState } from 'react';
import { UserPermissions, Permission } from '@/types';
import { useAppDispatch, useAppSelector, selectPermissions, setPermissions } from '@/store';
import { getPermissions } from '@/services';

/**
 * Hook to manage user permissions with Redux
 * Fetches permissions and stores them in Redux state
 */
export const usePermissions = () => {

  // ===============================================
  // Redux State
  // ===============================================
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(selectPermissions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    // ===============================================
    // Fetch Permissions
    // ===============================================
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        
        const response = await getPermissions();
        
        // ===============================================
        // Extract permissions from data: { name, description, permissions }
        // ===============================================
        const data = response?.data;
        const rawPermissions =
          data && typeof data === 'object' && !Array.isArray(data) && 'permissions' in data
            ? (data as { permissions: Record<string, unknown> }).permissions
            : undefined;

        if (response.status === 200 && rawPermissions && typeof rawPermissions === 'object') {
          // ===============================================
          // Convert permission keys from snake_case to camelCase (e.g. "manage_adjustments" -> "manageAdjustments")
          // ===============================================
          const permissions: UserPermissions = {};
          Object.keys(rawPermissions).forEach(key => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            permissions[camelKey] = rawPermissions[key] as Permission;
          });
          // ===============================================
          // Map API keys to sidebar PermissionKey (API uses singular/different names; sidebar uses plural/aliases)
          // ===============================================
          if (permissions.manageSale) permissions.manageSales = permissions.manageSale;
          if (permissions.managePurchase) permissions.managePurchases = permissions.managePurchase;
          if (permissions.manageSetting) permissions.manageSettings = permissions.manageSetting;
          if (permissions.manageRoles) permissions.manageRolesPermissions = permissions.manageRoles;
          dispatch(setPermissions(permissions));
        } else {
          dispatch(setPermissions(null));
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        dispatch(setPermissions(null));
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [dispatch]);

  return { 
    permissions, 
    loading, 
    setPermissions: (perms: UserPermissions | null) => dispatch(setPermissions(perms))
  };
};

