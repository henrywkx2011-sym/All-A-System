import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, DollarSign, Menu, X, RefreshCw } from 'lucide-react';
import './APP.css';

// Copy of root component adapted to client
// (unchanged logic; uses fetch to http://localhost:3001/api/dashboard)

const MOCK_STUDENTS = [
  { id: 'S001', name: 'Ali bin Abu', level: 'Form 5', subject: 'SPM Add Maths', status: 'Active', phone: '+6012-3456789' },
  { id: 'S002', name: 'Sarah Lim', level: 'Year 11', subject: 'IGCSE Physics', status: 'Active', phone: '+6017-8889999' },
  { id: 'S003', name: 'Muthu Kumar', level: 'Form 4', subject: 'SPM Modern Maths', status: 'Pending', phone: '+6019-2223333' },
  { id: 'S004', name: 'Nurul Huda', level: 'Form 5', subject: 'SPM Add Maths', status: 'Active', phone: '+6013-5556666' },
  { id: 'S005', name: 'Jason Tan', level: 'Form 3', subject: 'PT3 Maths', status: 'Inactive', phone: '+6016-7778888' },
];

const MOCK_FEES = [
  { id: 'T1001', student: 'Ali bin Abu', amount: 120, date: '2025-10-01', status: 'Verified' },
  { id: 'T1002', student: 'Sarah Lim', amount: 150, date: '2025-10-02', status: 'Verified' },
  { id: 'T1003', student: 'Muthu Kumar', amount: 120, date: '-', status: 'Unpaid' },
];

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-4 transition-colors text-left ${
      active 
        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className={`text-xs mt-2 ${subtext.includes('+') ? 'text-green-600' : 'text-gray-400'}`}>
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Active: 'bg-green-100 text-green-700',
    Verified: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Unpaid: 'bg-red-100 text-red-700',
    Inactive: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

export default function TuitionManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);

  const refreshData = async () => {
    setIsLoading(true);
    setIsDemoMode(false);
    try {
      const response = await fetch('http://localhost:3001/api/dashboard');
      if (!response.ok) throw new Error('Server response was not ok');
      const data = await response.json();
      if (data.students) setStudents(data.students);
      if (data.fees) setFees(data.fees);
    } catch (error) {
      console.warn('Failed to connect to local server. Switching to Demo Mode.', error);
      setStudents(MOCK_STUDENTS);
      setFees(MOCK_FEES);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { refreshData(); }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'students':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Student Database</h2>
              <div className="flex gap-2">
                 <button onClick={refreshData} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                  <span>Sync DB</span>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Level / Subject</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.length === 0 ? (
                      <tr><td colSpan="4" className="p-4 text-center text-gray-500">No students found.</td></tr>
                    ) : (
                      students.map((student, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="p-4 font-medium text-gray-900">{student.name}</td>
                          <td className="p-4 text-gray-600">{student.level} • {student.subject}</td>
                          <td className="p-4"><StatusBadge status={student.status} /></td>
                          <td className="p-4 text-gray-600 font-mono text-sm">{student.phone}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'fees':
      case 'materials':
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome, Director</h2>
            {isDemoMode && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                <span className="font-bold">Note:</span> Server disconnected. Showing demo data. Ensure your Node.js backend is running on port 3001.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Students" value={students.length} subtext={isDemoMode ? "Demo Mode" : "Synced from Sheets"} icon={Users} color="bg-blue-500" />
              <StatCard title="Total Fees" value={fees.length} subtext="Records found" icon={DollarSign} color="bg-green-500" />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
              Use the sidebar to navigate to the <strong>Students</strong> tab to see live data.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h1 className="font-bold text-lg">All-A Edu</h1>
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
          </div>
          <nav className="flex-1 py-6 space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={Users} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
          <div className="flex-1 text-right">
             <span className={`text-xs font-bold px-2 py-1 rounded ${isLoading ? 'bg-blue-100 text-blue-800' : isDemoMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
               {isLoading ? 'SYNCING...' : isDemoMode ? 'DEMO MODE' : 'ONLINE'}
             </span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
