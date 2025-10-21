// FIX: Define interfaces for data structures used throughout the application.
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'vendor' | 'admin';
  status: 'active' | 'deactivated';
  verificationStatus?: 'pending' | 'approved' | 'rejected'; // For vendors
}

export interface Lead {
  id: string;
  title: string;
  description: string;
  companyName: string;
  budget: number;
  authority: 'Decision Maker' | 'Influencer' | 'Researcher';
  need: 'High' | 'Medium' | 'Low';
  timeframe: 'Immediately' | '1-3 Months' | '3-6 Months';
  postedAt: Date;
  postedBy: string;
  postedByImage?: string;
  email?: string;
  phone?: string;
  unlocked?: boolean;
  status: 'pending' | 'approved' | 'internal' | 'rejected';
  rejectedReason?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
}

export interface Vendor {
  id:string;
  name: string;
  logo: string;
}

export interface Slide {
    id: string;
    image: string;
    title: string;
    subtitle: string;
}

// BANT analysis result from Gemini
export interface BANTAnalysis {
  budget: number;
  authority: 'Decision Maker' | 'Influencer' | 'Researcher';
  need: 'High' | 'Medium' | 'Low';
  timeframe: 'Immediately' | '1-3 Months' | '3-6 Months';
  isValid: boolean;
  reason: string;
  title: string;
}