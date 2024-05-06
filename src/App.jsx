import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
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
          <Route path={pages.login} element={<Login />} />
          <Route path={pages.register} element={<Register />} />
          <Route path={pages.resetPassword} element={<ResetPassword />} />
          <Route path={pages.account} element={<Account />} />
          <Route path={pages.logout} element={<Logout />} />
          <Route path={pages.adminsDashboard} element={<AdminsDashboard />} />
          <Route path={pages.gallery} element={<GalleryPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
