import React, { useState, useEffect } from 'react';
import type { Product, Slide, Vendor } from '../types';

interface ShowcaseProps {
    slides: Slide[];
    products: Product[];
    vendors: Vendor[];
    onProductClick: (product: Product) => void;
    onNavigate: (view: 'postEnquiry') => void;
}

const Showcase: React.FC<ShowcaseProps> = ({ slides, products, vendors, onProductClick, onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg h-64 sm:h-[300px]">
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-md md:text-lg text-slate-200 mb-5 max-w-2xl drop-shadow-md">
                  {slide.subtitle}
                </p>
                <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div 
        onClick={() => onNavigate('postEnquiry')}
        className="my-12 w-full bg-blue-600 text-white overflow-hidden py-3 shadow-md rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-300"
      >
        <div className="flex w-max animate-marquee">
          <span className="text-base font-semibold mx-12 whitespace-nowrap">
            Post your enquiry and get a reward up to 10% on the closed deal. ✨
          </span>
          <span className="text-base font-semibold mx-12 whitespace-nowrap" aria-hidden="true">
            Post your enquiry and get a reward up to 10% on the closed deal. ✨
          </span>
        </div>
      </div>

      <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Explore Our Core Categories</h2>
          <p className="text-slate-500 text-center mb-8">Click on any service to learn more about its features and pricing.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
              <div 
              key={product.id} 
              onClick={() => onProductClick(product)}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col"
              >
              <img src={product.image} alt={product.name} className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"/>
              <div className="p-4 text-center flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 flex-grow">{product.name}</h3>
                  <p className="text-sm text-blue-600 font-semibold mt-2">{product.price}</p>
                   <p className="text-xs text-slate-500 mt-2 h-8 overflow-hidden">
                        {product.description.split(' - ')[0]}
                   </p>
              </div>
              </div>
          ))}
          </div>

          <div className="mt-16 mb-8">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Trusted By Top Vendors</h2>
            <div className="relative w-full overflow-hidden bg-white py-6 shadow-md rounded-xl">
              <div className="flex w-max animate-marquee">
                {[...vendors, ...vendors].map((vendor, index) => (
                  <div key={index} className="mx-12 flex-shrink-0 flex items-center justify-center" style={{ width: '160px', height: '60px' }}>
                    <img 
                      src={vendor.logo} 
                      alt={vendor.name} 
                      className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default Showcase;
