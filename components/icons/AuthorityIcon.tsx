import React from 'react';

const AuthorityIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-1.148 0-2.25.33-3.218.905a.75.75 0 00-.373 1.033 6 6 0 009.182 0 .75.75 0 00-.373-1.033A7.46 7.46 0 0012 12.75z" />
  </svg>
);

export default AuthorityIcon;
