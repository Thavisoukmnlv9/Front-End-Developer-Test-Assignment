export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateTodoRequest {
  todo: string;
  completed: boolean;
  userId: number;
}

export interface UpdateTodoRequest {
  todo?: string;
  completed?: boolean;
  userId?: number;
}

export interface ApiError {
  message: string;
  status: number;
}