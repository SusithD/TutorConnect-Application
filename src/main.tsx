import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './index.css';
import axios from 'axios';

// Create mock API interceptor for screenshot purpose
axios.interceptors.request.use(
  config => {
    // Allow the request to pass through (but it will likely fail anyway)
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercept all axios responses to return mock data instead of errors
axios.interceptors.response.use(
  response => {
    // Pass through actual responses (if they work)
    return response;
  },
  error => {
    // Instead of rejecting with an error, return mock data
    console.log('API call failed, returning mock data');
    
    // Extract the URL to determine what data to mock
    const url = error.config.url;
    
    // Simple mock data based on the endpoint
    if (url.includes('/api/tutors') && !url.includes('/api/tutors/')) {
      return Promise.resolve({
        data: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Smith',
            title: 'Mathematics Specialist',
            bio: 'Experienced math tutor with a passion for making complex concepts simple.',
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
            bio: 'Passionate about literature and helping students improve their writing skills.',
            hourlyRate: 30,
            yearsOfExperience: 6,
            averageRating: 4.9,
            totalReviews: 42,
            profilePictureUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=640',
            subjects: [{ id: 3, name: 'English' }, { id: 4, name: 'Literature' }]
          }
        ]
      });
    }
    
    if (url.includes('/api/tutors/')) {
      return Promise.resolve({
        data: {
          id: 1,
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          title: 'Mathematics & Physics Tutor',
          bio: 'I am a passionate Mathematics and Physics tutor with over 8 years of teaching experience.',
          hourlyRate: 35,
          yearsOfExperience: 8,
          averageRating: 4.8,
          totalReviews: 56,
          profilePictureUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=640',
          subjects: [
            { id: 1, name: 'Mathematics' },
            { id: 2, name: 'Physics' }
          ],
          expertise: [
            {
              id: 1,
              title: 'MSc in Mathematics',
              institution: 'Stanford University',
              yearObtained: 2015,
              verified: true,
              description: 'Specialized in Applied Mathematics and Statistics'
            }
          ],
          availableTimeSlots: [
            {
              id: 1,
              dayOfWeek: 'MONDAY',
              startTime: '09:00',
              endTime: '12:00',
              available: true
            },
            {
              id: 2,
              dayOfWeek: 'WEDNESDAY',
              startTime: '14:00',
              endTime: '17:00',
              available: true
            }
          ],
          reviews: [
            {
              id: 1,
              student: { 
                id: 201, 
                firstName: 'Emma', 
                lastName: 'Davis' 
              },
              rating: 5,
              comment: 'Excellent tutor! Made complex concepts easy to understand.',
              createdAt: '2023-04-12T14:30:00.000Z'
            }
          ]
        }
      });
    }
    
    if (url.includes('/api/bookings')) {
      return Promise.resolve({
        data: [
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
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            status: 'CONFIRMED',
            notes: 'Will be focusing on calculus',
            meetingLink: 'https://meet.google.com/abc-defg-hij'
          }
        ]
      });
    }
    
    // Default mock data for any other endpoint
    return Promise.resolve({
      data: {}
    });
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);