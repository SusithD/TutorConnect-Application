import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalSubjects: number;
}

interface RecentActivity {
  id: number;
  type: string;
  details: string;
  timestamp: string;
  userId?: number;
  userName?: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    totalSubjects: 0
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await axios.get('/api/admin/stats');
        setStats(statsResponse.data);
        
        // Fetch recent activities
        const activitiesResponse = await axios.get('/api/admin/activities');
        setActivities(activitiesResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // For demo purposes - mock data
    if (process.env.NODE_ENV === 'development') {
      const mockStats = {
        totalUsers: 256,
        totalStudents: 180,
        totalTutors: 65,
        totalBookings: 428,
        completedBookings: 312,
        pendingBookings: 43,
        totalRevenue: 15420,
        totalSubjects: 24
      };
      
      const mockActivities = [
        { 
          id: 1, 
          type: 'NEW_USER', 
          details: 'New student registration', 
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          userId: 201,
          userName: 'Rebecca Johnson'
        },
        { 
          id: 2, 
          type: 'NEW_BOOKING', 
          details: 'New booking created', 
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          userId: 202,
          userName: 'Michael Chen'
        },
        { 
          id: 3, 
          type: 'BOOKING_COMPLETED', 
          details: 'Session completed', 
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          userId: 203,
          userName: 'Sarah Wilson'
        },
        { 
          id: 4, 
          type: 'NEW_REVIEW', 
          details: 'New tutor review submitted', 
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          userId: 204,
          userName: 'David Lee'
        },
        { 
          id: 5, 
          type: 'PAYMENT_RECEIVED', 
          details: 'Payment processed', 
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 205,
          userName: 'Jennifer Lopez'
        }
      ];
      
      setStats(mockStats);
      setActivities(mockActivities);
      setLoading(false);
    }
  }, []);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'NEW_USER':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'NEW_BOOKING':
      case 'BOOKING_COMPLETED':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'NEW_REVIEW':
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'PAYMENT_RECEIVED':
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.firstName || 'Admin'}!</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500">Students</span>
                    <span className="ml-1 text-xs font-medium text-gray-900">{stats.totalStudents}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Tutors</span>
                    <span className="ml-1 text-xs font-medium text-gray-900">{stats.totalTutors}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500">Completed</span>
                    <span className="ml-1 text-xs font-medium text-gray-900">{stats.completedBookings}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Pending</span>
                    <span className="ml-1 text-xs font-medium text-gray-900">{stats.pendingBookings}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs font-medium text-green-500">12% increase</span>
                    <span className="ml-1 text-xs text-gray-500">from last month</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Subjects</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalSubjects}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/admin/subjects"
                    className="text-xs font-medium text-purple-600 hover:text-purple-500"
                  >
                    Manage subjects →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent activity */}
            <div className="md:col-span-2 bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== activities.length - 1 ? (
                            <span
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div>
                              <div className="relative px-1">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                  {getActivityIcon(activity.type)}
                                </div>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <a href="#" className="font-medium text-gray-900">
                                    {activity.userName || 'System'}
                                  </a>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {activity.details}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-gray-500">
                                <p>{formatTimestamp(activity.timestamp)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <a
                    href="#"
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View all activity
                  </a>
                </div>
              </div>
            </div>
            
            {/* Quick actions & Overview */}
            <div className="md:col-span-1 space-y-6">
              {/* Quick actions */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6 space-y-3">
                  <Link
                    to="/admin/users"
                    className="block w-full py-2 px-4 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
                  >
                    Manage Users
                  </Link>
                  <Link
                    to="/admin/subjects"
                    className="block w-full py-2 px-4 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium"
                  >
                    Manage Subjects
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className="block w-full py-2 px-4 rounded-md bg-green-50 text-green-700 hover:bg-green-100 font-medium"
                  >
                    View All Bookings
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="block w-full py-2 px-4 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    System Settings
                  </Link>
                </div>
              </div>
              
              {/* Platform overview */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Platform Overview</h2>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 gap-y-4">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Total Sessions Today</dt>
                      <dd className="mt-1 text-sm text-gray-900">24</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">New Users (Last 7 Days)</dt>
                      <dd className="mt-1 text-sm text-gray-900">38</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Active Tutors</dt>
                      <dd className="mt-1 text-sm text-gray-900">42</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Avg. Session Rating</dt>
                      <dd className="mt-1 text-sm text-gray-900">4.8 / 5</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts and graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">User Growth</h2>
              </div>
              <div className="p-6">
                <div className="h-60">
                  {/* Mock chart - in a real app, you'd use a proper chart library */}
                  <div className="h-full flex items-end space-x-2">
                    {[30, 40, 35, 50, 49, 60, 70, 91, 125].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500"
                          style={{ height: `${value / 125 * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Revenue Overview</h2>
              </div>
              <div className="p-6">
                <div className="h-60">
                  {/* Mock chart - in a real app, you'd use a proper chart library */}
                  <div className="h-full flex items-end space-x-2">
                    {[1200, 1700, 1500, 1900, 2200, 2100, 2400, 2300, 2800].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-green-500"
                          style={{ height: `${value / 2800 * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;