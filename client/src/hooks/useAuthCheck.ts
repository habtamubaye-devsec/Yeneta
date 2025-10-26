import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

axios.defaults.withCredentials = true; // send cookies automatically

export function useAuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/auth/me");
        console.log(res)
        if (res.data.user.role === "student") navigate("/student");
        else if (res.data.user.role === "instructor") navigate("/instructor");
      } catch(error: any) {
        navigate("/register");
        message.error(error.message)
      }
    };

    checkAuth();
  }, [navigate]);
}
