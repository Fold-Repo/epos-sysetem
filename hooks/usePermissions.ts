"use client"

import { useEffect, useState } from 'react';
import { UserPermissions } from '@/types';
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
        
        // Extract permissions from the first role in the data array
        if (response.status === 200 && response.data && response.data.length > 0) {
          const rawPermissions = response.data[0].permissions;
          
          // Convert all permission keys from snake_case to camelCase
          // e.g., "manage_adjustments" -> "manageAdjustments"
          const permissions: UserPermissions = {};
          Object.keys(rawPermissions).forEach(key => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            permissions[camelKey] = rawPermissions[key];
          });
          
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

    dispatch(setPermissions(null));

    // ===============================================
    // Fetch Permissions if not already loaded
    // ===============================================
    // if (permissions === null) {
    //   fetchPermissions();
    // }

  }, [dispatch]);

  return { 
    permissions, 
    loading, 
    setPermissions: (perms: UserPermissions | null) => dispatch(setPermissions(perms))
  };
};

