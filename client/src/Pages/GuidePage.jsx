import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useParams, useNavigate } from "react-router-dom";
import guideBackground from "../assets/heroBackground.png";
import gestureService from "../GestureNav/GestureService.js";
import GestureControl from "../GestureNav/GestureControl";
import axios from "axios";

const GuidePage = () => {
  const navigate = useNavigate();
  // Refs
  const bgRef = useRef(null);


  // Params
  const { guideId } = useParams();
  
  // State
  const [guide, setGuide] = useState({});
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [navigationCooldown, setNavigationCooldown] = useState(false);


  useEffect(() => {
    axios.get(API_ENDPOINT + "/guides/" + guideId)
    .then(resp => {
      setGuide(resp.data);
    })
    .catch(err => {
      console.error(err);
      navigate('/error');
    })

    axios.get(API_ENDPOINT + "/guides/" + guideId + "/steps")
    .then(resp => {
      console.log(resp.data);
      setSteps(resp.data);
    })
    .catch(err => {
      console.error(err);
      // prevents page from being added to history stack (or something like that)
      navigate('/error', {replace: true });
    })
  }, []);

  // Oil change guide steps content - this would normally be in a separate file or fetched from an API
  const stepsOld = [
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
  ];
   // Background parallax effect
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

  // Navigation functions with useCallback for better performance
  const goToNextStep = useCallback(() => {
    if (currentStep < steps.length - 1 && !isTransitioning && !navigationCooldown) {
      console.log("Moving to next step");
      
      // Set cooldown and transition states
      setNavigationCooldown(true);
      setIsTransitioning(true);
      setDirection(1);
      
      // Delayed state updates
      setTimeout(() => {
        setCurrentStep(prevStep => prevStep + 1);
        setIsTransitioning(false);
        
        // Remove navigation cooldown after delay
        setTimeout(() => {
          setNavigationCooldown(false);
        }, 1000); // Reduced cooldown to 1 second for better UX
      }, 300);
    }
  }, [currentStep, isTransitioning, navigationCooldown, steps.length]);
  
  const goToPrevStep = useCallback(() => {
    if (!isTransitioning && !navigationCooldown) {
      console.log("Moving to previous step");
      
      // Set cooldown and transition states
      setNavigationCooldown(true);
      setIsTransitioning(true);
      setDirection(-1);
      
      // Delayed state updates
      setTimeout(() => {
        setCurrentStep(prevStep => prevStep - 1);
        setIsTransitioning(false);
        
        // Remove navigation cooldown after delay
        setTimeout(() => {
          setNavigationCooldown(false);
        }, 1000); // Reduced cooldown to 1 second for better UX
      }, 300);
    }
  }, [currentStep, isTransitioning, navigationCooldown]);
  
  // Jump to specific step
  const jumpToStep = useCallback((stepIndex) => {
    if (stepIndex !== currentStep && !isTransitioning && !navigationCooldown) {
      setNavigationCooldown(true);
      setIsTransitioning(true);
      setDirection(stepIndex > currentStep ? 1 : -1);
      
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsTransitioning(false);
        
        setTimeout(() => {
          setNavigationCooldown(false);
        }, 1000);
      }, 300);
    }
  }, [currentStep, isTransitioning, navigationCooldown]);

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
  }, [goToNextStep, goToPrevStep]);

  // Handle gesture detection with improved mapping - key fix for thumbs down
  const handleGestureDetected = useCallback((gesture, confidence) => {
    console.log(`Gesture detected: ${gesture}, Confidence: ${confidence}`);
    
    // Explicit mapping of gestures to navigation actions
    switch(gesture) {
      case "Thumb_Up":
        goToNextStep();
        break;
      case "Thumb_Down":
        console.log("Trying to go to previous step");
        console.log("Current step:", currentStep);
        console.log("Is transitioning:", isTransitioning);
        console.log("Navigation cooldown:", navigationCooldown);
        
        goToPrevStep(); 
        break;
      default:
        // Ignore other gestures
        break;
    }
  }, [goToNextStep, goToPrevStep]);

  // Toggle gesture recognition
  const toggleGestures = useCallback(() => {
    setGesturesEnabled(prev => !prev);
  }, []);

  return (
    steps.length > 0 ?
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
              { guide.name }
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
            {/*
            <h2 className="text-lg font-bold text-[#1A3D61]">
              {`Step ${currentStep + 1}`}
            </h2>
            */}
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
              disabled={isTransitioning || navigationCooldown}
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
              disabled={isTransitioning || navigationCooldown}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Gesture control component */}
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
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-[#1A3D61] text-white p-4">
                    <h3 className="font-bold text-lg">{`Step ${currentStep + 1}`}</h3>
                  </div>
                  <div className="p-6">
                    <p>{steps[currentStep].description}</p>
                    <div className="h-56 bg-gray-200 mt-4 flex items-center justify-center">
                      <div className="text-[#1A3D61] text-5xl opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step Indicators */}
          <div className="flex flex-wrap justify-center gap-2 my-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => jumpToStep(index)}
                disabled={isTransitioning || navigationCooldown}
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
    : <div>Loading...</div>
  );
};

export default GuidePage;
