import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, ExternalLink } from 'lucide-react';

export default function StudyRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const roomUrl = `https://meet.ffmuc.net/studysquad-${roomId}`;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center' }}>
        <button className="btn btn-outline" onClick={() => navigate('/network')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Network
        </button>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
        <Video size={64} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Ready to study?</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
          To bypass browser security restrictions on camera and microphone usage, 
          your private encrpyted StudySquad room will open safely in a new tab!
        </p>

        <a 
          href={roomUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-primary" 
          style={{ padding: '1rem 2.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
           Launch Video Room <ExternalLink size={20} />
        </a>
      </div>
    </div>
  );
}
