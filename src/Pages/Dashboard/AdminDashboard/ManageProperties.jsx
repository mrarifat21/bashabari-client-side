import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManageProperties = () => {
  //   const axiosSecure = useAxiosSecure();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // Fetch all pending properties
  const {
    data: pendingProperties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pending-properties"],
    queryFn: async () => {
      const res = await axiosSecure.get("/properties");
      return res.data;
    },
  });

  // Mutation for updating property status
  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/properties/status/${id}`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Updated!",
        text: "Property status has been changed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["pending-properties"]);
    },
  });

  // Handle approve/reject
  const handleStatusChange = (id, status) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You want to mark this as ${status}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${status} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, status });
      }
    });
  };

  if (isLoading)
    return (
      <p className="text-center py-10 text-primary font-semibold text-lg">
        Loading properties...
      </p>
    );
  if (isError)
    return (
      <p className="text-center text-error py-10 font-semibold text-lg">
        Failed to load properties.
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto overflow-x-auto rounded-lg shadow-lg border border-base-300">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">
        Manage Pending Properties
      </h2>

      {pendingProperties.length === 0 ? (
        <p className="text-center text-secondary-content text-lg">
          No pending properties found.
        </p>
      ) : (
        <table className="table w-full table-zebra">
          <thead className="bg-primary text-primary-content">
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Image</th>
              <th className="text-left">Title</th>
              <th className="text-left">Location</th>
              <th className="text-left">Agent Name</th>
              <th className="text-left">Agent Email</th>
              <th className="text-left">Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingProperties.map((property, index) => (
              <tr
                key={property._id}
                className="hover:bg-base-300 transition-colors duration-200"
              >
                <td className="text-center font-semibold">{index + 1}</td>
                <td className="p-2">
                  <img
                    src={property.image}
                    alt="property"
                    className="w-20 h-16 object-cover rounded-lg mx-auto"
                  />
                </td>
                <td className="max-w-xs truncate" title={property.title}>
                  {property.title}
                </td>
                <td className="max-w-xs truncate" title={property.location}>
                  {property.location}
                </td>
                <td className="max-w-xs truncate" title={property.agentName}>
                  {property.agentName}
                </td>
                <td className="max-w-xs truncate" title={property.agentEmail}>
                  {property.agentEmail}
                </td>
                <td>
                  ${property.priceMin} - ${property.priceMax}
                </td>

                <td className="text-center">
                  {property.status === "pending" ? (
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(property._id, "verified")
                        }
                        className="btn btn-sm btn-success"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(property._id, "rejected")
                        }
                        className="btn btn-sm btn-error"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`badge rounded-xs text-white p-2 ${
                        property.status === "verified"
                          ? "badge-success"
                          : property.status === "rejected"
                          ? "badge-error"
                          : "badge-neutral"
                      }`}
                    >
                      {property.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageProperties;
