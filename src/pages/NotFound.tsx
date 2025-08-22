import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold text-muted-foreground mb-4">404</h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground">
            <p>Attempted to access:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs break-all">
              {location.pathname}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
