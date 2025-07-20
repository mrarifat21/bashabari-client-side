import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

const AdvertiseProperty = () => {
  const axiosSecure = useAxios();

  const { data: properties = [], isLoading, error, refetch } = useQuery({
    queryKey: ["verifiedProperties"],
    queryFn: async () => {
      const res = await axiosSecure.get("/properties?status=verified");
      return res.data;
    },
  });

  const handleAdvertise = async (id) => {
    try {
      const res = await axiosSecure.patch(`/advertise/${id}`);
      if (res.data.modifiedCount > 0) {
        refetch();
      }
    } catch (err) {
      console.error("Advertise failed", err);
    }
  };

  if (isLoading)
    return (
      <div className="text-center mt-10 text-primary font-semibold text-lg">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-10 text-error font-semibold text-lg">
        Error loading properties
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">
        Advertise Verified Properties
      </h2>

      {properties.length === 0 ? (
        <p className="text-center text-secondary-content text-lg">
          No verified properties found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-base-300">
          <table className="table w-full table-zebra">
            <thead className="bg-primary text-primary-content">
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">Image</th>
                <th className="text-left">Title</th>
                <th className="text-left">Location</th>
                <th className="text-left">Price Range</th>
                <th className="text-left">Agent</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, idx) => (
                <tr
                  key={property._id}
                  className="hover:bg-base-300 transition-colors duration-200"
                >
                  <td className="text-center font-semibold">{idx + 1}</td>
                  <td className="p-2">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-20 h-16 object-cover rounded-lg mx-auto"
                    />
                  </td>
                  <td className="max-w-xs truncate" title={property.title}>
                    {property.title}
                  </td>
                  <td className="max-w-xs truncate" title={property.location}>
                    {property.location}
                  </td>
                  <td>
                    ${property.priceMin} - ${property.priceMax}
                  </td>
                  <td className="max-w-xs truncate" title={property.agentName}>
                    {property.agentName}
                  </td>
                  <td className="text-center">
                    {property.isAdvertised ? (
                      <span className="badge badge-success p-2">Advertised</span>
                    ) : (
                      <button
                        onClick={() => handleAdvertise(property._id)}
                        className="btn btn-sm btn-primary"
                      >
                        Advertise
                      </button>
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

export default AdvertiseProperty;
