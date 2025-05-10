import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, DollarSign, MessageSquare, Star, User, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: number;
  subject: {
    id: number;
    name: string;
  };
  student: {
    id: number;
    firstName: string;
    lastName: string;
  };
  startTime: string;
  endTime: string;
  status: string;
}

interface ScheduleSlot {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

const TutorDashboard = () => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalHours: 0,
    completedSessions: 0,
    averageRating: 0,
    totalStudents: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch upcoming bookings
        const bookingsResponse = await axios.get('/api/bookings/upcoming');
        setUpcomingBookings(bookingsResponse.data);
        
        // Fetch schedule slots
        const scheduleResponse = await axios.get('/api/tutor/schedule');
        setScheduleSlots(scheduleResponse.data);
        
        // Fetch stats
        const statsResponse = await axios.get('/api/tutor/stats');
        setStats(statsResponse.data);
        
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
          student: { id: 201, firstName: 'Emma', lastName: 'Davis' },
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // tomorrow + 1 hour
          status: 'CONFIRMED'
        },
        {
          id: 2,
          subject: { id: 1, name: 'Mathematics' },
          student: { id: 202, firstName: 'Alex', lastName: 'Wilson' },
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 2 days from now + 1 hour
          status: 'PENDING'
        }
      ];
      
      const mockSchedule = [
        { id: 1, dayOfWeek: 'MONDAY', startTime: '09:00:00', endTime: '12:00:00', available: true },
        { id: 2, dayOfWeek: 'MONDAY', startTime: '13:00:00', endTime: '16:00:00', available: true },
        { id: 3, dayOfWeek: 'WEDNESDAY', startTime: '09:00:00', endTime: '12:00:00', available: true },
        { id: 4, dayOfWeek: 'WEDNESDAY', startTime: '13:00:00', endTime: '16:00:00', available: true },
        { id: 5, dayOfWeek: 'FRIDAY', startTime: '09:00:00', endTime: '12:00:00', available: true },
      ];
      
      const mockStats = {
        totalEarnings: 1250,
        totalHours: 25,
        completedSessions: 18,
        averageRating: 4.7,
        totalStudents: 8,
      };
      
      setUpcomingBookings(mockBookings);
      setScheduleSlots(mockSchedule);
      setStats(mockStats);
      setLoading(false);
    }
  }, []);
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  };
  
  const getDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };
  
  const handleConfirmBooking = async (bookingId: number) => {
    try {
      await axios.post(`/api/bookings/${bookingId}/confirm`);
      setUpcomingBookings(
        upcomingBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'CONFIRMED' } 
            : booking
        )
      );
    } catch (error) {
      console.error('Error confirming booking', error);
    }
  };
  
  const handleRejectBooking = async (bookingId: number) => {
    try {
      await axios.post(`/api/bookings/${bookingId}/reject`);
      setUpcomingBookings(
        upcomingBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'REJECTED' } 
            : booking
        )
      );
    } catch (error) {
      console.error('Error rejecting booking', error);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.firstName || 'Tutor'}!</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Stats cards */}
          <div className="md:col-span-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <Clock className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-500">Hours Taught</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <Calendar className="h-8 w-8 text-purple-500 mb-2" />
                <p className="text-sm font-medium text-gray-500">Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <Star className="h-8 w-8 text-yellow-500 mb-2" />
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <Users className="h-8 w-8 text-indigo-500 mb-2" />
                <p className="text-sm font-medium text-gray-500">Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          
          {/* Main content - 8 columns */}
          <div className="md:col-span-8 space-y-6">
            {/* Upcoming sessions */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
                  <Link
                    to="/tutor/bookings"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View all
                  </Link>
                </div>
                
                {upcomingBookings.length === 0 ? (
                  <div className="bg-gray-50 p-6 text-center rounded-lg">
                    <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">No upcoming sessions</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You don't have any upcoming tutoring sessions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {booking.subject.name} with {booking.student.firstName} {booking.student.lastName}
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
                          
                          {booking.status === 'PENDING' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleConfirmBooking(booking.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleRejectBooking(booking.id)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Schedule */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Your Schedule</h2>
                  <Link
                    to="/profile"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Edit
                  </Link>
                </div>
                
                {scheduleSlots.length === 0 ? (
                  <div className="bg-gray-50 p-6 text-center rounded-lg">
                    <Clock className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">No schedule set</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add your available time slots to start receiving booking requests.
                    </p>
                    <div className="mt-4">
                      <Link
                        to="/profile"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Set Schedule
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
                      const daySlots = scheduleSlots.filter(slot => slot.dayOfWeek === day);
                      
                      if (daySlots.length === 0) {
                        return null;
                      }
                      
                      return (
                        <div key={day} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="text-base font-medium text-gray-900 mb-2">{getDayName(day)}</h3>
                          <div className="flex flex-wrap gap-2">
                            {daySlots.map((slot) => (
                              <span
                                key={slot.id}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  slot.available
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent reviews */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
                  <Link
                    to="/profile?tab=reviews"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View all
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <User className="h-10 w-10 rounded-full bg-gray-200 p-1 text-gray-600" />
                        <div className="ml-3">
                          <h3 className="text-base font-medium text-gray-900">Emma Davis</h3>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">3 days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      Great tutor! Very patient and explains concepts clearly. My math grades have improved significantly.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <User className="h-10 w-10 rounded-full bg-gray-200 p-1 text-gray-600" />
                        <div className="ml-3">
                          <h3 className="text-base font-medium text-gray-900">Alex Wilson</h3>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">1 week ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      Helped me prepare for my final exams. Very knowledgeable in mathematics and makes it easy to understand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - 4 columns */}
          <div className="md:col-span-4 space-y-6">
            {/* Quick actions */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    to="/profile"
                    className="block w-full py-2 px-4 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
                  >
                    Update Profile
                  </Link>
                  <Link
                    to="/profile?tab=schedule"
                    className="block w-full py-2 px-4 rounded-md bg-green-50 text-green-700 hover:bg-green-100 font-medium"
                  >
                    Manage Schedule
                  </Link>
                  <Link
                    to="/messages"
                    className="block w-full py-2 px-4 rounded-md bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-medium"
                  >
                    Check Messages
                  </Link>
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
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <User className="h-10 w-10 rounded-full bg-gray-200 p-1 text-gray-600" />
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">Emma Davis</p>
                      <p className="text-sm text-gray-500 truncate">Will we cover quadratic equations in our next session?</p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className="inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <User className="h-10 w-10 rounded-full bg-gray-200 p-1 text-gray-600" />
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">Alex Wilson</p>
                      <p className="text-sm text-gray-500 truncate">Thanks for the homework help! I'm ready for the next...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Earnings chart */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h2>
                <div className="h-48 flex items-end space-x-2">
                  {[250, 320, 180, 290, 410, 320].map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-blue-500 w-10"
                        style={{ height: `${value / 410 * 150}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(2023, index).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDashboard;