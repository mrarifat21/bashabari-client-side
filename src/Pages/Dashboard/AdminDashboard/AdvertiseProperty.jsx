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

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10">Error loading properties</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Advertise Verified Properties</h2>
      {properties.length === 0 ? (
        <p>No verified properties found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Price Range</th>
                <th>Agent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, idx) => (
                <tr key={property._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-20 h-16 object-cover rounded"
                    />
                  </td>
                  <td>{property.title}</td>
                  <td>{property.location}</td>
                  <td>
                    ${property.priceMin} - ${property.priceMax}
                  </td>
                  <td>{property.agentName}</td>
                  <td>
                    {property.isAdvertised ? (
                      <span className="badge badge-success">Advertised</span>
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
