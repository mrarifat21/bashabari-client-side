import React from "react";

import { FaUserShield, FaUserTie, FaUserCircle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";

const Profile = () => {
  const { user } = useAuth();
  const { role, isLoading } = useUserRole();

  if (isLoading || !user) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="border rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
        {/* Profile image */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
          <img
            src={user?.photoURL || "https://i.ibb.co/vq1kZ2J/default-user.png"}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user?.displayName}</h2>
          <p className=" mt-1">{user?.email}</p>

          {role === "admin" && (
            <p className="mt-2 text-primary font-medium flex items-center gap-2">
              <FaUserShield /> Admin
            </p>
          )}

          {role === "agent" && (
            <p className="mt-2 text-blue-600 font-medium flex items-center gap-2">
              <FaUserTie /> Agent
            </p>
          )}

          {/* No role shown for regular users */}
        </div>
      </div>

      {/* Optional additional info */}
      <div className="mt-6 bg-base-100 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-2">Account Details</h3>
        <ul className="text-sm  space-y-1">
          <li>
            <span className="font-medium">Email:</span> {user.email}
          </li>
          
          <li>
            <span className="font-medium">Join Date:</span>{" "}
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : "N/A"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
