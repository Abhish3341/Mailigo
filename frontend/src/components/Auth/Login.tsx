import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = React.useState<string>('');

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Get user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );

        // Debug: log the URL being hit
        console.log(
          'Sending user data to:',
          `${import.meta.env.VITE_API_BASE_URL}/auth/google`
        );

        // Send to our backend
        const backendResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
          userInfo.data
        );

        // Save token
        localStorage.setItem('auth_token', backendResponse.data.token);

        // Update auth context
        await login(backendResponse.data.user);
      } catch (error) {
        console.error('Login error:', error);
        setError('Failed to login. Please try again.');
      }
    },
    onError: () => {
      setError('Google login failed. Please try again.');
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/namestation-logo.svg" 
            alt="Namestation" 
            className="h-16 w-16 mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Mailigo
          </h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Log in with your Google account to access the platform
        </p>
        
        <button
          onClick={() => googleLogin()}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
