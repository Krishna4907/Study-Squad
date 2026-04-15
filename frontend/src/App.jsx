import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { BookOpen, LogOut } from 'lucide-react';

import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Connections from './components/Connections';
import StudyRoom from './components/StudyRoom';

// Landing Page
function Landing() {
  return (
    <div className="container app-wrapper animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }} className="auth-logo">StudySquad</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
        AI-powered matching for students. Find compatible study partners with the same courses, schedule, and learning style to boost your productivity.
      </p>
      <Link to="/auth" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
        Get Started
      </Link>
    </div>
  );
}

function Navbar({ user }) {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
          <BookOpen color="white" size={24} />
        </div>
        <span className="auth-logo" style={{ fontSize: '1.5rem', margin: 0 }}>StudySquad</span>
      </Link>
      
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
          <Link to="/network" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Network</Link>
          <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
          <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem' }}>
           <Link to="/auth" className="btn btn-outline">Login</Link>
           <Link to="/auth" className="btn btn-primary">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile status simulation. In reality, we'd check if user has filled profile in backend.
  const [hasProfile, setHasProfile] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Faking profile check for demo. If user has 'hasProfile' in localStorage, set to true.
      if (currentUser && localStorage.getItem(`profile_${currentUser.uid}`)) {
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={!user ? <Landing /> : <Navigate to={hasProfile ? "/dashboard" : "/onboarding"} />} />
            <Route path="/auth" element={!user ? <Auth /> : <Navigate to={hasProfile ? "/dashboard" : "/onboarding"} />} />
            <Route path="/onboarding" element={user ? <Onboarding user={user} setHasProfile={setHasProfile} /> : <Navigate to="/auth" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="/network" element={user ? <Connections /> : <Navigate to="/auth" />} />
            <Route path="/room/:roomId" element={user ? <StudyRoom /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
