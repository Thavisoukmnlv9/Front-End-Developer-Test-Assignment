import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterBar } from "@/components/todos/FilterBar";
import { TodosList } from "@/components/todos/TodosList";
import { useTodosByUser } from "@/hooks/useTodos";
import { Skeleton } from "@/components/ui/skeleton";

const UserTodos = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [limit] = useState(50);
  const [skip] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const userIdNum = parseInt(userId!);
  const { data: todosData, isLoading, error } = useTodosByUser(userIdNum, limit, skip);

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

      return true;
    });
  }, [sortedTodos, searchTerm, statusFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="self-start">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent truncate">
              User {userId} Todos
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            All todos assigned to User {userId}
          </p>
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

      {/* Filters - no user filter since we're already filtering by user */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        userIdFilter=""
        onUserIdFilterChange={() => { }}
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
        userIdFilter=""
        showUser={false}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredTodos.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default UserTodos;