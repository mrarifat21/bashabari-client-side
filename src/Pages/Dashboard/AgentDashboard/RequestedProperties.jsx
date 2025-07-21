import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";

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
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left text-primary">
        Requested Properties
      </h2>
      {isLoading ? (
        <p className="text-center text-lg font-medium text-primary py-10">
          Loading...
        </p>
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
                  <td colSpan="8" className="text-center py-6 text-gray-500">
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
                        className={`badge capitalize text-white bg-black border border-black px-3 py-1`}
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
                            className="btn btn-xs bg-black text-green-500 border border-black px-3 hover:bg-gray-800"
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
                            className="btn btn-xs bg-black text-red-500 border border-black px-3 hover:bg-gray-800"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
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
