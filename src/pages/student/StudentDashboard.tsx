import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, GraduationCap, MessageSquare, Search, User } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: number;
  subject: {
    id: number;
    name: string;
  };
  tutor: {
    id: number;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
  };
  startTime: string;
  endTime: string;
  status: string;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch upcoming bookings
        const bookingsResponse = await axios.get('/api/bookings/upcoming');
        setUpcomingBookings(bookingsResponse.data);
        
        // Fetch unread message count
        const messagesResponse = await axios.get('/api/messages/unread/count');
        setUnreadMessages(messagesResponse.data.count);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // For demo purposes - mock data
    if (process.env.NODE_ENV === 'development') {
      const mockBookings = [
        {
          id: 1,
          subject: { id: 1, name: 'Mathematics' },
          tutor: { 
            id: 101, 
            firstName: 'John', 
            lastName: 'Smith',
            profilePictureUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=640'
          },
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // tomorrow + 1 hour
          status: 'CONFIRMED'
        },
        {
          id: 2,
          subject: { id: 3, name: 'Physics' },
          tutor: { 
            id: 102, 
            firstName: 'Michael', 
            lastName: 'Chen',
            profilePictureUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=640'
          },
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 3 days from now + 1.5 hours
          status: 'PENDING'
        }
      ];
      
      setUpcomingBookings(mockBookings);
      setUnreadMessages(3);
      setLoading(false);
    }
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.firstName || 'Student'}!</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main content - 8 columns */}
          <div className="md:col-span-8 space-y-6">
            {/* Quick actions */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link
                    to="/student/tutors"
                    className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors"
                  >
                    <Search className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Find a Tutor</span>
                  </Link>
                  
                  <Link
                    to="/student/bookings"
                    className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors"
                  >
                    <Calendar className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">My Sessions</span>
                  </Link>
                  
                  <Link
                    to="/messages"
                    className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 transition-colors"
                  >
                    <MessageSquare className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Messages</span>
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
                  >
                    <User className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Profile</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Upcoming sessions */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
                  <Link
                    to="/student/bookings"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View all
                  </Link>
                </div>
                
                {upcomingBookings.length === 0 ? (
                  <div className="bg-gray-50 p-6 text-center rounded-lg">
                    <GraduationCap className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">No upcoming sessions</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Schedule your first tutoring session to get started.
                    </p>
                    <div className="mt-4">
                      <Link
                        to="/student/tutors"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Find a Tutor
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start">
                          <img
                            src={booking.tutor.profilePictureUrl || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=640'}
                            alt={`${booking.tutor.firstName} ${booking.tutor.lastName}`}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <h3 className="text-base font-medium text-gray-900">
                              {booking.subject.name} with {booking.tutor.firstName} {booking.tutor.lastName}
                            </h3>
                            <div className="mt-1 flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm text-gray-500 mr-3">
                                {format(new Date(booking.startTime), 'MMM d, yyyy')}
                              </span>
                              <Clock className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm text-gray-500">
                                {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                              </span>
                            </div>
                            <div className="mt-2 flex space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'CONFIRMED'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Learning progress */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Progress</h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-medium text-gray-900">Mathematics</h3>
                    <div className="mt-2">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              Progress: 75%
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              3/4 Sessions Completed
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                          <div
                            style={{ width: '75%' }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-medium text-gray-900">Physics</h3>
                    <div className="mt-2">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-green-600">
                              Progress: 50%
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-green-600">
                              2/4 Sessions Completed
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                          <div
                            style={{ width: '50%' }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - 4 columns */}
          <div className="md:col-span-4 space-y-6">
            {/* User stats */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">12</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Hours Learned</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">18.5</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Subjects</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">3</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Reviews Given</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">8</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent messages */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
                  <Link
                    to="/messages"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View all
                  </Link>
                </div>
                
                {unreadMessages > 0 ? (
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-900">
                          You have {unreadMessages} unread message{unreadMessages > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="mt-2">
                        <Link
                          to="/messages"
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Read now →
                        </Link>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <img
                        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=640"
                        alt="John Smith"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-3 min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">John Smith</p>
                        <p className="text-sm text-gray-500 truncate">Great session today! Looking forward to our next...</p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No unread messages</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recommended tutors */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Tutors</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <img
                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=640"
                      alt="Sarah Johnson"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                      <p className="text-xs text-gray-500">English Literature</p>
                    </div>
                    <Link
                      to="/student/tutors/2"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View
                    </Link>
                  </div>
                  
                  <div className="flex items-center">
                    <img
                      src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=640"
                      alt="Michael Chen"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Michael Chen</p>
                      <p className="text-xs text-gray-500">Physics & Engineering</p>
                    </div>
                    <Link
                      to="/student/tutors/3"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    to="/student/tutors"
                    className="block text-sm font-medium text-center text-blue-600 hover:text-blue-500"
                  >
                    Browse more tutors
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;