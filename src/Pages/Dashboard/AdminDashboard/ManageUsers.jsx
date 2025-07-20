import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxios from "../../../hooks/useAxios";

const ManageUsers = () => {
  const axiosSecure = useAxios();
  // const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Mutations
  const updateRole = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axiosSecure.patch(`/users/role/${id}`, { role });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["allUsers"]),
  });

  const markFraud = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/users/fraud/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      queryClient.invalidateQueries(["allVerifiedProperties"]);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      Swal.fire("Deleted!", "User has been removed.", "success");
    },
  });

  // Handlers
  const handleRoleChange = (id, role) => {
    updateRole.mutate({ id, role });
  };

  const handleMarkFraud = (id) => {
    Swal.fire({
      title: "Mark as Fraud?",
      text: "This will remove agent's properties and restrict access.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      confirmButtonText: "Yes, mark as fraud",
    }).then((result) => {
      if (result.isConfirmed) {
        markFraud.mutate(id);
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this user permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser.mutate(id);
      }
    });
  };

  if (isLoading)
    return (
      <p className="text-center py-10 text-primary font-semibold text-lg">
        Loading users...
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto overflow-x-auto rounded-lg shadow-lg border border-base-300">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">Manage Users</h2>

      <table className="table w-full table-zebra">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="text-center">#</th>
            <th className="text-left">Name</th>
            <th className="text-left">Email</th>
            <th className="text-center">Role</th>
            <th className="text-center">Make Admin</th>
            <th className="text-center">Make Agent</th>
            <th className="text-center">Mark Fraud</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr
              key={user._id}
              className="hover:bg-base-300 transition-colors duration-200"
            >
              <td className="text-center font-semibold">{i + 1}</td>
              <td className="max-w-xs truncate" title={user.name}>
                {user.name}
              </td>
              <td className="max-w-xs truncate" title={user.email}>
                {user.email}
              </td>
              <td className="text-center ">
                {user.status === "fraud" ? (
                  <span className="badge rounded-xs p-2 badge-error">Fraud</span>
                ) : (
                  <span className="capitalize">{user.role}</span>
                )}
              </td>
              <td className="text-center ">
                {user.status !== "fraud" && user.role !== "admin" && (
                  <button
                    onClick={() => handleRoleChange(user._id, "admin")}
                    className="btn btn-xs btn-info px-3 py-1 rounded-md font-semibold hover:bg-info-focus transition border-1 text-black"
                    style={{ minWidth: "90px" }}
                  >
                    Make Admin
                  </button>
                )}
              </td>
              <td className="text-center">
                {user.status !== "fraud" && user.role !== "agent" && (
                  <button
                    onClick={() => handleRoleChange(user._id, "agent")}
                    className="btn btn-xs btn-success px-3 py-1 rounded-md font-semibold hover:bg-success-focus transition border-1 text-black"
                    style={{ minWidth: "90px" }}
                  >
                    Make Agent
                  </button>
                )}
              </td>
              <td className="text-center">
                {user.role === "agent" && user.status !== "fraud" && (
                  <button
                    onClick={() => handleMarkFraud(user._id)}
                    className="btn btn-xs btn-warning px-3 py-1 rounded-md font-semibold hover:bg-warning-focus transition border-1 text-black"
                    style={{ minWidth: "110px" }}
                  >
                    Mark as Fraud
                  </button>
                )}
              </td>
              <td className="text-center">
                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn btn-xs btn-error px-3 py-1 rounded-md font-semibold hover:bg-error-focus transition border-1"
                  style={{ minWidth: "70px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
