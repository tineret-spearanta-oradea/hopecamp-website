import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import AdminsDashboard from "./components/admins";
import Home from "./components/home";
import ResetPassword from "./components/auth/reset_password";
import Account from "./components/auth/account";
import Logout from "./components/auth/logout";
import { pages } from "./constants";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={pages.home} element={<Home />} />
        <Route path={pages.login} element={<Login />} />
        <Route path={pages.register} element={<Register />} />
        <Route path={pages.resetPassword} element={<ResetPassword />} />
        <Route path={pages.account} element={<Account />} />
        <Route path={pages.logout} element={<Logout />} />
        <Route path={pages.adminsDashboard} element={<AdminsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
