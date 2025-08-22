import { useState } from "react";
import { Link } from "react-router-dom";
import { User, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const users = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    todoCount: Math.floor(Math.random() * 20) + 1,
    completedCount: Math.floor(Math.random() * 10),
  }));

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Users
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse all users and view their todos
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {users.reduce((acc, user) => acc + user.todoCount, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Todos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {users.reduce((acc, user) => acc + user.completedCount, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Completed Todos</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="group hover:shadow-card transition-all duration-200 bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{user.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
                  asChild
                >
                  <Link to={`/users/${user.id}/todos`}>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {user.todoCount} todos
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-success-light text-success border-success/20"
                  >
                    {user.completedCount} done
                  </Badge>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={`/users/${user.id}/todos`}>
                  View Todos
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Users;