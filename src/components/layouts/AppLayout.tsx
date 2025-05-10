import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {isAuthenticated && (
          <Sidebar role={user?.role} />
        )}
        
        <main className={`flex-1 ${isAuthenticated ? 'ml-0 md:ml-64' : ''} p-4 md:p-8`}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default AppLayout;