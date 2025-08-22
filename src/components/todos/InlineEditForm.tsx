import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/enhanced-button";
import { useUpdateTodo } from "@/hooks/useTodos";
import { updateTodoSchema, type UpdateTodoFormData } from "@/lib/validations";
import { Todo } from "@/types/api";
import { Check, X, Edit3 } from "lucide-react";

interface InlineEditFormProps {
  todo: Todo;
  onCancel?: () => void;
}

export const InlineEditForm = ({ todo, onCancel }: InlineEditFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateTodo = useUpdateTodo();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<UpdateTodoFormData>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      todo: todo.todo,
      completed: todo.completed,
      userId: todo.userId,
    },
    mode: "onChange",
  });

  const watchedTodo = watch("todo");

  const onSubmit = async (data: UpdateTodoFormData) => {
    try {
      await updateTodo.mutateAsync({
        id: todo.id,
        data: { todo: data.todo },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    onCancel?.();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="flex-1">{todo.todo}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
      <div className="flex-1">
        <Input
          {...register("todo")}
          className={errors.todo ? "border-destructive" : ""}
          autoFocus
        />
        {errors.todo && (
          <p className="text-xs text-destructive mt-1">{errors.todo.message}</p>
        )}
      </div>
      
      <div className="flex gap-1">
        <Button
          type="submit"
          size="icon"
          disabled={!isValid || updateTodo.isPending}
          className="h-8 w-8 text-success hover:text-success/80"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCancel}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
