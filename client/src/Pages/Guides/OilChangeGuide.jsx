import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import guideBackground from "../../assets/heroBackground.png"; // Adjusted path for subfolder
import gestureService from "../../GestureNav/GestureService.js";
window.gestureService = gestureService;
import GestureControl from "../../GestureNav/GestureControl"; // Import the reusable component

const OilChangeGuide = () => {
    const bgRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
    const [gesturesEnabled, setGesturesEnabled] = useState(false); // Add this state declaration
    const [navigationCooldown, setNavigationCooldown] = useState(false);

  // Steps for the guide
  const steps = [
    {
      title: "Introduction",
      content: (
        <div className="p-6 bg-[#e6f0ff] rounded-lg">
          <h2 className="text-xl font-bold text-[#1A3D61] mb-4">Introduction</h2>
          <p className="mb-4">
            Changing your vehicle's oil is one of the most important maintenance tasks to keep your engine running smoothly. This guide will walk you through the process step by step.
          </p>
          <p>
            <strong>Note:</strong> The exact procedure may vary slightly depending on your specific vehicle. Always consult your owner's manual for vehicle-specific information.
          </p>
        </div>
      )
    },
    {
      title: "Materials Needed",
      content: (
        <div>
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
      )
    },
    {
      title: "Prepare Your Vehicle",
      content: (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1A3D61] text-white p-4">
            <h3 className="font-bold text-lg">Step 1: Prepare Your Vehicle</h3>
          </div>
          <div className="p-6">
            <p>Make sure your engine is warm but not hot. Park on a level surface, apply the parking brake, and chock the wheels. If needed, raise the front of the vehicle using a jack and secure it with jack stands.</p>
            <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
              <div className="text-[#1A3D61] text-5xl opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Locate Oil Drain Plug and Filter",
      content: (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1A3D61] text-white p-4">
            <h3 className="font-bold text-lg">Step 2: Locate the Oil Drain Plug and Filter</h3>
          </div>
          <div className="p-6">
            <p>Look under your vehicle and locate the oil drain plug on the bottom of the engine oil pan. Also locate the oil filter, which is usually on the side of the engine.</p>
            <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
              <div className="text-[#1A3D61] text-5xl opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Drain the Old Oil",
      content: (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1A3D61] text-white p-4">
            <h3 className="font-bold text-lg">Step 3: Drain the Old Oil</h3>
          </div>
          <div className="p-6">
            <p>Place the oil drain pan beneath the drain plug. Using the appropriate wrench, carefully loosen the drain plug counter-clockwise. Once loosened, unscrew it by hand (be careful as the oil may be warm). Let all the oil drain into the pan.</p>
            <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
              <div className="text-[#1A3D61] text-5xl opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Replace the Drain Plug",
      content: (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1A3D61] text-white p-4">
            <h3 className="font-bold text-lg">Step 4: Replace the Drain Plug</h3>
          </div>
          <div className="p-6">
            <p>Once all the oil has drained, clean the drain plug and its gasket. Check for any damage to the gasket and replace if necessary. Reinstall the drain plug and tighten it to the proper torque specification (check your owner's manual).</p>
            <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
              <div className="text-[#1A3D61] text-5xl opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Remove and Replace Oil Filter",
      content: (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1A3D61] text-white p-4">
            <h3 className="font-bold text-lg">Step 5: Remove and Replace the Oil Filter</h3>
          </div>
          <div className="p-6">
            <p>Position the oil drain pan under the filter. Using an oil filter wrench, loosen the old filter by turning it counter-clockwise. Remove it by hand and let any remaining oil drain into the pan. Take the new filter and apply a thin film of new oil to the gasket. Install the new filter and tighten it by hand until the gasket makes contact with the engine, then turn it an additional 3/4 turn.</p>
            <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
              <div className="text-[#1A3D61] text-5xl opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Add New Oil",
      content: (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1A3D61] text-white p-4">
            <h3 className="font-bold text-lg">Step 6: Add New Oil</h3>
          </div>
          <div className="p-6">
            <p>Locate the oil filler cap on top of the engine. Remove it and place a funnel in the opening. Pour in the new oil slowly, checking the level with the dipstick periodically. Add oil until the level reaches the "Full" mark on the dipstick.</p>
            <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
              <div className="text-[#1A3D61] text-5xl opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Start Engine and Check",
      content: (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1A3D61] text-white p-4">
            <h3 className="font-bold text-lg">Step 7: Start the Engine and Check for Leaks</h3>
          </div>
          <div className="p-6">
            <p>Replace the oil filler cap and start the engine. Let it run for a minute, then turn it off and wait a few minutes for the oil to settle. Check for any leaks around the drain plug and filter. Check the oil level again and add more if necessary.</p>
            <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
              <div className="text-[#1A3D61] text-5xl opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Dispose of Used Oil",
      content: (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1A3D61] text-white p-4">
            <h3 className="font-bold text-lg">Step 8: Dispose of Used Oil Properly</h3>
          </div>
          <div className="p-6">
            <p>Pour the used oil from the drain pan into a suitable container (like an empty oil bottle or a dedicated oil recycling container). Take it to a local auto parts store, recycling center, or service station that accepts used oil. Never pour used oil down the drain or onto the ground.</p>
            <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
              <div className="text-[#1A3D61] text-5xl opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Record Maintenance",
      content: (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1A3D61] text-white p-4">
            <h3 className="font-bold text-lg">Step 9: Record Your Maintenance</h3>
          </div>
          <div className="p-6">
            <p>Record the date, mileage, and type of oil and filter used in your vehicle maintenance log. This will help you keep track of when your next oil change is due. If your vehicle has an oil life monitor or maintenance reminder system, reset it according to your owner's manual.</p>
            <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
              <div className="text-[#1A3D61] text-5xl opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Tips and Warnings",
      content: (
        <div className="p-6 bg-[#FFF8D6] rounded-lg">
          <h2 className="text-xl font-bold text-[#946800] mb-4">Tips and Warnings</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Always dispose of used oil properly at a recycling center or auto parts store.</li>
            <li>Check your owner's manual for the recommended oil change interval.</li>
            <li>Remember to reset your oil change reminder light if your vehicle has one.</li>
            <li><strong>Warning:</strong> Never work under a vehicle supported only by a jack. Always use jack stands.</li>
            <li><strong>Warning:</strong> Be careful when draining hot oil as it can cause burns.</li>
            <li>Consider wearing disposable gloves to keep your hands clean.</li>
            <li>Have plenty of rags or paper towels on hand to clean up spills.</li>
            <li>If you're unsure about any part of the process, consult a professional mechanic.</li>
          </ul>
        </div>
      )
    }
  ];
  // Parallax effect for background
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

  // Enhanced navigation functions with transitions
  const goToNextStep = () => {
    // Check both transition state and navigation cooldown
    if (currentStep < steps.length - 1 && !isTransitioning && !navigationCooldown) {
      console.log("Moving to next step");
      
      // Activate cooldown
      setNavigationCooldown(true);
      
      // Start transition
      setIsTransitioning(true);
      setDirection(1);
      
      setTimeout(() => {
        // Use functional update to ensure you're working with the latest state
        setCurrentStep(prevStep => prevStep + 1);
        setIsTransitioning(false);
        
        // Remove the cooldown after a delay
        setTimeout(() => {
          setNavigationCooldown(false);
        }, 3000); // 3.0 second cooldown
      }, 300);
    }
  };
  
  const goToPrevStep = () => {
    // Check both transition state and navigation cooldown
    if (currentStep > 0 && !isTransitioning && !navigationCooldown) {
      console.log("Moving to previous step");
      
      // Activate cooldown
      setNavigationCooldown(true);
      
      // Start transition
      setIsTransitioning(true);
      setDirection(-1);
      
      setTimeout(() => {
        // Use functional update to ensure you're working with the latest state
        setCurrentStep(prevStep => prevStep - 1);
        setIsTransitioning(false);
        
        // Remove the cooldown after a delay
        setTimeout(() => {
          setNavigationCooldown(false);
        }, 3000); // 3.0 second cooldown
      }, 300);
    }
  };
  // Jump to specific step
  const jumpToStep = (stepIndex) => {
    if (stepIndex !== currentStep && !isTransitioning) {
      setIsTransitioning(true);
      setDirection(stepIndex > currentStep ? 1 : -1);
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        goToNextStep();
      } else if (e.key === "ArrowLeft") {
        goToPrevStep();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStep, isTransitioning, navigationCooldown]);

  // Handle gesture detection
  const handleGestureDetected = (gesture, confidence) => {
    console.log(`Gesture detected: ${gesture}, Current step: ${currentStep}, Transitioning: ${isTransitioning}, Cooldown: ${navigationCooldown}`);
    
    if (gesture === "Thumb_Up") {
      console.log("Thumb up detected, going to next step");
      goToNextStep();
    } else if (gesture === "Thumb_Down") {
      console.log("Thumb down detected, going to previous step");
      goToPrevStep();
    }
  };
  // Toggle gesture recognition
  const toggleGestures = () => {
    setGesturesEnabled(!gesturesEnabled);
  };

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

      {/* Guide Navigation - Fixed at top */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link 
              to="/guides" 
              className="flex items-center text-[#1A3D61] hover:text-[#17405f]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Guides
            </Link>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-[#1A3D61] text-white hover:bg-[#17405f] rounded-lg transition font-medium">
                Print Guide
              </button>
              <button 
                className={`px-3 py-1 text-sm ${
                  gesturesEnabled 
                    ? "bg-red-600 text-white hover:bg-red-700" 
                    : "bg-white text-[#1A3D61] hover:bg-gray-200 border border-[#1A3D61]"
                } rounded-lg transition font-medium`}
                onClick={toggleGestures}
              >
                {gesturesEnabled ? "Disable Gestures" : "Enable Gestures"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Step Progress Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-[57px] z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-[#1A3D61]">
              {steps[currentStep].title}
            </h2>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[#1A3D61] h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Guide Content with Side Navigation Arrows and inline gesture control */}
      <section className="w-full py-12 px-6 sm:px-12 bg-white min-h-[60vh] relative">
        <div className="max-w-4xl mx-auto relative">
          {/* Left arrow - fixed on the side */}
          {currentStep > 0 && (
            <button 
              onClick={goToPrevStep}
              className="flex absolute left-[-80px] top-1/2 transform -translate-y-1/2 rounded-full h-12 w-12 bg-white shadow-md items-center justify-center text-[#1A3D61] hover:bg-gray-100 transition"
              disabled={isTransitioning}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right arrow - fixed on the side */}
          {currentStep < steps.length - 1 && (
            <button 
              onClick={goToNextStep}
              className="flex absolute right-[-80px] top-1/2 transform -translate-y-1/2 rounded-full h-12 w-12 bg-white shadow-md items-center justify-center text-[#1A3D61] hover:bg-gray-100 transition"
              disabled={isTransitioning}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Inline gesture control - positioned in the top right corner of the content area */}
          {gesturesEnabled && (
            <div className="fixed left-4 top-1/3 z-30">
              <GestureControl 
                isEnabled={gesturesEnabled}
                onToggle={toggleGestures}
                onGestureDetected={handleGestureDetected}
                instructions={[
                  { gesture: "👍 Thumb Up", action: "Next Step" },
                  { gesture: "👎 Thumb Down", action: "Previous Step" }
                ]}
              />
            </div>
          )}

          {/* Content with animation */}
          <div className="mb-16 min-h-[400px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ 
                  opacity: 0, 
                  x: direction * 50 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0 
                }}
                exit={{ 
                  opacity: 0, 
                  x: direction * -50 
                }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step Indicators */}
          <div className="flex flex-wrap justify-center gap-2 my-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => jumpToStep(index)}
                disabled={isTransitioning}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentStep === index 
                    ? "bg-[#1A3D61] w-6" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OilChangeGuide;
