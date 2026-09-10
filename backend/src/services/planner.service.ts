import { prisma } from '../prisma/client';
import { MacroTargets } from './calculator.service';

export interface PlannedFood {
  foodId: number;
  nombre: string;
  gramosSugeridos: number;
  medidaSugerida?: string;
  macros: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    calorias: number;
  }
}

export interface MealPlan {
  nombreComida: string;
  alimentos: PlannedFood[];
  totales: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    calorias: number;
  }
}

export class PlannerService {
  public static async generatePlan(targets: MacroTargets, meals: string[]): Promise<MealPlan[]> {
    if (!meals || meals.length === 0) {
      throw new Error('Debe proporcionar al menos una comida');
    }

    const mealCount = meals.length;
    
    // Fraccionamiento equitativo
    const mealTargets = {
      proteinas: targets.proteinas / mealCount,
      carbohidratos: targets.carbohidratos / mealCount,
      grasas: targets.grasas / mealCount,
      calorias: targets.caloriasObjetivo / mealCount
    };

    const allFoods = await prisma.food.findMany({
      include: { tags: true }
    });

    // Helpers
    const getMealTag = (mealName: string) => {
      const lower = mealName.toLowerCase();
      if (lower.includes('desayuno')) return 'desayuno';
      if (lower.includes('almuerzo')) return 'almuerzo';
      if (lower.includes('cena')) return 'cena';
      return 'snack'; // Merienda, pre, post
    };

    const getMaxGrams = (food: any) => {
      const calPerGram = food.calorias / food.porcionBase;
      // Si tiene más de 5 kcal por gramo (ej. aceite, nueces, chocolate), el tope es 40g. Si no, 350g.
      return calPerGram >= 5 ? 40 : 350;
    };

    const plan: MealPlan[] = [];

    for (const mealName of meals) {
      let remainingTargets = { ...mealTargets };
      const alimentosComida: PlannedFood[] = [];
      const selectedFoodIds = new Set<number>();
      
      const mealTag = getMealTag(mealName);

      // Filtrar alimentos por el contexto de la comida
      const contextFoods = allFoods.filter(f => f.tags.some(t => t.name === mealTag));
      
      const proteinaFoods = contextFoods.filter(f => f.tags.some(t => t.name === 'fuente_proteina'));
      const carboFoods = contextFoods.filter(f => f.tags.some(t => t.name === 'fuente_carbohidratos'));
      const grasaFoods = contextFoods.filter(f => f.tags.some(t => t.name === 'fuente_grasas'));

      // Función auxiliar para llenar un macro específico
      const fillMacro = (foodsArray: any[], targetMacroName: 'proteinas' | 'carbohidratos' | 'grasas', maxAttempts = 2, priorityFilter?: (f: any) => boolean) => {
        let attempts = 0;
        while (remainingTargets[targetMacroName] > 5 && attempts < maxAttempts) {
          attempts++;
          
          // 1. Filtrar disponibles (evitar duplicados y mezclas raras)
          let available = foodsArray.filter(f => {
            if (selectedFoodIds.has(f.id)) return false;
            
            // Regla: No mezclar múltiples lácteos líquidos/semi-líquidos
            const nameLower = f.nombre.toLowerCase();
            const isDairy = nameLower.includes('leche') || nameLower.includes('yogur');
            const hasDairy = alimentosComida.some(a => a.nombre.toLowerCase().includes('leche') || a.nombre.toLowerCase().includes('yogur'));
            if (isDairy && hasDairy) return false;

            // Regla: No mezclar múltiples quesos
            const isQueso = nameLower.includes('queso');
            const hasQueso = alimentosComida.some(a => a.nombre.toLowerCase().includes('queso'));
            if (isQueso && hasQueso) return false;

            return true;
          });

          if (available.length === 0) break;

          // 2. Aplicar filtro de prioridad en el primer intento (para asegurar plato principal)
          if (priorityFilter && attempts === 1) {
             const prioritized = available.filter(priorityFilter);
             if (prioritized.length > 0) available = prioritized;
          }

          const selectedFood = available[Math.floor(Math.random() * available.length)];
          const macroPerPortion = selectedFood[targetMacroName];
          
          if (macroPerPortion > 0) {
            let idealGrams = this.calculateGrams(remainingTargets[targetMacroName], macroPerPortion, selectedFood.porcionBase);
            const maxGramsAllowed = getMaxGrams(selectedFood);
            
            // Aplicar tope
            let finalGrams = Math.min(idealGrams, maxGramsAllowed);

            if (finalGrams > 0) {
              const planned = this.formatPlannedFood(selectedFood, finalGrams);
              alimentosComida.push(planned);
              selectedFoodIds.add(selectedFood.id);
              
              // Descontar macros reales aportados
              remainingTargets.proteinas -= planned.macros.proteinas;
              remainingTargets.carbohidratos -= planned.macros.carbohidratos;
              remainingTargets.grasas -= planned.macros.grasas;
            }
          }
        }
      };

      // Fase Proteínas: En Almuerzo/Cena priorizamos carnes (altas en proteína, bajas en carbos)
      const proteinPriority = (mealTag === 'almuerzo' || mealTag === 'cena') 
        ? (f: any) => f.proteinas > 15 && f.carbohidratos < 10 
        : undefined;
      fillMacro(proteinaFoods, 'proteinas', 2, proteinPriority);

      // Fase Carbohidratos: Priorizamos fuentes densas de carbos (arroz, fideos, papa, avena) frente a verduras
      fillMacro(carboFoods, 'carbohidratos', 2, (f: any) => f.carbohidratos > 15);

      // Fase Grasas
      fillMacro(grasaFoods, 'grasas', 2);

      // Calcular totales reales de la comida final
      let totalP = 0, totalC = 0, totalG = 0, totalCal = 0;
      for (const f of alimentosComida) {
        totalP += f.macros.proteinas;
        totalC += f.macros.carbohidratos;
        totalG += f.macros.grasas;
        totalCal += f.macros.calorias;
      }

      plan.push({
        nombreComida: mealName,
        alimentos: alimentosComida,
        totales: {
          proteinas: Math.round(totalP),
          carbohidratos: Math.round(totalC),
          grasas: Math.round(totalG),
          calorias: Math.round(totalCal)
        }
      });
    }

    return plan;
  }

  private static calculateGrams(targetMacro: number, foodMacroPerPortion: number, portionSize: number): number {
    if (foodMacroPerPortion <= 0 || targetMacro <= 0) return 0;
    const macroPerGram = foodMacroPerPortion / portionSize;
    return Math.round(targetMacro / macroPerGram);
  }

  private static formatPlannedFood(food: any, gramos: number): PlannedFood {
    const ratio = gramos / food.porcionBase;
    
    let medidaSugerida = `${gramos}g`;
    const nombreLower = food.nombre.toLowerCase();
    
    if (nombreLower.includes('huevo')) {
      const unidades = Math.max(1, Math.round(gramos / 50));
      medidaSugerida = `${unidades} unidad${unidades > 1 ? 'es' : ''}`;
    } else if (nombreLower.includes('pan integral')) {
      const rebanadas = Math.max(1, Math.round(gramos / 25));
      medidaSugerida = `${rebanadas} rebanada${rebanadas > 1 ? 's' : ''}`;
    }

    return {
      foodId: food.id,
      nombre: food.nombre,
      gramosSugeridos: gramos,
      medidaSugerida: medidaSugerida,
      macros: {
        proteinas: Math.round(food.proteinas * ratio * 10) / 10,
        carbohidratos: Math.round(food.carbohidratos * ratio * 10) / 10,
        grasas: Math.round(food.grasas * ratio * 10) / 10,
        calorias: Math.round(food.calorias * ratio)
      }
    };
  }
}
