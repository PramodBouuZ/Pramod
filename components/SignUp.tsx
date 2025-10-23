import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import UserIcon from './icons/UserIcon';
import EmailIcon from './icons/EmailIcon';
import LockIcon from './icons/LockIcon';
import BuildingIcon from './icons/BuildingIcon';
import PhoneIcon from './icons/PhoneIcon';
import AuthorityIcon from './icons/AuthorityIcon';
import LocationIcon from './icons/LocationIcon';

interface SignUpProps {
  onAuthSuccess: (user: User) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onAuthSuccess }) => {
  const [role, setRole] = useState<'customer' | 'vendor'>('vendor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [designation, setDesignation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleFromQuery = params.get('role');
    if (roleFromQuery === 'customer' || roleFromQuery === 'vendor') {
      setRole(roleFromQuery);
    }
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return emailRegex.test(String(email).toLowerCase());
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !phone || !location) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (role === 'vendor' && (!companyName || !designation)) {
      setError('Please fill in all required fields for a vendor account.');
      return;
    }
    
    const newUser: User = { 
      id: `user-${Date.now()}`, 
      name, 
      email, 
      phone, 
      role, 
      status: 'active',
      location,
      companyName: role === 'vendor' ? companyName : undefined,
      designation: role === 'vendor' ? designation : undefined,
      isEmailVerified: false,
    };
    
    onAuthSuccess(newUser);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Create an Account</h2>
          <p className="text-slate-500 text-center mb-8">Join our platform to buy or sell B2B leads.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <span className="text-sm font-medium text-slate-700 mb-2 block">I am a:</span>
              <div className="flex space-x-2">
                <button type="button" onClick={() => setRole('vendor')} className={`w-full py-2 text-sm rounded-md border transition-colors ${role === 'vendor' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>Vendor</button>
                <button type="button" onClick={() => setRole('customer')} className={`w-full py-2 text-sm rounded-md border transition-colors ${role === 'customer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>Customer</button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5"><UserIcon className="h-5 w-5 text-slate-400"/></span>
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>
            
            {role === 'vendor' && (
              <>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5"><BuildingIcon className="h-5 w-5 text-slate-400"/></span>
                  <input type="text" placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full pl-12 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5"><AuthorityIcon className="h-5 w-5 text-slate-400"/></span>
                  <input type="text" placeholder="Your Designation" value={designation} onChange={e => setDesignation(e.target.value)} className="w-full pl-12 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                </div>
              </>
            )}
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5"><EmailIcon className="h-5 w-5 text-slate-400"/></span>
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5"><PhoneIcon className="h-5 w-5 text-slate-400"/></span>
              <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-12 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5"><LocationIcon className="h-5 w-5 text-slate-400"/></span>
              <input type="text" placeholder="Location (e.g., Mumbai)" value={location} onChange={e => setLocation(e.target.value)} className="w-full pl-12 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5"><LockIcon className="h-5 w-5 text-slate-400"/></span>
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg">
              Create Account
            </button>

            <p className="text-sm text-center text-slate-500 pt-3">
              Already have an account? <a href="/login" className="font-semibold text-blue-600 hover:underline">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;