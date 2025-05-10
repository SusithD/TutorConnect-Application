import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Book, Edit, Plus, Search, Trash } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  description: string;
  tutorCount?: number;
  studentCount?: number;
}

const AdminSubjectsPage = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('/api/admin/subjects');
        setSubjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      }
    };
    
    fetchSubjects();
    
    // Mock data for development
    if (process.env.NODE_ENV === 'development') {
      const mockSubjects = [
        { id: 1, name: 'Mathematics', description: 'Algebra, Calculus, Geometry and more', tutorCount: 12, studentCount: 45 },
        { id: 2, name: 'Physics', description: 'Classical mechanics, thermodynamics, electromagnetism, and quantum mechanics', tutorCount: 8, studentCount: 32 },
        { id: 3, name: 'Chemistry', description: 'Organic, inorganic, and physical chemistry', tutorCount: 6, studentCount: 28 },
        { id: 4, name: 'Biology', description: 'Cellular biology, genetics, ecology, and evolution', tutorCount: 5, studentCount: 24 },
        { id: 5, name: 'English Literature', description: 'Fiction, poetry, drama, and literary analysis', tutorCount: 10, studentCount: 38 },
        { id: 6, name: 'History', description: 'World history, American history, European history', tutorCount: 7, studentCount: 27 },
        { id: 7, name: 'Computer Science', description: 'Programming, algorithms, data structures, and software design', tutorCount: 15, studentCount: 53 },
        { id: 8, name: 'Economics', description: 'Microeconomics, macroeconomics, and economic theory', tutorCount: 4, studentCount: 21 },
        { id: 9, name: 'Psychology', description: 'Clinical, cognitive, developmental, and social psychology', tutorCount: 3, studentCount: 19 },
        { id: 10, name: 'Spanish', description: 'Grammar, conversation, writing, and literature', tutorCount: 6, studentCount: 31 }
      ];
      
      setSubjects(mockSubjects);
      setLoading(false);
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSubject) {
        // Update existing subject
        await axios.put(`/api/admin/subjects/${editingSubject.id}`, formData);
        
        setSubjects(subjects.map(subject => 
          subject.id === editingSubject.id
            ? { ...subject, ...formData }
            : subject
        ));
      } else {
        // Create new subject
        const response = await axios.post('/api/admin/subjects', formData);
        
        setSubjects([...subjects, response.data]);
      }
      
      // Reset form
      setFormData({ name: '', description: '' });
      setEditingSubject(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };
  
  const handleEdit = (subject: Subject) => {
    setFormData({
      name: subject.name,
      description: subject.description
    });
    setEditingSubject(subject);
    setShowForm(true);
  };
  
  const handleDelete = async () => {
    if (!subjectToDelete) return;
    
    try {
      await axios.delete(`/api/admin/subjects/${subjectToDelete.id}`);
      
      setSubjects(subjects.filter(subject => subject.id !== subjectToDelete.id));
      setShowDeleteConfirm(false);
      setSubjectToDelete(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };
  
  // Add a safety check to ensure subjects is an array before filtering
  const filteredSubjects = Array.isArray(subjects) 
    ? subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Subjects</h1>
        <p className="mt-2 text-gray-600">Add, edit, or remove subjects that tutors can teach and students can learn.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Subject List */}
        <div className="lg:flex-1">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="sm:flex sm:justify-between sm:items-center">
                <div className="relative flex-1 max-w-xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <button
                    onClick={() => {
                      setFormData({ name: '', description: '' });
                      setEditingSubject(null);
                      setShowForm(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </button>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="p-6 text-center">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-900">No subjects found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Get started by adding a new subject'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutors
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubjects.map((subject) => (
                      <tr key={subject.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                              <Book className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-md truncate">
                            {subject.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{subject.tutorCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{subject.studentCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(subject)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSubjectToDelete(subject);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-4 w-4" />
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
        
        {/* Subject Form */}
        {showForm && (
          <div className="lg:w-96">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                </h2>
              </div>
              
              <div className="p-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Subject Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingSubject(null);
                          setFormData({ name: '', description: '' });
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {editingSubject ? 'Save Changes' : 'Add Subject'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Subject
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the subject "{subjectToDelete?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSubjectToDelete(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubjectsPage;