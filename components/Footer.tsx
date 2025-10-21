import React from 'react';
import FacebookIcon from './icons/FacebookIcon';
import TwitterIcon from './icons/TwitterIcon';
import LinkedInIcon from './icons/LinkedInIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-blue-400">BANT</span>
              <span className="text-3xl font-bold text-yellow-400">Confirm</span>
            </div>
            <p className="text-sm text-slate-400">
              Connecting businesses with valuable leads to foster growth and opportunity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-200">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Post a Lead</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Find Leads</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-200">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-200">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <FacebookIcon />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <TwitterIcon />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} BANT Confirm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;