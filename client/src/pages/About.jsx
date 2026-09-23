import React from 'react';
import { Sparkles, Trophy, ShieldCheck, Heart, Award, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="badge badge-cultural" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={14} /> ABOUT SPOORTHI
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '0.75rem', fontFamily: 'Outfit' }}>
          Empowering College Talent & Innovation
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto' }}>
          SPOORTHI is the annual national inter-college fest platform designed to streamline event organization, student registrations, attendance check-ins, and mock payments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <Trophy size={36} color="#6366f1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>Our Mission</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
            To foster healthy competition, artistic expression, academic debate, and athletic prowess across colleges nationwide through a seamless digital experience.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <ShieldCheck size={36} color="#a855f7" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>Role-Based Access</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Admins oversee fest setup & coordinators. Coordinators manage assigned events & attendance. Students register, make mock payments, and track digital passes.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <Award size={36} color="#f59e0b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>Real-time Notifications</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Instant alerts for venue updates, schedule changes, coordinator announcements, and registration confirmations keep all participants updated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
