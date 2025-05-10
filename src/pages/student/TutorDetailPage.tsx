import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Book, 
  Calendar, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Star, 
  Users 
} from 'lucide-react';
import { format } from 'date-fns';

interface Subject {
  id: number;
  name: string;
}

interface Expertise {
  id: number;
  title: string;
  description: string;
  institution: string;
  yearObtained: number;
  verified: boolean;
}

interface TimeSlot {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Review {
  id: number;
  student: {
    id: number;
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Tutor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  bio: string;
  hourlyRate: number;
  yearsOfExperience: number;
  averageRating: number;
  totalReviews: number;
  profilePictureUrl: string;
  subjects: Subject[];
  expertises: Expertise[];
  availableTimeSlots: TimeSlot[];
  reviews: Review[];
}

interface BookingData {
  tutorId: number;
  subjectId: number;
  startTime: string;
  endTime: string;
  notes: string;
}

const TutorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking form state
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  
  // Section toggle state
  const [activeTab, setActiveTab] = useState('about');
  
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await axios.get(`/api/tutors/${id}`);
        setTutor(response.data);
        // If tutor has subjects, select the first one by default
        if (response.data.subjects && response.data.subjects.length > 0) {
          setSelectedSubject(response.data.subjects[0].id);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load tutor details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTutor();
    
    // For demo purposes - mock data
    if (process.env.NODE_ENV === 'development') {
      const mockTutor = {
        id: parseInt(id || '1'),
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        title: 'Mathematics & Physics Tutor',
        bio: 'I am a passionate Mathematics and Physics tutor with over 8 years of teaching experience. I believe in making complex concepts simple and enjoyable through real-world examples and interactive learning. My teaching approach focuses on building a strong foundation of fundamentals and then gradually moving to advanced topics. I have helped students achieve significant improvements in their grades and develop a genuine interest in STEM subjects.',
        hourlyRate: 35,
        yearsOfExperience: 8,
        averageRating: 4.8,
        totalReviews: 56,
        profilePictureUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=640',
        subjects: [
          { id: 1, name: 'Mathematics' },
          { id: 2, name: 'Physics' },
          { id: 3, name: 'Statistics' }
        ],
        expertises: [
          {
            id: 1,
            title: 'Master of Science in Applied Mathematics',
            description: 'Specialized in Mathematical Modeling and Numerical Analysis',
            institution: 'University of Michigan',
            yearObtained: 2015,
            verified: true
          },
          {
            id: 2,
            title: 'Certified High School Mathematics Teacher',
            description: 'Licensed to teach mathematics at secondary education level',
            institution: 'State Board of Education',
            yearObtained: 2016,
            verified: true
          }
        ],
        availableTimeSlots: [
          { id: 1, dayOfWeek: 'MONDAY', startTime: '09:00:00', endTime: '12:00:00', available: true },
          { id: 2, dayOfWeek: 'MONDAY', startTime: '14:00:00', endTime: '17:00:00', available: true },
          { id: 3, dayOfWeek: 'WEDNESDAY', startTime: '09:00:00', endTime: '12:00:00', available: true },
          { id: 4, dayOfWeek: 'WEDNESDAY', startTime: '14:00:00', endTime: '17:00:00', available: true },
          { id: 5, dayOfWeek: 'FRIDAY', startTime: '09:00:00', endTime: '12:00:00', available: true }
        ],
        reviews: [
          {
            id: 1,
            student: { id: 101, firstName: 'Emma', lastName: 'Davis' },
            rating: 5,
            comment: 'John is an excellent tutor who explains complex mathematical concepts in a simple way. My grades improved significantly after taking his sessions.',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
          },
          {
            id: 2,
            student: { id: 102, firstName: 'Alex', lastName: 'Wilson' },
            rating: 5,
            comment: 'Very patient and knowledgeable tutor. Helped me prepare for my AP Physics exam and I got a 5!',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
          },
          {
            id: 3,
            student: { id: 103, firstName: 'Michael', lastName: 'Brown' },
            rating: 4,
            comment: 'Great at explaining difficult concepts. Sometimes sessions run a bit longer than scheduled, but it\'s because he wants to make sure you understand everything.',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
          }
        ]
      };
      
      setTutor(mockTutor);
      if (mockTutor.subjects && mockTutor.subjects.length > 0) {
        setSelectedSubject(mockTutor.subjects[0].id);
      }
      setLoading(false);
    }
  }, [id]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookSession = async () => {
    if (!selectedSubject || !selectedDate || !selectedTimeSlot) {
      setBookingError('Please select a subject, date, and time slot before booking.');
      return;
    }
    
    setBookingLoading(true);
    setBookingError('');
    
    // Calculate start and end times based on selected date and time slot
    const startDate = new Date(selectedDate);
    const [startHour, startMinute] = selectedTimeSlot.startTime.split(':').map(Number);
    startDate.setHours(startHour, startMinute, 0);
    
    const endDate = new Date(selectedDate);
    const [endHour, endMinute] = selectedTimeSlot.endTime.split(':').map(Number);
    endDate.setHours(endHour, endMinute, 0);
    
    const bookingData: BookingData = {
      tutorId: tutor?.id || 0,
      subjectId: selectedSubject,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      notes: bookingNotes
    };
    
    try {
      await axios.post('/api/bookings', bookingData);
      setBookingSuccess(true);
      setBookingLoading(false);
      
      // Reset form
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      setBookingNotes('');
      
      // Redirect to bookings page after short delay
      setTimeout(() => {
        navigate('/student/bookings');
      }, 2000);
    } catch (err) {
      setBookingError('Failed to book session. Please try again later.');
      setBookingLoading(false);
    }
  };

  const getDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return format(date, 'h:mm a');
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !tutor) return [];
    
    const dayOfWeek = format(selectedDate, 'EEEE').toUpperCase();
    
    return tutor.availableTimeSlots.filter(
      slot => slot.dayOfWeek === dayOfWeek && slot.available
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !tutor) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-red-700">{error || 'Error loading tutor details.'}</p>
          </div>
        </div>
      </div>
    );
  }
  
  const availableTimeSlots = getAvailableTimeSlots();
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Tutor Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 mb-4 md:mb-0">
              <img
                src={tutor.profilePictureUrl || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=640'}
                alt={`${tutor.firstName} ${tutor.lastName}`}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-sm"
              />
            </div>
            <div className="md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{tutor.firstName} {tutor.lastName}</h1>
                  <p className="text-lg text-gray-600 mt-1">{tutor.title}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < Math.floor(tutor.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : index < tutor.averageRating
                              ? 'text-yellow-400 fill-current opacity-50'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {tutor.averageRating.toFixed(1)} ({tutor.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                  <p className="text-2xl font-bold text-gray-900">${tutor.hourlyRate}/hr</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {tutor.yearsOfExperience} years of experience
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map(subject => (
                    <span
                      key={subject.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <Book className="h-4 w-4 mr-1" />
                      {subject.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
                <button
                  onClick={() => setActiveTab('booking')}
                  className="mb-3 sm:mb-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Calendar className="h-5 w-5 mr-1" />
                  Book a Session
                </button>
                <button
                  onClick={() => navigate('/messages/chat/new', { state: { tutorId: tutor.id } })}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <MessageSquare className="h-5 w-5 mr-1" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('expertise')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'expertise'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Expertise & Experience
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'booking'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Book a Session
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About {tutor.firstName}</h2>
              <p className="text-gray-700 whitespace-pre-line">{tutor.bio}</p>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Subjects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tutor.subjects.map(subject => (
                    <div key={subject.id} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">{subject.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Schedule</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {tutor.availableTimeSlots.length === 0 ? (
                    <p className="text-gray-500">No availability information provided.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
                        const daySlots = tutor.availableTimeSlots.filter(slot => slot.dayOfWeek === day);
                        
                        if (daySlots.length === 0) {
                          return null;
                        }
                        
                        return (
                          <div key={day} className="border border-gray-200 rounded-lg p-3">
                            <h4 className="font-medium text-gray-900 mb-2">{getDayName(day)}</h4>
                            <div className="space-y-1">
                              {daySlots.map((slot) => (
                                <div key={slot.id} className="text-sm text-gray-600">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Expertise Tab */}
          {activeTab === 'expertise' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Education & Certifications</h2>
              
              {tutor.expertises.length === 0 ? (
                <p className="text-gray-500">No expertise information provided.</p>
              ) : (
                <div className="space-y-6">
                  {tutor.expertises.map(expertise => (
                    <div key={expertise.id} className="bg-gray-50 rounded-lg p-5">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{expertise.title}</h3>
                            {expertise.verified && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{expertise.institution}</p>
                          <p className="mt-1 text-sm text-gray-500">{expertise.yearObtained}</p>
                          {expertise.description && (
                            <p className="mt-3 text-gray-700">{expertise.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Teaching Experience</h2>
                <div className="bg-gray-50 rounded-lg p-5">
                  <div className="flex items-center">
                    <Users className="h-10 w-10 text-gray-400" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Years of Experience</h3>
                      <p className="mt-1 text-gray-600">{tutor.yearsOfExperience} years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Student Reviews</h2>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < Math.floor(tutor.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : index < tutor.averageRating
                            ? 'text-yellow-400 fill-current opacity-50'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    {tutor.averageRating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({tutor.totalReviews} reviews)
                  </span>
                </div>
              </div>
              
              {tutor.reviews.length === 0 ? (
                <div className="bg-gray-50 p-6 text-center rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900">No reviews yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This tutor doesn't have any reviews yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {tutor.reviews.map(review => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-5">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {review.student.firstName.charAt(0)}
                            {review.student.lastName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-base font-medium text-gray-900">
                              {review.student.firstName} {review.student.lastName}
                            </h3>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, index) => (
                                  <Star
                                    key={index}
                                    className={`h-4 w-4 ${
                                      index < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-xs text-gray-500">
                                {format(new Date(review.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Booking Tab */}
          {activeTab === 'booking' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Book a Session with {tutor.firstName}</h2>
              
              {bookingSuccess ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <div className="ml-3">
                      <p className="text-green-700 font-medium">Booking request sent successfully!</p>
                      <p className="text-green-700 text-sm mt-1">You'll be redirected to your bookings page shortly.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookingError && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-red-700">{bookingError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">1. Select Subject</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tutor.subjects.map(subject => (
                          <div
                            key={subject.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedSubject === subject.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedSubject(subject.id)}
                          >
                            <div className="flex items-center">
                              <Book className="h-5 w-5 text-gray-500" />
                              <span className="ml-2 font-medium">{subject.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">2. Select Date</h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        {/* Simplified calendar for demo - in a real app, use a proper calendar component */}
                        <div className="grid grid-cols-3 gap-2">
                          {[...Array(7)].map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i + 1); // Start from tomorrow
                            const dayAvailable = tutor.availableTimeSlots.some(
                              slot => slot.dayOfWeek === format(date, 'EEEE').toUpperCase() && slot.available
                            );
                            
                            return (
                              <div
                                key={i}
                                className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${
                                  selectedDate && date.toDateString() === selectedDate.toDateString()
                                    ? 'border-blue-500 bg-blue-50'
                                    : dayAvailable
                                    ? 'border-gray-200 hover:bg-gray-50'
                                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                                onClick={() => dayAvailable && handleDateSelect(date)}
                              >
                                <div className="text-xs font-medium text-gray-500">
                                  {format(date, 'EEE')}
                                </div>
                                <div className="text-lg font-medium mt-1">
                                  {format(date, 'd')}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">3. Select Time</h3>
                      {selectedDate ? (
                        availableTimeSlots.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {availableTimeSlots.map((slot) => (
                              <div
                                key={slot.id}
                                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                  selectedTimeSlot?.id === slot.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => handleTimeSlotSelect(slot)}
                              >
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="ml-2 font-medium">
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p className="text-yellow-700">
                              No available time slots for the selected date. Please select another date.
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                          <p className="text-gray-500">
                            Please select a date to view available time slots.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Session Details</h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                              Notes (optional)
                            </label>
                            <textarea
                              id="notes"
                              rows={4}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Let the tutor know what you'd like to focus on in this session..."
                              value={bookingNotes}
                              onChange={(e) => setBookingNotes(e.target.value)}
                            />
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tutor:</span>
                                <span className="font-medium">{tutor.firstName} {tutor.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subject:</span>
                                <span className="font-medium">
                                  {selectedSubject
                                    ? tutor.subjects.find(s => s.id === selectedSubject)?.name || 'Not selected'
                                    : 'Not selected'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">
                                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Not selected'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Time:</span>
                                <span className="font-medium">
                                  {selectedTimeSlot
                                    ? `${formatTime(selectedTimeSlot.startTime)} - ${formatTime(selectedTimeSlot.endTime)}`
                                    : 'Not selected'}
                                </span>
                              </div>
                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Rate:</span>
                                  <span className="font-medium">${tutor.hourlyRate}/hour</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Duration:</span>
                                  <span className="font-medium">
                                    {selectedTimeSlot
                                      ? (() => {
                                          const [startHour, startMinute] = selectedTimeSlot.startTime.split(':').map(Number);
                                          const [endHour, endMinute] = selectedTimeSlot.endTime.split(':').map(Number);
                                          const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                                          return `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
                                        })()
                                      : 'Not selected'}
                                  </span>
                                </div>
                                <div className="flex justify-between font-medium text-lg pt-2">
                                  <span>Total:</span>
                                  <span className="text-blue-600">
                                    {selectedTimeSlot
                                      ? (() => {
                                          const [startHour, startMinute] = selectedTimeSlot.startTime.split(':').map(Number);
                                          const [endHour, endMinute] = selectedTimeSlot.endTime.split(':').map(Number);
                                          const durationHours = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
                                          return `$${(tutor.hourlyRate * durationHours).toFixed(2)}`;
                                        })()
                                      : '$0.00'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleBookSession}
                            disabled={!selectedSubject || !selectedDate || !selectedTimeSlot || bookingLoading}
                            className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                              !selectedSubject || !selectedDate || !selectedTimeSlot || bookingLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                          >
                            {bookingLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : (
                              'Book Session'
                            )}
                          </button>
                          
                          <p className="text-xs text-gray-500 text-center mt-2">
                            By booking a session, you agree to our Terms of Service and Cancellation Policy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDetailPage;