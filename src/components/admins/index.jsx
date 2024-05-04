import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";
import MessagesTable from "./MessagesTable";
import { useAuth } from "../../contexts/authContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { getNumberOfUnreadMessages } from "../../firebase/database";
import ManageAdminsSection from "./ManageAdminsSection";
import { pages } from "../../constants";

const AdminDashboard = () => {
  //TODO: add identity validation
  const [selectedSection, setSelectedSection] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const [numbersForLabels, setNumberForLabels] = useState({
    unreadMessages: null,
    users: null,
  });

  const sections = [
    { label: "Participanti", value: "users" },
    { label: "Mesaje", value: "messages" },
    { label: "Admins", value: "admins" },
    { label: "Statistici", value: "statistics" },
  ];

  const getNumberForLabels = async (section) => {
    try {
      const numberOfUnreadMessages = await getNumberOfUnreadMessages();
      setNumberForLabels((prevData) => ({
        ...prevData,
        unreadMessages: numberOfUnreadMessages.toString(),
      }));
    } catch (error) {
      console.error("Error fetching number of unread messages:", error);
    }
  };

  useEffect(() => {
    if (!loading && (userData === null || !userData.isAdmin)) {
      navigate(pages.account);
    }
  }, [loading, userData, navigate]);

  useEffect(() => {
    getNumberForLabels("messages");
  }, [selectedSection]);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

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
                <div className="flex">
                  {section.label}{" "}
                  {section.value === "messages" &&
                    numbersForLabels.unreadMessages !== undefined &&
                    numbersForLabels.unreadMessages !== null &&
                    numbersForLabels.unreadMessages !== "0" && (
                      <span className="mx-2 rounded-full bg-red-500 flex items-center justify-center font-mono w-7 text-sm">
                        {numbersForLabels.unreadMessages}
                      </span>
                    )}
                  {section.value === "users" &&
                    numbersForLabels.users !== undefined &&
                    numbersForLabels.users !== null &&
                    numbersForLabels.users !== "0" && (
                      <span className="mx-2 rounded-full bg-red-500 flex items-center justify-center font-mono w-7 text-sm">
                        {numbersForLabels.users}
                      </span>
                    )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-full overflow-x-auto bg-slate-200">
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
        {userData !== null && userData.isAdmin ? (
          <>
            {selectedSection === "users" && (
              <UserTable loggedInUserData={userData} />
            )}
            {selectedSection === "messages" && <MessagesTable />}
            {selectedSection === "admins" && (
              <ManageAdminsSection loggedInUserData={userData} />
            )}
            {selectedSection === "statistics" && <StatisticsSection />}
          </>
        ) : (
          <div></div> // ???
        )}
      </main>
    </div>
  );
};

const StatisticsSection = () => {
  // Placeholder for Remove User Section
  return <h2>❗️aceasta pagina este inca in lucru❗️</h2>;
};

export default AdminDashboard;
