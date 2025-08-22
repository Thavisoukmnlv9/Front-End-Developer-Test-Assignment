import { useState } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/enhanced-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "completed" | "pending";
  onStatusFilterChange: (value: "all" | "completed" | "pending") => void;
  userIdFilter: string;
  onUserIdFilterChange: (value: string) => void;
  onClearFilters: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export const FilterBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  userIdFilter,
  onUserIdFilterChange,
  onClearFilters,
  totalCount,
  filteredCount,
}: FilterBarProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const hasActiveFilters = searchTerm || statusFilter !== "all" || userIdFilter;

  return (
    <div className="space-y-4">
      {/* Search and Basic Filters Row */}
      <div className="flex flex-col gap-4">
        {/* Search Input - Always visible */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                {isFiltersOpen ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User ID Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <Input
                    placeholder="Enter user ID"
                    type="number"
                    value={userIdFilter}
                    onChange={(e) => onUserIdFilterChange(e.target.value)}
                    min="1"
                  />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">&nbsp;</label>
                    <Button
                      variant="outline"
                      onClick={onClearFilters}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Results Summary and Active Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Results Count */}
        <div className="flex items-center gap-2">
          {totalCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              {hasActiveFilters && filteredCount !== undefined
                ? `${filteredCount} of ${totalCount} todos`
                : `${totalCount} todos`
              }
            </span>
          )}
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap items-center gap-2">
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="capitalize">
              {statusFilter}
            </Badge>
          )}
          {userIdFilter && (
            <Badge variant="secondary">
              User {userIdFilter}
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary">
              "{searchTerm}"
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};