import axios from 'axios';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  email: string;
  userId: number;
  role: string;
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
  score: number;
  userId: number;
  movieId: number;
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
  create: (score: number, movieId: number) => {
    const userIdStr = localStorage.getItem('userId');
    const userId = userIdStr ? parseInt(userIdStr, 10) : null;
    console.log('Rating API - userId:', userId, 'type:', typeof userId);
    return api.post('/ratings', { score, userId, movieId });
  },
  getAverage: (movieId: number) => api.get<number>(`/ratings/movie/${movieId}/average`),
  getUserRating: (userId: number, movieId: number) => api.get<number>(`/ratings/user/${userId}/movie/${movieId}`),
  delete: (userId: number, movieId: number) => api.delete(`/ratings/user/${userId}/movie/${movieId}`),
  getMy: () => api.get('/ratings/my'),
};

export const authApi = {
  login: async (data: LoginData) => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    if (response.data.userId) {
      localStorage.setItem('userId', response.data.userId.toString());
    }
    if (response.data.role) {
      localStorage.setItem('userRole', response.data.role);
    }
    return response;
  },
  register: async (data: RegisterData) => {
    const response = await api.post<LoginResponse>('/auth/register', data);
    if (response.data.userId) {
      localStorage.setItem('userId', response.data.userId.toString());
    }
    if (response.data.role) {
      localStorage.setItem('userRole', response.data.role);
    }
    return response;
  },
};

interface Review {
  id: number;
  reviewText: string;
  movieId: number;
  movieTitle: string;
  createdAt: string;
  userRating?: number;
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
