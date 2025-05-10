import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Home, MessageSquare, Search, Settings, User, Users } from 'lucide-react';

interface SidebarProps {
  role?: 'STUDENT' | 'TUTOR' | 'ADMIN';
}

const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Define the navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: 'Profile',
        href: '/profile',
        icon: <User className="w-5 h-5" />,
      },
      {
        name: 'Messages',
        href: '/messages',
        icon: <MessageSquare className="w-5 h-5" />,
      },
    ];

    if (role === 'STUDENT') {
      return [
        {
          name: 'Dashboard',
          href: '/student/dashboard',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: 'Find Tutors',
          href: '/student/tutors',
          icon: <Search className="w-5 h-5" />,
        },
        {
          name: 'My Bookings',
          href: '/student/bookings',
          icon: <Calendar className="w-5 h-5" />,
        },
        ...baseItems,
      ];
    }

    if (role === 'TUTOR') {
      return [
        {
          name: 'Dashboard',
          href: '/tutor/dashboard',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: 'My Schedule',
          href: '/tutor/bookings',
          icon: <Calendar className="w-5 h-5" />,
        },
        ...baseItems,
      ];
    }

    if (role === 'ADMIN') {
      return [
        {
          name: 'Dashboard',
          href: '/admin/dashboard',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: 'Users',
          href: '/admin/users',
          icon: <Users className="w-5 h-5" />,
        },
        {
          name: 'Bookings',
          href: '/admin/bookings',
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          name: 'Subjects',
          href: '/admin/subjects',
          icon: <BookOpen className="w-5 h-5" />,
        },
        {
          name: 'Settings',
          href: '/admin/settings',
          icon: <Settings className="w-5 h-5" />,
        },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-md z-10 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out pt-16">
      <div className="h-full overflow-y-auto">
        <nav className="px-3 pt-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`mr-3 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;