import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";

const MyAddedProperties = () => {
  const { user } = useAuth();
  //   const axiosSecure = useAxiosSecure();
  const axiosSecure = useAxios();
  const [properties, setProperties] = useState([]);

  // Fetch properties added by current agent
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/properties/agent?email=${user.email}`)
        .then((res) => setProperties(res.data));
    }
  }, [user, axiosSecure]);

 const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This property will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      axiosSecure
        .delete(`/properties/${id}`)
        .then((res) => {
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Property has been deleted.", "success");
            setProperties(properties.filter((p) => p._id !== id));
          } else {
            Swal.fire(
              "Failed!",
              "Property could not be deleted. Try again later.",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Delete error:", error);
          Swal.fire(
            "Error",
            "Something went wrong while deleting the property.",
            "error"
          );
        });
    }
  });
};


  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">My Added Properties</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="card bg-base-100 shadow-xl">
            <figure>
              <img
                src={property.image}
                alt={property.title}
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{property.title}</h2>
              <p>
                <strong>Location:</strong> {property.location}
              </p>
              <p>
                <strong>Agent:</strong> {property.agentName}
              </p>
              <p>
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
              <p>
                <strong>Price Range:</strong> ${property.priceMin} - $
                {property.priceMax}
              </p>

              <div className="mt-4 flex gap-2">
                {property.status !== "rejected" && (
                  <Link to={`/dashboard/updateProperty/${property._id}`}>
                    <button className="btn btn-sm btn-info">Update</button>
                  </Link>
                )}
                <button
                  className="btn btn-sm btn-error"
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
