import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/authContext"; // Adjust path if needed
import Login from "./components/auth/login"; // Adjust path if needed
import Register from "./components/auth/register"; // Adjust path if needed
import Home from "./components/home"; // Adjust path if needed

function App() {
  const { UserLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        // Add additional routes as needed
      </Routes>
    </Router>
  );
}

export default App;
