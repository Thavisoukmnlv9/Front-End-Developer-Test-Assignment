import axios from 'axios';
import { Todo, TodosResponse, CreateTodoRequest, UpdateTodoRequest, UsersResponse } from '@/types/api';

const BASE_URL = 'https://dummyjson.com';

const token = '06b29b7253af4813a22d9af34498dee5';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Todos API
export const todosApi = {
  // Get all todos with pagination
  getTodos: async (limit = 10, skip = 0): Promise<TodosResponse> => {
    const response = await api.get(`/todos?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Get todos by user
  getTodosByUser: async (userId: number, limit = 10, skip = 0): Promise<TodosResponse> => {
    const response = await api.get(`/todos/user/${userId}?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Get single todo
  getTodo: async (id: number): Promise<Todo> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  // Create todo
  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const todoWithTimestamps = {
      ...todo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const response = await api.post('/todos/add', todoWithTimestamps);
    return response.data;
  },

  // Update todo
  updateTodo: async (id: number, todo: UpdateTodoRequest): Promise<Todo> => {
    const todoWithTimestamp = {
      ...todo,
      updatedAt: new Date().toISOString(),
    };
    const response = await api.put(`/todos/${id}`, todoWithTimestamp);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id: number): Promise<Todo> => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },
};

// Users API (for displaying user info)
export const usersApi = {
  getUsers: async (limit = 10, skip = 0): Promise<UsersResponse> => {
    const response = await api.get(`/users?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  getUser: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};