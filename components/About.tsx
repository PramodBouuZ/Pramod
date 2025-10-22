import React from 'react';
import UserCircleIcon from './icons/UserCircleIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import TargetIcon from './icons/TargetIcon';


const About: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800">About BANT Confirm</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          We are the bridge between businesses with needs and vendors with solutions. Our mission is to streamline the B2B lead generation process by providing high-quality, pre-qualified leads, saving everyone time and money.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-5 rounded-full">
            <BriefcaseIcon className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-800">For Businesses</h2>
          <p className="mt-2 text-slate-500">
            Stop wasting time searching for vendors. Post your requirement for free and let our AI qualify it. Connect with top-tier service providers ready to meet your needs.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-5 rounded-full">
            <TargetIcon className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-800">For Vendors</h2>
          <p className="mt-2 text-slate-500">
            Access a constant stream of high-intent, BANT-qualified leads. Stop cold calling and start closing deals with customers who are actively looking for your solutions.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-yellow-100 p-5 rounded-full">
            <UserCircleIcon className="h-10 w-10 text-yellow-600" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-800">Our Philosophy</h2>
          <p className="mt-2 text-slate-500">
            We believe in quality over quantity. Our proprietary AI analyzes every lead against the BANT framework (Budget, Authority, Need, Timeframe) to ensure you only engage with serious prospects.
          </p>
        </div>
      </div>
      
      <div className="mt-20 bg-slate-50 p-10 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-slate-800">Join Our Growing Platform</h2>
        <p className="mt-3 text-slate-600">Whether you're looking for a service or providing one, BANT Confirm is your trusted partner for growth.</p>
        <div className="mt-6 flex justify-center gap-4">
            <a href="#/signup?role=customer" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                Post an Enquiry
            </a>
            <a href="#/signup?role=vendor" className="bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition duration-300">
                Become a Vendor
            </a>
        </div>
      </div>
    </div>
  );
};

export default About;
