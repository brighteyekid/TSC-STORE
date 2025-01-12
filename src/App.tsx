import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Footer from './components/Footer';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { RegionProvider } from './context/RegionContext';
import RegionSelector from './components/RegionSelector';
import AdminRouteGuard from './components/AdminRouteGuard';
import { useEffect, useState } from 'react';
import Bootsplash from './components/Bootsplash';

// Add these type declarations at the top of the file, after imports
interface FirebugWindow extends Window {
  Firebug?: {
    chrome?: {
      isInitialized?: boolean;
    };
  };
}

// Layout component for main site
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </>
);

// Layout component for admin pages
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-primary">
    {children}
  </main>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        {/* Main site routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/products"
          element={
            <MainLayout>
              <Products />
            </MainLayout>
          }
        />
        <Route
          path="/products/:category"
          element={
            <MainLayout>
              <Products />
            </MainLayout>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminLayout>
                <AdminLogin />
              </AdminLayout>
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRouteGuard>
              <AdminLayout>
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              </AdminLayout>
            </AdminRouteGuard>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [showBootsplash, setShowBootsplash] = useState(true);

  return (
    <RegionProvider>
      <Router>
        {showBootsplash ? (
          <Bootsplash onComplete={() => setShowBootsplash(false)} />
        ) : (
          <AppContent />
        )}
      </Router>
    </RegionProvider>
  );
}

// Separate component to use router hooks
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const showBlockedMessage = () => {
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 9999;
      ">
        <h3>Developer Tools Disabled</h3>
        <p>For security reasons, developer tools are not available on this site.</p>
      </div>
    `;
    document.body.appendChild(message);
    setTimeout(() => document.body.removeChild(message), 3000);
  };

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showBlockedMessage();
  });

  document.addEventListener('keydown', (e) => {
    // Prevent F12
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }

    // Prevent Ctrl+Shift+I and Ctrl+Shift+J
    if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        // Prevent Ctrl+Shift+C
        (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
        // Prevent Ctrl+U
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))) {
      e.preventDefault();
      showBlockedMessage();
      return;
    }
  });

  // Additional protection against devtools
  const devtools = {
    isOpen: false,
    orientation: '' as string | null
  };

  const threshold = 160;

  const emitEvent = (isOpen: boolean, orientation: string | null) => {
    devtools.isOpen = isOpen;
    devtools.orientation = orientation;
  };

  const checkDevTools = ({ emitEvents = true } = {}) => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';

    const firefoxDevtools = ((window as unknown as FirebugWindow).Firebug?.chrome?.isInitialized) || false;

    if (
      !(heightThreshold && widthThreshold) &&
      (firefoxDevtools || widthThreshold || heightThreshold)
    ) {
      if (emitEvents && !devtools.isOpen) {
        emitEvent(true, orientation);
        window.location.reload();
      }
      return true;
    }
    if (emitEvents && devtools.isOpen) {
      emitEvent(false, null);
    }
    return false;
  };

  setInterval(checkDevTools, 1000);

  useEffect(() => {
    // Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Prevent F12
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }

      // Prevent Ctrl+Shift+I and Ctrl+Shift+J
      if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
          // Prevent Ctrl+Shift+C
          (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
          // Prevent Ctrl+U
          (e.ctrlKey && (e.key === 'U' || e.key === 'u'))) {
        e.preventDefault();
        return;
      }
    });

    // Additional protection against devtools
    const devtools = {
      isOpen: false,
      orientation: '' as string | null
    };

    const threshold = 160;

    const emitEvent = (isOpen: boolean, orientation: string | null) => {
      devtools.isOpen = isOpen;
      devtools.orientation = orientation;
    };

    const checkDevTools = ({ emitEvents = true } = {}) => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const orientation = widthThreshold ? 'vertical' : 'horizontal';

      const firefoxDevtools = ((window as unknown as FirebugWindow).Firebug?.chrome?.isInitialized) || false;

      if (
        !(heightThreshold && widthThreshold) &&
        (firefoxDevtools || widthThreshold || heightThreshold)
      ) {
        if (emitEvents && !devtools.isOpen) {
          emitEvent(true, orientation);
          window.location.reload();
        }
        return true;
      }
      if (emitEvents && devtools.isOpen) {
        emitEvent(false, null);
      }
      return false;
    };

    setInterval(checkDevTools, 1000);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-primary text-white">
      {!isAdminRoute && (
        <>
          <RegionSelector />
          <Navbar />
        </>
      )}
      <AnimatedRoutes />
    </div>
  );
}

export default App;
