import { useAuthStore } from '../store.js';
import { Navigate, Outlet } from 'react-router-dom';
import AppSidebar from '@/shared/AppSidebar.jsx';
import Header from '@/shared/Header.jsx';

const DashBoard = () => {

  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      <AppSidebar role={user?.role} />
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashBoard;