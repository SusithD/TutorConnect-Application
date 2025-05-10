import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Building, Calendar, ChevronDown, Edit, Eye, EyeOff, GraduationCap as Graduation, Mail, Phone, Save, User, X } from 'lucide-react';

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  
  // Student specific fields
  educationLevel?: string;
  grade?: number;
  school?: string;
  
  // Tutor specific fields
  bio?: string;
  title?: string;
  hourlyRate?: number;
  yearsOfExperience?: number;
  profilePictureUrl?: string;
  subjects?: { id: number; name: string }[];
  expertise?: {
    id: number;
    title: string;
    description: string;
    institution: string;
    yearObtained: number;
    verified: boolean;
  }[];
  schedule?: {
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    available: boolean;
  }[];
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Subject {
  id: number;
  name: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editableProfile, setEditableProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password change state
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Subject management for tutors
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [newExpertise, setNewExpertise] = useState({
    title: '',
    description: '',
    institution: '',
    yearObtained: new Date().getFullYear()
  });
  
  // Schedule management for tutors
  const [newScheduleSlot, setNewScheduleSlot] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00',
    available: true
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        setProfile(response.data);
        setEditableProfile(response.data);
        
        if (response.data.subjects) {
          setSelectedSubjects(response.data.subjects.map((s: any) => s.id));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };
    
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('/api/subjects');
        setAllSubjects(response.data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };
    
    fetchProfile();
    fetchSubjects();
    
    // For demo purposes - mock data
    if (process.env.NODE_ENV === 'development') {
      const mockProfile = {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '+12345678901',
        role: 'TUTOR',
        bio: 'Experienced mathematics tutor with a passion for helping students succeed.',
        title: 'Mathematics & Physics Tutor',
        hourlyRate: 35,
        yearsOfExperience: 8,
        profilePictureUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=640',
        subjects: [
          { id: 1, name: 'Mathematics' },
          { id: 2, name: 'Physics' },
          { id: 3, name: 'Statistics' }
        ],
        expertise: [
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
        schedule: [
          { id: 1, dayOfWeek: 'MONDAY', startTime: '09:00:00', endTime: '12:00:00', available: true },
          { id: 2, dayOfWeek: 'MONDAY', startTime: '14:00:00', endTime: '17:00:00', available: true },
          { id: 3, dayOfWeek: 'WEDNESDAY', startTime: '09:00:00', endTime: '12:00:00', available: true },
          { id: 4, dayOfWeek: 'WEDNESDAY', startTime: '14:00:00', endTime: '17:00:00', available: true },
          { id: 5, dayOfWeek: 'FRIDAY', startTime: '09:00:00', endTime: '12:00:00', available: true }
        ]
      };
      
      const mockSubjects = [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Physics' },
        { id: 3, name: 'Statistics' },
        { id: 4, name: 'Chemistry' },
        { id: 5, name: 'Biology' },
        { id: 6, name: 'Computer Science' },
        { id: 7, name: 'English' },
        { id: 8, name: 'History' },
        { id: 9, name: 'Geography' },
        { id: 10, name: 'Economics' }
      ];
      
      setProfile(mockProfile);
      setEditableProfile(mockProfile);
      setSelectedSubjects(mockProfile.subjects.map((s: any) => s.id));
      setAllSubjects(mockSubjects);
      setLoading(false);
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => {
      if (!prev) return null;
      
      let updatedValue: any = value;
      if (name === 'hourlyRate' || name === 'yearsOfExperience' || name === 'grade') {
        updatedValue = value === '' ? '' : Number(value);
      }
      
      return { ...prev, [name]: updatedValue };
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTogglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  const handleSaveProfile = async () => {
    if (!editableProfile) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.put('/api/users/profile', editableProfile);
      setProfile(editableProfile);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.put('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Password changed successfully!');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSubjectToggle = (subjectId: number) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
    
    setEditableProfile(prev => {
      if (!prev) return null;
      
      const updatedSubjects = prev.subjects ? [...prev.subjects] : [];
      const existingSubject = updatedSubjects.find(s => s.id === subjectId);
      
      if (existingSubject) {
        return {
          ...prev,
          subjects: updatedSubjects.filter(s => s.id !== subjectId)
        };
      } else {
        const subject = allSubjects.find(s => s.id === subjectId);
        if (subject) {
          return {
            ...prev,
            subjects: [...updatedSubjects, subject]
          };
        }
      }
      
      return prev;
    });
  };
  
  const handleAddExpertise = () => {
    if (!editableProfile) return;
    
    const newExpertiseItem = {
      id: Date.now(), // Temporary ID for new item
      ...newExpertise,
      verified: false
    };
    
    setEditableProfile(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        expertise: [...(prev.expertise || []), newExpertiseItem]
      };
    });
    
    // Reset form
    setNewExpertise({
      title: '',
      description: '',
      institution: '',
      yearObtained: new Date().getFullYear()
    });
  };
  
  const handleRemoveExpertise = (id: number) => {
    setEditableProfile(prev => {
      if (!prev || !prev.expertise) return prev;
      
      return {
        ...prev,
        expertise: prev.expertise.filter(exp => exp.id !== id)
      };
    });
  };
  
  const handleAddScheduleSlot = () => {
    if (!editableProfile) return;
    
    const newSlot = {
      id: Date.now(), // Temporary ID for new item
      dayOfWeek: newScheduleSlot.dayOfWeek,
      startTime: `${newScheduleSlot.startTime}:00`,
      endTime: `${newScheduleSlot.endTime}:00`,
      available: newScheduleSlot.available
    };
    
    setEditableProfile(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        schedule: [...(prev.schedule || []), newSlot]
      };
    });
    
    // Reset form
    setNewScheduleSlot({
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '10:00',
      available: true
    });
  };
  
  const handleRemoveScheduleSlot = (id: number) => {
    setEditableProfile(prev => {
      if (!prev || !prev.schedule) return prev;
      
      return {
        ...prev,
        schedule: prev.schedule.filter(slot => slot.id !== id)
      };
    });
  };
  
  const handleToggleSlotAvailability = (id: number) => {
    setEditableProfile(prev => {
      if (!prev || !prev.schedule) return prev;
      
      return {
        ...prev,
        schedule: prev.schedule.map(slot => 
          slot.id === id ? { ...slot, available: !slot.available } : slot
        )
      };
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-red-700">Failed to load profile. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    // If the time already has seconds (HH:MM:SS), convert to HH:MM
    if (timeString.split(':').length === 3) {
      return timeString.split(':').slice(0, 2).join(':');
    }
    
    return timeString;
  };
  
  const getDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your personal information and account settings</p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Change Password
            </button>
            {profile.role === 'TUTOR' && (
              <>
                <button
                  onClick={() => setActiveTab('subjects')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'subjects'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Subjects & Expertise
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'schedule'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Schedule
                </button>
              </>
            )}
          </nav>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditableProfile(profile);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="mb-4">
                        <img
                          src={profile.profilePictureUrl || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=640'}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-sm"
                        />
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-gray-600">{profile.email}</p>
                      <div className="mt-2 text-sm text-gray-500 px-2 py-1 bg-gray-200 rounded-full uppercase">
                        {profile.role}
                      </div>
                    </div>
                    
                    {profile.role === 'TUTOR' && profile.hourlyRate && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <span className="block text-gray-500 text-sm">Hourly Rate</span>
                          <span className="block text-2xl font-bold text-gray-900">${profile.hourlyRate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={editableProfile?.firstName || ''}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="text-gray-900">{profile.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={editableProfile?.lastName || ''}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="text-gray-900">{profile.lastName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-gray-900">{profile.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={editableProfile?.phone || ''}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="text-gray-900">{profile.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {profile.role === 'STUDENT' && (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
                              Education Level
                            </label>
                            {editMode ? (
                              <select
                                id="educationLevel"
                                name="educationLevel"
                                value={editableProfile?.educationLevel || ''}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              >
                                <option value="">Select Education Level</option>
                                <option value="Primary">Primary School</option>
                                <option value="Secondary">Secondary School</option>
                                <option value="HighSchool">High School</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Postgraduate">Postgraduate</option>
                                <option value="Other">Other</option>
                              </select>
                            ) : (
                              <div className="flex items-center">
                                <Graduation className="h-5 w-5 text-gray-400 mr-2" />
                                <p className="text-gray-900">{profile.educationLevel || 'Not specified'}</p>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                              Grade/Year
                            </label>
                            {editMode ? (
                              <input
                                type="number"
                                id="grade"
                                name="grade"
                                min="1"
                                max="12"
                                value={editableProfile?.grade || ''}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            ) : (
                              <p className="text-gray-900">{profile.grade || 'Not specified'}</p>
                            )}
                          </div>
                          
                          <div className="md:col-span-2">
                            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                              School/Institution
                            </label>
                            {editMode ? (
                              <input
                                type="text"
                                id="school"
                                name="school"
                                value={editableProfile?.school || ''}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            ) : (
                              <div className="flex items-center">
                                <Building className="h-5 w-5 text-gray-400 mr-2" />
                                <p className="text-gray-900">{profile.school || 'Not specified'}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {profile.role === 'TUTOR' && (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Professional Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                              Professional Title
                            </label>
                            {editMode ? (
                              <input
                                type="text"
                                id="title"
                                name="title"
                                value={editableProfile?.title || ''}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            ) : (
                              <p className="text-gray-900">{profile.title || 'Not specified'}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                              Hourly Rate ($)
                            </label>
                            {editMode ? (
                              <input
                                type="number"
                                id="hourlyRate"
                                name="hourlyRate"
                                min="0"
                                step="0.01"
                                value={editableProfile?.hourlyRate || ''}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            ) : (
                              <p className="text-gray-900">${profile.hourlyRate}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                              Years of Experience
                            </label>
                            {editMode ? (
                              <input
                                type="number"
                                id="yearsOfExperience"
                                name="yearsOfExperience"
                                min="0"
                                value={editableProfile?.yearsOfExperience || ''}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            ) : (
                              <p className="text-gray-900">{profile.yearsOfExperience}</p>
                            )}
                          </div>
                          
                          <div className="md:col-span-2">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                              Bio
                            </label>
                            {editMode ? (
                              <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                value={editableProfile?.bio || ''}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            ) : (
                              <p className="text-gray-900 whitespace-pre-line">{profile.bio || 'No bio provided.'}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
              
              <div className="max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleTogglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                      >
                        {showPassword.current ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleTogglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleTogglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      onClick={handleChangePassword}
                      disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating Password...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Password Requirements</h3>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc pl-5">
                    <li>At least 8 characters long</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character (e.g., !@#$%^&*)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Subjects & Expertise Tab */}
          {activeTab === 'subjects' && profile.role === 'TUTOR' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Subjects & Expertise</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Subjects
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditableProfile(profile);
                        setSelectedSubjects(profile.subjects?.map(s => s.id) || []);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Subjects You Teach</h3>
                    
                    {editMode ? (
                      <div>
                        <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto mb-4">
                          {allSubjects.map(subject => (
                            <div key={subject.id} className="flex items-center">
                              <input
                                id={`subject-${subject.id}`}
                                type="checkbox"
                                checked={selectedSubjects.includes(subject.id)}
                                onChange={() => handleSubjectToggle(subject.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`subject-${subject.id}`} className="ml-2 block text-sm text-gray-900">
                                {subject.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          Select all subjects you are qualified to teach. Students will be able to find you based on these subjects.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.subjects && profile.subjects.length > 0 ? (
                          profile.subjects.map(subject => (
                            <span
                              key={subject.id}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {subject.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No subjects added yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Education & Expertise</h3>
                    
                    {editMode ? (
                      <div>
                        <div className="space-y-4 mb-6">
                          {editableProfile?.expertise && editableProfile.expertise.length > 0 ? (
                            editableProfile.expertise.map(exp => (
                              <div key={exp.id} className="bg-gray-50 p-4 rounded-lg relative">
                                <button
                                  onClick={() => handleRemoveExpertise(exp.id)}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                  aria-label="Remove"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Title/Qualification
                                    </label>
                                    <p className="text-sm text-gray-900">{exp.title}</p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Institution
                                    </label>
                                    <p className="text-sm text-gray-900">{exp.institution}</p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Year Obtained
                                    </label>
                                    <p className="text-sm text-gray-900">{exp.yearObtained}</p>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Description
                                    </label>
                                    <p className="text-sm text-gray-900">{exp.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No expertise added yet.</p>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Add New Qualification</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expertise-title" className="block text-xs font-medium text-gray-700 mb-1">
                                Title/Qualification
                              </label>
                              <input
                                type="text"
                                id="expertise-title"
                                value={newExpertise.title}
                                onChange={(e) => setNewExpertise(prev => ({ ...prev, title: e.target.value }))}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., Master of Science in Mathematics"
                              />
                            </div>
                            <div>
                              <label htmlFor="expertise-institution" className="block text-xs font-medium text-gray-700 mb-1">
                                Institution
                              </label>
                              <input
                                type="text"
                                id="expertise-institution"
                                value={newExpertise.institution}
                                onChange={(e) => setNewExpertise(prev => ({ ...prev, institution: e.target.value }))}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., University of Michigan"
                              />
                            </div>
                            <div>
                              <label htmlFor="expertise-year" className="block text-xs font-medium text-gray-700 mb-1">
                                Year Obtained
                              </label>
                              <input
                                type="number"
                                id="expertise-year"
                                value={newExpertise.yearObtained}
                                onChange={(e) => setNewExpertise(prev => ({ ...prev, yearObtained: parseInt(e.target.value) || new Date().getFullYear() }))}
                                min="1950"
                                max={new Date().getFullYear()}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label htmlFor="expertise-description" className="block text-xs font-medium text-gray-700 mb-1">
                                Description (Optional)
                              </label>
                              <textarea
                                id="expertise-description"
                                value={newExpertise.description}
                                onChange={(e) => setNewExpertise(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Briefly describe your qualification..."
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <button
                              onClick={handleAddExpertise}
                              disabled={!newExpertise.title || !newExpertise.institution}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add Qualification
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {profile.expertise && profile.expertise.length > 0 ? (
                          profile.expertise.map(exp => (
                            <div key={exp.id} className="bg-gray-50 rounded-lg p-5">
                              <div className="flex items-start">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                                    {exp.verified && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm text-gray-600">{exp.institution}</p>
                                  <p className="mt-1 text-sm text-gray-500">{exp.yearObtained}</p>
                                  {exp.description && (
                                    <p className="mt-3 text-gray-700">{exp.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No expertise information provided.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Schedule Tab */}
          {activeTab === 'schedule' && profile.role === 'TUTOR' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Teaching Schedule</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Schedule
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditableProfile(profile);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Set Your Available Time Slots</h3>
                
                {editMode ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {editableProfile?.schedule && editableProfile.schedule.length > 0 ? (
                        ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
                          const daySlots = editableProfile.schedule?.filter(slot => slot.dayOfWeek === day) || [];
                          
                          if (daySlots.length === 0) {
                            return null;
                          }
                          
                          return (
                            <div key={day} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-base font-medium text-gray-900 mb-2">{getDayName(day)}</h4>
                              <div className="space-y-2">
                                {daySlots.map((slot) => (
                                  <div key={slot.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id={`slot-${slot.id}`}
                                        checked={slot.available}
                                        onChange={() => handleToggleSlotAvailability(slot.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <label htmlFor={`slot-${slot.id}`} className="ml-2 block text-sm text-gray-900">
                                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                      </label>
                                    </div>
                                    <button
                                      onClick={() => handleRemoveScheduleSlot(slot.id)}
                                      className="text-gray-400 hover:text-gray-600"
                                      aria-label="Remove"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="md:col-span-2 lg:col-span-3">
                          <p className="text-gray-500">No schedule slots added yet.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Add New Time Slot</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label htmlFor="dayOfWeek" className="block text-xs font-medium text-gray-700 mb-1">
                            Day
                          </label>
                          <select
                            id="dayOfWeek"
                            value={newScheduleSlot.dayOfWeek}
                            onChange={(e) => setNewScheduleSlot(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="MONDAY">Monday</option>
                            <option value="TUESDAY">Tuesday</option>
                            <option value="WEDNESDAY">Wednesday</option>
                            <option value="THURSDAY">Thursday</option>
                            <option value="FRIDAY">Friday</option>
                            <option value="SATURDAY">Saturday</option>
                            <option value="SUNDAY">Sunday</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="startTime" className="block text-xs font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            id="startTime"
                            value={newScheduleSlot.startTime}
                            onChange={(e) => setNewScheduleSlot(prev => ({ ...prev, startTime: e.target.value }))}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="endTime" className="block text-xs font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            id="endTime"
                            value={newScheduleSlot.endTime}
                            onChange={(e) => setNewScheduleSlot(prev => ({ ...prev, endTime: e.target.value }))}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={handleAddScheduleSlot}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Add Time Slot
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      These are the times when you are available for tutoring sessions. Students can book sessions during these time slots.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profile.schedule && profile.schedule.length > 0 ? (
                        ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
                          const daySlots = profile.schedule?.filter(slot => slot.dayOfWeek === day) || [];
                          
                          if (daySlots.length === 0) {
                            return null;
                          }
                          
                          return (
                            <div key={day} className="border border-gray-200 rounded-lg p-3">
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
                        })
                      ) : (
                        <div className="md:col-span-2 lg:col-span-3">
                          <p className="text-gray-500">No schedule information provided.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;