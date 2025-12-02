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
  login: (data: LoginData) => api.post<LoginResponse>('/auth/login', data),
  register: (data: LoginData) => api.post<LoginResponse>('/auth/register', data),
};

interface Review {
  id: number;
  reviewText: string;
  movieId: number;
  movieTitle: string;
  createdAt: string;
}

interface ReviewCreate {
  reviewText: string;
  movieId: number;
}

interface WatchlistItem {
  id: number;
  movieId: number;
  movieTitle: string;
  posterUrl?: string;
  watched: boolean;
  addedAt: string;
}

export const reviewApi = {
  getByMovie: (movieId: number) => api.get<Review[]>(`/reviews/movie/${movieId}`),
  getMy: () => api.get<Review[]>('/reviews/my'),
  create: (data: ReviewCreate) => api.post<Review>('/reviews', data),
  delete: (id: number) => api.delete(`/reviews/${id}`),
};

export const watchlistApi = {
  getMy: () => api.get<WatchlistItem[]>('/watchlist'),
  add: (movieId: number) => api.post<WatchlistItem>(`/watchlist/${movieId}`),
  remove: (movieId: number) => api.delete(`/watchlist/${movieId}`),
  markWatched: (movieId: number, watched: boolean) => 
    api.patch<WatchlistItem>(`/watchlist/${movieId}/watched`, null, { params: { watched } }),
};
