export interface UserProfile {
  pesoKg: number;
  alturaCm: number;
  edad: number;
  genero: string; // 'M' o 'F'
  factorActividad: number;
  objetivo: string; // 'Volumen', 'Definicion', 'Mantenimiento', 'Recomposicion'
}

export interface MacroTargets {
  tdee: number;
  caloriasObjetivo: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
}

export class CalculatorService {
  /**
   * Calcula el Gasto Energético Diario Total (TDEE) usando Mifflin-St Jeor
   */
  public static calculateTDEE(user: UserProfile): number {
    let bmr = (10 * user.pesoKg) + (6.25 * user.alturaCm) - (5 * user.edad);
    
    if (user.genero.toUpperCase() === 'M') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    
    return bmr * user.factorActividad;
  }

  /**
   * Determina los objetivos calóricos y de macronutrientes basados en el perfil y objetivo
   */
  public static calculateTargets(user: UserProfile): MacroTargets {
    const tdee = this.calculateTDEE(user);
    let caloriasObjetivo = tdee;
    let proteinasPerKg = 2.0; // Base para volumen o mantenimiento
    const grasasPerKg = 0.9; // Base constante

    switch (user.objetivo.toLowerCase()) {
      case 'volumen':
        caloriasObjetivo = tdee * 1.15; // +15% superávit
        break;
      case 'definicion':
        caloriasObjetivo = tdee * 0.80; // -20% déficit
        proteinasPerKg = 2.4; // Aumentar proteína para proteger músculo en déficit
        break;
      case 'recomposicion':
        // Déficit muy ligero (5%) para facilitar pérdida de grasa manteniendo anabolismo
        caloriasObjetivo = tdee * 0.95;
        proteinasPerKg = 2.4;
        break;
      case 'mantenimiento':
      default:
        caloriasObjetivo = tdee;
        break;
    }

    // Calcular gramos de macros
    const proteinasGramos = Math.round(user.pesoKg * proteinasPerKg);
    const grasasGramos = Math.round(user.pesoKg * grasasPerKg);

    // Calcular calorías consumidas por proteínas y grasas
    const proteinasCalorias = proteinasGramos * 4;
    const grasasCalorias = grasasGramos * 9;

    // El resto de calorías va a carbohidratos
    const carbohidratosCalorias = caloriasObjetivo - (proteinasCalorias + grasasCalorias);
    const carbohidratosGramos = Math.round(carbohidratosCalorias / 4);

    return {
      tdee: Math.round(tdee),
      caloriasObjetivo: Math.round(caloriasObjetivo),
      proteinas: proteinasGramos,
      grasas: grasasGramos,
      carbohidratos: carbohidratosGramos > 0 ? carbohidratosGramos : 0 // Prevención de macros negativos
    };
  }
}
