import { useState, useMemo, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";
import { FilterBar } from "@/components/todos/FilterBar";
import { TodosList } from "@/components/todos/TodosList";
import { TodoCreateDialog } from "@/components/todos/TodoCreateDialog";
import { useTodos, clearLocalTodos } from "@/hooks/useTodos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [limit] = useState(30);
  const [skip] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { data: todosData, isLoading, error, localTodos } = useTodos(limit, skip);
  const todos = useMemo(() => todosData?.todos || [], [todosData?.todos]);
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (a.createdAt && !b.createdAt) return -1;
      if (!a.createdAt && b.createdAt) return 1;
      return b.id - a.id;
    });
  }, [todos]);

  // Filter todos based on search and filters
  const filteredTodos = useMemo(() => {
    return sortedTodos.filter((todo) => {
      // Search filter
      if (searchTerm && !todo.todo.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Status filter
      if (statusFilter === "completed" && !todo.completed) {
        return false;
      }
      if (statusFilter === "pending" && todo.completed) {
        return false;
      }

      // User ID filter
      if (userIdFilter && todo.userId !== parseInt(userIdFilter)) {
        return false;
      }

      return true;
    });
  }, [sortedTodos, searchTerm, statusFilter, userIdFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, userIdFilter]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setUserIdFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

  // Calculate stats based on filtered todos
  const completedCount = filteredTodos.filter(todo => todo.completed).length;
  const pendingCount = filteredTodos.filter(todo => !todo.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your todos efficiently
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="shadow-primary w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
          <Button
            onClick={() => {
              clearLocalTodos();
              window.location.reload(); // Reload to see the effect
            }}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear localStorage
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Todos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTodos.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Debug Info - Hidden on mobile for cleaner UI */}
      <div className="hidden sm:block text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
        <div>Server todos: {todosData?.todos?.length || 0}</div>
        <div>localStorage todos: {localTodos?.length || 0}</div>
        <div>Combined total: {todos.length}</div>
        <div>Filtered total: {filteredTodos.length}</div>
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        userIdFilter={userIdFilter}
        onUserIdFilterChange={setUserIdFilter}
        onClearFilters={handleClearFilters}
        totalCount={filteredTodos.length}
      />

      {/* Todos List */}
      <TodosList
        todos={filteredTodos}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        userIdFilter={userIdFilter}
        showUser={true}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredTodos.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Create Dialog */}
      <TodoCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};

export default Dashboard;