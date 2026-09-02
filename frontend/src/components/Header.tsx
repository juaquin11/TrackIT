import React from 'react';
import { Activity, Smartphone } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Activity size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>TrackIT</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Seguimiento Nutricional & PWA</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="badge badge-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Smartphone size={12} /> PWA Ready
        </span>
      </div>
    </header>
  );
};
