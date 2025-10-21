import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onNavigate: (view: 'home' | 'leads' | 'postEnquiry') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onLoginClick, onSignUpClick, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-9">
            <div className="flex items-center space-x-4 text-xs font-medium text-slate-600">
              <button onClick={onSignUpClick} className="hover:text-blue-600 transition-colors">
                Become a Vendor
              </button>
              <span className="text-slate-300">|</span>
              <button onClick={() => onNavigate('postEnquiry')} className="hover:text-blue-600 transition-colors">
                Post Enquiry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="text-3xl font-bold text-blue-600">BANT</span>
              <span className="text-3xl font-bold text-yellow-500">Confirm</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => onNavigate('leads')} className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Buy Leads
              </button>
            </nav>

            <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                      <div className="text-right">
                          <span className="text-sm font-medium text-slate-700">Welcome, {user.name}</span>
                      </div>
                      <button
                          onClick={onLogout}
                          className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
                      >
                          Logout
                      </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                      <button
                          onClick={onLoginClick}
                          className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-md"
                      >
                          Login
                      </button>
                      <button
                          onClick={onSignUpClick}
                          className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-md shadow-sm"
                      >
                          Sign Up
                      </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;