import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import profilePlaceholder from "../../assets/profilePlaceholder.jpg";
import { Link } from "react-router";
import useAxios from "../../hooks/useAxios";

const AllProperties = () => {
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["verifiedPropertiesByAgent"],
    queryFn: async () => {
      const res = await axiosSecure.get("/verified-properties-by-agents");
      return res.data;
    },
  });

  // Filter based on location
  const filteredProperties = properties.filter((property) =>
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort based on price range
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const aMin = parseFloat(a.priceMin);
    const bMin = parseFloat(b.priceMin);

    if (sortOrder === "low-to-high") return aMin - bMin;
    if (sortOrder === "high-to-low") return bMin - aMin;
    return 0; // default
  });

  if (isLoading) {
    return <div className="text-center mt-10 text-xl">Loading properties...</div>;
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        All Verified Properties
      </h2>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full sm:max-w-xs"
        />

        {/* Sort Dropdown */}
        <select
          className="select select-bordered w-full sm:w-fit"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Sort by Price</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      {/* Property Cards */}
      {sortedProperties.length === 0 ? (
        <p className="text-center text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((property) => (
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

                <div className="flex items-center gap-2 mt-2">
                  <strong className="text-sm">Agent:</strong>
                  <img
                    src={property.agentImage || profilePlaceholder}
                    alt="Agent"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="text-sm">{property.agentName}</span>
                </div>

                <p className="text-sm mt-2">
                  <strong>Status:</strong>{" "}
                  <span className="badge badge-success">Verified</span>
                </p>

                <p className="text-sm mt-1">
                  <strong>Price Range:</strong> ${property.priceMin} - ${property.priceMax}
                </p>

                <Link to={`/property/${property._id}`} className="mt-4 block">
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
