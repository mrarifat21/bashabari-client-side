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
console.log(offers);
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
    <div className="w-11/12 mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6">Requested Properties</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Property</th>
                <th>Location</th>
                <th>Buyer</th>
                <th>Email</th>
                <th>Offer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => (
                <tr key={offer._id}>
                  <td>{index + 1}</td>
                  <td>{offer.propertyTitle}</td>
                  <td>{offer.propertyLocation}</td>
                  <td>{offer.buyerName}</td>
                  <td>{offer.buyerEmail}</td>
                  <td>${offer.offerAmount}</td>
                  <td>
                    <span
                      className={`badge ${
                        offer.status === "pending"
                          ? "badge-warning"
                          : offer.status === "accepted"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {offer.status}
                    </span>
                  </td>
                  <td>
                    {offer.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateStatus({
                              id: offer._id,
                              status: "accepted",
                              propertyId: offer.propertyId,
                            })
                          }
                          className="btn btn-xs btn-success"
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
                          className="btn btn-xs btn-error"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      "-"
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

export default RequestedProperties;
