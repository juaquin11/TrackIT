import React from 'react';
import { Flame, Dumbbell, Wheat, Droplet } from 'lucide-react';

interface MacroMetricProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
}

const MacroMetric: React.FC<MacroMetricProps> = ({ label, current, target, unit, color, icon }) => {
  const percentage = Math.min(100, Math.round((current / target) * 100));

  return (
    <div style={{ flex: 1, minWidth: '130px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {icon} {label}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{current}/{target}{unit}</span>
      </div>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
};

export const DailySummary: React.FC = () => {
  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Resumen Nutricional Hoy</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Meta Diaria</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem'
      }}>
        <MacroMetric
          label="Calorías"
          current={1450}
          target={2200}
          unit=" kcal"
          color="var(--accent-amber)"
          icon={<Flame size={16} color="var(--accent-amber)" />}
        />
        <MacroMetric
          label="Proteínas"
          current={110}
          target={160}
          unit="g"
          color="var(--accent-blue)"
          icon={<Dumbbell size={16} color="var(--accent-blue)" />}
        />
        <MacroMetric
          label="Carbohidratos"
          current={140}
          target={220}
          unit="g"
          color="var(--accent-purple)"
          icon={<Wheat size={16} color="var(--accent-purple)" />}
        />
        <MacroMetric
          label="Grasas"
          current={45}
          target={70}
          unit="g"
          color="var(--accent-emerald)"
          icon={<Droplet size={16} color="var(--accent-emerald)" />}
        />
      </div>
    </section>
  );
};
