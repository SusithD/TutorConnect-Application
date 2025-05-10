import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Check, ChevronDown, Filter, MoreHorizontal, Search, Shield, Slash, User, Users } from 'lucide-react';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  active: boolean;
  createdAt: string;
  lastLogin: string;
  profileDetails?: {
    hourlyRate?: number;
    averageRating?: number;
    totalReviews?: number;
    totalSessions?: number;
    totalBookings?: number;
  };
}

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dropdownUser, setDropdownUser] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
    
    // Mock data for development
    if (process.env.NODE_ENV === 'development') {
      const mockUsers = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '+12345678901',
          role: 'TUTOR',
          active: true,
          createdAt: '2023-01-15T10:30:00.000Z',
          lastLogin: '2023-04-18T14:25:32.000Z',
          profileDetails: {
            hourlyRate: 35,
            averageRating: 4.8,
            totalReviews: 56,
            totalSessions: 124,
            totalBookings: 130
          }
        },
        {
          id: 2,
          firstName: 'Emma',
          lastName: 'Davis',
          email: 'emma.davis@example.com',
          phone: '+12345678902',
          role: 'STUDENT',
          active: true,
          createdAt: '2023-02-05T08:15:00.000Z',
          lastLogin: '2023-04-17T09:10:45.000Z',
          profileDetails: {
            totalBookings: 15
          }
        },
        {
          id: 3,
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@example.com',
          phone: '+12345678903',
          role: 'TUTOR',
          active: true,
          createdAt: '2023-01-20T14:45:00.000Z',
          lastLogin: '2023-04-18T11:30:22.000Z',
          profileDetails: {
            hourlyRate: 45,
            averageRating: 4.7,
            totalReviews: 28,
            totalSessions: 82,
            totalBookings: 85
          }
        },
        {
          id: 4,
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+12345678904',
          role: 'TUTOR',
          active: false,
          createdAt: '2023-02-15T09:30:00.000Z',
          lastLogin: '2023-03-28T16:40:15.000Z',
          profileDetails: {
            hourlyRate: 30,
            averageRating: 4.9,
            totalReviews: 43,
            totalSessions: 105,
            totalBookings: 110
          }
        },
        {
          id: 5,
          firstName: 'Alex',
          lastName: 'Wilson',
          email: 'alex.wilson@example.com',
          phone: '+12345678905',
          role: 'STUDENT',
          active: true,
          createdAt: '2023-03-10T11:20:00.000Z',
          lastLogin: '2023-04-16T13:55:38.000Z',
          profileDetails: {
            totalBookings: 8
          }
        },
        {
          id: 6,
          firstName: 'David',
          lastName: 'Brown',
          email: 'david.brown@example.com',
          phone: '+12345678906',
          role: 'ADMIN',
          active: true,
          createdAt: '2023-01-05T08:30:00.000Z',
          lastLogin: '2023-04-18T15:20:10.000Z'
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    }
  }, []);
  
  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, {
        active: !currentStatus
      });
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, active: !currentStatus } : u
      ));
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleClickOutside = () => {
    setDropdownUser(null);
  };
  
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const filteredUsers = users.filter(user => {
    // Apply role filter
    if (roleFilter !== 'all' && user.role.toLowerCase() !== roleFilter) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter === 'active' && !user.active) {
      return false;
    }
    if (statusFilter === 'inactive' && user.active) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="mt-2 text-gray-600">View and manage all users on the platform.</p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="relative flex-1 max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative inline-flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="tutor">Tutors</option>
                  <option value="admin">Admins</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="relative inline-flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'There are no users in the system'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          {user.role === 'TUTOR' && user.profileDetails && (
                            <div className="text-xs text-gray-500">
                              {user.profileDetails.averageRating}/5 ({user.profileDetails.totalReviews} reviews)
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'TUTOR'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownUser(dropdownUser === user.id ? null : user.id);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        
                        {dropdownUser === user.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleUserStatus(user.id, user.active);
                                  setDropdownUser(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                {user.active ? (
                                  <span className="flex items-center">
                                    <Slash className="h-4 w-4 mr-2 text-red-500" />
                                    Deactivate User
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    Activate User
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // In a real app, this would navigate to a user detail/edit page
                                  console.log('View user details', user.id);
                                  setDropdownUser(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-blue-500" />
                                  View Details
                                </span>
                              </button>
                              {user.role !== 'ADMIN' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // In a real app, this would promote the user to admin
                                    console.log('Promote to admin', user.id);
                                    setDropdownUser(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  <span className="flex items-center">
                                    <Shield className="h-4 w-4 mr-2 text-purple-500" />
                                    Make Admin
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;