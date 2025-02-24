import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken, handleApiError } from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    try {
      const response = await api.post("/auth/login", { username, password });
      const token = response.data.token;
      setAuthToken(token);
      localStorage.setItem("token", token);
      navigate("/tasks");
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
};

export default Login;
