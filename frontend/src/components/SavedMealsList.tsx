import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { fetchSavedMeals, applySavedMeal } from '../services/api';

interface SavedMealItem {
  id: number;
  gramos: number;
  food: { id: number; nombre: string; porcionBase: number; calorias: number; proteinas: number; carbohidratos: number; grasas: number };
}

interface SavedMeal {
  id: number;
  nombre: string;
  categoria: string; // Breakfast, Lunch, etc
  items: SavedMealItem[];
  totales: { calorias: number; proteinas: number; carbohidratos: number; grasas: number };
}

interface SavedMealsListProps {
  onMealApplied: (macros: { calorias: number; proteinas: number; carbohidratos: number; grasas: number }) => void;
}

export const SavedMealsList: React.FC<SavedMealsListProps> = ({ onMealApplied }) => {
  const [meals, setMeals] = useState<SavedMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const data = await fetchSavedMeals();
      // Map category strings to match the mockup if they are simple numbers/IDs in the DB
      const mappedData = data.map((meal: any, index: number) => ({
        ...meal,
        categoria: index === 0 ? 'Desayuno' : (index === 1 ? 'Almuerzo' : 'Cena'),
        timeStr: index === 0 ? '7:30 AM' : (index === 1 ? '1:00 PM' : '8:00 PM'),
      }));
      setMeals(mappedData);
    } catch (err) {
      console.error('Error cargando platos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (meal: SavedMeal) => {
    if (appliedIds.has(meal.id)) return;
    try {
      setApplyingId(meal.id);
      const result = await applySavedMeal(meal.id);
      onMealApplied(result.totalesAplicados);
      setAppliedIds(new Set(appliedIds).add(meal.id));
      setToast(`"${meal.nombre}" registrado ✓`);
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error('Error aplicando plato:', err);
    } finally {
      setApplyingId(null);
    }
  };

  const calcItemCals = (item: SavedMealItem) => {
    const ratio = item.gramos / item.food.porcionBase;
    return Math.round(item.food.calorias * ratio);
  };

  if (loading) {
    return (
      <div className="section-container">
        <div className="section-header-row">
          <h2 className="section-title">Mis Platos</h2>
          <span className="section-date-right">Hoy</span>
        </div>
        <div className="meal-planner-grid">
          {[1, 2].map(i => (
            <div key={i} className="meal-card-glass">
              <div className="loading-skeleton" style={{ height: '220px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header-row">
        <h2 className="section-title">Mis Platos</h2>
        <span className="section-date-right">Hoy</span>
      </div>

      <div className="meal-planner-grid">
        {meals.map((meal: any) => {
          const isApplied = appliedIds.has(meal.id);
          return (
            <div 
              key={meal.id} 
              className={`meal-card-glass ${isApplied ? 'applied' : ''}`}
              onClick={() => !isApplied && handleApply(meal)}
              style={{ cursor: isApplied ? 'default' : 'pointer' }}
            >
              {/* Header: Breakfast / Time / Check */}
              <div className="meal-card-top">
                <span className="meal-card-cat">{meal.categoria}</span>
                <div className="meal-card-time-wrapper">
                  <span className="meal-card-time">{meal.timeStr}</span>
                  {isApplied ? <Check size={14} color="var(--text-secondary)" /> : <Check size={14} color="rgba(255,255,255,0.2)" />}
                </div>
              </div>

              {/* Title & Summary */}
              <div className="meal-card-title">{meal.nombre}</div>
              <div className="meal-card-summary">
                {meal.totales.calorias} kcal | P: {meal.totales.proteinas}g C: {meal.totales.carbohidratos}g G: {meal.totales.grasas}g
              </div>

              {/* Ingredients List */}
              <div className="meal-ingredients-title">Ingredientes</div>
              <div className="meal-ingredients-list">
                {meal.items.map((item: any) => (
                  <div key={item.id} className="ingredient-row">
                    <span className="ing-name">{item.food.nombre}</span>
                    <div className="ing-stats">
                      <span className="ing-grams">{item.gramos}g</span>
                      <span className="ing-cals">{calcItemCals(item)} kcal</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Overlay loading state */}
              {applyingId === meal.id && (
                <div className="meal-card-overlay">
                  Registrando...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};
