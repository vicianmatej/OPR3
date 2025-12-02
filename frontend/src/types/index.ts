export interface Movie {
  id: number;
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  posterUrl?: string;
  createdAt?: string;
  averageRating?: number;
  ratingCount?: number;
}

export interface MovieCreate {
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  posterUrl?: string;
}

export interface RatingCreate {
  movieId: number;
  userId: number;
  rating: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}

export interface Review {
  id: number;
  reviewText: string;
  movieId: number;
  movieTitle: string;
  createdAt: string;
}

export interface ReviewCreate {
  reviewText: string;
  movieId: number;
}

export interface WatchlistItem {
  id: number;
  movieId: number;
  movieTitle: string;
  posterUrl?: string;
  watched: boolean;
  addedAt: string;
}