import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const PropertyBought = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch user's bought/offered properties
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["propertyBought", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/offers/user?email=${user.email}`);
      return res.data;
    },
  });

  // Mutation to simulate payment update (you'll replace this with actual payment integration)
  const payMutation = useMutation({
    mutationFn: async (offerId) => {
      return axiosSecure.patch(`/offers/pay/${offerId}`, {
        status: "bought",
        transactionId: "txn_1234567890", // dummy transaction id, replace after integration
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["propertyBought", user?.email]);
      Swal.fire("Payment Success", "Payment completed successfully.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Payment failed. Please try again.", "error");
    },
  });

  const handlePay = (id) => {
    Swal.fire({
      title: "Proceed to Pay?",
      text: "You will pay the offered amount for this property.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, pay now",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // payMutation.mutate(id);
        navigate( `/dashboard/payment/${id}`)
      }
    });
  };
console.log(offers);
  if (isLoading) return <p className="text-center py-10">Loading your properties...</p>;

  if (offers.length === 0)
    return <p className="text-center py-10 text-gray-500">You haven't made any offers yet.</p>;
// console.log(offers);
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8">My Offered Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer._id} className="border rounded-lg shadow p-4 ">
            <img
              src={offer.propertyImage}
              alt={offer.propertyTitle}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold">{offer.propertyTitle}</h3>
            <p className="text-gray-300 mb-1">Location: {offer.propertyLocation}</p>
            <p className="text-gray-300 mb-1">Agent: {offer.agentName}</p>
            <p className="text-gray-400 font-semibold mb-2">Offered Amount: ${offer.offerAmount}</p>

            <p className="mb-3">
              Status:{" "}
              <span
                className={`font-semibold ${
                  offer.status === "pending"
                    ? "text-yellow-500"
                    : offer.status === "accepted"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
              </span>
            </p>

            {offer.status === "accepted" && !offer.transactionId && (
              <button
                onClick={() => handlePay(offer._id)}
                className="btn btn-primary w-full"
              >
                Pay
              </button>
            )}

            {offer.status === "bought" && offer.transactionId && (
              <p className="text-green-600 font-semibold">
                Paid (Transaction ID: {offer.transactionId})
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyBought;
