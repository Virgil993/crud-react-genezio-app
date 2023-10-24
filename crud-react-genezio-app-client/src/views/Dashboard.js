import React from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { User } from "@genezio-sdk/crud-react-genezio-app-server_us-east-1";

function Dashboard() {
  const [users, setUsers] = React.useState(null);
  const navigate = useNavigate();

  const getAllUsers = async () => {
    const res = await User.getUsers();
    if (!res || !res.success) {
      console.log("error at fetching users");
      return;
    }
    setUsers(res.users);
  };

  React.useEffect(() => {
    if (!users) {
      getAllUsers();
    }
  }, [users]);
  return !users ? (
    <></>
  ) : (
    <div className="dashboard">
      <div className="header">All users</div>
      {users.length !== 0 ? (
        <div className="users-container">
          {users.map((element) => {
            return (
              <div className="user" key={element._id}>
                <div>Name : {element.name}</div>
                <div>Email : {element.email}</div>
                <div>Gender : {element.gender}</div>
                <div>Verified : {element.verified.toString()}</div>
              </div>
            );
          })}
          <button
            onClick={(event) => {
              event.preventDefault();
              navigate("/addUser");
            }}
          >
            Add User
          </button>
        </div>
      ) : (
        <div className="users-container">
          <div>No users availabale</div>
          <button
            onClick={(event) => {
              event.preventDefault();
              navigate("/addUser");
            }}
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
