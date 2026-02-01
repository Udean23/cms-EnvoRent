import React, { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signInData, setSignInData] = useState({ username: '', password: '' });
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const handleSignInSubmit = () => {
    console.log('Sign in submitted:', signInData);
  };

  const handleSignUpSubmit = () => {
    console.log('Sign up submitted:', signUpData);
  };

  return (
    <div className="relative w-full bg-white min-h-screen overflow-hidden">
      <div 
        className={`absolute h-[2000px] w-[2000px] -top-[10%] bg-gradient-to-br from-blue-500 to-cyan-400 transition-all duration-[1.8s] ease-in-out rounded-full transform -translate-y-1/2
          ${isSignUpMode ? 'translate-x-full right-[52%] z-20' : 'right-[48%] z-20'}
        `}
      />
      <div className="absolute w-full h-full top-0 left-0">
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 w-1/2 transition-all duration-1000 delay-700 ease-in-out grid grid-cols-1 z-10 ${
            isSignUpMode ? 'left-1/4 -translate-x-1/2' : 'left-3/4 -translate-x-1/2'
          }`}
        >
          <div 
            className={`flex items-center shadow-2xl border border-gray-200 rounded-xl max-w-150 ml-20 p-5 justify-center flex-col px-20 transition-all duration-200 delay-700 overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 ${
              isSignUpMode ? 'opacity-0 z-10' : 'opacity-100 z-20'
            }`}
          >
            <h2 className="text-4xl text-gray-700 mb-3 font-semibold">Sign in</h2>
            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <User className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input 
                type="text" 
                placeholder="Username"
                value={signInData.username}
                onChange={(e) => setSignInData({...signInData, username: e.target.value})}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <Lock className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                value={signInData.password}
                onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <button 
              onClick={handleSignInSubmit}
              className="w-36 bg-blue-500 border-none outline-none h-12 rounded-full text-white uppercase font-semibold my-3 cursor-pointer transition-all duration-500 hover:bg-blue-600"
            >
              Login
            </button>
          </div>
          <div 
            className={`flex items-center justify-center shadow-2xl border border-gray-200 rounded-xl max-w-150 p-5 ml-20 flex-col px-20 transition-all duration-200 delay-700 overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 ${
              isSignUpMode ? 'opacity-100 z-20' : 'opacity-0 z-10'
            }`}
          >
            <h2 className="text-4xl text-gray-700 mb-3 font-semibold">Sign up</h2>
            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <User className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input 
                type="text" 
                placeholder="Username"
                value={signUpData.username}
                onChange={(e) => setSignUpData({...signUpData, username: e.target.value})}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <Mail className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input 
                type="email" 
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="max-w-[380px] w-full bg-gray-100 my-3 h-14 rounded-full grid grid-cols-[15%_85%] px-2 relative">
              <Lock className="text-center leading-[55px] text-gray-400 transition-all duration-500 text-lg m-auto" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                className="bg-transparent outline-none border-none leading-none font-semibold text-lg text-gray-800 placeholder-gray-400"
              />
            </div>
            <button 
              onClick={handleSignUpSubmit}
              className="w-36 bg-blue-500 border-none outline-none h-12 rounded-full text-white uppercase font-semibold my-3 cursor-pointer transition-all duration-500 hover:bg-blue-600"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
      <div className="absolute h-full w-full top-0 left-0 grid grid-cols-2 z-30">
        <div className="flex flex-col items-end justify-around text-center z-20 py-12 pr-[17%] pl-[12%] pointer-events-auto">
          <div 
            className={`text-white transition-transform duration-900 delay-600 ease-in-out ${
              isSignUpMode ? '-translate-x-[800px]' : 'translate-x-0'
            }`}
          >
            <h3 className="font-bold leading-none text-4xl mb-4">New here?</h3>
            <p className="text-sm font-semibold py-3 mb-6">
              Join us today and discover amazing features that will transform your experience!
            </p>
            <button
              onClick={handleSignUpClick}
              className="bg-transparent border-2 border-white w-32 h-10 font-semibold text-sm text-white rounded-full transition-all duration-300 hover:bg-white hover:text-blue-500 cursor-pointer"
            >
              Sign up
            </button>
          </div>
          <div 
            className={`w-full transition-transform duration-1100 delay-400 ease-in-out ${
              isSignUpMode ? '-translate-x-[800px]' : 'translate-x-0'
            }`}
          >
            <div className="w-120 h-120 mx-auto flex items-center justify-center">
              <img src="/public/img/Auth/log.svg" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-around text-center z-20 py-12 pl-[17%] pr-[12%] pointer-events-auto">
          <div 
            className={`text-white transition-transform duration-900 delay-600 ease-in-out ${
              isSignUpMode ? 'translate-x-0' : 'translate-x-[800px]'
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
            className={`w-full transition-transform duration-1100 delay-400 ease-in-out ${
              isSignUpMode ? 'translate-x-0' : 'translate-x-[800px]'
            }`}
          >
            <div className="w-120 h-120 mx-auto flex items-center justify-center">
                <img src="/public/img/Auth/register.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;