import React, { useState } from "react";
import UserListSection from "./UserList";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sections = [
    { label: "Users", value: "users" },
    { label: "Messages", value: "messages" },
    { label: "Add Admin", value: "addAdmin" },
    { label: "Remove User", value: "removeUser" },
  ];

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
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ">
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
        {selectedSection === "users" && <UsersSection />}
        {selectedSection === "messages" && <MessagesSection />}
        {selectedSection === "addAdmin" && <AddAdminSection />}
        {selectedSection === "removeUser" && <RemoveUserSection />}
      </main>
    </div>
  );
};

const mockData = [
  {
    id: 1,
    emailAddress: "john@example.com",
    fullName: "John Doe",
    age: 25,
    phone: "1234567890",
    church: "First Church",
    payTaxTo: "IRS",
    amountPaid: "$100",
    transport: "Car",
    numberOfDays: 3,
    isConfirmed: true,
    isAdmin: true,
  },
  {
    id: 2,
    emailAddress: "jane@example.com",
    fullName: "Jane Smith",
    age: 17,
    phone: "9876543210",
    church: "Second Church",
    payTaxTo: "IRS",
    amountPaid: "$150",
    transport: "Bus",
    numberOfDays: 2,
    isConfirmed: false,
    isAdmin: false,
  },
];
const UsersSection = () => {
  return <UserListSection userList={mockData} />;
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
