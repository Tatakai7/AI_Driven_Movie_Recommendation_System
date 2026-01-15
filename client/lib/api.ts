const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem('authToken', token);
}

export function getAuthToken() {
  return authToken || localStorage.getItem('authToken');
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem('authToken');
}

function getHeaders() {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// Auth endpoints
export async function register(email: string, password: string, username: string) {
  const data = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
  setAuthToken(data.token);
  return data.user;
}

export async function login(email: string, password: string) {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.token);
  return data.user;
}

export async function getProfile() {
  return apiCall('/auth/profile');
}

export async function updateProfile(username?: string, favoriteGenres?: string[]) {
  return apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ username, favoriteGenres }),
  });
}

// Movie endpoints
export async function getMovies(params?: { genre?: string; search?: string; limit?: number; skip?: number }) {
  const queryString = params ? new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString() : '';
  return apiCall(`/movies?${queryString}`);
}

export async function getMovieById(id: string) {
  return apiCall(`/movies/${id}`);
}

export async function rateMovie(movieId: string, rating: number) {
  return apiCall('/movies/rate', {
    method: 'POST',
    body: JSON.stringify({ movieId, rating }),
  });
}

export async function getUserRating(movieId: string) {
  return apiCall(`/movies/${movieId}/rating`);
}

export async function getRecommendations(limit?: number) {
  const queryString = limit ? `?limit=${limit}` : '';
  return apiCall(`/movies/recommendations${queryString}`);
}

// Watchlist endpoints
export async function addToWatchlist(movieId: string) {
  return apiCall('/watchlist', {
    method: 'POST',
    body: JSON.stringify({ movieId }),
  });
}

export async function removeFromWatchlist(movieId: string) {
  return apiCall(`/watchlist/${movieId}`, {
    method: 'DELETE',
  });
}

export async function getWatchlist() {
  return apiCall('/watchlist');
}

export async function isInWatchlist(movieId: string) {
  return apiCall(`/watchlist/${movieId}`);
}
