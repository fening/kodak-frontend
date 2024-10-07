import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import RecordList from './pages/RecordList';
import RecordDetail from './pages/RecordDetail';
import RecordForm from './pages/RecordForm';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import { getCurrentUser, User, isAuthenticated } from './services/AuthService';

const AppContent: React.FC = () => {
  const hideOnPaths = ['/login', '/register'];
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserInfo = () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      if (!newIsDesktop) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const shouldShowSidebarAndHeader = !hideOnPaths.includes(location.pathname) && isAuthenticated();

  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/records':
        return 'Records';
      case '/records/new':
        return 'New Record';
      case '/settings':
        return 'Settings';
      case '/profile':
        return 'Profile';
      default:
        if (pathname.startsWith('/records/') && pathname.endsWith('/edit')) {
          return 'Edit Record';
        } else if (pathname.startsWith('/records/')) {
          return 'Record Details';
        }
        return 'Page Not Found';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-white">
      {shouldShowSidebarAndHeader && (
        <Sidebar 
          isOpen={sidebarOpen} 
          isDesktop={isDesktop} 
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
        />
      )}
      <div className={`flex flex-col flex-1 overflow-hidden ${shouldShowSidebarAndHeader ? (sidebarOpen && isDesktop ? 'ml-64' : 'ml-0') : 'w-full'}`}>
        {shouldShowSidebarAndHeader && (
          <Header 
            toggleSidebar={toggleSidebar} 
            username={user?.user.username || ''}
            pageTitle={getPageTitle(location.pathname)}
            showMenuButton={!sidebarOpen || !isDesktop}
          />
        )}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${shouldShowSidebarAndHeader ? 'p-4' : ''}`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/records" element={<PrivateRoute><RecordList /></PrivateRoute>} />
            <Route path="/records/new" element={<PrivateRoute><RecordForm /></PrivateRoute>} />
            <Route path="/records/:id/edit" element={<PrivateRoute><RecordForm /></PrivateRoute>} />
            <Route path="/records/:id" element={<PrivateRoute><RecordDetail /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {shouldShowSidebarAndHeader && <Footer />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;