import React, { useState, useEffect } from 'react';
import { Plus, Search, LogOut } from 'lucide-react';
import { JobApplication, JobApplicationFormData } from './types';
import { fetchApplications, addApplicationToDb, updateApplicationInDb, deleteApplicationFromDb } from './services/storage';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import JobTable from './components/JobTable';
import Modal from './components/Modal';
import ConfirmationDialog from './components/ConfirmationDialog';
import JobForm from './components/JobForm';
import JobDetailsView from './components/JobDetailsView';
import Button from './components/Button';
import Login from './components/Login';

// Robust ID generator for client-side optimistic updates if needed, 
// though we usually use ID passed to DB.
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | undefined>(undefined);
  const [viewingApp, setViewingApp] = useState<JobApplication | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch data when user logs in
  useEffect(() => {
    if (user) {
      setDataLoading(true);
      fetchApplications(user.uid)
        .then(data => {
          setApplications(data);
        })
        .catch(err => console.error("Failed to load apps", err))
        .finally(() => setDataLoading(false));
    } else {
      setApplications([]);
    }
  }, [user]);

  const handleLogout = () => {
    signOut(auth);
  };

  const handleAddClick = () => {
    setEditingApp(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (app: JobApplication) => {
    setViewingApp(undefined);
    setIsViewModalOpen(false);
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleViewClick = (app: JobApplication) => {
    setViewingApp(app);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId && user) {
      try {
        await deleteApplicationFromDb(user.uid, deleteId);
        setApplications(prev => prev.filter(app => app.id !== deleteId));
        
        // Close detail view if it was the one being deleted
        if (viewingApp?.id === deleteId) {
          setIsViewModalOpen(false);
          setViewingApp(undefined);
        }
      } catch (e) {
        alert("Failed to delete application.");
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleFormSubmit = async (data: JobApplicationFormData) => {
    if (!user) return;

    try {
      if (editingApp) {
        // Update existing
        const updatedApp = { ...editingApp, ...data };
        await updateApplicationInDb(user.uid, updatedApp);
        
        setApplications(prev => prev.map(app => 
          app.id === editingApp.id ? updatedApp : app
        ));
      } else {
        // Create new
        const newApp: JobApplication = {
          id: generateId(),
          ...data
        };
        await addApplicationToDb(user.uid, newApp);
        setApplications(prev => [newApp, ...prev]);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save application to database.");
    }
  };

  const filteredApplications = applications.filter(app => 
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return <Login />;
  }

  // Main App
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Title and Logo removed */}
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-slate-500 mr-2">
                {applications.length} applications tracked
              </div>
              <Button onClick={handleAddClick} icon={Plus}>
                Add New
              </Button>
              <Button onClick={handleLogout} variant="secondary" icon={LogOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
            <p className="mt-1 text-sm text-slate-500">Manage and track your job search progress.</p>
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search companies..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State for Data */}
        {dataLoading ? (
          <div className="py-20 flex justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <JobTable 
            applications={filteredApplications} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick}
            onView={handleViewClick}
          />
        )}
        
      </main>

      {/* Form Modal (Add/Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? "Edit Application" : "New Application"}
      >
        <JobForm
          initialData={editingApp}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Application Details"
      >
        {viewingApp && (
          <JobDetailsView 
            application={viewingApp}
            onClose={() => setIsViewModalOpen(false)}
            onEdit={() => handleEditClick(viewingApp)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Application"
        message="Are you sure you want to delete this job application? This action cannot be undone."
      />

    </div>
  );
}

export default App;