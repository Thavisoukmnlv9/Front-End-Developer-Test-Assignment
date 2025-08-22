import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Edit3, Trash2, User, ExternalLink, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { useUpdateTodo, useDeleteTodo } from "@/hooks/useTodos";
import { Todo } from "@/types/api";
import { cn } from "@/lib/utils";
import { TodoEditDialog } from "./TodoEditDialog";

interface TodoCardProps {
  todo: Todo;
  showUser?: boolean;
}

export const TodoCard = ({ todo, showUser = true }: TodoCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const handleToggleComplete = () => {
    updateTodo.mutate({
      id: todo.id,
      data: { completed: !todo.completed },
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      deleteTodo.mutate(todo.id);
    }
  };

  // Format creation date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const createdDate = formatDate(todo.createdAt);

  return (
    <>
      <Card className={cn(
        "group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-gradient-to-br from-card to-card/80 border-border/30",
        todo.completed && "opacity-80 bg-gradient-to-br from-muted/20 to-muted/10"
      )}>
        <CardHeader className="pb-3">
          {/* Header with completion toggle and actions */}
          <div className="flex items-start justify-between gap-3">
            {/* Left side: Completion toggle and status */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleComplete}
                disabled={updateTodo.isPending}
                className={cn(
                  "transition-all duration-200 flex-shrink-0 p-1 rounded-full hover:bg-muted/50",
                  todo.completed
                    ? "text-success hover:text-success/80"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {todo.completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>

              {/* Status Badge */}
              <Badge
                variant={todo.completed ? "secondary" : "default"}
                className={cn(
                  "text-xs font-medium px-2 py-1",
                  todo.completed
                    ? "bg-success/20 text-success border-success/30"
                    : "bg-warning/20 text-warning border-warning/30"
                )}
              >
                {todo.completed ? "Completed" : "Pending"}
              </Badge>
            </div>

            {/* Right side: Actions */}
            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditOpen(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleteTodo.isPending}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Main content */}
          <div className="space-y-4">
            {/* Todo text */}
            <div className="group/todo">
              <Link
                to={`/todo/${todo.id}`}
                className={cn(
                  "block font-medium text-base leading-6 hover:text-primary transition-colors break-words group-hover/todo:underline decoration-primary/30 underline-offset-2",
                  todo.completed && "line-through text-muted-foreground"
                )}
              >
                {todo.todo}
              </Link>
              
              {/* External link indicator */}
              <div className="flex items-center justify-between mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover/todo:opacity-100 transition-opacity h-6 px-2 text-xs text-muted-foreground hover:text-primary"
                  asChild
                >
                  <Link to={`/todo/${todo.id}`}>
                    View Details
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Metadata section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/20">
              {/* Left side: User and ID info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                {/* User Info */}
                {showUser && (
                  <Link
                    to={`/users/${todo.userId}/todos`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/user"
                  >
                    <div className="p-1.5 rounded-full bg-primary/10 group-hover/user:bg-primary/20 transition-colors">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="font-medium">User {todo.userId}</span>
                  </Link>
                )}

                {/* Todo ID */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="p-1.5 rounded-full bg-muted/20">
                    <span className="text-xs font-mono">#{todo.id}</span>
                  </div>
                </div>

                {/* Creation date if available */}
                {createdDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">{createdDate}</span>
                  </div>
                )}
              </div>

              {/* Right side: Quick actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant={todo.completed ? "outline" : "default"}
                  size="sm"
                  onClick={handleToggleComplete}
                  disabled={updateTodo.isPending}
                  className={cn(
                    "h-8 px-3 text-xs font-medium",
                    todo.completed 
                      ? "border-muted-foreground/30 text-muted-foreground hover:bg-muted/20" 
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  {updateTodo.isPending ? (
                    <Clock className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  {todo.completed ? "Mark Pending" : "Mark Complete"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TodoEditDialog
        todo={todo}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
};