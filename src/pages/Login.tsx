import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect old /login route to /auth
const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/auth", { replace: true });
  }, [navigate]);

  return null;
};

export default Login;
