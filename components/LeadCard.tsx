import React from 'react';
import type { Lead, User } from '../types';
import LockIcon from './icons/LockIcon';
import UserIcon from './icons/UserIcon';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import BuildingIcon from './icons/BuildingIcon';
import AuthorityIcon from './icons/AuthorityIcon';
import NeedIcon from './icons/NeedIcon';
import TimeframeIcon from './icons/TimeframeIcon';
import FireIcon from './icons/FireIcon';


interface LeadCardProps {
  lead: Lead;
  onUnlock: (lead: Lead) => void;
  user: User | null;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onUnlock, user }) => {
  
  const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const isHotLead = (new Date().getTime() - lead.postedAt.getTime()) < (24 * 60 * 60 * 1000); // 24 hours in ms
  
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-blue-300 flex flex-col h-full">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-blue-600 bg-blue-100">
                  New Lead
              </span>
              {isHotLead && (
                <span className="flex items-center gap-1 text-xs font-semibold py-1 px-3 uppercase rounded-full text-red-600 bg-red-100 animate-pulse">
                    <FireIcon className="h-4 w-4" />
                    Hot Lead
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 flex-shrink-0 ml-2">{timeSince(lead.postedAt)}</div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 leading-tight">{lead.title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-grow h-12 overflow-hidden">{lead.description}</p>
        
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
           <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
              <div className="flex flex-col items-center p-1 bg-slate-50 rounded-md">
                  <AuthorityIcon className="h-5 w-5 mb-1 text-blue-500" />
                  <span className="font-semibold">{lead.authority}</span>
              </div>
              <div className="flex flex-col items-center p-1 bg-slate-50 rounded-md">
                  <NeedIcon className="h-5 w-5 mb-1 text-red-500" />
                  <span className="font-semibold">{lead.need}</span>
              </div>
               <div className="flex flex-col items-center p-1 bg-slate-50 rounded-md">
                  <TimeframeIcon className="h-5 w-5 mb-1 text-green-500" />
                  <span className="font-semibold">{lead.timeframe}</span>
              </div>
           </div>
            <div className="flex items-center justify-between text-slate-600 pt-2">
                <span className="text-sm font-medium">Budget:</span>
                <span className="text-xl font-bold text-green-600">₹{lead.budget.toLocaleString('en-IN')}</span>
            </div>
        </div>

        <div className="mt-auto pt-4">
          {lead.unlocked ? (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-fade-in bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 text-base">Contact Details:</h4>
               <div className="flex items-center space-x-3 text-sm text-slate-700">
                {lead.postedByImage ? (
                  <img src={lead.postedByImage} alt={lead.postedBy} className="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
                ) : (
                  <UserIcon className="h-9 w-9 text-blue-500" />
                )}
                <span className="font-medium">{lead.postedBy}</span>
              </div>
               <div className="flex items-center space-x-3 text-sm text-slate-700">
                <BuildingIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>{lead.companyName}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-700">
                <EmailIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <a href={`mailto:${lead.email}`} className="hover:underline truncate">{lead.email}</a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-700">
                <PhoneIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-slate-200 text-center">
              <div className="relative p-4 rounded-lg bg-slate-100 blur-sm select-none">
                   <div className="flex items-center space-x-3 text-sm text-slate-400">
                      <UserIcon /> <span>Contact Person Name</span>
                   </div>
                   <div className="flex items-center space-x-3 text-sm text-slate-400 mt-2">
                      <EmailIcon /> <span>**********@company.com</span>
                   </div>
              </div>
               {user?.role === 'vendor' ? (
                  <button 
                      onClick={() => onUnlock(lead)}
                      className="mt-[-2.5rem] relative w-full flex items-center justify-center bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                      <LockIcon className="h-5 w-5 mr-2" />
                      Unlock for ₹100
                  </button>
               ) : (
                  user?.role !== 'customer' && (
                     <button 
                      onClick={() => onUnlock(lead)}
                      className="mt-[-2.5rem] relative w-full flex items-center justify-center bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <LockIcon className="h-5 w-5 mr-2" />
                      Login to Unlock
                    </button>
                  )
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCard;