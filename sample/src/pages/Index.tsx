import { Link } from "react-router-dom";

const Index = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold">React + Vite</h1>
      <Link to="/login" className="text-primary underline">Login</Link>
    </div>
  </div>
);

export default Index;
