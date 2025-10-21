
import React from 'react';
import type { Lead } from '../types';

interface PaymentModalProps {
  lead: Lead | null;
  onClose: () => void;
  onConfirm: (leadId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ lead, onClose, onConfirm }) => {
  if (!lead) return null;

  const handlePayment = () => {
    // In a real app, this would integrate with Razorpay SDK
    onConfirm(lead.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all scale-100 opacity-100">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Unlock Lead Details</h2>
              <p className="text-sm text-slate-500 mt-1">Complete payment to view contact info.</p>
            </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-700 truncate">{lead.title}</h3>
            <p className="text-sm text-slate-500">From: {lead.companyName}</p>
          </div>
          
          <div className="flex justify-between items-center text-lg font-bold text-slate-800 mb-6">
            <span>Total Amount</span>
            <span>₹100.00</span>
          </div>

          <p className="text-xs text-center text-slate-400 mb-4">You will be redirected to a secure payment gateway.</p>
          
          <button 
            onClick={handlePayment} 
            className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
          >
            Pay ₹100 securely
          </button>
        </div>
        <div className="bg-slate-100 px-8 py-4 rounded-b-lg text-center">
            <p className="text-xs text-slate-500">Powered by <span className="font-bold">Razorpay</span></p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
