import axios from 'axios';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  email: string;
}

interface Movie {
  id: number;
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  posterUrl?: string;
  createdAt?: string;
}

interface MovieCreate {
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  posterUrl?: string;
}

interface RatingCreate {
  movieId: number;
  userId: number;
  rating: number;
}

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const movieApi = {
  getAll: () => api.get<Movie[]>('/movies'),
  getById: (id: number) => api.get<Movie>(`/movies/${id}`),
  create: (data: MovieCreate) => api.post<Movie>('/movies', data),
  update: (id: number, data: MovieCreate) => api.put<Movie>(`/movies/${id}`, data),
  delete: (id: number) => api.delete(`/movies/${id}`),
  search: (title?: string, genre?: string, year?: number) => 
    api.get<Movie[]>('/movies/search', { params: { title, genre, year } }),
};

export const ratingApi = {
  create: (data: RatingCreate) => api.post('/ratings', data),
  getAverage: (movieId: number) => api.get<number>(`/ratings/movie/${movieId}/average`),
  delete: (userId: number, movieId: number) => api.delete(`/ratings/user/${userId}/movie/${movieId}`),
};

export const authApi = {
  login: (data: LoginData) => api.post<LoginResponse>('/v1/auth/login', data),
};
