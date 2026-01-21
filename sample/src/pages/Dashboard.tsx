import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Phone, User } from "lucide-react";

export default function Dashboard() {
  const { user, logout, refreshUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      refreshUser();
    }
  }, [isLoading, user, refreshUser]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/phone-input", { replace: true });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div 
          role="status" 
          aria-label="Loading" 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
        ></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone Number</p>
                  <p className="text-lg font-semibold">{user?.phone_number || "N/A"}</p>
                </div>
              </div>

              {user?.name && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-lg font-semibold">{user.name}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account is active and verified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-sm font-medium">Active</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
