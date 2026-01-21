import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/phone-input", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div 
        role="status" 
        aria-label="Loading" 
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
      ></div>
    </div>
  );
};

export default Index;
