const API_URL = 'http://localhost:4000/api';

// Helper para hacer fetch con manejo de errores estandarizado
async function request(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Error de conexión con la API');
  }
  return json;
}

// ============ USER ============
export async function fetchUserWithTargets() {
  const json = await request('/users');
  return { user: json.data, targets: json.targets };
}

export async function updateUser(id: number, body: any) {
  const json = await request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return { user: json.data, targets: json.targets };
}

// ============ SAVED MEALS ============
export async function fetchSavedMeals() {
  const json = await request('/saved-meals');
  return json.data;
}

export async function applySavedMeal(id: number, fecha?: string) {
  const json = await request(`/saved-meals/${id}/apply`, {
    method: 'POST',
    body: JSON.stringify({ fecha }),
  });
  return json.data;
}

// ============ FOODS ============
export async function fetchFoods() {
  const json = await request('/foods');
  return json.data;
}
