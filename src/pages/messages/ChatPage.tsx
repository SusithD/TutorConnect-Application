import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Airplay as PaperAirplane, User } from 'lucide-react';
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
}

interface Message {
  id: number;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
  };
  content: string;
  sentAt: string;
  read: boolean;
}

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        const response = await axios.get(`/api/messages/chatrooms/${id}`);
        setChatRoom(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load chat room. Please try again later.');
        setLoading(false);
      }
    };
    
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/chatrooms/${id}/messages`);
        setMessages(response.data);
        // Mark messages as read
        axios.post(`/api/messages/chatrooms/${id}/read`);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    
    fetchChatRoom();
    fetchMessages();
    
    // For demo purposes - mock data
    if (process.env.NODE_ENV === 'development') {
      const mockChatRoom = {
        id: parseInt(id || '1'),
        student: { id: 201, firstName: 'Emma', lastName: 'Davis' },
        tutor: { 
          id: 101, 
          firstName: 'John', 
          lastName: 'Smith',
          profilePictureUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=640'
        },
        lastMessageAt: new Date().toISOString()
      };
      
      const mockMessages = [
        {
          id: 1,
          sender: { id: 201, firstName: 'Emma', lastName: 'Davis' },
          content: 'Hello! I\'m interested in booking a session for calculus help.',
          sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago
          read: true
        },
        {
          id: 2,
          sender: { id: 101, firstName: 'John', lastName: 'Smith' },
          content: 'Hi Emma! I\'d be happy to help you with calculus. What specific topics are you struggling with?',
          sentAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(), // 47 hours ago
          read: true
        },
        {
          id: 3,
          sender: { id: 201, firstName: 'Emma', lastName: 'Davis' },
          content: 'I\'m having trouble with derivatives and integrals. I have an exam coming up next week.',
          sentAt: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(), // 46 hours ago
          read: true
        },
        {
          id: 4,
          sender: { id: 101, firstName: 'John', lastName: 'Smith' },
          content: 'No problem, I can definitely help you prepare for your exam. How about we schedule a session for 2 hours?',
          sentAt: new Date(Date.now() - 45 * 60 * 60 * 1000).toISOString(), // 45 hours ago
          read: true
        },
        {
          id: 5,
          sender: { id: 201, firstName: 'Emma', lastName: 'Davis' },
          content: 'That sounds great! When are you available?',
          sentAt: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(), // 44 hours ago
          read: true
        },
        {
          id: 6,
          sender: { id: 101, firstName: 'John', lastName: 'Smith' },
          content: 'I\'m available this Thursday from 4-6pm or Friday from 3-5pm. Would either of those work for you?',
          sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
          read: true
        },
        {
          id: 7,
          sender: { id: 201, firstName: 'Emma', lastName: 'Davis' },
          content: 'Thursday from 4-6pm works perfectly for me!',
          sentAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), // 23 hours ago
          read: true
        },
        {
          id: 8,
          sender: { id: 101, firstName: 'John', lastName: 'Smith' },
          content: 'Perfect! I\'ll book the session for Thursday. Could you let me know which specific calculus problems you\'re struggling with so I can prepare?',
          sentAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22 hours ago
          read: true
        },
        {
          id: 9,
          sender: { id: 201, firstName: 'Emma', lastName: 'Davis' },
          content: 'Sure! I\'m particularly confused about implicit differentiation and integration by parts. I\'ll send you a couple of example problems.',
          sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          read: false
        }
      ];
      
      setChatRoom(mockChatRoom);
      setMessages(mockMessages);
      setLoading(false);
    }
    
    // Set up polling for new messages
    const intervalId = setInterval(fetchMessages, 10000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [id]);
  
  useEffect(() => {
    // Scroll to bottom when messages update
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    try {
      const response = await axios.post(`/api/messages/chatrooms/${id}/messages`, {
        content: newMessage.trim()
      });
      
      setMessages([...messages, response.data]);
      setNewMessage('');
      
      // For demo purposes
      if (process.env.NODE_ENV === 'development') {
        const mockMessage = {
          id: messages.length + 1,
          sender: { id: user?.id || 0, firstName: user?.firstName || '', lastName: user?.lastName || '' },
          content: newMessage.trim(),
          sentAt: new Date().toISOString(),
          read: false
        };
        
        setMessages([...messages, mockMessage]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };
  
  const getOtherPerson = () => {
    if (!chatRoom || !user) return null;
    
    return user.role === 'STUDENT' ? chatRoom.tutor : chatRoom.student;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !chatRoom) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-red-700">{error || 'Error loading chat room.'}</p>
          </div>
        </div>
      </div>
    );
  }
  
  const otherPerson = getOtherPerson();
  
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-220px)] flex flex-col">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={() => navigate('/messages')}
          className="mr-3 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        {user?.role === 'STUDENT' ? (
          <>
            <img
              src={chatRoom.tutor.profilePictureUrl || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=640'}
              alt={`${chatRoom.tutor.firstName} ${chatRoom.tutor.lastName}`}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <h2 className="text-base font-medium text-gray-900">
                {chatRoom.tutor.firstName} {chatRoom.tutor.lastName}
              </h2>
              <p className="text-sm text-gray-500">Tutor</p>
            </div>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <User className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h2 className="text-base font-medium text-gray-900">
                {chatRoom.student.firstName} {chatRoom.student.lastName}
              </h2>
              <p className="text-sm text-gray-500">Student</p>
            </div>
          </>
        )}
        
        {user?.role === 'STUDENT' && (
          <Link
            to={`/student/tutors/${chatRoom.tutor.id}`}
            className="ml-auto text-sm text-blue-600 hover:text-blue-500"
          >
            View Profile
          </Link>
        )}
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.sender.id === user?.id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                    isCurrentUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatDistanceToNow(new Date(message.sentAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-r-md ${
              !newMessage.trim() || sending
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <PaperAirplane className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;