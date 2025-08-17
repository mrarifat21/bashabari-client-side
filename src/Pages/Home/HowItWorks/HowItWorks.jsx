import { FaSearchLocation, FaRegHandshake, FaHome } from "react-icons/fa";

const HowItWorks = () => {
  return (
    <section className="bg-background">
      <div className="py-16  text-text transition-colors duration-300">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-button">
            How It Works
          </h2>
          <p className="text-text/80 mb-12">
            Bashabari makes buying your dream property easy, secure, and
            transparent.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-surfaceColor rounded-2xl p-6 shadow-md hover:shadow-xl border border-border transition-transform transform hover:-translate-y-1 duration-300">
              <div className="text-5xl text-button mb-4">
                <FaSearchLocation />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">
                Browse Verified Properties
              </h3>
              <p className="text-sm text-text/80">
                Explore listings across Bangladesh with photos, prices, and
                agent info.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surfaceColor rounded-2xl p-6 shadow-md hover:shadow-xl border border-border transition-transform transform hover:-translate-y-1 duration-300">
              <div className="text-5xl text-button mb-4">
                <FaRegHandshake />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">
                Make an Offer
              </h3>
              <p className="text-sm text-text/80">
                Submit your offer securely with your preferred price and contact
                details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surfaceColor rounded-2xl p-6 shadow-md hover:shadow-xl border border-border transition-transform transform hover:-translate-y-1 duration-300">
              <div className="text-5xl text-button mb-4">
                <FaHome />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">
                Own Your Dream Home
              </h3>
              <p className="text-sm text-text/80">
                Once the agent accepts and you complete payment, the home is
                yours!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
