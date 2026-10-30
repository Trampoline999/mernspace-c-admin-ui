
import { useAuthStore } from "../src/store.js";


export const usePermission = () => {

  const user = useAuthStore((state) => state.user);
  const allowedRoles = ["admin", "manager"]

  const _isPermission = () => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    isAllowed: _isPermission
  }
};