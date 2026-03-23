import React, { useState } from 'react';
import {
  Camera, User, Mail, Globe, Lock, Shield, Bell, Check,
  Smartphone, Monitor, LogOut, ShieldCheck, Eye, EyeOff,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileSettings() {
  const [activeSection, setActiveSection] = useState('General');
  const [showPassword, setShowPassword] = useState(false);

  const sidebarItems = [
    { name: 'General', icon: User },
    { name: 'Security', icon: Lock },
    { name: 'Notifications', icon: Bell },
    { name: 'Permissions', icon: Shield },
  ];

  // --- Animation Variants ---
  const tabVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.2 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-340 mx-auto p-4 md:p-0"
    >
      <div className="flex flex-col lg:flex-row gap-8 ">

        {/* Sidebar Navigation */}
        <aside className="lg:w-72 lg:sticky lg:top-26 lg:h-fit space-y-1 self-start">
          <div className="px-4 py-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Settings Menu
          </div>
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeSection === item.name
                  ? 'bg-[#C1E1A6] text-black shadow-sm'
                  : 'text-gray-500 hover:bg-white hover:shadow-sm'
                }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </aside>

        {/* Main Content Card */}
        <div className="flex-1 bg-white border border-gray-100 rounded-4xl p-6 md:p-10 shadow-sm min-h-150">
          <AnimatePresence mode="wait">

            {/* 1. GENERAL SECTION */}
            {activeSection === 'General' && (
              <motion.div key="general" {...tabVariants} className="max-w-2xl space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your public profile and account identity.</p>
                </div>

                <div className="flex items-center gap-6 p-4 bg-gray-50/50 rounded-3xl">
                  <div className="relative">
                    <img src="https://i.pravatar.cc/150?u=sajib" alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-sm object-cover" />
                    <button className="absolute -bottom-1 -right-1 p-2 bg-black text-white rounded-full border-2 border-white"><Camera size={12} /></button>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Profile Photo</h4>
                    <p className="text-xs text-gray-500 mb-2">Recommended size: 400x400px</p>
                    <div className="flex gap-2">
                      <button className="text-xs font-bold px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Upload</button>
                      <button className="text-xs font-bold px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="First Name" value="Athun" />
                  <InputGroup label="Last Name" value="V" />
                  <InputGroup label="Email Address" value="sajib@rexora.com" icon={Mail} />
                  <InputGroup label="Phone" value="1234567890" icon={Phone} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Bio</label>
                  <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C1E1A6] text-sm h-32 resize-none" defaultValue="E-commerce lead at Rexora. Passionate about data-driven UI and customer experience." />
                </div>
                <ActionButtons />
              </motion.div>
            )}

            {/* 2. SECURITY SECTION */}
            {activeSection === 'Security' && (
              <motion.div key="security" {...tabVariants} className="max-w-2xl space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Security</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your password and active sessions.</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">Change Password</h4>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Current Password"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C1E1A6] text-sm focus:outline-0"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <input type="password" placeholder="New Password" className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:outline-0 focus:ring-[#C1E1A6] text-sm" />
                  <button className='px-4 py-2 bg-lime-400 rounded-xl font-semibold cursor-pointer text-sm hover:bg-lime-500'>Change</button>
                </div>

                <div className="p-5 border border-gray-100 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><ShieldCheck size={20} /></div>
                      <div>
                        <p className="text-sm font-bold">Two-factor Authentication</p>
                        <p className="text-xs text-gray-500">Keep your account extra secure</p>
                      </div>
                    </div>
                    <Toggle active={true} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">Where you're logged in</h4>
                  <div className="space-y-3">
                    <DeviceItem icon={Monitor} name="MacBook Pro 16”" location="Dhaka, Bangladesh" status="Active now" />
                    <DeviceItem icon={Smartphone} name="iPhone 15 Pro" location="Dhaka, Bangladesh" status="Last active: 2 hours ago" />
                  </div>
                </div>
                <ActionButtons />
              </motion.div>
            )}

            {/* 3. NOTIFICATIONS SECTION */}
            {activeSection === 'Notifications' && (
              <motion.div key="notif" {...tabVariants} className="max-w-2xl space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-500 mt-1">Choose how you want to be alerted.</p>
                </div>

                <div className="space-y-1">
                  <NotifToggle title="Order Updates" desc="Send notifications when a customer places an order." active={true} />
                  <NotifToggle title="Customer Inquiries" desc="Email me when a new support ticket is opened." active={true} />
                  <NotifToggle title="Stock Alerts" desc="Notify when product inventory falls below 10%." active={false} />
                  <NotifToggle title="Weekly Reports" desc="Send a summarized sales report every Monday." active={true} />
                </div>
                <ActionButtons />
              </motion.div>
            )}

            {/* 4. PERMISSIONS SECTION */}
            {activeSection === 'Permissions' && (
              <motion.div key="perm" {...tabVariants} className="max-w-2xl space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Role & Permissions</h2>
                  <p className="text-sm text-gray-500 mt-1">Your access level across the Rexora platform.</p>
                </div>

                <div className="p-6 bg-[#C1E1A6]/10 border border-[#C1E1A6]/20 rounded-4xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-black"><Shield size={24} /></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Super Admin Access</h4>
                      <p className="text-xs text-gray-500">Full control over the system</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Manage Users', 'Edit Billing', 'Product Catalog', 'Financial Reports', 'API Access', 'Delete Data'].map(p => (
                      <div key={p} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <div className="w-4 h-4 rounded-full bg-[#C1E1A6] flex items-center justify-center text-black"><Check size={10} /></div>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                  <h4 className="text-red-600 font-bold text-sm mb-1">Danger Zone</h4>
                  <p className="text-xs text-red-500/70 mb-4">Deleting your account is permanent and cannot be undone.</p>
                  <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all">Deactivate Account</button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// --- Helper Components ---

function InputGroup({ label, value, icon: Icon }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase ml-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />}
        <input
          type="text"
          defaultValue={value}
          className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C1E1A6] text-sm font-medium`}
        />
      </div>
    </div>
  );
}

function Toggle({ active }) {
  return (
    <div className={`w-11 h-6 rounded-full p-1 transition-colors ${active ? 'bg-[#C1E1A6]' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : ''}`} />
    </div>
  );
}

function DeviceItem({ icon: Icon, name, location, status }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="text-gray-400"><Icon size={20} /></div>
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{location} • {status}</p>
        </div>
      </div>
      <button className="text-xs font-bold text-red-500 px-3 py-1 hover:bg-white rounded-lg transition-colors">Log out</button>
    </div>
  );
}

function NotifToggle({ title, desc, active }) {
  const [isOn, setIsOn] = useState(active);
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <button onClick={() => setIsOn(!isOn)}><Toggle active={isOn} /></button>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
      <button className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:shadow-lg shadow-black/20 transition-all active:scale-95">
        <Check size={18} /> Save Changes
      </button>
      <button className="px-8 py-3 text-gray-500 text-sm font-bold hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
    </div>
  );
}