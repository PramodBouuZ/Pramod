import React from 'react';
import type { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const features = product.description.split(' - ').filter(f => f.trim() !== '');

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all scale-100 opacity-100 overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <img src={product.image} alt={product.name} className="w-full h-56 object-cover"/>
        <div className="p-8">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">{product.name}</h2>
                    <p className="text-lg font-semibold text-blue-600 mt-1">{product.price}</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
            </div>
          
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Key Features:</h3>
            <ul className="space-y-2 text-slate-600 list-disc list-inside">
                {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
        </div>
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-end items-center space-x-3">
            <button className="text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 transition-colors px-4 py-2 rounded-md border border-slate-300">
                Get Details
            </button>
            <button className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-md shadow-sm">
                Book a Demo
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;