import { useAuthStore } from '../store.js';
import { Navigate, Outlet } from 'react-router-dom';
import SidebarDemo from '@/components/sidebar-demo';

const DashBoard = () => {

  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  return (
    <div className="flex h-screen w-full">
      <SidebarDemo />
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoard;