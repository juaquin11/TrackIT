import React from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { DailySummary } from './components/DailySummary';
import { SavedMealsList } from './components/SavedMealsList';
import { Bell, Activity, LayoutTemplate, BookOpen, TrendingUp, MoreHorizontal } from 'lucide-react';
import './index.css';

const App: React.FC = () => {
  const { user, targets, consumed, loading, error, addConsumed } = useDashboardData();

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="profile-pic">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" />
        </div>
        <div className="logo">
          <span className="accent">Track</span>IT
        </div>
        <div className="bell-icon-wrapper">
          <Bell size={20} color="var(--text-secondary)" />
          <div className="bell-dot"></div>
        </div>
      </header>

      {/* Greeting */}
      <div className="greeting-section">
        <h1 className="greeting-title">¡Bienvenido de vuelta, Alex!</h1>
        <div className="greeting-date">{dateStr}</div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {error && (
          <div className="card" style={{ borderColor: 'var(--color-carbs)', marginBottom: '16px' }}>
            <p style={{ color: 'var(--color-carbs)', fontSize: '0.85rem' }}>
              ⚠ {error}
            </p>
          </div>
        )}

        <DailySummary targets={targets} consumed={consumed} loading={loading} />

        <div style={{ marginTop: '24px' }}>
          <SavedMealsList onMealApplied={addConsumed} userId={user?.id} />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-item active">
          <LayoutTemplate size={24} />
          <span>Inicio</span>
        </div>
        <div className="nav-item">
          <BookOpen size={24} />
          <span>Diario</span>
        </div>
        <div className="nav-item">
          <Activity size={24} />
          <span>Comidas</span>
        </div>
        <div className="nav-item">
          <TrendingUp size={24} />
          <span>Progreso</span>
        </div>
        <div className="nav-item">
          <MoreHorizontal size={24} />
          <span>Más</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
