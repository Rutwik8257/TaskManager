import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import AuthLayout from "../../components/layouts/AuthLayout";
import { UserContext } from "../../context/userContext"; // ✅ required
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Login logic will go here

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password){
      setError("Please enter the password");
      return;
    }
    setError("");
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
          email,
          password,
        });
        console.log("Login response:", response.data);

        const { token, role } = response.data;

        if (token) {
          localStorage.setItem("token", token);
          updateUser(response.data);
          if (role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }
  }catch (error) {
    if (error.response && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  }
  };
  

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-sm text-slate-700 mt-[5px] mb-6">
          Please enter your credentials to login
        </p>

        <form onSubmit={handleLogin}>
  <Input
    value={email}
    onChange={({ target }) => setEmail(target.value)}
    label="Email Address"
    placeholder="john@example.com"
    type="text"
  />

  <Input
    value={password}
    onChange={({ target }) => setPassword(target.value)}
    label="Password"
    placeholder="Min. 6 characters"
    type="password"
  />

  {error && <p className="text-red-500 text-sm">{error}</p>}

  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
  >
    Login
  </button>
</form>
        <p className="text-[13px] text-slate-800 mt-3">
          Don't have an account?{" "}
          <Link className="font-medium text-primary underline" to="/signUp">
            Sign Up
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
};

export default Login;
