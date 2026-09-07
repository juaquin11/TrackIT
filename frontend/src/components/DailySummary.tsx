import React from 'react';
import { Targets } from '../hooks/useDashboardData';

interface DailySummaryProps {
  targets: Targets | null;
  consumed: { calorias: number; proteinas: number; carbohidratos: number; grasas: number };
  loading: boolean;
}

interface RingProps {
  current: number;
  target: number;
  color: string;
  size: number;
  strokeWidth: number;
}

const ProgressRing: React.FC<RingProps> = ({ current, target, color, size, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)' }}
      />
    </svg>
  );
};

interface ArcProps {
  current: number;
  target: number;
  color: string;
  size: number;
  strokeWidth: number;
}

const ProgressArc: React.FC<ArcProps> = ({ current, target, color, size, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const arcLength = Math.PI * radius;
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = arcLength - (percentage / 100) * arcLength;

  return (
    <svg width={size} height={size / 2 + strokeWidth} style={{ overflow: 'visible' }}>
      <path
        d={`M ${strokeWidth/2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${cy}`}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={`M ${strokeWidth/2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${arcLength} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)' }}
      />
    </svg>
  );
};

export const DailySummary: React.FC<DailySummaryProps> = ({ targets, consumed, loading }) => {
  if (loading || !targets) {
    return (
      <div className="section-container">
        <h2 className="section-title">Macros Diarios</h2>
        <div className="macros-rings-container">
          <div className="loading-skeleton" style={{ width: '220px', height: '110px', borderRadius: '110px 110px 0 0', margin: '0 auto' }} />
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="loading-skeleton" style={{ width: '70px', height: '70px', borderRadius: '50%' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const protPct = targets.proteinas > 0 ? Math.min(100, Math.round((consumed.proteinas / targets.proteinas) * 100)) : 0;
  const carbPct = targets.carbohidratos > 0 ? Math.min(100, Math.round((consumed.carbohidratos / targets.carbohidratos) * 100)) : 0;
  const fatPct = targets.grasas > 0 ? Math.min(100, Math.round((consumed.grasas / targets.grasas) * 100)) : 0;
  const calRemaining = targets.caloriasObjetivo - consumed.calorias;

  return (
    <div className="section-container">
      <h2 className="section-title">Macros Diarios</h2>

      <div className="macros-rings-container">
        
        {/* Arco grande de Calorías */}
        <div className="arc-calories-container">
          <div className="arc-wrapper">
            <ProgressArc
              current={consumed.calorias}
              target={targets.caloriasObjetivo}
              color="var(--color-calories-ring)"
              size={240}
              strokeWidth={14}
            />
            <div className="arc-label-center">
              <span className="arc-label-value">{calRemaining > 0 ? calRemaining : 0}</span>
              <span className="arc-label-title">kcal restantes</span>
            </div>
          </div>
        </div>

        {/* 3 Anillos pequeños de Macros */}
        <div className="ring-macros-group">
          {/* Proteínas */}
          <div className="ring-macro-item">
            <span className="ring-macro-title">Proteínas</span>
            <div className="ring-wrapper-small">
              <ProgressRing
                current={consumed.proteinas}
                target={targets.proteinas}
                color="var(--color-protein)"
                size={70}
                strokeWidth={6}
              />
              <div className="ring-label-center-small">
                <span className="ring-small-value">{consumed.proteinas}g</span>
                <span className="ring-small-detail">de {targets.proteinas}g</span>
              </div>
            </div>
          </div>

          {/* Carbohidratos */}
          <div className="ring-macro-item">
            <span className="ring-macro-title">Carbos</span>
            <div className="ring-wrapper-small">
              <ProgressRing
                current={consumed.carbohidratos}
                target={targets.carbohidratos}
                color="var(--color-carbs)"
                size={70}
                strokeWidth={6}
              />
              <div className="ring-label-center-small">
                <span className="ring-small-value">{consumed.carbohidratos}g</span>
                <span className="ring-small-detail">de {targets.carbohidratos}g</span>
              </div>
            </div>
          </div>

          {/* Grasas */}
          <div className="ring-macro-item">
            <span className="ring-macro-title">Grasas</span>
            <div className="ring-wrapper-small">
              <ProgressRing
                current={consumed.grasas}
                target={targets.grasas}
                color="var(--color-fats)"
                size={70}
                strokeWidth={6}
              />
              <div className="ring-label-center-small">
                <span className="ring-small-value">{consumed.grasas}g</span>
                <span className="ring-small-detail">de {targets.grasas}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar en español */}
      <div className="quick-stats-bar">
        <div className="stat-item">
          <span className="stat-label">Agua:</span> <span className="stat-val">2.1L</span>/3L
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">Pasos:</span> <span className="stat-val">8,450</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">Gym:</span> <span className="stat-val">Listo</span>
        </div>
      </div>

    </div>
  );
};
