import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importez useNavigate
import { useAuth } from "../context/AuthProvider";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Utilisez useNavigate ici
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      navigate("/chat"); // Redirigez vers la page du chat après une connexion réussie
    } else {
      // Afficher un message d'erreur ou effectuer une autre action en cas d'échec de connexion
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
