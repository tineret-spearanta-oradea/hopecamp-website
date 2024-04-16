import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import AdminsDashboard from "./components/admins";
import Home from "./components/home";
import "./index.css";

function App() {
  const { UserLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscrie-te" element={<Register />} />
        <Route path="/admins" element={<AdminsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
