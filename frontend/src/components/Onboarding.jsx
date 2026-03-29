import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

export default function Onboarding({ user, setHasProfile }) {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Onboarding Form State
  const [profile, setProfile] = useState({
    name: '', year: '1st Year', branch: 'Computer Science',
    courses: '', learningStyle: 'Visual', scheduleFocus: 'Morning',
    sessionLength: '1-2 hours', availability: 'Weekdays Night', goals: ''
  });

  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const submitProfile = async () => {
    const formattedProfile = {
      firebaseUid: user.uid,
      name: profile.name,
      yearOfStudy: profile.year,
      branch: profile.branch,
      courses: profile.courses.split(',').map(s => s.trim()).filter(s => s !== ''),
      learningStyle: profile.learningStyle,
      scheduleFocus: profile.scheduleFocus,
      sessionLength: profile.sessionLength,
      availability: profile.availability,
      goals: profile.goals
    };

    try {
      await fetch('http://localhost:8080/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedProfile)
      });
      
      localStorage.setItem(`profile_${user.uid}`, JSON.stringify(formattedProfile));
      setHasProfile(true);
      navigate('/dashboard');
    } catch(err) {
      console.error("Failed to connect to matching server:", err);
      // Fallback local save if server is offline just so you can continue testing React
      localStorage.setItem(`profile_${user.uid}`, JSON.stringify(formattedProfile));
      setHasProfile(true);
      navigate('/dashboard');
    }
  };

  return (
    <div className="onboarding-container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Build Your Study Profile</h2>
        <p style={{ color: 'var(--text-secondary)' }}>AI will use this info to find your perfect study partners.</p>
      </div>

      <div className="step-indicator">
        {[1, 2, 3].map(s => (
          <div key={s} className={`step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
            {step > s ? <Check size={16} /> : s}
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Basic Information</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="e.g. Rahul Kumar" 
                     value={profile.name} onChange={e => updateProfile('name', e.target.value)} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Year of Study</label>
                <select className="form-select" value={profile.year} onChange={e => updateProfile('year', e.target.value)}>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Branch/Major</label>
                <select className="form-select" value={profile.branch} onChange={e => updateProfile('branch', e.target.value)}>
                  <option>Computer Science</option>
                  <option>Electrical Eng.</option>
                  <option>Mechanical Eng.</option>
                  <option>Information Tech.</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Current Courses (Comma Separated)</label>
              <input type="text" className="form-input" placeholder="Data Structures, DBMS, Mathematics"
                     value={profile.courses} onChange={e => updateProfile('courses', e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>Learning Style</h3>
            <div className="form-group">
              <label className="form-label">Primary Learning Style</label>
              <select className="form-select" value={profile.learningStyle} onChange={e => updateProfile('learningStyle', e.target.value)}>
                <option>Visual learner (diagrams/videos)</option>
                <option>Auditory learner (lectures/discussions)</option>
                <option>Reading/Writing</option>
                <option>Kinesthetic (hands-on practice)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">When are you most productive?</label>
              <select className="form-select" value={profile.scheduleFocus} onChange={e => updateProfile('scheduleFocus', e.target.value)}>
                <option>Morning person (8 AM - 12 PM)</option>
                <option>Afternoon (12 PM - 5 PM)</option>
                <option>Night owl (8 PM onwards)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ideal Session Length</label>
              <select className="form-select" value={profile.sessionLength} onChange={e => updateProfile('sessionLength', e.target.value)}>
                <option>Short Pomodoros (30-45 mins)</option>
                <option>Standard (1-2 hours)</option>
                <option>Deep Work (3+ hours)</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem', color: '#10b981' }}>Availability & Goals</h3>
            <div className="form-group">
              <label className="form-label">General Availability</label>
              <select className="form-select" value={profile.availability} onChange={e => updateProfile('availability', e.target.value)}>
                <option>Weekdays 6-8 PM</option>
                <option>Weekends 10 AM - 2 PM</option>
                <option>Late Nights</option>
                <option>Flexible</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">What's your primary goal?</label>
              <input type="text" className="form-input" placeholder="e.g. Score 9+ CGPA, Prepare for placements"
                     value={profile.goals} onChange={e => updateProfile('goals', e.target.value)} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => setStep(step - 1)}
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
          >
            <ChevronLeft size={18} /> Back
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={() => step === 3 ? submitProfile() : setStep(step + 1)}
            disabled={step === 1 && !profile.name}
          >
            {step === 3 ? 'Save Profile' : <><ChevronRight size={18} /> Next</>}
          </button>
        </div>
      </div>
    </div>
  );
}
