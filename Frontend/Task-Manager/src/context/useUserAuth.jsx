import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Named export 'useUserAuth'
export const useUserAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);
};
