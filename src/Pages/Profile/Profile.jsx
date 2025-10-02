import React from "react";
import { FaUserShield, FaUserTie } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";

const Profile = () => {
  const { user } = useAuth();
  const { role, isLoading } = useUserRole();

  if (isLoading || !user) {
    return (
      <div className="text-center py-20 text-text bg-base-100 text-lg font-semibold">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-base-100 rounded-xl shadow-lg mt-6">
      <div className="bg-base-200 border border-base-300 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary flex-shrink-0">
          <img
            src={user?.photoURL || "https://i.ibb.co/vq1kZ2J/default-user.png"}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-text">
          <h2 className="text-3xl font-extrabold mb-1 text-primary">{user?.displayName}</h2>
          <p className="text-text mb-3 break-words">{user?.email}</p>

          {role === "admin" && (
            <p className="inline-flex items-center gap-2 text-accent font-semibold text-lg">
              <FaUserShield /> Admin
            </p>
          )}

          {role === "agent" && (
            <p className="inline-flex items-center gap-2 text-accent font-semibold text-lg">
              <FaUserTie /> Agent
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-base-200 p-6 rounded-2xl shadow-md text-text max-w-md mx-auto sm:mx-0">
        <h3 className="text-xl font-bold mb-4 text-primary">Account Details</h3>
        <ul className="text-sm space-y-3">
          <li>
            <span className="font-semibold text-primary">Email:</span> {user.email}
          </li>

          <li>
            <span className="font-semibold text-primary">Join Date:</span>{" "}
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
