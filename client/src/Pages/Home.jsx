import Header from "../components/Header";
import partner1 from "../assets/Placeholder.png";
import partner2 from "../assets/Placeholder.png";
import partner3 from "../assets/Placeholder.png";
import heroBackground from "../assets/heroBackground.png";
import { motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const FadeInOnView = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    let targetY = 0;
    let currentY = 0;
    let animationFrame;
  
    const lerp = (start, end, factor) => start + (end - start) * factor;
  
    const updateParallax = () => {
      targetY = window.scrollY;
      currentY = lerp(currentY, targetY, 0.21); // Smooth interpolation
  
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${currentY * 0.3}px) scale(1.1)`; // mask movement
      }
  
      animationFrame = requestAnimationFrame(updateParallax);
    };
  
    animationFrame = requestAnimationFrame(updateParallax);
  
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="bg-[#F8F8F8] text-black w-full overflow-x-hidden">

      {/* Hero Section */}
<section className="relative min-h-[75vh] sm:min-h-[80vh] isolate overflow-hidden">
  <img
    ref={bgRef}
    src={heroBackground}
    alt="Auto repair background"
    className="absolute inset-0 -z-10 w-full h-[120%] object-cover object-[center_200%] brightness-50 will-change-transform scale-120"
  />

  <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-xl p-10 shadow-lg max-w-3xl"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1A3D61] mb-4"
      >
        Smarter Vehicle Maintenance Starts Here
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg md:text-xl text-gray-700 mb-8"
      >
        Built for home and professional mechanics. Track. Guide. Maintain.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <button className="px-6 py-3 bg-[#1A3D61] text-white hover:bg-[#17405f] rounded-lg transition text-lg font-semibold">
          Browse Guides
        </button>

        <Link to="/add-vehicle">
          <button className="px-6 py-3 bg-white text-[#1A3D61] hover:bg-gray-200 border border-[#1A3D61] rounded-lg transition text-lg font-semibold">
            Enter Vehicle Info
          </button>
        </Link>
      </motion.div>
    </motion.div>
  </div>
</section>

<<<<<<< Updated upstream
=======
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link to="/guides">
                <button className="px-6 py-3 bg-[#1A3D61] text-white hover:bg-[#17405f] rounded-lg transition text-lg font-semibold">
                  Browse Guides
                </button>
              </Link>
              <button className="px-6 py-3 bg-white text-[#1A3D61] hover:bg-gray-200 border border-[#1A3D61] rounded-lg transition text-lg font-semibold">
                Enter Vehicle Info
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
>>>>>>> Stashed changes

      {/* Features */}
      <section className="w-full py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-[#1A3D61]">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeInOnView delay={0.1}>
              <div className="rounded-lg bg-[#e6f0ff] p-6 shadow-sm text-left">
                <h3 className="font-semibold text-[#1A3D61] text-lg mb-2">
                  Gesture-Controlled Guides
                </h3>
                <p>
                  Navigate repair steps hands-free using intuitive gestures while keeping your workspace clean and efficient.
                </p>
              </div>
            </FadeInOnView>
            <FadeInOnView delay={0.3}>
              <div className="rounded-lg bg-[#E6FFE6] p-6 shadow-sm text-left">
                <h3 className="font-semibold text-[#066306] text-lg mb-2">
                  Maintenance History
                </h3>
                <p>
                  Digitally track oil changes, tire rotations, inspections, and service logs across all your vehicles.
                </p>
              </div>
            </FadeInOnView>
            <FadeInOnView delay={0.5}>
              <div className="rounded-lg bg-[#FFF8D6] p-6 shadow-sm text-left">
                <h3 className="font-semibold text-[#946800] text-lg mb-2">
                  Parts Compatibility
                </h3>
                <p>
                  Lookup and verify compatible parts for your exact vehicle — no more guessing at the parts store.
                </p>
              </div>
            </FadeInOnView>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-20 px-6 sm:px-12 bg-[#F8F8F8]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-[#1A3D61]">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <FadeInOnView delay={0.1}>
              <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">1. Add Your Vehicle</h4>
                <p>
                  Customize your experience by entering your make, model, and year — VIN optional.
                </p>
              </div>
            </FadeInOnView>
            <FadeInOnView delay={0.3}>
              <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">2. Choose a Task</h4>
                <p>
                  Select from common procedures or guided diagnostics to begin your repair or maintenance task.
                </p>
              </div>
            </FadeInOnView>
            <FadeInOnView delay={0.5}>
              <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">3. Follow the Steps</h4>
                <p>
                  Use clean, visual step-by-step instructions or gesture-based navigation while you work.
                </p>
              </div>
            </FadeInOnView>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="w-full py-16 px-6 sm:px-12 bg-white text-center">
        <h2 className="text-2xl font-bold text-[#1A3D61] mb-4">Our Partners</h2>
        <p className="mb-10 text-gray-600">
          We collaborate with leading tech providers, parts manufacturers, and community infrastructure partners.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          <img src={partner1} alt="Partner 1" className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition" />
          <img src={partner2} alt="Partner 2" className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition" />
          <img src={partner3} alt="Partner 3" className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition" />
        </div>
      </section>
    </div>
  );
};

export default Home;