import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const AddToWishlistButton = ({ property }) => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  // ✅ Check if property already in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (user && property?._id) {
        try {
          const res = await axiosSecure.get(
            `/wishlist/check?email=${user.email}&propertyId=${property._id}`
          );
          setIsAdded(res.data.exists); // true or false
        } catch (err) {
          console.error("Error checking wishlist:", err);
        }
      }
    };

    checkWishlist();
  }, [user, property?._id, axiosSecure]);

  // ✅ Handle Add to Wishlist
  const handleAddToWishlist = async () => {
    if (!user) {
      return Swal.fire("Unauthorized", "Please log in to add to wishlist", "warning");
    }

    setIsAdding(true);
    const wishlistData = {
      userEmail: user.email,
      propertyId: String(property._id), // ensure string
      propertyTitle: property.title,
      propertyImage: property.image,
      priceMin: property.priceMin,
      priceMax: property.priceMax,
      agentName: property.agentName,
      agentImage: property.agentImage,
      agentEmail:property.agentEmail,
      propertyLocation: property.location,
      propertyStatus: property.status,
      addedAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/wishlist", wishlistData);
      if (res.data.insertedId) {
        Swal.fire({
          title: "Added!",
          text: "Property added to your wishlist.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsAdded(true);
      } else {
        Swal.fire("Failed", "Could not add to wishlist", "error");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        Swal.fire("Already Added", err.response.data.message, "info");
        setIsAdded(true);
      } else {
        Swal.fire("Error", err.message || "Something went wrong", "error");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToWishlist}
      disabled={isAdding || isAdded}
      className="btn btn-primary mt-4 w-full sm:w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdded ? "Added ❤️" : isAdding ? "Adding..." : "Add to Wishlist ❤️"}
    </button>
  );
};

export default AddToWishlistButton;
