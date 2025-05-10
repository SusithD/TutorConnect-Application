import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Filter, Search, Star } from 'lucide-react';

interface Tutor {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  hourlyRate: number;
  yearsOfExperience: number;
  averageRating: number;
  totalReviews: number;
  profilePictureUrl: string;
  subjects: Subject[];
}

interface Subject {
  id: number;
  name: string;
}

const TutorListPage = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorsResponse, subjectsResponse] = await Promise.all([
          axios.get('/api/tutors'),
          axios.get('/api/subjects')
        ]);
        
        setTutors(tutorsResponse.data);
        setSubjects(subjectsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tutors. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const applyFilters = () => {
    setLoading(true);
    
    const params: any = {};
    if (searchQuery) params.query = searchQuery;
    if (selectedSubjects.length > 0) params.subjects = selectedSubjects.join(',');
    if (priceRange[0] > 0 || priceRange[1] < 200) {
      params.minPrice = priceRange[0];
      params.maxPrice = priceRange[1];
    }
    if (minRating > 0) params.minRating = minRating;
    if (sortBy) params.sortBy = sortBy;
    
    axios.get('/api/tutors', { params })
      .then(response => {
        setTutors(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to apply filters. Please try again.');
        setLoading(false);
      });
  };
  
  const handleSubjectToggle = (subjectId: number) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubjects([]);
    setPriceRange([0, 200]);
    setMinRating(0);
    setSortBy('rating');
    
    // Re-fetch all tutors
    setLoading(true);
    axios.get('/api/tutors')
      .then(response => {
        setTutors(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to reset filters. Please try again.');
        setLoading(false);
      });
  };
  
  // For demo purposes, using mock data if API calls aren't available
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && tutors.length === 0 && !loading) {
      const mockTutors = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Smith',
          title: 'Mathematics Specialist',
          bio: 'Experienced math tutor with a passion for making complex concepts simple and enjoyable.',
          hourlyRate: 35,
          yearsOfExperience: 8,
          averageRating: 4.8,
          totalReviews: 56,
          profilePictureUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=640',
          subjects: [{ id: 1, name: 'Mathematics' }, { id: 2, name: 'Statistics' }]
        },
        {
          id: 2,
          firstName: 'Sarah',
          lastName: 'Johnson',
          title: 'English Literature Teacher',
          bio: 'I help students develop critical thinking skills through engaging literary analysis.',
          hourlyRate: 30,
          yearsOfExperience: 6,
          averageRating: 4.9,
          totalReviews: 43,
          profilePictureUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=640',
          subjects: [{ id: 3, name: 'English' }, { id: 4, name: 'Literature' }]
        },
        {
          id: 3,
          firstName: 'Michael',
          lastName: 'Chen',
          title: 'Physics & Engineering Tutor',
          bio: 'PhD candidate with extensive tutoring experience in physics and engineering subjects.',
          hourlyRate: 45,
          yearsOfExperience: 4,
          averageRating: 4.7,
          totalReviews: 28,
          profilePictureUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=640',
          subjects: [{ id: 5, name: 'Physics' }, { id: 6, name: 'Engineering' }]
        },
        {
          id: 4,
          firstName: 'Emily',
          lastName: 'Parker',
          title: 'Biology & Chemistry Specialist',
          bio: 'Making science accessible and engaging for students of all levels.',
          hourlyRate: 40,
          yearsOfExperience: 7,
          averageRating: 4.6,
          totalReviews: 37,
          profilePictureUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=640',
          subjects: [{ id: 7, name: 'Biology' }, { id: 8, name: 'Chemistry' }]
        }
      ];
      
      const mockSubjects = [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Statistics' },
        { id: 3, name: 'English' },
        { id: 4, name: 'Literature' },
        { id: 5, name: 'Physics' },
        { id: 6, name: 'Engineering' },
        { id: 7, name: 'Biology' },
        { id: 8, name: 'Chemistry' },
        { id: 9, name: 'Computer Science' },
        { id: 10, name: 'History' }
      ];
      
      setTutors(mockTutors);
      setSubjects(mockSubjects);
    }
  }, [tutors, loading]);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Find a Tutor</h1>
        <p className="mt-2 text-gray-600">Connect with expert tutors in your subject of interest.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters for larger screens */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tutors..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 py-2 border"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Subjects</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {subjects.map(subject => (
                  <div key={subject.id} className="flex items-center">
                    <input
                      id={`subject-${subject.id}`}
                      name={`subject-${subject.id}`}
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={() => handleSubjectToggle(subject.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`subject-${subject.id}`} className="ml-2 text-sm text-gray-700">
                      {subject.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
                <span className="mx-2">to</span>
                <input
                  type="number"
                  min={priceRange[0]}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">{minRating}</span>
              </div>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${index < minRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-1 text-xs text-gray-500">& up</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              >
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={applyFilters}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
              >
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile filters button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="w-full flex justify-center items-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            <ChevronDown className={`h-5 w-5 ml-2 transform ${filtersVisible ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Mobile filters panel */}
          {filtersVisible && (
            <div className="mt-2 bg-white p-4 rounded-md shadow-md border border-gray-200">
              {/* Mobile filter content - simplified version of desktop filters */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tutors..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 border pl-3"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  onChange={(e) => setSelectedSubjects(e.target.value ? [parseInt(e.target.value)] : [])}
                  value={selectedSubjects[0] || ''}
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 mr-2"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 ml-2"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    applyFilters();
                    setFiltersVisible(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    resetFilters();
                    setFiltersVisible(false);
                  }}
                  className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Tutor listing */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
              <p>{error}</p>
            </div>
          ) : tutors.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700">
              <p>No tutors found matching your criteria. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {tutors.map(tutor => (
                <div key={tutor.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md">
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <img
                          src={tutor.profilePictureUrl || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=640'}
                          alt={`${tutor.firstName} ${tutor.lastName}`}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{tutor.firstName} {tutor.lastName}</h3>
                        <p className="text-sm text-gray-600">{tutor.title}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${
                                  index < Math.floor(tutor.averageRating)
                                    ? 'text-yellow-400 fill-current'
                                    : index < tutor.averageRating
                                    ? 'text-yellow-400 fill-current opacity-50'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-600">
                            {tutor.averageRating.toFixed(1)} ({tutor.totalReviews})
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">${tutor.hourlyRate}/hr</p>
                        <p className="text-sm text-gray-600">{tutor.yearsOfExperience} years exp.</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{tutor.bio}</p>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tutor.subjects.map(subject => (
                        <span
                          key={subject.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {subject.name}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-5 flex justify-end">
                      <Link
                        to={`/student/tutors/${tutor.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorListPage;