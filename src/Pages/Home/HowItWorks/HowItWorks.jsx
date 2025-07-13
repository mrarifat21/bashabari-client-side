import { FaSearchLocation, FaRegHandshake, FaHome } from "react-icons/fa";

const HowItWorks = () => {
  return (
    <section className="py-12 bg-base-100">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-6 text-primary">How It Works</h2>
        <p className="text-base-content mb-10">
          Bashabari makes buying your dream property easy, secure, and transparent.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="card bg-base-200 p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl text-primary mb-4">
              <FaSearchLocation />
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Verified Properties</h3>
            <p className="text-sm text-base-content">
              Explore listings across Bangladesh with photos, prices, and agent info.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card bg-base-200 p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl text-primary mb-4">
              <FaRegHandshake />
            </div>
            <h3 className="text-xl font-semibold mb-2">Make an Offer</h3>
            <p className="text-sm text-base-content">
              Submit your offer securely with your preferred price and contact details.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card bg-base-200 p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl text-primary mb-4">
              <FaHome />
            </div>
            <h3 className="text-xl font-semibold mb-2">Own Your Dream Home</h3>
            <p className="text-sm text-base-content">
              Once the agent accepts and you complete payment, the home is yours!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
