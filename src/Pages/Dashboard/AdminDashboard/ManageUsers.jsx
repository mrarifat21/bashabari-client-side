import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxios from "../../../hooks/useAxios";

const ManageUsers = () => {
  const axiosSecure = useAxios();
//   const axiosSecure = useAxiosSecure();
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

  if (isLoading) return <p className="text-center">Loading users...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Make Admin</th>
              <th>Make Agent</th>
              <th>Mark Fraud</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user._id}>
                <td>{i + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.status === "fraud" ? (
                    <span className="badge badge-error">Fraud</span>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {user.status !== "fraud" && user.role !== "admin" && (
                    <button
                      onClick={() => handleRoleChange(user._id, "admin")}
                      className="btn btn-xs btn-info"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
                <td>
                  {user.status !== "fraud" && user.role !== "agent" && (
                    <button
                      onClick={() => handleRoleChange(user._id, "agent")}
                      className="btn btn-xs btn-success"
                    >
                      Make Agent
                    </button>
                  )}
                </td>
                <td>
                  {user.role === "agent" && user.status !== "fraud" && (
                    <button
                      onClick={() => handleMarkFraud(user._id)}
                      className="btn btn-xs btn-warning"
                    >
                      Mark as Fraud
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
