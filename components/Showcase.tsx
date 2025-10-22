import React, { useState, useEffect, useMemo } from 'react';
import type { Product, Slide, Vendor, Testimonial, BANTAnalysis, User } from '../types';
import ConversationalEnquiryForm from './ConversationalEnquiryForm';

interface ShowcaseProps {
    slides: Slide[];
    products: Product[];
    vendors: Vendor[];
    testimonials: Testimonial[];
    onProductClick: (product: Product) => void;
    onNavigate: (view: 'postEnquiry') => void;
    onFormSubmit: (analysis: BANTAnalysis) => void;
    user: User | null;
}

const Showcase: React.FC<ShowcaseProps> = ({ slides, products, vendors, testimonials, onProductClick, onNavigate, onFormSubmit, user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productSearch, setProductSearch] = useState('');

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
  
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const searchLower = productSearch.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }, [products, productSearch]);


  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg h-64 sm:h-[300px]">
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={slide.image} alt={slide.subtitle} className="w-full h-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-md md:text-lg text-slate-200 mb-5 max-w-2xl drop-shadow-md">
                  {slide.subtitle}
                </p>
                <a href="#/about" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
                  Learn More
                </a>
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

      <div className="mt-8 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-900 font-semibold py-3 overflow-hidden whitespace-nowrap shadow-lg rounded-lg">
        <div className="inline-block animate-marquee">
            <span className="mx-12 text-lg">✨ Post your inquiry and get up to 10% commission on your closed deal.</span>
            <span className="mx-12 text-lg">✨ Post your inquiry and get up to 10% commission on your closed deal.</span>
            <span className="mx-12 text-lg">✨ Post your inquiry and get up to 10% commission on your closed deal.</span>
            <span className="mx-12 text-lg">✨ Post your inquiry and get up to 10% commission on your closed deal.</span>
        </div>
      </div>
      
      {/* Quick Enquiry Section */}
      <div className="my-12">
        <ConversationalEnquiryForm 
          onFormSubmit={onFormSubmit}
          user={user}
          isHomePage={true}
        />
      </div>

      <div className="my-12">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Explore Our Core Categories</h2>
          <p className="text-slate-500 text-center mb-6">Find the perfect solution for your business needs.</p>
          
          <div className="max-w-xl mx-auto mb-8">
            <input 
              type="text"
              placeholder="Search for products or features (e.g., 'CRM', 'call routing')..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full px-5 py-3 text-base border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
              <div 
              key={product.id} 
              onClick={() => onProductClick(product)}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col"
              >
              <img src={product.image} alt={`Promotional image for ${product.name}`} className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy"/>
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
          {filteredProducts.length === 0 && (
             <div className="text-center bg-white p-12 rounded-lg shadow-sm mt-6">
                <h3 className="text-xl font-semibold text-slate-700">No products match your search.</h3>
                <p className="text-slate-500 mt-2">Try a different keyword or clear the search.</p>
            </div>
          )}

          <div className="mt-16 mb-8">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Trusted By Top Vendors</h2>
            <div className="relative w-full overflow-hidden bg-white py-6 shadow-md rounded-xl">
              <div className="flex w-max animate-marquee">
                {[...vendors, ...vendors].map((vendor, index) => (
                  <div key={index} className="mx-12 flex-shrink-0 flex items-center justify-center" style={{ width: '160px', height: '60px' }}>
                    <img 
                      src={vendor.logo} 
                      alt={`Logo of our trusted vendor: ${vendor.name}`}
                      className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
      
      <div className="my-16">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">What Our Customers Say</h2>
        <p className="text-slate-500 text-center mb-10">Real feedback from businesses thriving with our leads.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 flex flex-col">
              <svg className="w-10 h-10 text-blue-200 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
              </svg>
              <p className="text-slate-600 italic leading-relaxed mb-6 flex-grow">"{testimonial.feedback}"</p>
              <div className="flex items-center mt-auto pt-4 border-t border-slate-200">
                <img src={testimonial.userImage} alt={testimonial.userName} className="h-12 w-12 rounded-full object-cover mr-4 ring-2 ring-blue-100" loading="lazy" />
                <div>
                  <p className="font-bold text-slate-800">{testimonial.userName}</p>
                  <p className="text-sm text-slate-500">{testimonial.companyName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Showcase;