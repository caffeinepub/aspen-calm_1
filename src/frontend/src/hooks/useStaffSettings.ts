import { useState } from 'react';

const STAFF_AUTH_KEY = 'aspen-calm-staff-auth';

export function useStaffSettings() {
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(STAFF_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const authenticateStaff = () => {
    setIsStaffAuthenticated(true);
    try {
      sessionStorage.setItem(STAFF_AUTH_KEY, 'true');
    } catch (e) {
      console.warn('Failed to save staff auth:', e);
    }
  };

  const logoutStaff = () => {
    setIsStaffAuthenticated(false);
    try {
      sessionStorage.removeItem(STAFF_AUTH_KEY);
    } catch (e) {
      console.warn('Failed to clear staff auth:', e);
    }
  };

  return {
    isStaffAuthenticated,
    authenticateStaff,
    logoutStaff,
  };
}
