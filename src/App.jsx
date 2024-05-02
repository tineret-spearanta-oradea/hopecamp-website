<<<<<<< HEAD
import HomePage from "./pages/HomePage"

function App() {
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import AdminsDashboard from "./components/admins";
import Home from "./components/home";
import ResetPassword from "./components/auth/reset_password";
import Account from "./components/auth/account";
import Logout from "./components/auth/logout";
import "./index.css";
>>>>>>> 7c14912a29c7eb47e7a4da50a890afa155bb9e29

function App() {
  return (
<<<<<<< HEAD
    <>
      <HomePage/>
    </>
  )
=======
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
>>>>>>> 7c14912a29c7eb47e7a4da50a890afa155bb9e29
}

export default App;
