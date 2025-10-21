import React, { useState } from 'react';
import type { Lead, User } from '../types';
import LeadCard from './LeadCard';
import FilterIcon from './icons/FilterIcon';

interface LeadBoardProps {
  leads: Lead[];
  onUnlockLead: (lead: Lead) => void;
  searchTerm: string;
  minBudget: string;
  maxBudget: string;
  statusFilter: 'all' | 'locked' | 'unlocked';
  startDate: string;
  endDate: string;
  sortBy: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (status: 'all' | 'locked' | 'unlocked') => void;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClearFilters: () => void;
  user: User | null;
}

const LeadBoard: React.FC<LeadBoardProps> = ({ 
  leads, 
  onUnlockLead,
  searchTerm,
  minBudget,
  maxBudget,
  statusFilter,
  startDate,
  endDate,
  sortBy,
  onSearchChange,
  onMinBudgetChange,
  onMaxBudgetChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onSortChange,
  onClearFilters,
  user
 }) => {

  const [showFilters, setShowFilters] = useState(false);
  const statusButtonBase = "w-full text-center px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200";
  const statusButtonActive = "bg-blue-600 text-white shadow";
  const statusButtonInactive = "bg-transparent text-slate-600 hover:bg-slate-100";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mt-8 mb-6">
        <div>
          <label htmlFor="sort-by" className="sr-only">Sort by</label>
          <select 
            id="sort-by"
            value={sortBy}
            onChange={onSortChange}
            className="bg-white border border-slate-300 text-slate-700 font-medium py-2 pl-3 pr-8 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="budget-desc">Budget: High to Low</option>
            <option value="budget-asc">Budget: Low to High</option>
          </select>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition duration-300"
          aria-expanded={showFilters}
        >
          <FilterIcon className="h-5 w-5 text-slate-500" />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {showFilters && (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-slate-200 space-y-4">
          {/* Row 1: Search and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">Search by Title or Company</label>
              <input 
                type="text" 
                id="search"
                placeholder="e.g., 'Mobile App'" 
                value={searchTerm}
                onChange={onSearchChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
              />
            </div>
            <div>
              <label htmlFor="min-budget" className="block text-sm font-medium text-slate-700 mb-1">Min Budget (₹)</label>
              <input 
                type="number"
                id="min-budget" 
                placeholder="e.g., 100000"
                value={minBudget}
                onChange={onMinBudgetChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
              />
            </div>
            <div>
              <label htmlFor="max-budget" className="block text-sm font-medium text-slate-700 mb-1">Max Budget (₹)</label>
              <input 
                type="number"
                id="max-budget" 
                placeholder="e.g., 800000"
                value={maxBudget}
                onChange={onMaxBudgetChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
              />
            </div>
          </div>
          
          {/* Row 2: Status, Date, and Clear */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slate-300">
                  <button onClick={() => onStatusChange('all')} className={`${statusButtonBase} ${statusFilter === 'all' ? statusButtonActive : statusButtonInactive}`}>All</button>
                  <button onClick={() => onStatusChange('unlocked')} className={`${statusButtonBase} ${statusFilter === 'unlocked' ? statusButtonActive : statusButtonInactive}`}>Unlocked</button>
                  <button onClick={() => onStatusChange('locked')} className={`${statusButtonBase} ${statusFilter === 'locked' ? statusButtonActive : statusButtonInactive}`}>Locked</button>
                </div>
              </div>
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                <input 
                  type="date"
                  id="start-date" 
                  value={startDate}
                  onChange={onStartDateChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                <input 
                  type="date"
                  id="end-date" 
                  value={endDate}
                  onChange={onEndDateChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                />
              </div>
              <button 
                onClick={onClearFilters}
                className="bg-white border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 transition duration-300 h-10"
              >
                Clear All Filters
              </button>
          </div>
        </div>
      )}
      
      {leads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leads.map(lead => (
            <LeadCard key={lead.id} lead={lead} onUnlock={onUnlockLead} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-slate-700">No leads match your criteria.</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or check back later!</p>
        </div>
      )}
    </div>
  );
};

export default LeadBoard;