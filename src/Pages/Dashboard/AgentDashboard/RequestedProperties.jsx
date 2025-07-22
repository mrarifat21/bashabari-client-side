import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const RequestedProperties = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["agentOffers", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/offers/agent?email=${user.email}`);
      return res.data;
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, status, propertyId }) => {
      return await axiosSecure.patch(`/offers/update-status/${id}`, {
        status,
        propertyId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["agentOffers", user?.email]);
      Swal.fire({
        title: "Status Updated!",
        icon: "success",
        background: "#1C1C1C", // Base-100
        color: "#EAEAEA", // Base-content
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error",
        text: "Failed to update status.",
        icon: "error",
        background: "#1C1C1C", // Base-100
        color: "#EAEAEA", // Base-content
      });
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 bg-base-100 rounded-xl shadow-lg text-base-content">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left text-primary pt-6">
        Requested Properties
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-base-300">
          <table className="table w-full table-zebra min-w-[700px]">
            <thead className="bg-primary text-primary-content">
              <tr>
                <th className="text-center">#</th>
                <th className="text-left">Property</th>
                <th className="text-left">Location</th>
                <th className="text-left">Buyer</th>
                <th className="text-left">Email</th>
                <th className="text-right">Offer</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-base-content/70">
                    No offers found.
                  </td>
                </tr>
              ) : (
                offers.map((offer, index) => (
                  <tr
                    key={offer._id}
                    className="hover:bg-base-300 transition-colors duration-200"
                  >
                    <td className="text-center font-semibold">{index + 1}</td>
                    <td
                      className="max-w-xs truncate"
                      title={offer.propertyTitle}
                    >
                      {offer.propertyTitle}
                    </td>
                    <td
                      className="max-w-xs truncate"
                      title={offer.propertyLocation}
                    >
                      {offer.propertyLocation}
                    </td>
                    <td className="max-w-xs truncate" title={offer.buyerName}>
                      {offer.buyerName}
                    </td>
                    <td className="max-w-xs truncate" title={offer.buyerEmail}>
                      {offer.buyerEmail}
                    </td>
                    <td className="text-right font-semibold whitespace-nowrap">
                      ${offer.offerAmount}
                    </td>
                    <td className="text-center">
                      <span
                        className={` capitalize px-3 py-1 
                          ${offer.status === "pending" ? " text-warning font-bold" : ""}
                          ${offer.status === "accepted" ? " text-success font-bold" : ""}
                          ${offer.status === "rejected" ? "text-error font-bold" : ""}
                        `}
                        title={offer.status}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {offer.status === "pending" ? (
                        <div className="flex justify-center gap-2 flex-wrap">
                          <button
                            onClick={() =>
                              updateStatus({
                                id: offer._id,
                                status: "accepted",
                                propertyId: offer.propertyId,
                              })
                            }
                            className="btn btn-xs btn-success text-success-content px-3 border-0"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateStatus({
                                id: offer._id,
                                status: "rejected",
                                propertyId: offer.propertyId,
                              })
                            }
                            className="btn btn-xs btn-error text-error-content px-3 border-0 "
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-base-content/60">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestedProperties;
