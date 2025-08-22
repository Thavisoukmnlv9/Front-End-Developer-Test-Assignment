import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateTodo } from "@/hooks/useTodos";
import { createTodoSchema, type CreateTodoFormData } from "@/lib/validations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TodoCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TodoCreateDialog = ({ open, onOpenChange }: TodoCreateDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTodo = useCreateTodo();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      todo: "",
      completed: false,
      userId: 1,
    },
    mode: "onChange",
  });

  const watchedCompleted = watch("completed");

  const onSubmit = async (data: CreateTodoFormData) => {
    setIsSubmitting(true);
    try {

      const todoData = {
        todo: data.todo,
        completed: data.completed,
        userId: data.userId,
      };
      await createTodo.mutateAsync(todoData);

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create todo:", error);
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Todo Text Field */}
          <div className="space-y-2">
            <Label htmlFor="todo">Todo Text</Label>
            <Input
              id="todo"
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
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              type="number"
              {...register("userId", { valueAsNumber: true })}
              min="1"
              max="10000"
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
              id="completed"
              checked={watchedCompleted}
              onCheckedChange={(checked) => setValue("completed", checked)}
            />
            <Label htmlFor="completed">Mark as completed</Label>
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
              disabled={!isValid || isSubmitting || createTodo.isPending}
              variant="gradient"
            >
              {isSubmitting || createTodo.isPending ? "Creating..." : "Create Todo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};