import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todosApi } from "@/lib/api";
import {
  CreateTodoRequest,
  UpdateTodoRequest,
  TodosResponse,
  Todo,
} from "@/types/api";
import { toast } from "@/hooks/use-toast";
import { useState, useCallback, useEffect } from "react";

export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...todoKeys.lists(), filters] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
  byUser: (userId: number) => [...todoKeys.all, "user", userId] as const,
};

const LOCAL_TODOS_KEY = "local_todos";

const getLocalTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(LOCAL_TODOS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setLocalTodos = (todos: Todo[]) => {
  try {
    localStorage.setItem(LOCAL_TODOS_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Failed to save todos to localStorage:", error);
  }
};

export const clearLocalTodos = () => {
  localStorage.removeItem(LOCAL_TODOS_KEY);
};

export const useTodos = (limit = 10, skip = 0) => {
  const [localTodos, setLocalTodos] = useState<Todo[]>(getLocalTodos);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data: serverTodosData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [...todoKeys.list({ limit, skip }), refreshKey],
    queryFn: () => todosApi.getTodos(limit, skip),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setLocalTodos(getLocalTodos());
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const combinedTodos = useCallback(() => {
    const serverTodos = serverTodosData?.todos || [];

    const serverTodosMap = new Map(serverTodos.map((todo) => [todo.id, todo]));

    const allTodos = [...serverTodos];

    localTodos.forEach((localTodo) => {
      const existingIndex = allTodos.findIndex(
        (todo) => todo.id === localTodo.id
      );
      if (existingIndex >= 0) {
        allTodos[existingIndex] = localTodo;
      } else {
        allTodos.push(localTodo);
      }
    });

    return allTodos;
  }, [serverTodosData, localTodos]);

  const todos = combinedTodos();
  const total = todos.length;

  const forceRefresh = useCallback(() => {
    setLocalTodos(getLocalTodos());
    setRefreshKey((prev) => prev + 1);
    refetch();
  }, [refetch]);

  return {
    data: { todos, total, skip, limit },
    isLoading,
    error,
    localTodos,
    setLocalTodos,
    refetch,
    forceRefresh,
  };
};

export const useTodo = (id: number) => {
  const { localTodos } = useTodos();
  const localTodo = localTodos.find((todo) => todo.id === id);

  const {
    data: serverTodo,
    isLoading,
    error,
  } = useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todosApi.getTodo(id),
    enabled: !!id && !localTodo,
  });

  const todo = localTodo || serverTodo;

  return {
    data: todo,
    isLoading: isLoading && !localTodo,
    error: error && !localTodo,
  };
};

export const useTodosByUser = (userId: number, limit = 10, skip = 0) => {
  const { localTodos } = useTodos();
  const localUserTodos = localTodos.filter((todo) => todo.userId === userId);

  const {
    data: serverTodosData,
    isLoading,
    error,
  } = useQuery({
    queryKey: todoKeys.byUser(userId),
    queryFn: () => todosApi.getTodosByUser(userId, limit, skip),
    enabled: !!userId,
  });

  const combinedTodos = useCallback(() => {
    const serverTodos = serverTodosData?.todos || [];

    const serverTodosMap = new Map(serverTodos.map((todo) => [todo.id, todo]));

    const allTodos = [...serverTodos];

    localUserTodos.forEach((localTodo) => {
      const existingIndex = allTodos.findIndex(
        (todo) => todo.id === localTodo.id
      );
      if (existingIndex >= 0) {
        allTodos[existingIndex] = localTodo;
      } else {
        allTodos.push(localTodo);
      }
    });

    return allTodos;
  }, [serverTodosData, localUserTodos]);

  const todos = combinedTodos();
  const total = todos.length;

  return {
    data: { todos, total, skip, limit },
    isLoading,
    error,
    localTodos: localUserTodos,
  };
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todo: CreateTodoRequest) => {
      try {
        const response = await todosApi.createTodo(todo);
        console.log("DummyJSON API Response:", response);
        return response;
      } catch (error) {
        console.log("API create failed, creating locally only:", error);

        const localId = Date.now() + Math.floor(Math.random() * 1000);

        return {
          id: localId,
          todo: todo.todo,
          completed: todo.completed,
          userId: todo.userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    },
    onSuccess: (newTodo, variables) => {
      const localTodo: Todo = {
        ...newTodo,
        id: newTodo.id || Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const currentLocalTodos = getLocalTodos();
      const updatedLocalTodos = [localTodo, ...currentLocalTodos];
      setLocalTodos(updatedLocalTodos);

      queryClient.setQueriesData(
        { queryKey: todoKeys.lists() },
        (old: TodosResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            todos: [localTodo, ...(old.todos || [])],
            total: (old.total || 0) + 1,
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: todoKeys.all });

      window.dispatchEvent(new Event("storage"));

      toast({
        title: "Todo created",
        description: `Todo created successfully! ID: ${localTodo.id}`,
      });
    },
    onError: (error) => {
      console.error("API Error:", error);
      toast({
        title: "Error creating todo",
        description: "There was an error creating your todo. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateTodoRequest;
    }) => {
      try {
        const existingTodo = await todosApi.getTodo(id);

        if (existingTodo) {
          const response = await todosApi.updateTodo(id, data);
          console.log("DummyJSON API Update Response:", response);
          return response;
        } else {
          console.log("Todo not found on server, updating locally only");
          return {
            ...existingTodo,
            ...data,
            id,
            updatedAt: new Date().toISOString(),
            isLocalUpdate: true,
          };
        }
      } catch (error) {
        console.log("API update failed, updating locally only:", error);

        return {
          id,
          todo: data.todo || "Unknown",
          completed: data.completed || false,
          userId: data.userId || 1,
          updatedAt: new Date().toISOString(),
          isLocalUpdate: true,
        };
      }
    },
    onSuccess: (updatedTodo, { id, data }) => {
      const currentLocalTodos = getLocalTodos();
      const todoIndex = currentLocalTodos.findIndex((todo) => todo.id === id);

      let updatedLocalTodo: Todo;
      if (todoIndex >= 0) {
        updatedLocalTodo = {
          ...currentLocalTodos[todoIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        currentLocalTodos[todoIndex] = updatedLocalTodo;
      } else {
        updatedLocalTodo = {
          ...updatedTodo,
          id,
          updatedAt: new Date().toISOString(),
        };
        currentLocalTodos.push(updatedLocalTodo);
      }

      setLocalTodos(currentLocalTodos);

      queryClient.setQueriesData(
        { queryKey: todoKeys.lists() },
        (old: TodosResponse | undefined) => {
          if (!old) return old;
          const updatedTodos = old.todos.map((todo) =>
            todo.id === id ? updatedLocalTodo : todo
          );
          return {
            ...old,
            todos: updatedTodos,
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: todoKeys.all });

      window.dispatchEvent(new Event("storage"));

      toast({
        title: "Todo updated",
        description: `Todo updated successfully! ID: ${id}`,
      });
    },
    onError: (err) => {
      console.error("API Update Error:", err);
      toast({
        title: "Error updating todo",
        description: "There was an error updating your todo. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const existingTodo = await todosApi.getTodo(id);

        if (existingTodo) {
          const response = await todosApi.deleteTodo(id);
          console.log("DummyJSON API Delete Response:", response);
          return response;
        } else {
          console.log("Todo not found on server, deleting locally only");
          return {
            ...existingTodo,
            id,
            isDeleted: true,
            deletedOn: new Date().toISOString(),
            isLocalUpdate: true,
          };
        }
      } catch (error) {
        console.log("API delete failed, deleting locally only:", error);

        return {
          id,
          todo: "Unknown",
          completed: false,
          userId: 1,
          isDeleted: true,
          deletedOn: new Date().toISOString(),
          isLocalUpdate: true,
        };
      }
    },
    onSuccess: (deletedTodo, id) => {
      const currentLocalTodos = getLocalTodos();
      const updatedLocalTodos = currentLocalTodos.filter(
        (todo) => todo.id !== id
      );
      setLocalTodos(updatedLocalTodos);

      queryClient.setQueriesData(
        { queryKey: todoKeys.lists() },
        (old: TodosResponse | undefined) => {
          if (!old) return old;
          const filteredTodos = old.todos.filter((todo) => todo.id !== id);
          return {
            ...old,
            todos: filteredTodos,
            total: Math.max(0, (old.total || 0) - 1),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: todoKeys.all });

      window.dispatchEvent(new Event("storage"));

      toast({
        title: "Todo deleted",
        description: `Todo deleted successfully! ID: ${id}`,
      });
    },
    onError: (error) => {
      console.error("API Delete Error:", error);
      toast({
        title: "Error deleting todo",
        description: "There was an error deleting your todo. Please try again.",
        variant: "destructive",
      });
    },
  });
};
