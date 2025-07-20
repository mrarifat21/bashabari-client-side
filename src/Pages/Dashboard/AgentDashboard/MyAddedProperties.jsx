import React from "react";
import profilePlaceholder from './../../../assets/profilePlaceholder.jpg';
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyAddedProperties = () => {
  const { user } = useAuth();
  // const axiosSecure = useAxiosSecure();
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

  if (isLoading) return <div className="text-center my-10 text-primary font-semibold text-lg">Loading...</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">
        My Added Properties
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div
            key={property._id}
            className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300 rounded-lg border border-base-300 flex flex-col"
          >
            <figure className="overflow-hidden rounded-t-lg">
              <img
                src={property.image}
                alt={property.title}
                className="h-56 w-full object-cover transform hover:scale-105 transition duration-300"
              />
            </figure>

            <div className="card-body flex flex-col flex-grow p-4">
              <h2 className="card-title text-lg font-semibold truncate" title={property.title}>
                {property.title}
              </h2>

              <p className="text-sm mt-1">
                <strong>Location:</strong> {property.location}
              </p>

              {/* Agent Info with image */}
              <div className="flex items-center gap-2 mt-2">
                <strong>Agent:</strong>
                <img
                  src={property.agentImage || profilePlaceholder}
                  alt="Agent"
                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                />
                <span className="text-sm truncate" title={property.agentName}>
                  {property.agentName}
                </span>
              </div>

              {/* Status */}
              <p className="text-sm mt-3">
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
              <p className="text-sm mt-2">
                <strong>Price Range:</strong> ${property.priceMin} - ${property.priceMax}
              </p>

              {/* Buttons */}
              <div className="mt-auto flex flex-wrap gap-3 justify-center sm:justify-start">
                {property.status !== "rejected" && (
                  <Link to={`/dashboard/updateProperty/${property._id}`} className="w-full sm:w-auto">
                    <button className="btn btn-sm btn-info w-full sm:w-auto px-6 py-2 rounded-md font-semibold hover:bg-info-focus transition">
                      Update
                    </button>
                  </Link>
                )}
                <button
                  className="btn btn-sm btn-error w-full sm:w-auto px-6 py-2 rounded-md font-semibold hover:bg-error-focus transition"
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
