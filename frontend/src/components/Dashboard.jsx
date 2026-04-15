import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Clock, CheckCircle, RefreshCcw } from 'lucide-react';
import { auth } from '../firebase';

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleConnect = async (receiverId) => {
    try {
      const response = await fetch('http://localhost:8080/api/connections/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderFirebaseUid: auth.currentUser?.uid,
          receiverId: receiverId.toString(),
          message: "Hey! Let's study together!"
        })
      });
      if (response.ok) {
        alert("Request sent successfully!");
      } else {
        const text = await response.text();
        alert("Notice: " + text);
      }
    } catch(err) {
      alert("Error sending request.");
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
    if (!user) return;

    // Load local profile copy for sidebar info
    const localProfile = JSON.parse(localStorage.getItem(`profile_${user.uid}`) || '{}');
    setProfile(localProfile);

    try {
      let coursesArray = localProfile.courses;
      if (typeof coursesArray === 'string') {
        coursesArray = coursesArray.split(',').map(s => s.trim()).filter(s => s !== '');
      }

      // Auto-sync local profile to the Database just in case it was created while offline
      await fetch('http://localhost:8080/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...localProfile, courses: coursesArray, firebaseUid: user.uid })
      });

      const response = await fetch('http://localhost:8080/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUid: user.uid })
      });
      
      if(!response.ok) throw new Error("Match Server unreachable");
      
      const data = await response.json();
      setMatches(data);
    } catch(err) {
      setError(err.message);
      console.error("Could not fetch matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="container app-wrapper animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Your Study Squad Matches</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            AI analyzed your profile against all registered users.
          </p>
        </div>
        <button className="btn btn-outline" onClick={fetchMatches} disabled={loading}>
          <RefreshCcw size={16} className={loading ? "spinner" : ""} /> Refresh
        </button>
      </div>

      <div className="dashboard-grid">
        <aside className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} color="var(--primary)" /> Your Profile Tracker
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Branch</div>
              <div style={{ fontWeight: 600 }}>{profile?.branch || "-"}</div>
            </li>
            <li>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tracking Courses</div>
              <div className="match-tags">
                {(Array.isArray(profile?.courses) 
                    ? profile.courses 
                    : (typeof profile?.courses === 'string' ? profile.courses.split(',') : [])
                  ).map((c, i) => (
                  <span key={i} className="tag tag-shared">{c.trim ? c.trim() : c}</span>
                ))}
              </div>
            </li>
            <li>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Primary Style</div>
              <div className="tag">{profile?.learningStyle || "-"}</div>
            </li>
          </ul>
        </aside>

        <main>
          {loading ? (
             <div className="loader-container"><div className="spinner"></div></div>
          ) : error ? (
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#fbbf24' }}>
                <h3>Cannot Connect to Database</h3>
                <p>Ensure the Java Spring Boot Backend is running at localhost:8080</p>
             </div>
          ) : matches.length === 0 ? (
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-secondary)' }}>No Matches Found Yet</h3>
                <p style={{ marginTop: '0.5rem' }}>Wait for more students to register with similar courses, or widen your interests!</p>
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matches.map(match => (
                <div key={match.profileId} className="glass-panel match-card">
                  <div className="match-header">
                    <div className="match-info">
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {match.name} 
                        <span style={{ fontSize: '0.9rem', color: '#fbbf24', display: 'flex', alignItems: 'center' }}>
                          <Star size={16} fill="currentColor" stroke="none" /> {match.rating}
                        </span>
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={14} /> {match.recentActivity}
                      </p>
                    </div>
                    <div className="match-score">
                      <div className="score-badge">
                        {match.compatibilityPercentage}% Compatible
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '1rem 0', margin: '0.5rem 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shared Courses</span>
                        <div className="match-tags mt-1">
                          {match.sharedCourses.map(c => <span key={c} className="tag tag-shared">{c}</span>)}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Why it's a match</span>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{match.availabilityInfo}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{match.styleMatch}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem 1rem' }}
                      onClick={() => handleConnect(match.profileId)}
                    >
                      <MessageCircle size={16}/> Send Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
