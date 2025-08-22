import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateTodo } from "@/hooks/useTodos";
import { updateTodoSchema, type UpdateTodoFormData } from "@/lib/validations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Todo } from "@/types/api";

interface TodoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: Todo | null;
}

export const TodoEditDialog = ({ open, onOpenChange, todo }: TodoEditDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateTodo = useUpdateTodo();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<UpdateTodoFormData>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      todo: "",
      completed: false,
      userId: 1,
    },
    mode: "onChange",
  });

  const watchedCompleted = watch("completed");


  useEffect(() => {
    if (todo) {
      setValue("todo", todo.todo);
      setValue("completed", todo.completed);
      setValue("userId", todo.userId);
    }
  }, [todo, setValue]);

  const onSubmit = async (data: UpdateTodoFormData) => {
    if (!todo) return;

    setIsSubmitting(true);
    try {

      const updateData: UpdateTodoFormData = {};
      if (data.todo !== undefined) updateData.todo = data.todo;
      if (data.completed !== undefined) updateData.completed = data.completed;
      if (data.userId !== undefined) updateData.userId = data.userId;

      await updateTodo.mutateAsync({ id: todo.id, data: updateData });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {

      reset();
    }
    onOpenChange(newOpen);
  };

  if (!todo) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Todo Text Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-todo">Todo Text</Label>
            <Input
              id="edit-todo"
              {...register("todo")}
              placeholder="Enter your todo..."
              className={errors.todo ? "border-destructive" : ""}
            />
            {errors.todo && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.todo.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* User ID Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-userId">User ID</Label>
            <Input
              id="edit-userId"
              type="number"
              {...register("userId", { valueAsNumber: true })}
              min="1"
              max="10000"
              disabled={true}
              className={errors.userId ? "border-destructive" : ""}
            />
            {errors.userId && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.userId.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Completed Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-completed"
              checked={watchedCompleted}
              onCheckedChange={(checked) => setValue("completed", checked)}
            />
            <Label htmlFor="edit-completed">Mark as completed</Label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || updateTodo.isPending}
              variant="gradient"
            >
              {isSubmitting || updateTodo.isPending ? "Updating..." : "Update Todo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};