import React from 'react';

const FireIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0110.303 9.75H9.75a.75.75 0 000 1.5h.553a9.75 9.75 0 01-3.355 6.914.75.75 0 101.06 1.06 8.25 8.25 0 003.181-5.912h.412a.75.75 0 000-1.5h-.412a8.25 8.25 0 00-1.12-3.447 9.75 9.75 0 015.42 5.565.75.75 0 101.352-.672A8.25 8.25 0 0013.7 9.75h.553a.75.75 0 000-1.5h-.553a8.25 8.25 0 00-1.78-5.014.75.75 0 00-.91-.05z" clipRule="evenodd" />
  </svg>
);

export default FireIcon;