import React, { useState } from 'react';
import type { EnquiryFormData } from '../types';

interface EnquiryFormProps {
  onFormSubmit: (formData: EnquiryFormData) => void;
}

const EnquiryForm: React.FC<EnquiryFormProps> = ({ onFormSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [authority, setAuthority] = useState<'Decision Maker' | 'Influencer' | 'Researcher'>('Decision Maker');
    const [need, setNeed] = useState<'High' | 'Medium' | 'Low'>('High');
    const [timeframe, setTimeframe] = useState<'Immediately' | '1-3 Months' | '3-6 Months'>('Immediately');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title || !description || !budget) {
            setError('Please fill out all required fields.');
            return;
        }

        const budgetNumber = parseInt(budget, 10);
        if (isNaN(budgetNumber) || budgetNumber <= 0) {
            setError('Please enter a valid, positive number for the budget.');
            return;
        }

        onFormSubmit({
            title,
            description,
            budget: budgetNumber,
            authority,
            need,
            timeframe
        });

        // Reset form
        setTitle('');
        setDescription('');
        setBudget('');
        setAuthority('Decision Maker');
        setNeed('High');
        setTimeframe('Immediately');
    };

    const formRowClass = "grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 items-center";
    const labelClass = "text-sm font-semibold text-slate-700 md:text-right";
    const inputContainerClass = "md:col-span-2";
    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Post Your Business Requirement</h2>
                <p className="text-slate-500 mt-2">Fill out the details below, and we'll connect you with qualified vendors.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className={formRowClass}>
                    <label htmlFor="title" className={labelClass}>Requirement Title <span className="text-red-500">*</span></label>
                    <div className={inputContainerClass}>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., 'Need CRM for 50-person Sales Team'"
                            className={inputClass}
                            required
                        />
                    </div>
                </div>

                <div className={formRowClass}>
                    <label htmlFor="description" className={labelClass}>Detailed Description <span className="text-red-500">*</span></label>
                    <div className={inputContainerClass}>
                         <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your project, goals, and any specific features you need..."
                            className={`${inputClass} h-32 resize-y`}
                            required
                        />
                    </div>
                </div>

                <div className={formRowClass}>
                    <label htmlFor="budget" className={labelClass}>Estimated Budget (₹) <span className="text-red-500">*</span></label>
                    <div className={inputContainerClass}>
                        <input
                            type="number"
                            id="budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="e.g., 500000"
                            className={inputClass}
                            required
                        />
                    </div>
                </div>

                <div className="border-t border-slate-200 my-6"></div>
                <p className="text-center text-sm text-slate-500 -mt-2 mb-4">Help vendors understand your needs better with BANT details.</p>

                <div className={formRowClass}>
                    <label htmlFor="authority" className={labelClass}>Your Authority</label>
                     <div className={inputContainerClass}>
                        <select id="authority" value={authority} onChange={(e) => setAuthority(e.target.value as any)} className={inputClass}>
                            <option>Decision Maker</option>
                            <option>Influencer</option>
                            <option>Researcher</option>
                        </select>
                    </div>
                </div>

                <div className={formRowClass}>
                    <label htmlFor="need" className={labelClass}>Need Urgency</label>
                     <div className={inputContainerClass}>
                        <select id="need" value={need} onChange={(e) => setNeed(e.target.value as any)} className={inputClass}>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
                
                <div className={formRowClass}>
                    <label htmlFor="timeframe" className={labelClass}>Project Timeframe</label>
                     <div className={inputContainerClass}>
                        <select id="timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value as any)} className={inputClass}>
                            <option>Immediately</option>
                            <option>1-3 Months</option>
                            <option>3-6 Months</option>
                        </select>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center pt-4">{error}</p>}

                <div className="pt-6 text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg text-lg"
                    >
                        Submit for Review
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EnquiryForm;