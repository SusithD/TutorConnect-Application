import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Check, Clock, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: number;
  subject: {
    id: number;
    name: string;
  };
  student?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  tutor?: {
    id: number;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
  };
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
  meetingLink: string;
}

const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const endpoint = user?.role === 'TUTOR'
          ? '/api/bookings/tutor'
          : '/api/bookings/student';

        const response = await axios.get(endpoint);
        setBookings(response.data);
        setFilteredBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings', error);
        setLoading(false);
      }
    };

    fetchBookings();

    // Mock data for development
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
          student: { id: 201, firstName: 'Emma', lastName: 'Davis' },
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // tomorrow + 1 hour
          status: 'CONFIRMED',
          notes: 'Focus on quadratic equations',
          meetingLink: 'https://meet.google.com/abc-defg-hij'
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
          student: { id: 202, firstName: 'Alex', lastName: 'Wilson' },
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 3 days from now + 1.5 hours
          status: 'PENDING',
          notes: '',
          meetingLink: ''
        },
        {
          id: 3,
          subject: { id: 2, name: 'English' },
          tutor: { 
            id: 103, 
            firstName: 'Sarah', 
            lastName: 'Johnson',
            profilePictureUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=640'
          },
          student: { id: 203, firstName: 'Rebecca', lastName: 'Taylor' },
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 2 days ago + 1 hour
          status: 'COMPLETED',
          notes: 'Discussed essay structure',
          meetingLink: 'https://meet.google.com/xyz-abcd-efg'
        },
        {
          id: 4,
          subject: { id: 4, name: 'Chemistry' },
          tutor: { 
            id: 104, 
            firstName: 'Emily', 
            lastName: 'Parker',
            profilePictureUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=640'
          },
          student: { id: 204, firstName: 'David', lastName: 'Brown' },
          startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 5 days ago + 1 hour
          status: 'CANCELLED',
          notes: '',
          meetingLink: ''
        }
      ];

      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Apply filters whenever filter or search changes
    let filtered = [...bookings];

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status.toLowerCase() === selectedFilter.toLowerCase());
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => {
        const subjectMatch = booking.subject.name.toLowerCase().includes(query);
        const nameMatch = user?.role === 'STUDENT'
          ? booking.tutor?.firstName.toLowerCase().includes(query) || booking.tutor?.lastName.toLowerCase().includes(query)
          : booking.student?.firstName.toLowerCase().includes(query) || booking.student?.lastName.toLowerCase().includes(query);
        return subjectMatch || nameMatch;
      });
    }

    setFilteredBookings(filtered);
  }, [selectedFilter, searchQuery, bookings, user]);

  const handleConfirmBooking = async (id: number) => {
    try {
      await axios.post(`/api/bookings/${id}/confirm`);
      // Update booking status in state
      setBookings(
        bookings.map(booking => 
          booking.id === id ? { ...booking, status: 'CONFIRMED' } : booking
        )
      );
    } catch (error) {
      console.error('Error confirming booking', error);
    }
  };

  const handleCancelBooking = async (id: number) => {
    try {
      await axios.post(`/api/bookings/${id}/cancel`);
      // Update booking status in state
      setBookings(
        bookings.map(booking => 
          booking.id === id ? { ...booking, status: 'CANCELLED' } : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Confirmed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case 'CANCELLED':
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">Manage your tutoring sessions</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Filters and search */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <div className="flex space-x-2">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        selectedFilter === filter
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Bookings list */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : user?.role === 'STUDENT'
                  ? 'Start by finding a tutor and booking your first session'
                  : 'You have no tutoring sessions yet'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex">
                        {/* Profile image for tutor/student */}
                        {user?.role === 'STUDENT' ? (
                          <img
                            src={booking.tutor?.profilePictureUrl || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=640'}
                            alt={`${booking.tutor?.firstName} ${booking.tutor?.lastName}`}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {booking.student?.firstName.charAt(0)}
                            {booking.student?.lastName.charAt(0)}
                          </div>
                        )}
                        
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                              {booking.subject.name}
                            </h3>
                            <span className="ml-3">
                              {getStatusBadge(booking.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {user?.role === 'STUDENT'
                              ? `with ${booking.tutor?.firstName} ${booking.tutor?.lastName}`
                              : `with ${booking.student?.firstName} ${booking.student?.lastName}`}
                          </p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy')}</span>
                            <Clock className="h-4 w-4 ml-3 mr-1" />
                            <span>
                              {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="mt-2 text-sm text-gray-600">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col items-end">
                        {/* Actions based on booking status and user role */}
                        {booking.status === 'CONFIRMED' && (
                          <a
                            href={booking.meetingLink || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Join Session
                          </a>
                        )}
                        
                        {booking.status === 'PENDING' && user?.role === 'TUTOR' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleConfirmBooking(booking.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                        
                        {booking.status === 'PENDING' && user?.role === 'STUDENT' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                        )}
                        
                        {booking.status === 'COMPLETED' && user?.role === 'STUDENT' && (
                          <button
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            Leave Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingsPage;