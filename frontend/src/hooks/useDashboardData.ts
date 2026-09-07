import { useState, useEffect, useCallback } from 'react';
import { fetchUserWithTargets } from '../services/api';

export interface Targets {
  tdee: number;
  caloriasObjetivo: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
}

export interface UserData {
  id: number;
  pesoKg: number;
  alturaCm: number;
  edad: number;
  genero: string;
  factorActividad: number;
  objetivo: string;
}

export interface DashboardData {
  user: UserData | null;
  targets: Targets | null;
  consumed: { calorias: number; proteinas: number; carbohidratos: number; grasas: number };
  loading: boolean;
  error: string | null;
  addConsumed: (macros: { calorias: number; proteinas: number; carbohidratos: number; grasas: number }) => void;
  refresh: () => void;
}

export function useDashboardData(): DashboardData {
  const [user, setUser] = useState<UserData | null>(null);
  const [targets, setTargets] = useState<Targets | null>(null);
  const [consumed, setConsumed] = useState({ calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { user, targets } = await fetchUserWithTargets();
      setUser(user);
      setTargets(targets);
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addConsumed = useCallback((macros: { calorias: number; proteinas: number; carbohidratos: number; grasas: number }) => {
    setConsumed(prev => ({
      calorias: prev.calorias + macros.calorias,
      proteinas: prev.proteinas + macros.proteinas,
      carbohidratos: prev.carbohidratos + macros.carbohidratos,
      grasas: prev.grasas + macros.grasas,
    }));
  }, []);

  return { user, targets, consumed, loading, error, addConsumed, refresh: loadData };
}
