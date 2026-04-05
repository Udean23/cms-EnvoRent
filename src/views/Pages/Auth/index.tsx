import React, { useState, useEffect } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { useApiClient } from '@/core/helpers/ApiClient';
import { setToken, getToken } from '@/core/helpers/TokenHandle';
import { GoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';

const AuthForm: React.FC = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const apiClient = useApiClient();

  useEffect(() => {
    const checkExistingSession = async () => {
      if (getToken()) {
        try {
          const response = await apiClient.get('/me');
          const role = response.data.user.role;
          if (role === 'admin' || role === 'superadmin' || role === 'super admin') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/';
          }
        } catch (err) {
          // Ignored
        }
      }
    };
    checkExistingSession();
  }, [apiClient]);

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSignInSubmit = async () => {
    if (!signInData.email || !signInData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/login', {
        email: signInData.email,
        password: signInData.password,
      });

      if (response.data.access_token) {
        setToken(response.data.access_token);
        setSuccessMessage('Login successful!');

        setTimeout(() => {
          if (response.data.user.role === 'admin') {
            window.location.href = '/dashboard';
          } else if (response.data.user.role === 'superadmin') {
            window.location.href = '/dashboard';
          } else if (response.data.user.role === 'customer') {
            window.location.href = '/';
          }
        }, 1000);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have successfully logged in!',
          timer: 1500,
          showConfirmButton: false,
        });

      }
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        setError(errorMessages);
      } else if (err.response?.status === 401) {
        setError(err.response?.data?.message || 'Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async () => {
    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/register', {
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        role: 'customer'
      });

      setSuccessMessage('Registration successful! Please sign in.');

      setTimeout(() => {
        setIsSignUpMode(false);
        setSignUpData({ name: '', email: '', password: '' });
        setSuccessMessage(null);
      }, 2000);

      Swal.fire({
        icon: 'success',
        title: 'Register Successful',
        text: 'You have successfully registered!',
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/google/callback', {
        token: credentialResponse.credential
      });
      
      if (res.data.access_token) {
        setToken(res.data.access_token);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have logged in with Google!',
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          const role = res.data.user.role;
          if (role === 'admin' || role === 'superadmin') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/';
          }
        }, 1000);
      }
    } catch (err) {
      Swal.fire('Error', 'Google login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-white min-h-screen overflow-hidden">
      <div
        className={`absolute h-[2000px] w-[2000px] -top-[10%] bg-gradient-to-br from-green-500 to-green-400 transition-all duration-[1.8s] ease-in-out rounded-full transform -translate-y-1/2 z-[1] pointer-events-none
          ${isSignUpMode ? 'translate-x-full right-[52%]' : 'right-[48%]'}
        `}
      />

      <div className="absolute w-full h-full top-0 left-0 z-20 pointer-events-none">
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 w-1/2 transition-all duration-1000 delay-700 ease-in-out grid grid-cols-1 ${isSignUpMode ? 'left-1/4 -translate-x-1/2' : 'left-3/4 -translate-x-1/2'
            }`}
        >
          {/* Sign In Form */}
          <div
            className={`flex items-center shadow-2xl bg-white border border-gray-200 rounded-xl max-w-150 ml-20 p-5 justify-center flex-col px-20 transition-all duration-200 delay-700 overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 ${isSignUpMode ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
              }`}
          >
            <h2 className="text-4xl text-gray-700 mb-3 font-semibold">Sign in</h2>

            {error && !isSignUpMode && (
              <div className="w-full max-w-[380px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            {successMessage && !isSignUpMode && (
              <div className="w-full max-w-[380px] bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-3 text-sm">
                {successMessage}
              </div>
            )}

            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <Mail className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                disabled={loading}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <Lock className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSignInSubmit()}
                disabled={loading}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSignInSubmit}
              disabled={loading}
              className="w-36 bg-green-500 border-none outline-none h-12 rounded-full text-white uppercase font-semibold my-3 cursor-pointer transition-all duration-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
            <div className="mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => Swal.fire('Error', 'Google Login failed', 'error')}
                useOneTap
                theme="filled_blue"
                shape="circle"
              />
            </div>
          </div>

          {/* Sign Up Form */}
          <div
            className={`flex items-center justify-center shadow-2xl bg-white border border-gray-200 rounded-xl max-w-150 p-5 ml-20 flex-col px-20 transition-all duration-200 delay-700 overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 ${isSignUpMode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
          >
            <h2 className="text-4xl text-gray-700 mb-3 font-semibold">Sign up</h2>

            {error && isSignUpMode && (
              <div className="w-full max-w-[380px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            {successMessage && isSignUpMode && (
              <div className="w-full max-w-[380px] bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-3 text-sm">
                {successMessage}
              </div>
            )}

            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <User className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input
                type="text"
                placeholder="Name"
                value={signUpData.name}
                onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                disabled={loading}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <Mail className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                disabled={loading}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <Lock className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSignUpSubmit()}
                disabled={loading}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSignUpSubmit}
              disabled={loading}
              className="w-36 bg-green-500 border-none outline-none h-12 rounded-full text-white uppercase font-semibold my-3 cursor-pointer transition-all duration-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Sign up'}
            </button>
            <div className="mt-4">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => Swal.fire('Error', 'Google Login failed', 'error')}
                    theme="filled_blue"
                    shape="circle"
                />
            </div>
          </div>
        </div>
      </div>

      {/* Panels - z-index: 10 */}
      <div className="absolute h-full w-full top-0 left-0 grid grid-cols-2 z-10">
        <div className="flex flex-col items-end justify-around text-center py-12 pr-[17%] pl-[12%] pointer-events-none">
          <div
            className={`text-white transition-transform duration-900 delay-600 ease-in-out pointer-events-auto ${isSignUpMode ? '-translate-x-[800px]' : 'translate-x-0'
              }`}
          >
            <h3 className="font-bold leading-none text-4xl mb-4">New here?</h3>
            <p className="text-sm font-semibold py-3 mb-6">
              Join us today and discover amazing features that will transform your experience!
            </p>
            <button
              onClick={handleSignUpClick}
              className="bg-transparent border-2 border-white w-32 h-10 font-semibold text-sm text-white rounded-full transition-all duration-300 hover:bg-white hover:text-green-500 cursor-pointer"
            >
              Sign up
            </button>
          </div>
          <div
            className={`w-full transition-transform duration-1100 delay-400 ease-in-out pointer-events-none ${isSignUpMode ? '-translate-x-[800px]' : 'translate-x-0'
              }`}
          >
            <div className="w-120 h-120 mx-auto flex items-center justify-center">
              <img src="/public/img/Auth/log.svg" alt="Login illustration" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-around text-center py-12 pl-[17%] pr-[12%] pointer-events-none">
          <div
            className={`text-white transition-transform duration-900 delay-600 ease-in-out pointer-events-auto ${isSignUpMode ? 'translate-x-0' : 'translate-x-[800px]'
              }`}
          >
            <h3 className="font-bold leading-none text-4xl mb-4">One of us?</h3>
            <p className="text-sm font-semibold py-3 mb-6">
              Welcome back! Sign in to access your account and continue your journey with us.
            </p>
            <button
              onClick={handleSignInClick}
              className="bg-transparent border-2 border-white w-32 h-10 font-semibold text-sm text-white rounded-full transition-all duration-300 hover:bg-white hover:text-blue-500 cursor-pointer"
            >
              Sign in
            </button>
          </div>
          <div
            className={`w-full transition-transform duration-1100 delay-400 ease-in-out pointer-events-none ${isSignUpMode ? 'translate-x-0' : 'translate-x-[800px]'
              }`}
          >
            <div className="w-120 h-120 mx-auto flex items-center justify-center">
              <img src="/public/img/Auth/register.svg" alt="Register illustration" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;