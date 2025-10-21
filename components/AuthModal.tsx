import React, { useState } from 'react';
import type { User } from '../types';
import UserIcon from './icons/UserIcon';
import EmailIcon from './icons/EmailIcon';
import LockIcon from './icons/LockIcon';
import BuildingIcon from './icons/BuildingIcon';
import PhoneIcon from './icons/PhoneIcon';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'customer' | 'vendor'>('vendor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'login') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      // Mock login logic
      const isAdmin = email.toLowerCase() === 'admin@bant.com';
      const mockUser: User = { 
        id: isAdmin ? 'admin1' : 'user1', 
        name: isAdmin ? 'Admin User' : 'John Doe', 
        email: email, 
        phone: '+919876543210',
        role: isAdmin ? 'admin' : 'vendor',
        status: 'active'
      };
      onAuthSuccess(mockUser);
    } else { // signup
      if (!name || !email || !password || !company || !phone) {
        setError('Please fill in all fields.');
        return;
      }
      // Mock signup logic
      const newUser: User = { id: `user-${Date.now()}`, name, email, phone, role, status: 'active' };
      onAuthSuccess(newUser);
    }
  };
  
  const tabBase = "w-1/2 py-3 text-center font-semibold text-sm focus:outline-none transition-colors duration-300";
  const tabActive = "text-blue-600 border-b-2 border-blue-600";
  const tabInactive = "text-slate-500 hover:text-slate-700";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex">
          <button onClick={() => setAuthMode('login')} className={`${tabBase} rounded-tl-lg ${authMode === 'login' ? tabActive : tabInactive}`}>Login</button>
          <button onClick={() => setAuthMode('signup')} className={`${tabBase} rounded-tr-lg ${authMode === 'signup' ? tabActive : tabInactive}`}>Sign Up</button>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-1">{authMode === 'login' ? 'Welcome Back!' : 'Create an Account'}</h2>
          <p className="text-slate-500 text-sm text-center mb-8">{authMode === 'login' ? 'Sign in to access your account.' : 'Get started by creating a new account.'}</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon className="h-5 w-5 text-slate-400"/></span>
                  <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><BuildingIcon className="h-5 w-5 text-slate-400"/></span>
                  <input type="text" placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </>
            )}
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><EmailIcon className="h-5 w-5 text-slate-400"/></span>
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {authMode === 'signup' && (
               <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><PhoneIcon className="h-5 w-5 text-slate-400"/></span>
                  <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            )}
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon className="h-5 w-5 text-slate-400"/></span>
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {authMode === 'signup' && (
              <div>
                <span className="text-sm font-medium text-slate-700 mb-2 block">I am a:</span>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => setRole('vendor')} className={`w-full py-2 text-sm rounded-md border ${role === 'vendor' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300'}`}>Vendor</button>
                  <button type="button" onClick={() => setRole('customer')} className={`w-full py-2 text-sm rounded-md border ${role === 'customer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300'}`}>Customer</button>
                </div>
              </div>
            )}
            
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
              {authMode === 'login' ? 'Login' : 'Sign Up'}
            </button>
            
            <p className="text-xs text-center text-slate-400 pt-2">
              By proceeding, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
