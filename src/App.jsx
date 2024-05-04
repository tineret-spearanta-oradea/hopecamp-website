import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import AdminsDashboard from "./components/admins";
import ResetPassword from "./components/auth/reset_password";
import Account from "./components/auth/account";
import Logout from "./components/auth/logout";
import { pages } from "./constants";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscrie-te" element={<Register />} />
          <Route path="/resetare-parola" element={<ResetPassword />} />
          <Route path="/cont" element={<Account />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/admins" element={<AdminsDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
