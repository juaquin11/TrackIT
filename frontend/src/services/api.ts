// Servicio básico usando Fetch API nativa para evitar dependencias extra por ahora
const API_URL = 'http://localhost:4000/api';

export const apiService = {
  async get(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'API Error');
    }
    return data.data; // Retorna el payload del success
  },

  async post(endpoint: string, body: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'API Error');
    }
    return data.data;
  },

  async put(endpoint: string, body: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'API Error');
    }
    return data.data;
  }
};
