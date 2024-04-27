import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import AdminsDashboard from "./components/admins";
import Home from "./components/home";
import NavigationBar from "./components/navigationBar";
import ResetPassword from "./components/auth/reset_password";
import Account from "./components/auth/account";
import Logout from "./components/auth/logout";
import "./index.css";

function App() {
  // const { UserLoggedIn } = useAuth();
  // TODO: Consider implementing rounting based on auth state here, not in the components themselves (?)
  // or maybe in a separate component.

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscrie-te" element={<Register />} />
        <Route path="/resetare-parola" element={<ResetPassword />} />
        <Route path="/cont" element={<Account />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admins" element={<AdminsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
