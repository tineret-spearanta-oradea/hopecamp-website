import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  Legend,
  Rectangle,
} from "recharts";
import { Link } from "react-router-dom";
import { getAllUsers, getAllMessages } from "../../firebase/database";
import { MaxOccupancy } from "../../constants";
import ProgressBar from "@ramonak/react-progress-bar";

const StatsSection = ({ setSelectedSection }) => {
  const [numberOfConfirmedUsers, setNumberOfConfirmedUsers] = useState(0);
  const [totalNumberOfUsers, setTotalNumberOfUsers] = useState(0);
  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState(0);
  const [totalNumberOfMessages, setTotalNumberOfMessages] = useState(0);
  const [occupancyPercentage, setOccupancyPercentage] = useState(0);
  const [averageAge, setAverageAge] = useState(0);
  const [usersPerSignupDay, setUsersPerSignupDay] = useState([]);
  const [usersPerCampDay, setUsersPerCampDay] = useState([]);

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

      const groupedByCampDay = allUsersResponse.reduce((acc, user) => {
        const date = new Date(user.startDate).toLocaleDateString();
        //iterate from user.startDate to user.endDate
        for (
          let d = new Date(user.startDate);
          d <= new Date(user.endDate);
          d.setDate(d.getDate() + 1)
        ) {
          const date = d.toLocaleDateString();
          if (!acc[date]) {
            acc[date] = 1;
          } else {
            acc[date]++;
          }
        }

        return acc;
      }, {});

      setUsersPerCampDay(
        Object.keys(groupedByCampDay).map((date) => ({
          date,
          numberOfUsers: groupedByCampDay[date],
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Users */}
        <button
          className=" text-left rounded-lg shadow-md bg-white hover:bg-slate-200
           transition-all duration-300 ease-in-out border border-indigo-500
           relative group cursor-pointer col-span-2 sm:col-span-1
           "
          onClick={handleGoToUsers}
        >
          <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative p-6 rounded-lg bg-white  ring-1 ring-gray-900/5">
            <h2 className="text-lg font-bold ">Participanti </h2>
            <div className="flex justify-between">
              <h2 className="text-md mb-2 lg:text-sm">confirmați / înscrişi</h2>
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
          className=" text-left rounded-lg shadow-md bg-white hover:bg-slate-200
           transition-all duration-300 ease-in-out border border-indigo-500
           relative group cursor-pointer col-span-2 sm:col-span-1
           "
          onClick={handleGoToMessages}
        >
          <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative h-full p-6 rounded-lg bg-white ring-1 ring-gray-900/5">
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
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Users per numberOfDays */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-2 sm:col-span-1">
          <h2 className="text-lg font-bold ">Locuri ocupate</h2>
          <h2 className="text-md mb-2">pe zile</h2>
          <div>
            {console.log(usersPerCampDay)}
            {/* <ResponsiveContainer width="100%" height="90%"> */}
            <BarChart data={usersPerCampDay} height={300} width={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="numberOfUsers" fill="#5664d0" />
            </BarChart>
            {/* </ResponsiveContainer> */}
          </div>
        </div>
        {/* Age */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-2 sm:col-span-1">
          <h2 className="text-lg font-bold">Vârsta medie</h2>
          <h2 className="text-md mb-2">a participanților</h2>
          <p className="text-lg font-bold">{averageAge}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
