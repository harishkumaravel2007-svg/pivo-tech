import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Founder } from './pages/Founder';
import { Services } from './pages/Services';
import { Portfolio } from './pages/Portfolio';
import { Reviews } from './pages/Reviews';
import { Contact } from './pages/Contact';

// Admin Pages
import { AdminLogin } from './pages/AdminLogin';
import { DashboardLayout } from './pages/AdminDashboard/DashboardLayout';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper for public layout with Navbar & Footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />
          <Route
            path="/founder"
            element={
              <PublicLayout>
                <Founder />
              </PublicLayout>
            }
          />
          <Route
            path="/services"
            element={
              <PublicLayout>
                <Services />
              </PublicLayout>
            }
          />
          <Route path="/skills" element={<Navigate to="/services" replace />} />
          <Route
            path="/portfolio"
            element={
              <PublicLayout>
                <Portfolio />
              </PublicLayout>
            }
          />
          <Route path="/achievements" element={<Navigate to="/portfolio" replace />} />
          <Route
            path="/reviews"
            element={
              <PublicLayout>
                <Reviews />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<DashboardLayout />} />

          {/* Catch-all redirect to Home */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
