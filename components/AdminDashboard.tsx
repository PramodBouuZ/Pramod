import React, { useState } from 'react';
import type { Lead, User, Slide, Product, Vendor } from '../types';

interface AdminDashboardProps {
  leads: Lead[];
  users: User[];
  slides: Slide[];
  products: Product[];
  vendors: Vendor[];
  totalRevenue: number;
  onApprove: (leadId: string) => void;
  onMarkInternal: (leadId: string) => void;
  onSetUserStatus: (userId: string, status: 'active' | 'deactivated') => void;
  onAddNewBanner: (bannerData: Omit<Slide, 'id'>) => void;
  onAddNewProduct: (productData: Omit<Product, 'id'>) => void;
  onAddNewVendor: (vendorData: Omit<Vendor, 'id'>) => void;
  onDeleteVendor: (vendorId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  leads, users, slides, products, vendors, totalRevenue, 
  onApprove, onMarkInternal, onSetUserStatus, onAddNewBanner, onAddNewProduct, onAddNewVendor, onDeleteVendor
}) => {
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  
  const [newProductName, setNewProductName] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorLogo, setNewVendorLogo] = useState('');

  const pendingLeads = leads.filter(l => l.status === 'pending');
  const approvedLeads = leads.filter(l => l.status === 'approved');
  const internalLeads = leads.filter(l => l.status === 'internal');
  const nonAdminUsers = users.filter(u => u.role !== 'admin');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImageState: (dataUrl: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageState(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBannerTitle && newBannerSubtitle && newBannerImage) {
      onAddNewBanner({ title: newBannerTitle, subtitle: newBannerSubtitle, image: newBannerImage });
      setNewBannerTitle('');
      setNewBannerSubtitle('');
      setNewBannerImage('');
      (document.getElementById('banner-image-upload') as HTMLInputElement).value = '';
    } else {
      alert('Please fill all banner fields.');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductName && newProductDesc && newProductPrice && newProductImage) {
      onAddNewProduct({ name: newProductName, description: newProductDesc, price: newProductPrice, image: newProductImage });
      setNewProductName('');
      setNewProductDesc('');
      setNewProductPrice('');
      setNewProductImage('');
       (document.getElementById('product-image-upload') as HTMLInputElement).value = '';
    } else {
      alert('Please fill all product fields.');
    }
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVendorName && newVendorLogo) {
      onAddNewVendor({ name: newVendorName, logo: newVendorLogo });
      setNewVendorName('');
      setNewVendorLogo('');
      (document.getElementById('vendor-logo-upload') as HTMLInputElement).value = '';
    } else {
      alert('Please provide a name and logo for the vendor.');
    }
  };


  const StatCard: React.FC<{ title: string; value: string | number; bgColor: string; }> = ({ title, value, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-lg shadow-md text-white`}>
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
  
  const LeadRow: React.FC<{lead: Lead}> = ({ lead }) => (
    <tr className="bg-white border-b hover:bg-slate-50">
        <td className="px-6 py-4">
            <div className="font-medium text-slate-900">{lead.title}</div>
            <div className="text-xs text-slate-500">{lead.companyName} by {lead.postedBy}</div>
        </td>
         <td className="px-6 py-4">
            <div className="font-medium text-slate-700">{lead.email}</div>
            <div className="text-xs text-slate-500">{lead.phone}</div>
        </td>
        <td className="px-6 py-4">₹{lead.budget.toLocaleString('en-IN')}</td>
        <td className="px-6 py-4 text-xs">
            <div><strong>A:</strong> {lead.authority}</div>
            <div><strong>N:</strong> {lead.need}</div>
            <div><strong>T:</strong> {lead.timeframe}</div>
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center space-x-2">
                <button onClick={() => onApprove(lead.id)} className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full hover:bg-green-600 transition">Approve</button>
                <button onClick={() => onMarkInternal(lead.id)} className="bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-full hover:bg-blue-600 transition">Mark Internal</button>
            </div>
        </td>
    </tr>
  );

  const renderLeadTable = (leadsToShow: Lead[], title: string) => (
      <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">{title} ({leadsToShow.length})</h2>
          {leadsToShow.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Lead Details</th>
                        <th scope="col" className="px-6 py-3">Budget</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leadsToShow.map(lead => (
                        <tr key={lead.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{lead.title}</div>
                                <div className="text-xs text-slate-500">{lead.companyName}</div>
                            </td>
                            <td className="px-6 py-4">₹{lead.budget.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4 capitalize">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    lead.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    lead.status === 'internal' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {lead.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
          ) : <p className="text-slate-500">No leads in this category.</p>}
      </div>
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome, Admin! Here's an overview of your platform.</p>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Pending Review" value={pendingLeads.length} bgColor="bg-yellow-500" />
        <StatCard title="Published Leads" value={approvedLeads.length} bgColor="bg-green-500" />
        <StatCard title="Internal Deals" value={internalLeads.length} bgColor="bg-blue-500" />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} bgColor="bg-indigo-500" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Content Management</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Banner Management */}
            <div>
                <h3 className="text-lg font-semibold text-slate-600 mb-3">Banner Management</h3>
                <form onSubmit={handleAddBanner} className="space-y-3 p-4 border rounded-lg bg-slate-50">
                    <input type="text" placeholder="Banner Title" value={newBannerTitle} onChange={e => setNewBannerTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    <input type="text" placeholder="Banner Subtitle" value={newBannerSubtitle} onChange={e => setNewBannerSubtitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    <div>
                        <label className="text-sm font-medium text-slate-700">Banner Image (JPG, GIF)</label>
                        <input id="banner-image-upload" type="file" accept=".jpg,.jpeg,.gif" onChange={e => handleImageUpload(e, setNewBannerImage)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700">Add New Banner</button>
                </form>
                 <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {slides.map(slide => <div key={slide.id} className="text-sm p-2 bg-slate-100 rounded flex items-center gap-2"><img src={slide.image} className="h-6 w-10 object-cover rounded-sm" alt={slide.title} /><span>{slide.title}</span></div>)}
                </div>
            </div>
            {/* Product Management */}
            <div>
                <h3 className="text-lg font-semibold text-slate-600 mb-3">Product Catalog</h3>
                <form onSubmit={handleAddProduct} className="space-y-3 p-4 border rounded-lg bg-slate-50">
                    <input type="text" placeholder="Product Name" value={newProductName} onChange={e => setNewProductName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    <textarea placeholder="Features (separate with ' - ')" value={newProductDesc} onChange={e => setNewProductDesc(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={2}></textarea>
                    <input type="text" placeholder="Price (e.g., Starts at ₹5,000)" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    <div>
                        <label className="text-sm font-medium text-slate-700">Product Image (JPG, GIF)</label>
                        <input id="product-image-upload" type="file" accept=".jpg,.jpeg,.gif" onChange={e => handleImageUpload(e, setNewProductImage)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700">Add New Product</button>
                </form>
                 <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
                    {products.map(product => (
                        <div key={product.id} className="text-sm p-3 bg-slate-100 rounded-lg flex items-start justify-between gap-4 border border-slate-200">
                            <div className="flex items-start gap-4">
                                <img src={product.image} className="h-16 w-24 object-cover rounded flex-shrink-0" alt={product.name} />
                                <div>
                                    <div className="font-bold text-slate-800">{product.name}</div>
                                    <div className="text-xs font-semibold text-blue-600 mt-1">{product.price}</div>
                                    {/* FIX: Replaced 'replaceAll' with 'replace' using a global regex for wider compatibility. */}
                                    <p className="text-xs text-slate-500 mt-2">{product.description.replace(/ - /g, ', ')}</p>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5 flex-shrink-0">
                                <button className="text-xs bg-white border border-slate-300 px-3 py-1 rounded-md hover:bg-slate-50 transition-colors">Edit</button>
                                <button className="text-xs bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-600 mb-3">Vendor Logo Management</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <form onSubmit={handleAddVendor} className="space-y-3 p-4 border rounded-lg bg-slate-50">
                    <input type="text" placeholder="Vendor Name" value={newVendorName} onChange={e => setNewVendorName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    <div>
                        <label className="text-sm font-medium text-slate-700">Vendor Logo (PNG, SVG recommended)</label>
                        <input id="vendor-logo-upload" type="file" accept="image/*" onChange={e => handleImageUpload(e, setNewVendorLogo)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700">Add Vendor Logo</button>
                </form>
              </div>
              <div className="max-h-80 overflow-y-auto pr-2">
                <div className="space-y-3">
                  {vendors.map(vendor => (
                      <div key={vendor.id} className="text-sm p-3 bg-slate-100 rounded-lg flex items-center justify-between gap-4 border border-slate-200">
                          <div className="flex items-center gap-4">
                              <img src={vendor.logo} className="h-10 w-24 object-contain bg-white p-1 rounded" alt={vendor.name} />
                              <div className="font-semibold text-slate-800">{vendor.name}</div>
                          </div>
                          <button 
                            onClick={() => onDeleteVendor(vendor.id)}
                            className="text-xs bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition-colors flex-shrink-0">
                              Delete
                          </button>
                      </div>
                  ))}
                </div>
              </div>
            </div>
        </div>

      </div>


       <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Pending Review ({pendingLeads.length})</h2>
          {pendingLeads.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Lead Details</th>
                        <th scope="col" className="px-6 py-3">Contact</th>
                        <th scope="col" className="px-6 py-3">Budget</th>
                        <th scope="col" className="px-6 py-3">BANT Info</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingLeads.map(lead => <LeadRow key={lead.id} lead={lead} />)}
                </tbody>
                </table>
            </div>
          ): <p className="text-slate-500">No new leads to review.</p>}
      </div>
      
       <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">User Management ({nonAdminUsers.length})</h2>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                      <th scope="col" className="px-6 py-3">User</th>
                      <th scope="col" className="px-6 py-3">Role</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {nonAdminUsers.map(user => (
                      <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                          <td className="px-6 py-4">
                              <div className="font-medium text-slate-900">{user.name}</div>
                              <div className="text-xs text-slate-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 capitalize">{user.role}</td>
                          <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.status}
                                </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.status === 'active' ? (
                                <button onClick={() => onSetUserStatus(user.id, 'deactivated')} className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full hover:bg-red-600 transition">Deactivate</button>
                            ) : (
                                <button onClick={() => onSetUserStatus(user.id, 'active')} className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full hover:bg-green-600 transition">Activate</button>
                            )}
                          </td>
                      </tr>
                  ))}
              </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;