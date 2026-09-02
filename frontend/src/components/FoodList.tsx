import React from 'react';
import { Plus, Tag, Utensils } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
}

const mockFoods: FoodItem[] = [
  {
    id: '1',
    name: 'Pechuga de Pollo a la Plancha',
    serving: '150g',
    calories: 247,
    protein: 46.5,
    carbs: 0,
    fat: 5.4,
    tags: ['Proteico', 'Almuerzo']
  },
  {
    id: '2',
    name: 'Avena con Leche y Plátano',
    serving: '1 tazón (250g)',
    calories: 320,
    protein: 12,
    carbs: 58,
    fat: 6,
    tags: ['Desayuno', 'Energía']
  },
  {
    id: '3',
    name: 'Huevos Revueltos con Espinaca',
    serving: '2 unidades',
    calories: 180,
    protein: 14,
    carbs: 2,
    fat: 13,
    tags: ['Keto', 'Desayuno']
  }
];

export const FoodList: React.FC = () => {
  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Utensils size={20} color="var(--accent-blue)" /> Registro de Alimentos
        </h2>
        <button className="btn btn-primary">
          <Plus size={18} /> Agregar Alimento
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mockFoods.map((food) => (
          <div
            key={food.id}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '1rem' }}>{food.name}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({food.serving})</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {food.tags.map((tag) => (
                  <span key={tag} className="badge badge-tag" style={{ fontSize: '0.65rem' }}>
                    <Tag size={10} style={{ display: 'inline', marginRight: '3px' }} /> {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                {food.calories} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>kcal</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
