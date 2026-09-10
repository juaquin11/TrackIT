import React, { useState } from 'react';
import { X, Check, RefreshCw, CheckCircle2 } from 'lucide-react';
import { generateDailyPlan } from '../services/api';

interface MealPlanWizardProps {
  onClose: () => void;
  onPlanApplied: (plan: any) => void;
  userId: number;
}

const AVAILABLE_MEALS = [
  'Desayuno',
  'Almuerzo',
  'Merienda',
  'Cena',
  'Pre-entreno',
  'Post-entreno'
];

type TrainingTime = 'Mañana' | 'Mediodía' | 'Tarde' | 'Noche' | null;

export const MealPlanWizard: React.FC<MealPlanWizardProps> = ({ onClose, onPlanApplied, userId }) => {
  const [selectedMeals, setSelectedMeals] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [trainingTime, setTrainingTime] = useState<TrainingTime>(null);
  
  // Guardamos el array de nombres ordenados para poder regenerar
  const [orderedMealNames, setOrderedMealNames] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<any[] | null>(null);
  const [planTargets, setPlanTargets] = useState<any>(null);

  const needsTrainingTime = selectedMeals.has('Pre-entreno') || selectedMeals.has('Post-entreno');

  const toggleMeal = (meal: string) => {
    const newSelected = new Set(selectedMeals);
    if (newSelected.has(meal)) {
      newSelected.delete(meal);
    } else {
      newSelected.add(meal);
    }
    setSelectedMeals(newSelected);
  };

  const handleNext = () => {
    if (selectedMeals.size === 0) return;
    
    if (needsTrainingTime) {
      setStep(2);
    } else {
      prepareAndFetchPlan(null);
    }
  };

  const prepareAndFetchPlan = async (time: TrainingTime) => {
    const baseOrder = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
    const finalPlan: string[] = [];
    
    const insertIfSelected = (meal: string) => {
      if (selectedMeals.has(meal)) finalPlan.push(meal);
    };

    if (time === 'Mañana') {
      insertIfSelected('Pre-entreno');
      insertIfSelected('Desayuno');
      insertIfSelected('Post-entreno');
      insertIfSelected('Almuerzo');
      insertIfSelected('Merienda');
      insertIfSelected('Cena');
    } else if (time === 'Mediodía') {
      insertIfSelected('Desayuno');
      insertIfSelected('Pre-entreno');
      insertIfSelected('Almuerzo');
      insertIfSelected('Post-entreno');
      insertIfSelected('Merienda');
      insertIfSelected('Cena');
    } else if (time === 'Tarde') {
      insertIfSelected('Desayuno');
      insertIfSelected('Almuerzo');
      insertIfSelected('Pre-entreno');
      insertIfSelected('Merienda');
      insertIfSelected('Post-entreno');
      insertIfSelected('Cena');
    } else if (time === 'Noche') {
      insertIfSelected('Desayuno');
      insertIfSelected('Almuerzo');
      insertIfSelected('Merienda');
      insertIfSelected('Pre-entreno');
      insertIfSelected('Cena');
      insertIfSelected('Post-entreno');
    } else {
      baseOrder.forEach(insertIfSelected);
    }

    setOrderedMealNames(finalPlan);
    await fetchPlanFromAPI(finalPlan);
  };

  const fetchPlanFromAPI = async (mealsArray: string[]) => {
    try {
      setStep(3); // Cargando
      const result = await generateDailyPlan(userId, mealsArray);
      setGeneratedPlan(result.plan);
      setPlanTargets(result.targets);
      setStep(4); // Resultados
    } catch (error) {
      console.error('Error generando plan:', error);
      alert('Hubo un error al generar el plan. Intenta de nuevo.');
      setStep(needsTrainingTime ? 2 : 1);
    }
  };

  const handleApply = () => {
    onPlanApplied(generatedPlan);
  };

  const calculateTotalPlanMacros = () => {
    if (!generatedPlan) return { proteinas: 0, carbohidratos: 0, grasas: 0, calorias: 0 };
    return generatedPlan.reduce((acc, meal) => {
      acc.proteinas += meal.totales.proteinas;
      acc.carbohidratos += meal.totales.carbohidratos;
      acc.grasas += meal.totales.grasas;
      acc.calorias += meal.totales.calorias;
      return acc;
    }, { proteinas: 0, carbohidratos: 0, grasas: 0, calorias: 0 });
  };

  return (
    <div className="wizard-overlay">
      <div className="wizard-modal">
        <button className="wizard-close" onClick={onClose}>
          <X size={20} />
        </button>

        {step === 1 && (
          <div className="wizard-step">
            <h3 className="wizard-title">¿Qué vas a comer hoy?</h3>
            <p className="wizard-subtitle">Seleccioná las comidas que querés incluir en tu día.</p>
            
            <div className="wizard-chips-grid">
              {AVAILABLE_MEALS.map(meal => (
                <button
                  key={meal}
                  className={`wizard-chip ${selectedMeals.has(meal) ? 'selected' : ''}`}
                  onClick={() => toggleMeal(meal)}
                >
                  {selectedMeals.has(meal) && <Check size={14} className="chip-icon" />}
                  {meal}
                </button>
              ))}
            </div>

            <button 
              className="btn-primary wizard-btn-next" 
              onClick={handleNext}
              disabled={selectedMeals.size === 0}
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <h3 className="wizard-title">¿A qué hora entrenás?</h3>
            <p className="wizard-subtitle">Para ordenar tu Pre y Post entreno correctamente.</p>
            
            <div className="wizard-time-grid">
              {['Mañana', 'Mediodía', 'Tarde', 'Noche'].map(time => (
                <button
                  key={time}
                  className={`wizard-time-card ${trainingTime === time ? 'selected' : ''}`}
                  onClick={() => setTrainingTime(time as TrainingTime)}
                >
                  {time}
                </button>
              ))}
            </div>

            <div className="wizard-actions-row">
              <button className="btn-secondary" onClick={() => setStep(1)}>Atrás</button>
              <button 
                className="btn-primary" 
                onClick={() => prepareAndFetchPlan(trainingTime)}
                disabled={!trainingTime}
              >
                Crear Plan
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step loading-step">
            <div className="loading-spinner"></div>
            <h3 className="wizard-title" style={{ marginTop: '24px', textAlign: 'center' }}>Calculando macros...</h3>
            <p className="wizard-subtitle" style={{ textAlign: 'center' }}>La inteligencia está armando tu día perfecto.</p>
          </div>
        )}

        {step === 4 && generatedPlan && (
          <div className="wizard-step results-step">
            <h3 className="wizard-title" style={{ marginBottom: '16px' }}>Tu Plan del Día</h3>
            
            <div className="generated-plan-list">
              {generatedPlan.map((meal: any, idx: number) => (
                <div key={idx} className="generated-meal-card">
                  <div className="generated-meal-header">
                    <span className="generated-meal-name">{meal.nombreComida}</span>
                    <span className="generated-meal-cals">{meal.totales.calorias} kcal</span>
                  </div>
                  <div className="generated-meal-macros">
                    P: {meal.totales.proteinas}g • C: {meal.totales.carbohidratos}g • G: {meal.totales.grasas}g
                  </div>
                  <div className="generated-meal-ingredients">
                    {meal.alimentos.map((food: any, fidx: number) => (
                      <div key={fidx} className="gen-ing-row">
                        <span className="gen-ing-name">{food.nombre}</span>
                        <span className="gen-ing-amount">
                          {food.medidaSugerida || `${food.gramosSugeridos}g`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* PANEL DE RESUMEN DIARIO */}
            {planTargets && (
              <div className="wizard-summary-panel">
                <h4 className="wizard-summary-title">Resumen del Día</h4>
                <div className="wizard-summary-grid">
                  <div className="wizard-summary-item">
                    <span className="summary-label">Kcal</span>
                    <span className="summary-value">
                      {calculateTotalPlanMacros().calorias} / {Math.round(planTargets.caloriasObjetivo)}
                    </span>
                  </div>
                  <div className="wizard-summary-item">
                    <span className="summary-label">Proteínas</span>
                    <span className="summary-value">
                      {calculateTotalPlanMacros().proteinas}g / {Math.round(planTargets.proteinas)}g
                    </span>
                  </div>
                  <div className="wizard-summary-item">
                    <span className="summary-label">Carbos</span>
                    <span className="summary-value">
                      {calculateTotalPlanMacros().carbohidratos}g / {Math.round(planTargets.carbohidratos)}g
                    </span>
                  </div>
                  <div className="wizard-summary-item">
                    <span className="summary-label">Grasas</span>
                    <span className="summary-value">
                      {calculateTotalPlanMacros().grasas}g / {Math.round(planTargets.grasas)}g
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="wizard-actions-row" style={{ marginTop: '24px' }}>
              <button className="btn-secondary" onClick={() => fetchPlanFromAPI(orderedMealNames)}>
                <RefreshCw size={16} /> Re-generar
              </button>
              <button className="btn-primary" onClick={handleApply}>
                <CheckCircle2 size={16} /> Aceptar Plan
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
