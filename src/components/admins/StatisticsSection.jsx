import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import { getAllUsers, getAllMessages } from "../../firebase/database";
import { MaxOccupancy } from "../../constants";
import ProgressBar from "@ramonak/react-progress-bar";

const StatisticsSection = ({ setSelectedSection }) => {
  const [numberOfConfirmedUsers, setNumberOfConfirmedUsers] = useState(0);
  const [totalNumberOfUsers, setTotalNumberOfUsers] = useState(0);
  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState(0);
  const [totalNumberOfMessages, setTotalNumberOfMessages] = useState(0);
  const [occupancyPercentage, setOccupancyPercentage] = useState(0);
  const [averageAge, setAverageAge] = useState(0);
  const [usersPerSignupDay, setUsersPerSignupDay] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsersResponse = await getAllUsers();
      setTotalNumberOfUsers(allUsersResponse.length);
      const confirmedUsersNumber = allUsersResponse.filter(
        (user) => user.isConfirmed
      ).length;
      setNumberOfConfirmedUsers(confirmedUsersNumber);
      const totalAge = allUsersResponse.reduce(function (prev, current) {
        return prev + current.age;
      }, 0);

      setAverageAge((totalAge / allUsersResponse.length).toFixed(2) || 0);
      setOccupancyPercentage(
        ((confirmedUsersNumber / MaxOccupancy) * 100).toFixed(2)
      );

      const groupedBySignupDate = allUsersResponse.reduce((acc, user) => {
        const date = new Date(user.signupDate).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = 1;
        } else {
          acc[date]++;
        }
        return acc;
      }, {});

      setUsersPerSignupDay(
        Object.keys(groupedBySignupDate).map((date) => ({
          date,
          numberOfUsers: groupedBySignupDate[date],
        }))
      );

      // get number of unread messages
      const allMessagesResponse = await getAllMessages();
      setTotalNumberOfMessages(allMessagesResponse.length);
      setNumberOfUnreadMessages(
        allMessagesResponse.filter((message) => !message.isRead).length
      );
    };

    fetchUsers();
  }, []);

  const handleGoToUsers = () => {
    setSelectedSection("users");
  };

  const handleGoToMessages = () => {
    setSelectedSection("messages");
  };

  return (
    <div className="m-4">
      <h1 className="text-lg font-bold mb-4">Statistici</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Users */}
        <button
          className="p-4 text-left rounded-lg shadow-md bg-white hover:bg-slate-200
           transition-all duration-300 ease-in-out border border-indigo-500"
          onClick={handleGoToUsers}
        >
          <div className="">
            <h2 className="text-lg font-bold ">Participanti </h2>
            <div className="flex justify-between">
              <h2 className="text-md mb-2">confirmați / înscrişi</h2>
              <h2 className="text-md mb-2">locuri ocupate</h2>
            </div>
            <div className="flex justify-between">
              <div className="flex items-end">
                <p className="text-lg font-bold">{numberOfConfirmedUsers} </p>
                <p className="text-md">/{totalNumberOfUsers}</p>
              </div>
              <p className="text-xl font-bold">{occupancyPercentage}%</p>
            </div>
            <ProgressBar height="10px" completed={occupancyPercentage} />
          </div>
        </button>
        {/* Messages */}
        <button
          className="p-4 text-left rounded-lg shadow-md bg-white hover:bg-slate-200
           transition-all duration-300 ease-in-out border border-indigo-500"
          onClick={handleGoToMessages}
        >
          <div className="">
            <h2 className="text-lg font-bold">Mesaje necitite </h2>
            <h2 className="text-md mb-2">din toate mesajele</h2>
            <div className="flex items-end">
              <p className="text-lg font-bold">{numberOfUnreadMessages} </p>
              <p className="text-md">/{totalNumberOfMessages}</p>
            </div>
          </div>
        </button>
        {/* Users per signup date */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 col-span-2">
          <h2 className="text-xl font-bold mb-2">
            Grafic înscrieri participanți
          </h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={usersPerSignupDay}>
              <Line type="monotone" dataKey="numberOfUsers" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Age */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Vârsta medie</h2>
          <h2 className="text-md mb-2">a participanților</h2>
          <p className="text-lg font-bold">{averageAge}</p>
        </div>
        {/* Users per numberOfDays */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Disponibilitate</h2>
          <h2 className="text-md mb-2">pe zile</h2>
          <p className="text-lg font-bold">Coming soon ... </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
