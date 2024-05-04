import React, { useState, useEffect } from "react";
import LoadingIcon from "../LoadingIcon";
import { getAllUsers } from "../../firebase/database";
import { updateUserData } from "../../firebase/database";
import FormButton from "../auth/FormButton";

const ManageAdminsSection = (loggedInUserData) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [addAdminEmail, setAddAdminEmail] = useState("");
  const [addSuperAdminEmail, setAddSuperAdminEmail] = useState("");
  const [deleteAdminEmail, setDeleteAdminEmail] = useState("");
  const [deleteSuperAdminEmail, setDeleteSuperAdminEmail] = useState("");
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    // return <LoadingIcon />;
  }

  // fetch data from database
  useEffect(() => {
    async function fetchData() {
      const allUsersData = await getAllUsers();
      setUserList(allUsersData);
      // setFilteredUserList(allUsersData);
      setIsLoading(false);
      if (
        loggedInUserData.loggedInUserData.isSuperAdmin &&
        loggedInUserData.loggedInUserData.isSuperAdmin === true
      ) {
        setIsSuperAdmin(true);
      }
    }
    fetchData();
  }, []);

  const addAdmin = () => {
    const userToUpdate = userList.find(
      (user) => user.email === addAdminEmail.replace(/\s/g, "")
    );
    if (userToUpdate === undefined || userToUpdate === null) {
      alert("Userul nu a fost gasit");
      return;
    }

    if (
      confirm(`Esti sigur ca vrei sa adaugi pe ${userToUpdate.name} ca admin?`)
    ) {
      userToUpdate.isConfirmed = true;
      userToUpdate.isAdmin = true;
      try {
        updateUserData(userToUpdate);
        setAddAdminEmail("");
        setUserList(
          userList.map((user) =>
            user.uid === userToUpdate.uid ? userToUpdate : user
          )
        );
        // TODO: change alert with ui component
        alert("Userul a fost adaugat ca admin");
      } catch (e) {
        alert(e);
      }
    }
  };

  const addSuperAdmin = () => {
    const userToUpdate = userList.find(
      (user) => user.email === addSuperAdminEmail.replace(/\s/g, "")
    );
    if (userToUpdate === undefined || userToUpdate === null) {
      alert("Userul nu a fost gasit");
      return;
    }

    if (
      confirm(
        `Esti sigur ca vrei sa adaugi pe ${userToUpdate.name} ca SUPER admin?`
      )
    ) {
      userToUpdate.isConfirmed = true;
      userToUpdate.isAdmin = true;
      userToUpdate.isSuperAdmin = true;
      try {
        updateUserData(userToUpdate);
        setUserList(
          userList.map((user) =>
            user.uid === userToUpdate.uid ? userToUpdate : user
          )
        );
        // TODO: change alerts with ui component
        alert("Userul a fost adaugat ca SUPER admin");
      } catch (e) {
        alert(e);
      }
    }
  };

  const deleteAdmin = () => {
    const userToUpdate = userList.find(
      (user) => user.email === deleteAdminEmail.replace(/\s/g, "")
    );

    if (userToUpdate === undefined || userToUpdate === null) {
      alert("Userul nu a fost gasit");
      return;
    }

    if (
      confirm(`Esti sigur ca vrei sa stergi pe ${userToUpdate.name} ca admin?`)
    ) {
      userToUpdate.isAdmin = false;
      try {
        updateUserData(userToUpdate);
        setUserList(
          userList.map((user) =>
            user.uid === userToUpdate.uid ? userToUpdate : user
          )
        );
        // TODO: change alerts with ui component
        alert("Userul a fost scos din lista de admini.");
      } catch (e) {
        alert(e);
      }
    }
  };

  const deleteSuperAdmin = () => {
    const userToUpdate = userList.find(
      (user) => user.email === deleteSuperAdminEmail.replace(/\s/g, "")
    );
    if (userToUpdate === undefined || userToUpdate === null) {
      alert("Userul nu a fost gasit");
      return;
    }

    if (
      confirm(
        `Esti sigur ca vrei sa stergi pe ${userToUpdate.name} ca SUPER admin?`
      )
    ) {
      userToUpdate.isSuperAdmin = false;
      try {
        updateUserData(userToUpdate);
        setUserList(
          userList.map((user) =>
            user.uid === userToUpdate.uid ? userToUpdate : user
          )
        );
        // TODO: change alerts with ui component
        alert(
          "Userul a fost scos din lista de SUPER admini. Acum este doar admin normal."
        );
      } catch (e) {
        alert(e);
      }
    }
  };

  return (
    <div className="m-4">
      <h1 className="text-3xl font-bold mb-4">Manage admins</h1>
      <AdminsList userList={userList} />
      {isSuperAdmin && (
        <div>
          <ManageAdminsInput
            manageAdminAction={addAdmin}
            manageEmailToAdd={setAddAdminEmail}
            label="Adaugǎ admin"
            buttonText="Adaugǎ"
          />
          <ManageAdminsInput
            manageAdminAction={deleteAdmin}
            manageEmailToAdd={setDeleteAdminEmail}
            label="Şterge admin"
            buttonText="Şterge"
          />
        </div>
      )}

      <AdminsList
        userList={userList}
        title="Lista SUPER Admini"
        isAdminType="isSuperAdmin"
      />
      {isSuperAdmin ? (
        <div>
          <ManageAdminsInput
            manageAdminAction={addSuperAdmin}
            manageEmailToAdd={setAddSuperAdminEmail}
            label="Adaugǎ SUPER admin"
            buttonText="Adaugǎ"
          />
          <ManageAdminsInput
            manageAdminAction={deleteSuperAdmin}
            manageEmailToAdd={setDeleteSuperAdminEmail}
            label="Şterge SUPER admin"
            buttonText="Şterge"
          />
        </div>
      ) : (
        <h3 className="text-blue-900">
          🔒 Nu ai drepturi de SUPER admin. Nu poti adauga sau sterge
          participanti sau admini.
        </h3>
      )}
    </div>
  );
};

export default ManageAdminsSection;

const AdminsList = ({
  userList,
  title = "Lista Admini",
  isAdminType = "isAdmin",
}) => {
  return (
    <div className=" mb-4">
      <h2 className="text-xl font-bold ">{title}</h2>
      <ul>
        {userList.map((user) => {
          if (user[isAdminType]) {
            return (
              <li key={user.uid}>
                {user.name} - {user.email}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

const ManageAdminsInput = ({
  manageAdminAction,
  manageEmailToAdd,
  label,
  buttonText,
}) => {
  return (
    <div className=" mb-4">
      <h3 className="text-md font-bold ">{label}</h3>
      <input
        type="text"
        placeholder="introdu emailul user-ului"
        className="p-2 border rounded-lg mr-2"
        onChange={(e) => manageEmailToAdd(e.target.value)}
      />
      <FormButton
        onClick={() => manageAdminAction()}
        action={buttonText === "Adaugǎ" ? "next" : "delete"}
      >
        {buttonText}
      </FormButton>
    </div>
  );
};
