import React from 'react';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* Header temporal */}
      <header style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--accent-neon)' }}>T</span>TrackIT
        </h1>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)' }} />
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '0 24px 100px 24px' }}>
        <h2 style={{ marginBottom: '4px' }}>Welcome Back!</h2>
        <p style={{ marginBottom: '24px' }}>Monday, Oct 28</p>
        
        {/* Prueba del Glassmorphism */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Configuración Inicial Lista</h3>
          <p>El sistema de diseño con glassmorphism y modo oscuro está funcionando correctamente.</p>
        </div>
      </main>

      {/* Bottom Navigation Placeholder */}
      <nav className="glass-panel" style={{ 
        position: 'fixed', 
        bottom: '24px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '432px',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-around',
        borderRadius: 'var(--border-radius-lg)',
        zIndex: 100
      }}>
        <div style={{ color: 'var(--accent-neon)' }}>Dashboard</div>
        <div style={{ color: 'var(--text-secondary)' }}>Planner</div>
        <div style={{ color: 'var(--text-secondary)' }}>Profile</div>
      </nav>
    </div>
  );
};

export default App;
