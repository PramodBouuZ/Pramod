import React from 'react';

const BriefcaseIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.475-2.25 2.475h-10.5c-1.286 0-2.25-.938-2.25-2.25v-4.075M12 9.75v3.75m-3.75-3.75v3.75m7.5-3.75v3.75M3 13.5h18M3 5.25h18v6.75a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25z" />
    </svg>
);

export default BriefcaseIcon;
