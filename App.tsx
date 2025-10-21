import React, { useState, useMemo } from 'react';
import type { User, Lead, Product, BANTAnalysis, Slide, Vendor } from './types';
import Header from './components/Header';
import Showcase from './components/Showcase';
import RequirementForm from './components/RequirementForm';
import LeadBoard from './components/LeadBoard';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProductModal from './components/ProductModal';
import PaymentModal from './components/PaymentModal';
import AdminDashboard from './components/AdminDashboard';
import AIAssistant from './components/AIAssistant';
import { sendEmail } from './utils/emailService';

// Mock Data
const initialUsers: User[] = [
  { id: 'admin1', name: 'Admin User', email: 'admin@bant.com', phone: '+911111111111', role: 'admin', status: 'active', verified: true },
  { id: 'vendor1', name: 'Sales Vendor', email: 'vendor@bant.com', phone: '+912222222222', role: 'vendor', status: 'active', verified: true },
  { id: 'customer1', name: 'Happy Customer', email: 'customer@bant.com', phone: '+913333333333', role: 'customer', status: 'active', verified: false },
  { id: 'vendor2', name: 'Inactive Vendor', email: 'inactive@bant.com', phone: '+914444444444', role: 'vendor', status: 'deactivated', verified: false },
  { id: 'vendor3', name: 'Unverified Vendor', email: 'unverified@bant.com', phone: '+915555555555', role: 'vendor', status: 'active', verified: false },
];

const initialLeads: Lead[] = [
    { id: 'lead1', title: 'Need CRM for 50-person Sales Team', description: 'We are a logistics company in Mumbai looking for a CRM solution to manage our 50-person sales team. We need features like lead tracking, sales pipeline management, and integration with our existing accounting software.', companyName: 'Logistics Pro', budget: 500000, authority: 'Decision Maker', need: 'High', timeframe: '1-3 Months', postedAt: new Date(Date.now() - 86400000 * 1), postedBy: 'Rajesh Kumar', postedByImage: 'https://i.pravatar.cc/150?u=rajesh', email: 'rajesh@logipro.com', phone: '+919876543210', unlocked: true, status: 'approved' },
    { id: 'lead2', title: 'IVR System for Customer Support Center', description: 'Our e-commerce brand requires an IVR system to handle incoming customer calls. We expect around 1000 calls per day. The system should support multiple languages and have call routing capabilities.', companyName: 'Fashion Hub', budget: 200000, authority: 'Influencer', need: 'High', timeframe: 'Immediately', postedAt: new Date(Date.now() - 86400000 * 2), postedBy: 'Priya Sharma', postedByImage: 'https://i.pravatar.cc/150?u=priya', email: 'priya.sharma@fashionhub.co', phone: '+919123456789', unlocked: false, status: 'approved' },
    { id: 'lead3', title: 'Bulk SMS Gateway for Marketing Campaigns', description: 'We need a reliable bulk SMS gateway to send promotional messages to our customer base of over 1 million users. Looking for a scalable solution with good delivery rates.', companyName: 'QuickMart', budget: 150000, authority: 'Researcher', need: 'Medium', timeframe: '3-6 Months', postedAt: new Date(Date.now() - 86400000 * 5), postedBy: 'Amit Patel', email: 'amit@quickmart.io', phone: '+919988776655', unlocked: false, status: 'approved' },
    { id: 'lead4', title: 'Develop a Mobile App for Food Delivery', description: 'A startup looking for a vendor to develop a cross-platform mobile application for a new food delivery service. Key features include user registration, restaurant listings, order placement, and payment integration. ', companyName: 'YumWheels', budget: 800000, authority: 'Decision Maker', need: 'High', timeframe: '1-3 Months', postedAt: new Date(Date.now() - 3600000 * 2), postedBy: 'Sunita Rao', email: 'sunita.r@yumwheels.com', phone: '+919876501234', unlocked: false, status: 'pending' },
];

const initialSlides: Slide[] = [
  {
    id: 'slide1',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Are you facing challenge after sales service,',
    subtitle: 'Don\'t worry Choose Bant Confirm for better service with reliable solutions',
  },
  {
    id: 'slide2',
    image: 'https://images.unsplash.com/photo-1587560699334-cc426240169f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Cloud Telephony Systems',
    subtitle: 'Upgrade your business communication with our reliable and scalable cloud phone systems.',
  },
];

const initialProducts: Product[] = [
  { id: 'prod1', name: 'CRM Solutions', image: 'https://placehold.co/600x400/4F46E5/FFF?text=CRM', description: 'Streamline sales processes - Manage customer relationships - Track communications effectively - Integrate with existing ERPs.', price: 'Starts at ₹15,000/month' },
  { id: 'prod2', name: 'IVR Systems', image: 'https://placehold.co/600x400/F59E0B/FFF?text=IVR', description: 'Automated call routing - 24/7 customer self-service - Personalized customer greetings - Real-time call analytics.', price: 'Starts at ₹5,000/month' },
];

const initialVendors: Vendor[] = [
  { id: 'vendor-1', name: 'Groweon Digital CRM', logo: 'https://placehold.co/150x50/1E90FF/FFF?text=Groweon' },
  { id: 'vendor-2', name: 'Collerdesk', logo: 'https://placehold.co/150x50/4169E1/FFF?text=Collerdesk' },
  { id: 'vendor-3', name: 'Primo VOIP', logo: 'https://placehold.co/150x50/8A2BE2/FFF?text=Primo+VOIP' },
  { id: 'vendor-4', name: 'Whatstool', logo: 'https://placehold.co/150x50/25D366/FFF?text=Whatstool' },
  { id: 'vendor-5', name: 'Tata Teleservices', logo: 'https://placehold.co/150x50/0054A6/FFF?text=Tata' },
  { id: 'vendor-6', name: 'Airtel', logo: 'https://placehold.co/150x50/E40000/FFF?text=Airtel' },
];

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [view, setView] = useState<'home' | 'leads' | 'postEnquiry' | 'admin'>('home');

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState<Product | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<Lead | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const handleNavigate = (targetView: 'home' | 'leads' | 'postEnquiry') => {
    if (currentUser?.role === 'admin') {
      setView(targetView === 'home' ? 'home' : 'admin');
      return;
    }
    
    if ((targetView === 'leads' || targetView === 'postEnquiry') && !currentUser) {
        setShowAuthModal(true);
        return; 
    }
    
    setView(targetView);
  };

  const handleAuthSuccess = (userFromModal: User) => {
    let finalUser: User | undefined;

    // Check if it's a login attempt or a signup
    if (userFromModal.id === 'login-attempt') {
      finalUser = users.find(u => u.email.toLowerCase() === userFromModal.email.toLowerCase());
      if (!finalUser) {
        alert("Login failed. User not found.");
        return;
      }
    } else { // It's a signup
      const newUser = { ...userFromModal };
      setUsers(prev => [...prev, newUser]);
      finalUser = newUser;
    }

    if (finalUser.email.toLowerCase() === 'admin@bant.com') {
      finalUser.role = 'admin';
    }
    
    setCurrentUser(finalUser);
    setShowAuthModal(false);
    
    if (finalUser.role === 'admin') {
      setView('admin');
    } else {
      // Redirect to home after login/signup
      setView('home');
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const handleUnlockLead = (leadToUnlock: Lead) => {
      if (!currentUser) {
          setShowAuthModal(true);
          return;
      }
      if (currentUser.role === 'vendor') {
        if (!currentUser.verified) {
            alert('Your account is not verified. Please contact an administrator to get verified before you can unlock leads.');
            return;
        }
        setShowPaymentModal(leadToUnlock);
      }
  };
  
  const handlePaymentConfirm = (leadId: string) => {
    setLeads(prevLeads => prevLeads.map(lead => 
      lead.id === leadId ? { ...lead, unlocked: true } : lead
    ));
    setShowPaymentModal(null);
  };
  
  const handleFormSubmit = (analysis: BANTAnalysis) => {
    if (!currentUser) {
      alert("Please log in to submit an enquiry.");
      setShowAuthModal(true);
      return;
    }
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      title: analysis.title,
      description: analysis.reason,
      companyName: currentUser.name,
      budget: analysis.budget,
      authority: analysis.authority,
      need: analysis.need,
      timeframe: analysis.timeframe,
      postedAt: new Date(),
      postedBy: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      unlocked: false,
      status: 'pending',
    };
    setLeads([newLead, ...leads]);
    alert('Your enquiry has been submitted for review. It will be published after admin approval.');
    setView('home');
  };

  const handleAIGeneratedLead = (leadData: Omit<Lead, 'id' | 'postedAt' | 'status' | 'unlocked'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-ai-${Date.now()}`,
      postedAt: new Date(),
      status: 'pending',
      unlocked: false,
    };
    setLeads(prev => [newLead, ...prev]);
    alert(`Thank you, ${leadData.postedBy}! Your lead has been submitted for review.`);
  };

  const handleApproveLead = (leadId: string) => {
    const leadToApprove = leads.find(lead => lead.id === leadId);
    if (!leadToApprove) return;

    setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: 'approved' } : lead));

    // Notify customer
    if (leadToApprove.email) {
      sendEmail(
        leadToApprove.email,
        `Your Lead "${leadToApprove.title}" has been Approved!`,
        `<p>Hello ${leadToApprove.postedBy},</p>
         <p>Great news! Your lead submission, "<b>${leadToApprove.title}</b>", has been reviewed and approved by our team.</p>
         <p>It is now live on our platform for vendors to view. We wish you the best in finding the right service provider!</p>
         <p>Thank you for using BANT Confirm.</p>`
      );
    }
    
    // Notify all active, verified vendors
    const activeVerifiedVendors = users.filter(user => user.role === 'vendor' && user.status === 'active' && user.verified);
    activeVerifiedVendors.forEach(vendor => {
        sendEmail(
            vendor.email,
            `New High-Quality Lead Available: ${leadToApprove.title}`,
            `<p>Hello ${vendor.name},</p>
             <p>A new lead that might match your services has just been posted on BANT Confirm:</p>
             <p><strong>Title:</strong> ${leadToApprove.title}</p>
             <p><strong>Budget:</strong> ₹${leadToApprove.budget.toLocaleString('en-IN')}</p>
             <p>Log in now to view the details and potentially unlock this opportunity!</p>`
        );
    });
  };
  
  const handleRejectLead = (leadId: string, reason: string) => {
    const leadToReject = leads.find(lead => lead.id === leadId);
    if (!leadToReject) return;

    setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: 'rejected', rejectedReason: reason } : lead));

    // Notify customer
    if (leadToReject.email) {
       sendEmail(
        leadToReject.email,
        `Update on Your Lead Submission: "${leadToReject.title}"`,
        `<p>Hello ${leadToReject.postedBy},</p>
         <p>Thank you for submitting your lead, "<b>${leadToReject.title}</b>". After careful review, we were unable to approve it at this time.</p>
         <p><strong>Reason:</strong> ${reason}</p>
         <p>Please feel free to edit your submission based on this feedback and resubmit, or post a new enquiry with more details.</p>
         <p>Thank you for using BANT Confirm.</p>`
      );
    }
  };

  const handleMarkInternal = (leadId: string) => {
    setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: 'internal' } : lead));
  };

  const handleUserStatusChange = (userId: string, newStatus: 'active' | 'deactivated') => {
    setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user));
  };

  const handleUserVerificationChange = (userId: string, isVerified: boolean) => {
    setUsers(users.map(user => user.id === userId ? { ...user, verified: isVerified } : user));
  };

  const handleAddNewBanner = (newBannerData: Omit<Slide, 'id'>) => {
    const newBanner: Slide = { ...newBannerData, id: `slide-${Date.now()}` };
    setSlides(prevSlides => [...prevSlides, newBanner]);
  };

  const handleAddNewProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...newProductData, id: `prod-${Date.now()}` };
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const handleAddNewVendor = (newVendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = { ...newVendorData, id: `vendor-${Date.now()}` };
    setVendors(prevVendors => [...prevVendors, newVendor]);
  };
  
  const handleDeleteVendor = (vendorId: string) => {
    setVendors(prevVendors => prevVendors.filter(vendor => vendor.id !== vendorId));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setMinBudget('');
    setMaxBudget('');
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
  };
  
  const totalRevenue = useMemo(() => {
    return leads.filter(lead => lead.unlocked).length * 100;
  }, [leads]);

  const filteredAndSortedLeads = useMemo(() => {
    return leads
      .filter(lead => {
        if (currentUser?.status === 'deactivated') return false;
        if (lead.status !== 'approved') return false;

        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm ? 
          lead.title.toLowerCase().includes(searchTermLower) || 
          lead.companyName.toLowerCase().includes(searchTermLower) : true;
        
        const matchesMinBudget = minBudget ? lead.budget >= parseInt(minBudget) : true;
        const matchesMaxBudget = maxBudget ? lead.budget <= parseInt(maxBudget) : true;
        
        const matchesStatus = statusFilter === 'all' ? true : 
          statusFilter === 'unlocked' ? lead.unlocked : !lead.unlocked;

        const leadDate = lead.postedAt.getTime();
        const matchesStartDate = startDate ? leadDate >= new Date(startDate).getTime() : true;
        const matchesEndDate = endDate ? leadDate <= new Date(endDate).getTime() : true;
        
        return matchesSearch && matchesMinBudget && matchesMaxBudget && matchesStatus && matchesStartDate && matchesEndDate;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'oldest':
            return a.postedAt.getTime() - b.postedAt.getTime();
          case 'budget-desc':
            return b.budget - a.budget;
          case 'budget-asc':
            return a.budget - b.budget;
          case 'newest':
          default:
            return b.postedAt.getTime() - a.postedAt.getTime();
        }
      });
  }, [leads, searchTerm, minBudget, maxBudget, statusFilter, startDate, endDate, sortBy, currentUser]);

  const renderContent = () => {
    if (currentUser?.role === 'admin' && view !== 'home') {
      return (
        <AdminDashboard 
          leads={leads} 
          users={users} 
          slides={slides}
          products={products}
          vendors={vendors}
          totalRevenue={totalRevenue}
          onApprove={handleApproveLead}
          onMarkInternal={handleMarkInternal}
          onReject={handleRejectLead}
          onSetUserStatus={handleUserStatusChange}
          onSetUserVerification={handleUserVerificationChange}
          onAddNewBanner={handleAddNewBanner}
          onAddNewProduct={handleAddNewProduct}
          onAddNewVendor={handleAddNewVendor}
          onDeleteVendor={handleDeleteVendor}
        />
      );
    }
    
    switch (view) {
        case 'leads':
            if (currentUser?.role !== 'vendor') {
                return (
                    <div className="text-center p-8 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-slate-700">For Vendors Only</h3>
                        <p className="text-slate-500 mt-2">This section is for vendors to purchase leads.</p>
                    </div>
                );
            }
            if (currentUser.status === 'deactivated') {
                return (
                    <div className="text-center p-8 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-red-600">Your account has been deactivated.</h3>
                        <p className="text-slate-500 mt-2">Please contact support for assistance.</p>
                    </div>
                );
            }
            return (
                <LeadBoard 
                  leads={filteredAndSortedLeads}
                  onUnlockLead={handleUnlockLead}
                  user={currentUser}
                  searchTerm={searchTerm} onSearchChange={e => setSearchTerm(e.target.value)}
                  minBudget={minBudget} onMinBudgetChange={e => setMinBudget(e.target.value)}
                  maxBudget={maxBudget} onMaxBudgetChange={e => setMaxBudget(e.target.value)}
                  statusFilter={statusFilter} onStatusChange={setStatusFilter}
                  startDate={startDate} onStartDateChange={e => setStartDate(e.target.value)}
                  endDate={endDate} onEndDateChange={e => setEndDate(e.target.value)}
                  sortBy={sortBy} onSortChange={e => setSortBy(e.target.value)}
                  onClearFilters={clearFilters}
                />
            );
        case 'postEnquiry':
            if (currentUser?.role !== 'customer') {
                 return (
                    <div className="text-center p-8 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-slate-700">For Customers Only</h3>
                        <p className="text-slate-500 mt-2">Vendors cannot post new requirements. Please log in as a customer.</p>
                    </div>
                );
            }
            if (currentUser.status === 'deactivated') {
                 return (
                    <div className="text-center p-8 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-red-600">Your account has been deactivated.</h3>
                        <p className="text-slate-500 mt-2">Please contact support for assistance.</p>
                    </div>
                );
            }
            return <RequirementForm onFormSubmit={handleFormSubmit} user={currentUser} />;
        case 'home':
        default:
            return (
                 <Showcase 
                    slides={slides}
                    products={products}
                    vendors={vendors}
                    onProductClick={(product) => setShowProductModal(product)}
                    onNavigate={handleNavigate}
                />
            );
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans">
      <Header 
        user={currentUser} 
        onLogout={handleLogout}
        onLoginClick={() => setShowAuthModal(true)}
        onSignUpClick={() => setShowAuthModal(true)}
        onNavigate={handleNavigate}
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <Footer />

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess} 
        />
      )}
      {showProductModal && (
        <ProductModal 
          product={showProductModal} 
          onClose={() => setShowProductModal(null)} 
        />
      )}
      {showPaymentModal && (
        <PaymentModal 
          lead={showPaymentModal}
          onClose={() => setShowPaymentModal(null)}
          onConfirm={handlePaymentConfirm}
        />
      )}

      {currentUser?.role !== 'admin' && <AIAssistant onAIGeneratedLead={handleAIGeneratedLead} />}
    </div>
  );
}

export default App;