import React, { useState } from 'react';
import type { User } from '../types';
import EmailIcon from './icons/EmailIcon';
import LockIcon from './icons/LockIcon';

interface LoginScreenProps {
  onAuthSuccess: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return emailRegex.test(String(email).toLowerCase());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const loginAttemptUser: User = {
      id: 'login-attempt',
      name: 'Login',
      email: email,
      phone: '',
      role: 'vendor', // This is a placeholder; role is determined in App.tsx
      status: 'active',
      location: '',
      isEmailVerified: false,
    };
    onAuthSuccess(loginAttemptUser);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Welcome Back!</h2>
          <p className="text-slate-500 text-center mb-8">Sign in to access your account and leads.</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5"><EmailIcon className="h-5 w-5 text-slate-400"/></span>
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5"><LockIcon className="h-5 w-5 text-slate-400"/></span>
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg">
              Login
            </button>
            
            <p className="text-sm text-center text-slate-500 pt-4">
              Don't have an account? <a href="/signup" className="font-semibold text-blue-600 hover:underline">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;