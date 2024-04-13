import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home";
import NavigationBar from "./components/navigationBar";
import "./index.css";


function App() {
  const { UserLoggedIn } = useAuth();

  return (
    <Router>
      <NavigationBar />
      <div className="pt-2 overflow-y-auto h-[calc(100vh-4rem)]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscrie-te" element={<Register />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
