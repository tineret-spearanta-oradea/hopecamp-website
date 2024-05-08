import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import UserTable from "./UserTable";
import MessagesTable from "./MessagesTable";
import { useAuth } from "../../contexts/authContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getNumberOfUnreadMessages,
} from "../../firebase/database";
import ManageAdminsSection from "./ManageAdminsSection";
import StatsSection from "./StatsSection";
import { pages } from "../../constants";
import { CampTitle } from "../../constants";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("stats");
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const [numbersForLabels, setNumberForLabels] = useState({
    unreadMessages: null,
    users: null,
  });

  const sections = [
    { label: "Statistici", value: "stats" },
    { label: "Participanti", value: "users" },
    { label: "Mesaje", value: "messages" },
    { label: "Admins", value: "admins" },
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
    try {
      const allUsersData = await getAllUsers();
      const unconfirmedUsers = allUsersData.filter((user) => !user.isConfirmed);
      setNumberForLabels((prevData) => ({
        ...prevData,
        users: unconfirmedUsers.length.toString(),
      }));
    } catch (error) {
      console.error("Error fetching number of users:", error);
    }
  };

  useEffect(() => {
    if (!loading && (userData === null || !userData.isAdmin)) {
      navigate(pages.account);
    }
  }, [loading, userData, navigate]);

  useEffect(() => {
    getNumberForLabels();
  }, [selectedSection]);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-64 ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <ul className="flex flex-col justify-between h-full">
          <div>
            {sections.map((section, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSectionClick(section.value)}
                  className={`py-2 px-4 block w-full text-left h-14 ${
                    selectedSection === section.value
                      ? "bg-gray-800"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <div className="flex">
                    {section.label}
                    {section.value === "messages" &&
                      numbersForLabels.unreadMessages !== undefined &&
                      numbersForLabels.unreadMessages !== null &&
                      numbersForLabels.unreadMessages !== "0" && (
                        <span className="mx-2 rounded-full bg-hope-orange flex items-center justify-center font-mono w-7 text-sm">
                          {numbersForLabels.unreadMessages}
                        </span>
                      )}
                    {section.value === "users" &&
                      numbersForLabels.users !== undefined &&
                      numbersForLabels.users !== null &&
                      numbersForLabels.users !== "0" && (
                        <span className="mx-2 rounded-full bg-hope-orange flex items-center justify-center font-mono w-7 text-sm">
                          {numbersForLabels.users}
                        </span>
                      )}
                  </div>
                </button>
              </li>
            ))}
          </div>
          <div className="flex flex-col justify-end">
            <li>
              <Link
                to={pages.account}
                className="py-2 px-4 block w-full text-left h-14 hover:bg-gray-800"
              >
                Contul meu
              </Link>
            </li>
            <li>
              <Link
                to={pages.logout}
                className="py-2 px-4 block w-full text-red-500 text-left h-14 hover:bg-gray-800"
              >
                Logout
              </Link>
            </li>
          </div>
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
          <div className="font-black text-lg uppercase ">
            {CampTitle.CoreName} {CampTitle.Edition}
          </div>
          <div className="text-sm flex items-center">
            <p className="mr-2 hidden sm:block text-xs">Admins Dashboard</p>
            {userData.imageUrl && userData.imageUrl !== "" && (
              <Link to={pages.account}>
                <img
                  src={userData.imageUrl}
                  alt="User"
                  style={{ height: "30px", borderRadius: "50%" }}
                />
              </Link>
            )}
          </div>
        </nav>
        {userData !== null && userData.isAdmin ? (
          <>
            {selectedSection === "users" && (
              <UserTable loggedInUserData={userData} />
            )}
            {selectedSection === "messages" && <MessagesTable />}
            {selectedSection === "admins" && (
              <ManageAdminsSection loggedInUserData={userData} />
            )}
            {selectedSection === "stats" && (
              <StatsSection setSelectedSection={setSelectedSection} />
            )}
          </>
        ) : (
          <div></div> // ???
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
