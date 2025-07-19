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
      queryClient.invalidateQueries(["pendingProperties"]);
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
    return <p className="text-center py-10">Loading properties...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 py-10">
        Failed to load properties.
      </p>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Pending Properties</h2>

      {pendingProperties.length === 0 ? (
        <p className="text-gray-500">No pending properties found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Agent Name</th>
                <th>Agent Eamil</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingProperties.map((property, index) => (
                <tr key={property._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={property.image}
                      alt="property"
                      className="w-20 h-12 object-cover rounded"
                    />
                  </td>
                  <td>{property.title}</td>
                  <td>{property.location}</td>
                  <td>{property.agentName}</td>
                  <td>{property.agentEmail}</td>
                  <td>
                    ${property.priceMin} - ${property.priceMax}
                  </td>

                  <td className="flex gap-2">
                    {property.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(property._id, "verified")
                          }
                          className="btn btn-xs btn-success"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(property._id, "rejected")
                          }
                          className="btn btn-xs btn-error"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`badge text-white ${
                          property.status === "verified"
                            ? "bg-success"
                            : property.status === "rejected"
                            ? "bg-error"
                            : "bg-gray-400"
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
        </div>
      )}
    </div>
  );
};

export default ManageProperties;
