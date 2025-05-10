import { Link } from 'react-router-dom';
import { BookOpen, Calendar, MessageSquare, Search, Star, Users } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Find The Perfect Tutor For Your Learning Journey
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Connect with expert tutors in any subject, schedule personalized sessions,
                and achieve your academic goals.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-gray-50 text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-8 py-3 bg-blue-700 border border-blue-400 text-white font-semibold rounded-md hover:bg-blue-800 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Online tutoring"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How TutorConnect Works</h2>
            <p className="mt-4 text-xl text-gray-600">Simple steps to start your learning journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Find a Tutor</h3>
              <p className="text-gray-600">
                Browse through our extensive list of qualified tutors. Filter by subject, price, and availability.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Book a Session</h3>
              <p className="text-gray-600">
                Schedule a session with your chosen tutor at a time that works for you.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Start Learning</h3>
              <p className="text-gray-600">
                Connect with your tutor online and get personalized help with your studies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popular Subjects</h2>
            <p className="mt-4 text-xl text-gray-600">Find expert tutors in a wide range of subjects</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Mathematics', 'Science', 'English', 'History',
              'Physics', 'Chemistry', 'Biology', 'Computer Science'
            ].map((subject) => (
              <Link
                key={subject}
                to={`/student/tutors?subject=${subject}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md border border-gray-100 text-center transition-all"
              >
                <h3 className="text-lg font-medium text-gray-900">{subject}</h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/student/tutors"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white rounded-md hover:bg-blue-50 font-medium"
            >
              View All Subjects
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Students Say</h2>
            <p className="mt-4 text-xl text-gray-600">Real success stories from our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                subject: 'Mathematics',
                quote: 'My math tutor helped me improve my grades from a C to an A. The personalized attention made all the difference.',
                image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=640'
              },
              {
                name: 'David Chen',
                subject: 'Physics',
                quote: 'I was struggling with physics concepts until I found my tutor on TutorConnect. Now I actually enjoy the subject!',
                image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=640'
              },
              {
                name: 'Emma Williams',
                subject: 'English Literature',
                quote: 'My tutor\'s guidance on essay writing transformed my approach to literature analysis. Highly recommend!',
                image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=640'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.subject} Student</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of students who are achieving their academic goals with the help of expert tutors.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-gray-50"
            >
              Sign Up as a Student
            </Link>
            <Link
              to="/become-a-tutor"
              className="px-8 py-3 bg-blue-700 border border-blue-400 text-white font-semibold rounded-md hover:bg-blue-800"
            >
              Become a Tutor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;