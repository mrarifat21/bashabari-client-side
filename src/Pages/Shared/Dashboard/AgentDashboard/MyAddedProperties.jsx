import React from "react";
import useAuth from "../../../../hooks/useAuth";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";

const MyAddedProperties = () => {
  const { user } = useAuth();
  //   const axiosSecure = useAxiosSecure();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // ✅ Fetch properties added by the agent
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["myProperties", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/properties/agent?email=${user.email}`
      );
      return res.data;
    },
  });


  // ✅ Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/properties/${id}`);
      return res.data;
    },
    onSuccess: (data, variables) => {
      if (data.deletedCount > 0) {
        Swal.fire("Deleted!", "Property has been deleted.", "success");
        queryClient.invalidateQueries(["myProperties", user?.email]);
      } else {
        Swal.fire(
          "Failed!",
          "Property could not be deleted. Try again later.",
          "error"
        );
      }
    },
    onError: () => {
      Swal.fire(
        "Error",
        "Something went wrong while deleting the property.",
        "error"
      );
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This property will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <div className="text-center my-10">Loading...</div>;

  return (
  <div className="p-4">
    <h2 className="text-3xl font-bold mb-6 text-center">My Added Properties</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <div key={property._id} className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300">
          <figure>
            <img
              src={property.image}
              alt={property.title}
              className="h-48 w-full object-cover rounded-t-lg"
            />
          </figure>

          <div className="card-body">
            <h2 className="card-title text-lg">{property.title}</h2>

            <p className="text-sm">
              <strong>Location:</strong> {property.location}
            </p>

            {/* Agent Info with image */}
            <div className="flex items-center gap-2 mt-1">
              <strong>Agent:</strong>
              <img
                src={property.agentImage || "https://i.ibb.co/yWZyB89/default-avatar.png"}
                alt="Agent"
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
              <span className="text-sm">{property.agentName}</span>
            </div>

            {/* Status */}
            <p className="text-sm mt-1">
              <strong>Status:</strong>
              <span
                className={`ml-2 badge ${
                  property.status === "verified"
                    ? "badge-success"
                    : property.status === "rejected"
                    ? "badge-error"
                    : "badge-warning"
                }`}
              >
                {property.status}
              </span>
            </p>

            {/* Price */}
            <p className="text-sm mt-1">
              <strong>Price Range:</strong> ${property.priceMin} - ${property.priceMax}
            </p>

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {property.status !== "rejected" && (
                <Link to={`/dashboard/updateProperty/${property._id}`} className="w-full sm:w-auto">
                  <button className="btn btn-sm btn-info w-full">Update</button>
                </Link>
              )}
              <button
                className="btn btn-sm btn-error w-full sm:w-auto"
                onClick={() => handleDelete(property._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default MyAddedProperties;
