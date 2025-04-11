import { useState } from "react";
import "./login.css";

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { username, password });
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: username.trim().toUpperCase(), // Match the case in database
          password: password.trim() // Ensure no whitespace in regimental number
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      localStorage.setItem("token", data.token);
      console.log("Login successful, token stored");
      onLogin();
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.message || "Network error occurred. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>CadoDeep Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <label htmlFor="username">Name</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Name"
          required
          disabled={isLoading}
        />

        <label htmlFor="password">Regimental Number</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your Regimental Number"
          required
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
