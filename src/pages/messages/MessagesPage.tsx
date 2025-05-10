import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Search, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatRoom {
  id: number;
  student: {
    id: number;
    firstName: string;
    lastName: string;
  };
  tutor: {
    id: number;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
  };
  lastMessageAt: string;
  lastMessage?: string;
  unreadCount: number;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('/api/messages/chatrooms');
        setChatRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat rooms', error);
        setLoading(false);
      }
    };
    
    fetchChatRooms();
    
    // Mock data for development
    if (process.env.NODE_ENV === 'development') {
      const mockChatRooms = [
        {
          id: 1,
          student: { id: 201, firstName: 'Emma', lastName: 'Davis' },
          tutor: { 
            id: 101, 
            firstName: 'John', 
            lastName: 'Smith',
            profilePictureUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=640'
          },
          lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          lastMessage: 'Will we be covering quadratic equations in our next session?',
          unreadCount: user?.role === 'TUTOR' ? 1 : 0
        },
        {
          id: 2,
          student: { id: 202, firstName: 'Alex', lastName: 'Wilson' },
          tutor: { 
            id: 102, 
            firstName: 'Michael', 
            lastName: 'Chen',
            profilePictureUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=640'
          },
          lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          lastMessage: 'Thanks for the homework help! I\'m ready for our next session.',
          unreadCount: 0
        },
        {
          id: 3,
          student: { id: 203, firstName: 'Rebecca', lastName: 'Taylor' },
          tutor: { 
            id: 103, 
            firstName: 'Sarah', 
            lastName: 'Johnson',
            profilePictureUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=640'
          },
          lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          lastMessage: 'I\'ve shared my essay draft. Could you review it before our next session?',
          unreadCount: user?.role === 'TUTOR' ? 2 : 0
        }
      ];
      
      setChatRooms(mockChatRooms);
      setLoading(false);
    }
  }, [user]);
  
  const filteredChatRooms = chatRooms.filter(chatRoom => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const otherPerson = user?.role === 'STUDENT'
      ? `${chatRoom.tutor.firstName} ${chatRoom.tutor.lastName}`
      : `${chatRoom.student.firstName} ${chatRoom.student.lastName}`;
    
    return otherPerson.toLowerCase().includes(query);
  });
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-600">Connect with your {user?.role === 'STUDENT' ? 'tutors' : 'students'}</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${user?.role === 'STUDENT' ? 'tutors' : 'students'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {filteredChatRooms.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-500">
                {searchQuery
                  ? 'No conversations match your search'
                  : user?.role === 'STUDENT'
                  ? 'Start a conversation with a tutor to get help with your studies'
                  : 'Messages from your students will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredChatRooms.map((chatRoom) => {
                const otherPerson = user?.role === 'STUDENT'
                  ? chatRoom.tutor
                  : chatRoom.student;
                
                return (
                  <Link
                    key={chatRoom.id}
                    to={`/messages/chat/${chatRoom.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-6 py-4 flex items-center">
                      {user?.role === 'STUDENT' ? (
                        <img
                          src={chatRoom.tutor.profilePictureUrl || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=640'}
                          alt={`${otherPerson.firstName} ${otherPerson.lastName}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <User className="h-6 w-6" />
                        </div>
                      )}
                      
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {otherPerson.firstName} {otherPerson.lastName}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(chatRoom.lastMessageAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-sm ${chatRoom.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'} truncate`}>
                          {chatRoom.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                      
                      {chatRoom.unreadCount > 0 && (
                        <span className="ml-3 inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          {chatRoom.unreadCount}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;