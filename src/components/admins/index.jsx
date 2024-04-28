import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";
import { useAuth } from "../../contexts/authContext";
import { Navigate, Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  //TODO: add identity validation
  const [selectedSection, setSelectedSection] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { authData, userData, userLoggedIn, loading, error } = useAuth();

  const sections = [
    { label: "Participanti", value: "users" },
    { label: "Mesaje", value: "messages" },
    { label: "Aduga admin", value: "addAdmin" },
    { label: "Sterge", value: "removeUser" },
  ];

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  useEffect(() => {
    if (!loading && !userData.isAdmin) {
      navigate("/cont");
    }
  }, [loading, userData, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white p-4 w-64 ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <ul>
          {sections.map((section, index) => (
            <li key={index}>
              <button
                onClick={() => handleSectionClick(section.value)}
                className={`py-2 px-4 block w-full text-left ${
                  selectedSection === section.value
                    ? "bg-gray-800"
                    : "hover:bg-gray-800"
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="max-w-full overflow-x-auto bg-slate-200">
        {/* Navbar */}
        <nav className="bg-gray-700 text-white w-full p-4 mb-4 flex justify-between items-center">
          {/* Sidebar toggle button */}
          <button className="" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>

        {/* Main section based on selected section */}
        {userData.isAdmin ? (
          <>
            {selectedSection === "users" && <UserTable />}
            {selectedSection === "messages" && <MessagesSection />}
            {selectedSection === "addAdmin" && <AddAdminSection />}
            {selectedSection === "removeUser" && <RemoveUserSection />}
          </>
        ) : (
          <div></div>
        )}
      </main>
    </div>
  );
};

const MessagesSection = () => {
  // Placeholder for Messages Section
  return <h2>Messages Section</h2>;
};
const AddAdminSection = () => {
  // Placeholder for Add Admin Section
  return <h2>Add Admin Section</h2>;
};

const RemoveUserSection = () => {
  // Placeholder for Remove User Section
  return <h2>Remove User Section</h2>;
};

export default AdminDashboard;
