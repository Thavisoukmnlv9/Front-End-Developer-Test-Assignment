import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Trash2, User, Calendar, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodo, useUpdateTodo, useDeleteTodo } from "@/hooks/useTodos";
import { useState } from "react";
import { TodoEditDialog } from "@/components/todos/TodoEditDialog";

const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const todoId = parseInt(id!);
  const { data: todo, isLoading, error } = useTodo(todoId);
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const handleToggleComplete = () => {
    if (todo) {
      updateTodo.mutate({
        id: todo.id,
        data: { completed: !todo.completed },
      });
    }
  };

  const handleDelete = () => {
    if (todo && window.confirm("Are you sure you want to delete this todo?")) {
      deleteTodo.mutate(todo.id, {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Todo Not Found</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            {error ? String(error) : "Todo not found or may have been deleted."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Todo Details</h1>
              <p className="text-muted-foreground">Todo #{todo.id}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(true)}
              className="w-full sm:w-auto"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleteTodo.isPending}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteTodo.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Todo Card */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  onClick={handleToggleComplete}
                  disabled={updateTodo.isPending}
                  className={`mt-1 transition-colors flex-shrink-0 ${todo.completed
                      ? "text-success hover:text-success/80"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {todo.completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <CardTitle className={`text-lg sm:text-xl break-words ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                    {todo.todo}
                  </CardTitle>
                </div>
              </div>

              <Badge
                variant={todo.completed ? "secondary" : "default"}
                className={`flex-shrink-0 ${todo.completed
                    ? "bg-success-light text-success border-success/20"
                    : "bg-warning-light text-warning border-warning/20"
                  }`}
              >
                {todo.completed ? "Completed" : "Pending"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Todo Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Assigned to:</span>
                <Link
                  to={`/users/${todo.userId}/todos`}
                  className="text-primary hover:underline font-medium truncate"
                >
                  User {todo.userId}
                </Link>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Todo ID:</span>
                <span className="font-mono">#{todo.id}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant={todo.completed ? "outline" : "success"}
                onClick={handleToggleComplete}
                disabled={updateTodo.isPending}
                className="w-full sm:w-auto"
              >
                {updateTodo.isPending ? "Updating..." : (
                  todo.completed ? "Mark as Pending" : "Mark as Completed"
                )}
              </Button>

              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link to={`/users/${todo.userId}/todos`}>
                  View User's Todos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <TodoEditDialog
        todo={todo}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
};

export default TodoDetail;