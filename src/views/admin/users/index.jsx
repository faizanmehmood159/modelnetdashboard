import React from "react";
import AddUsers from "./AddUsers";
import UsersApprove from "./UsersApprove";

const Users = () => {
  return (
    <div className="mt-6">
      <div>
        <AddUsers />
      </div>
      <UsersApprove />
    </div>
  );
};

export default Users;
