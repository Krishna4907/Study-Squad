import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, Video, UserPlus, Check, X } from 'lucide-react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Connections() {
  const [pending, setPending] = useState([]);
  const [network, setNetwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    const user = auth.currentUser;
    if(!user) return;
    setLoading(true);
    try {
      // Pending
      const pendingRes = await fetch(`http://localhost:8080/api/connections/pending/${user.uid}`);
      if(pendingRes.ok) setPending(await pendingRes.json());
      
      // Network
      const networkRes = await fetch(`http://localhost:8080/api/connections/network/${user.uid}`);
      if(networkRes.ok) setNetwork(await networkRes.json());
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleRespond = async (requestId, action) => {
      // If accepting, we could schedule it, but for Phase 3 we'll default to "Now"
      const res = await fetch('http://localhost:8080/api/connections/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              requestId: requestId.toString(),
              action: action,
              scheduledTime: "Flexible"
          })
      });
      if(res.ok) {
          fetchConnections(); // Refresh lists
      }
  };

  const currentProfileId = JSON.parse(localStorage.getItem(`profile_${auth.currentUser?.uid}`) || '{}').id;

  return (
    <div className="container app-wrapper animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Study Network</h1>

      {loading ? (
          <div className="loader-container"><div className="spinner"></div></div>
      ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              
              {/* Incoming Requests Section */}
              <section>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fbbf24' }}>
                      <Clock size={20} /> Pending Requests ({pending.length})
                  </h3>
                  {pending.length === 0 ? (
                      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No pending requests. Keep looking at your matches!
                      </div>
                  ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                          {pending.map(req => (
                              <div key={req.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                  <div>
                                      <h4 style={{ fontSize: '1.2rem' }}>{req.sender?.name}</h4>
                                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Wants to study with you</p>
                                  </div>
                                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                                      "{req.message}"
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                      <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => handleRespond(req.id, 'ACCEPT')}>
                                          <Check size={16} /> Accept
                                      </button>
                                      <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }} onClick={() => handleRespond(req.id, 'REJECT')}>
                                          <X size={16} /> Decline
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </section>

              {/* Accepted Network Section */}
              <section>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#4ade80' }}>
                      <UserCheck size={20} /> Your Study Partners ({network.length})
                  </h3>
                  {network.length === 0 ? (
                      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          You haven't connected with anyone yet.
                      </div>
                  ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                          {network.map(req => {
                              const partner = req.sender.id === currentProfileId ? req.receiver : req.sender;
                              return (
                                  <div key={req.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                      <div>
                                          <h4 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{partner?.name || 'Partner'}</h4>
                                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status: Active Partner</p>
                                      </div>
                                      <button 
                                          className="btn btn-primary" 
                                          style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', border: 'none' }}
                                          onClick={() => navigate(`/room/${req.meetRoomId}`)}
                                      >
                                          <Video size={16} /> Join Virtual Room
                                      </button>
                                  </div>
                              );
                          })}
                      </div>
                  )}
              </section>
          </div>
      )}
    </div>
  );
}
