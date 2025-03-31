import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import guideBackground from "../../assets/heroBackground.png"; // Reusing the same background

const OilChangeGuide = () => {
  const bgRef = useRef(null);

  // Parallax effect for background (same as in Home and Guides)
  useEffect(() => {
    let targetY = 0;
    let currentY = 0;
    let animationFrame;
  
    const lerp = (start, end, factor) => start + (end - start) * factor;
  
    const updateParallax = () => {
      targetY = window.scrollY;
      currentY = lerp(currentY, targetY, 0.21);
  
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${currentY * 0.3}px) scale(1.1)`;
      }
  
      animationFrame = requestAnimationFrame(updateParallax);
    };
  
    animationFrame = requestAnimationFrame(updateParallax);
  
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="bg-[#F8F8F8] text-black w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] isolate overflow-hidden">
        <img
          ref={bgRef}
          src={guideBackground}
          alt="Oil change background"
          className="absolute inset-0 -z-10 w-full h-[120%] object-cover object-[center_70%] brightness-50 will-change-transform scale-120"
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-xl p-8 shadow-lg max-w-3xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-extrabold leading-tight text-[#1A3D61] mb-3"
            >
              Oil Change Guide
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-2"
            >
              <span className="px-2 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                Easy
              </span>
              <span className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                30 minutes
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Guide Content */}
      <section className="w-full py-12 px-6 sm:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <Link 
              to="/guides" 
              className="flex items-center text-[#1A3D61] hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Guides
            </Link>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#1A3D61] text-white hover:bg-[#17405f] rounded-lg transition font-medium">
                Print Guide
              </button>
              <button className="px-4 py-2 bg-white text-[#1A3D61] hover:bg-gray-200 border border-[#1A3D61] rounded-lg transition font-medium">
                Enable Gestures
              </button>
            </div>
          </div>

          {/* Introduction */}
          <div className="p-6 bg-[#e6f0ff] rounded-lg mb-8">
            <h2 className="text-xl font-bold text-[#1A3D61] mb-4">Introduction</h2>
            <p className="mb-4">
              Changing your vehicle's oil is one of the most important maintenance tasks to keep your engine running smoothly. This guide will walk you through the process step by step.
            </p>
            <p>
              <strong>Note:</strong> The exact procedure may vary slightly depending on your specific vehicle. Always consult your owner's manual for vehicle-specific information.
            </p>
          </div>

          {/* Materials Needed */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1A3D61] mb-4">Materials Needed</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>New oil filter (specific to your vehicle)</li>
              <li>Motor oil (check your owner's manual for the correct type and quantity)</li>
              <li>Oil filter wrench</li>
              <li>Jack and jack stands or ramps</li>
              <li>Wheel chocks</li>
              <li>Oil drain pan</li>
              <li>Funnel</li>
              <li>Rags or shop towels</li>
              <li>Gloves</li>
              <li>Wrench for the drain plug</li>
            </ul>
          </div>

          {/* Steps */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1A3D61] mb-4">Step-by-Step Instructions</h2>
            
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="bg-[#1A3D61] text-white p-4 flex items-center">
                <span className="bg-white text-[#1A3D61] rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">1</span>
                <h3 className="font-bold">Prepare Your Vehicle</h3>
              </div>
              <div className="p-4">
                <p>Make sure your engine is warm but not hot. Park on a level surface, apply the parking brake, and chock the wheels. If needed, raise the front of the vehicle using a jack and secure it with jack stands.</p>
                <div className="h-40 bg-gray-200 mt-4 flex items-center justify-center">
                  <div className="text-[#1A3D61] text-5xl opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="bg-[#1A3D61] text-white p-4 flex items-center">
                <span className="bg-white text-[#1A3D61] rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">2</span>
                <h3 className="font-bold">Locate the Oil Drain Plug and Filter</h3>
              </div>
              <div className="p-4">
                <p>Look under your vehicle and locate the oil drain plug on the bottom of the engine oil pan. Also locate the oil filter, which is usually on the side of the engine.</p>
                <div className="h-40 bg-gray-200 mt-4 flex items-center justify-center">
                  <div className="text-[#1A3D61] text-5xl opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="bg-[#1A3D61] text-white p-4 flex items-center">
                <span className="bg-white text-[#1A3D61] rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">3</span>
                <h3 className="font-bold">Drain the Old Oil</h3>
              </div>
              <div className="p-4">
                <p>Place the oil drain pan beneath the drain plug. Using the appropriate wrench, carefully loosen the drain plug counter-clockwise. Once loosened, unscrew it by hand (be careful as the oil may be warm). Let all the oil drain into the pan.</p>
                <div className="h-40 bg-gray-200 mt-4 flex items-center justify-center">
                  <div className="text-[#1A3D61] text-5xl opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional steps would continue here */}
          </div>

          {/* Tips and Warnings */}
          <div className="p-6 bg-[#FFF8D6] rounded-lg mb-8">
            <h2 className="text-xl font-bold text-[#946800] mb-4">Tips and Warnings</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Always dispose of used oil properly at a recycling center or auto parts store.</li>
              <li>Check your owner's manual for the recommended oil change interval.</li>
              <li>Remember to reset your oil change reminder light if your vehicle has one.</li>
              <li><strong>Warning:</strong> Never work under a vehicle supported only by a jack. Always use jack stands.</li>
              <li><strong>Warning:</strong> Be careful when draining hot oil as it can cause burns.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="w-full py-12 px-6 sm:px-12 bg-[#F8F8F8]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-[#1A3D61]">Related Guides</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                <div className="text-[#1A3D61] text-4xl opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#1A3D61] mb-2">Air Filter Replacement</h3>
                <button className="w-full px-4 py-2 bg-[#1A3D61] text-white hover:bg-[#17405f] rounded-lg transition font-medium mt-2">
                  View Guide
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                <div className="text-[#1A3D61] text-4xl opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#1A3D61] mb-2">Checking Fluid Levels</h3>
                <button className="w-full px-4 py-2 bg-[#1A3D61] text-white hover:bg-[#17405f] rounded-lg transition font-medium mt-2">
                  View Guide
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                <div className="text-[#1A3D61] text-4xl opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#1A3D61] mb-2">Tire Rotation</h3>
                <button className="w-full px-4 py-2 bg-[#1A3D61] text-white hover:bg-[#17405f] rounded-lg transition font-medium mt-2">
                  View Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OilChangeGuide;