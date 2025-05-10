import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, ChevronDown, Filter, MoreHorizontal, Search, Trash, User } from 'lucide-react';
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
  tutor: {
    id: number;
    firstName: string;
    lastName: string;
  };
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
  meetingLink: string;
  createdAt: string;
}

const AdminBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/admin/bookings');
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };
    
    fetchBookings();
    
    // Mock data for development
    if (process.env.NODE_ENV === 'development') {
      const currentDate = new Date();
      
      const mockBookings = [
        {
          id: 1,
          subject: { id: 1, name: 'Mathematics' },
          student: { id: 201, firstName: 'Emma', lastName: 'Davis' },
          tutor: { id: 101, firstName: 'John', lastName: 'Smith' },
          startTime: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
          endTime: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // tomorrow + 1 hour
          status: 'CONFIRMED',
          notes: 'Focus on quadratic equations',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          createdAt: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
        },
        {
          id: 2,
          subject: { id: 2, name: 'Physics' },
          student: { id: 202, firstName: 'Alex', lastName: 'Wilson' },
          tutor: { id: 102, firstName: 'Michael', lastName: 'Chen' },
          startTime: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          endTime: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 3 days from now + 1.5 hours
          status: 'PENDING',
          notes: '',
          meetingLink: '',
          createdAt: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          id: 3,
          subject: { id: 3, name: 'English' },
          student: { id: 203, firstName: 'Rebecca', lastName: 'Taylor' },
          tutor: { id: 103, firstName: 'Sarah', lastName: 'Johnson' },
          startTime: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          endTime: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 2 days ago + 1 hour
          status: 'COMPLETED',
          notes: 'Discussed essay structure',
          meetingLink: 'https://meet.google.com/xyz-abcd-efg',
          createdAt: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
        },
        {
          id: 4,
          subject: { id: 4, name: 'Chemistry' },
          student: { id: 204, firstName: 'David', lastName: 'Brown' },
          tutor: { id: 104, firstName: 'Emily', lastName: 'Parker' },
          startTime: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          endTime: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 5 days ago + 1 hour
          status: 'CANCELLED',
          notes: '',
          meetingLink: '',
          createdAt: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
        },
        {
          id: 5,
          subject: { id: 5, name: 'Spanish' },
          student: { id: 205, firstName: 'Sophie', lastName: 'Miller' },
          tutor: { id: 105, firstName: 'Carlos', lastName: 'Rodriguez' },
          startTime: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          endTime: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 5 days from now + 1 hour
          status: 'CONFIRMED',
          notes: 'Practice conversation',
          meetingLink: 'https://meet.google.com/mno-pqrs-tuv',
          createdAt: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        }
      ];
      
      setBookings(mockBookings);
      setLoading(false);
    }
  }, []);
  
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleDeleteBooking = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/admin/bookings/${id}`);
        setBookings(bookings.filter(booking => booking.id !== id));
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };
  
  const filteredBookings = bookings.filter(booking => {
    // Apply status filter
    if (statusFilter !== 'all' && booking.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    
    // Apply date filter
    const bookingDate = new Date(booking.startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (bookingDate < today || bookingDate >= tomorrow) {
        return false;
      }
    } else if (dateFilter === 'thisWeek') {
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
      startOfWeek.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      
      if (bookingDate < startOfWeek || bookingDate >= endOfWeek) {
        return false;
      }
    } else if (dateFilter === 'past') {
      if (bookingDate >= today) {
        return false;
      }
    } else if (dateFilter === 'upcoming') {
      if (bookingDate < today) {
        return false;
      }
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.subject.name.toLowerCase().includes(query) ||
        booking.student.firstName.toLowerCase().includes(query) ||
        booking.student.lastName.toLowerCase().includes(query) ||
        booking.tutor.firstName.toLowerCase().includes(query) ||
        booking.tutor.lastName.toLowerCase().includes(query) ||
        booking.notes.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="mt-2 text-gray-600">View and manage all tutoring session bookings on the platform.</p>
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
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="relative inline-flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="thisWeek">This Week</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
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
        ) : filteredBookings.length === 0 ? (
          <div className="p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'There are no bookings in the system'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.subject.name}</div>
                      <div className="text-xs text-gray-500">
                        {booking.notes ? <span title={booking.notes}>Has Notes</span> : 'No Notes'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.student.firstName} {booking.student.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {booking.student.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.tutor.firstName} {booking.tutor.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {booking.tutor.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDateTime(booking.startTime)}</div>
                      <div className="text-sm text-gray-500">{formatDateTime(booking.endTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
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

export default AdminBookingsPage;