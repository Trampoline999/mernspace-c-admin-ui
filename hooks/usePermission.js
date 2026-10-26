
import { useAuthStore } from "../store.js";


export const usePermision = () => {

  const user = useAuthStore((state) => state.user);
  const allowedRoles = ["admin", "manager"]

  const _isPermission = () => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    isAlloewed: _isPermission
  }
};