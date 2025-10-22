import React, { useState } from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNavClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-9">
            <div className="flex items-center space-x-4 text-xs font-medium text-slate-600">
              <a href="#/signup?role=vendor" className="hover:text-blue-600 transition-colors">
                Become a Vendor
              </a>
              <span className="text-slate-300">|</span>
              <a href="#/postEnquiry" className="hover:text-blue-600 transition-colors">
                Post Enquiry
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#/" className="flex items-center cursor-pointer">
              <span className="text-3xl font-bold text-blue-600">BANT</span>
              <span className="text-3xl font-bold text-yellow-500">Confirm</span>
            </a>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#/leads" className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Buy Leads
              </a>
              <a href="#/about" className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">
                About Us
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
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
                      <a
                          href="#/login"
                          className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-md"
                      >
                          Login
                      </a>
                      <a
                          href="#/signup"
                          className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-md shadow-sm"
                      >
                          Sign Up
                      </a>
                  </div>
                )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-slate-600 hover:text-blue-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>

       {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100/95 backdrop-blur-sm md:hidden" onClick={handleMobileNavClose}>
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white shadow-xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <a href="#/" onClick={handleMobileNavClose} className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">BANT</span>
                <span className="text-2xl font-bold text-yellow-500">Confirm</span>
              </a>
              <button
                onClick={handleMobileNavClose}
                className="text-slate-500 hover:text-slate-800 p-2 rounded-md -mr-2"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              <a href="#/leads" onClick={handleMobileNavClose} className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors text-left">
                Buy Leads
              </a>
              <a href="#/postEnquiry" onClick={handleMobileNavClose} className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors text-left">
                Post Enquiry
              </a>
               <a href="#/about" onClick={handleMobileNavClose} className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors text-left">
                About Us
              </a>
              <a href="#/signup?role=vendor" onClick={handleMobileNavClose} className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors text-left">
                Become a Vendor
              </a>
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-200">
              {user ? (
                <div>
                  <p className="text-slate-600">Welcome, {user.name}</p>
                  <button
                    onClick={() => { onLogout(); handleMobileNavClose(); }}
                    className="mt-4 w-full text-center font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <a
                    href="#/login"
                    onClick={handleMobileNavClose}
                    className="block w-full text-center font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-300 transition-colors px-4 py-2 rounded-md"
                  >
                    Login
                  </a>
                  <a
                    href="#/signup"
                    onClick={handleMobileNavClose}
                    className="block w-full text-center font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-md shadow-sm"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
