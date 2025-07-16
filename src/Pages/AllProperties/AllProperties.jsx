import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; 
// import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxios from "../../hooks/useAxios";


const AllProperties = () => {
//   const axiosSecure = useAxiosSecure();
  const axiosSecure = useAxios();

  // Fetch all verified properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["allVerifiedProperties"],
    queryFn: async () => {
      const res = await axiosSecure.get("/properties?status=verified");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center mt-10 text-xl">Loading properties...</div>;
  }

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        All Verified Properties
      </h2>

      {properties.length === 0 ? (
        <p className="text-center text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300"
            >
              <figure>
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover rounded-t-lg"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title text-lg">{property.title}</h2>

                <p className="text-sm text-gray-700">
                  <strong>Location:</strong> {property.location}
                </p>

                {/* Agent Info */}
                <div className="flex items-center gap-2 mt-2">
                  <strong className="text-sm">Agent:</strong>
                  <img
                    src={
                      property.agentImage ||
                      "https://i.ibb.co/yWZyB89/default-avatar.png"
                    }
                    alt="Agent"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="text-sm">{property.agentName}</span>
                </div>

                {/* Status */}
                <p className="text-sm mt-2">
                  <strong>Status:</strong>{" "}
                  <span className="badge badge-success ml-1">Verified</span>
                </p>

                {/* Price */}
                <p className="text-sm mt-1">
                  <strong>Price Range:</strong> ${property.priceMin} - ${property.priceMax}
                </p>

                {/* Details button */}
                <Link to={`/property/${property._id}`} className="mt-4">
                  <button className="btn btn-sm btn-outline btn-primary w-full">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProperties;
