import React, { useRef, useEffect, useState } from "react";
import gestureService from "./GestureService.js";

const GestureControl = ({ 
  isEnabled, 
  onToggle,
  onGestureDetected,
  instructions = [], 
  isMobile = false,  // Added prop for mobile detection
  forceMobile = null // Added prop to explicitly override detection
}) => {
  // Refs for video and canvas elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Component state
  const [gestureOutput, setGestureOutput] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [minimized, setMinimized] = useState(isMobile); // Start minimized on mobile
  
  // Default gesture instructions if none provided
  const displayInstructions = instructions.length > 0 ? instructions : [
    { gesture: "👍 Thumb Up", action: "Next Step" },
    { gesture: "👎 Thumb Down", action: "Previous Step" }
  ];
  
  // Callback for UI updates (doesn't trigger navigation)
  const handleGestureUpdate = (gesture, confidence, handedness) => {
    setGestureOutput({
      gesture: gesture,
      confidence: (confidence * 100).toFixed(0), // Convert to percentage and round
      handedness: handedness
    });
  };
  
  // Callback for gesture actions that trigger navigation
  const handleGestureAction = (gesture, confidence, handedness) => {
    console.log(`Action trigger for ${gesture} gesture with confidence ${confidence}`);
    
    // Call the parent's callback
    if (onGestureDetected) {
      try {
        onGestureDetected(gesture, confidence);
        
        // Ensure prediction continues after the action
        setTimeout(() => {
          gestureService.restartLoop();
        }, 500);
      } catch (error) {
        console.error("Error handling gesture action:", error);
        gestureService.restartLoop();
      }
    }
  };
  
  // Function to reset webcam if there are issues
  const resetWebcam = async () => {
    setHasError(false);
    
    try {
      // Stop current webcam
      gestureService.stopWebcam();
      
      // Short delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset cooldown to allow immediate gestures
      gestureService.resetCooldown();
      
      // Start webcam again
      await gestureService.startWebcam();
      console.log("Webcam reset successfully");
    } catch (error) {
      console.error("Error resetting webcam:", error);
      setHasError(true);
    }
  };
  
  // Toggle minimized state
  const toggleMinimized = () => {
    // This allows gesture detection to continue working in the background
    setMinimized(prev => !prev);
  };
  useEffect(() => {
    // When minimizing or expanding, make sure the gesture recognition continues
    if (initialized && minimized) {
      console.log("Component minimized, ensuring gesture recognition continues");
      // Small delay to let DOM changes complete
      setTimeout(() => {
        // Restart the gesture recognition loop
        gestureService.restartLoop();
      }, 300);
    }
  }, [minimized, initialized]);
  // watches for minimized state changes
  // useEffect(() => {
  //   // Only handle the case when going from minimized to expanded
  //   if (initialized && !minimized && videoRef.current && canvasRef.current) {
  //     console.log("Component expanded, checking webcam status");

  //     // Check if video is active
  //     const isVideoActive = videoRef.current.srcObject !== null &&
  //       !videoRef.current.paused &&
  //       videoRef.current.readyState > 1;

  //     if (!isVideoActive) {
  //       console.log("Video inactive after expansion, restarting webcam");
  //       // Small delay to ensure DOM is ready
  //       setTimeout(() => {
  //         resetWebcam();
  //       }, 300);
  //     }
  //   }
  // }, [minimized, initialized]);
  
  // Initialize gesture service when enabled
  useEffect(() => {
    let errorCheckTimeout;
    
    const setupGestureRecognition = async () => {
      if (isEnabled && !initialized) {
        try {
          console.log("Initializing gesture service");
          setHasError(false);
          
          // Initialize service with our elements and callbacks
          await new Promise(resolve => setTimeout(resolve, 500));
          const success = await gestureService.initialize(
            videoRef.current,
            canvasRef.current,
            handleGestureAction,
            handleGestureUpdate
          );
          
          if (success) {
            console.log("Gesture service initialized successfully");
            setInitialized(true);
            await gestureService.startWebcam();
            
          

            // Set up automatic error checking
            errorCheckTimeout = setTimeout(() => {
              if (videoRef.current && (!videoRef.current.videoWidth || !videoRef.current.videoHeight)) {
                console.log("Video dimensions not detected, attempting reset");
                resetWebcam();
              }
            }, 5000);
          } else {
            console.error("Failed to initialize gesture service");
            setHasError(true);
          }
        } catch (error) {
          console.error("Failed to initialize gesture control:", error);
          setHasError(true);
        }
      } else if (!isEnabled) {
        console.log("Disabling gestures and stopping webcam");
        gestureService.stopWebcam();
        setInitialized(false); // This is safe even if it was false already
      }
      
    };
    
    setupGestureRecognition();
    
    // Cleanup when component unmounts or when disabled
    return () => {
      if (errorCheckTimeout) clearTimeout(errorCheckTimeout);
      gestureService.stopWebcam(); // Always stop webcam on unmount or disable
    };
    
  }, [isEnabled, initialized, isMobile, forceMobile]);
  
  // Monitor video element for errors
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleVideoError = (e) => {
      console.error("Video element error:", e);
      setHasError(true);
    };
    
    videoElement.addEventListener('error', handleVideoError);
    
    // Check for stalled video periodically
    const stalledInterval = setInterval(() => {
      if (initialized && videoElement && 
          (!videoElement.videoWidth || !videoElement.videoHeight)) {
        console.log("Video appears stalled, attempting reset");
        resetWebcam();
      }
    }, 10000);
    
    return () => {
      videoElement.removeEventListener('error', handleVideoError);
      clearInterval(stalledInterval);
    };
  }, [videoRef.current, initialized]);
  
  // Don't render anything if gestures are disabled
  if (!isEnabled) return null;
  
  // Determine panel class based on mobile status
  const panelClass = isMobile 
    ? "gesture-control-panel shadow-lg rounded-lg bg-white border border-gray-200 overflow-hidden" + 
      (minimized ? " w-12 h-12" : " w-56")
    : "gesture-control-panel shadow-lg rounded-lg bg-white border border-gray-200 overflow-hidden w-64";
  
  // Render minimized view for mobile if minimized
  if (isMobile && minimized) {
    return (
      <>
        {/* Keep video and canvas mounted but completely hidden */}
        <div className="hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="640"
            height="480"
          />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
          />
        </div>
      </>
    );
  }
  
  /*
  // This was changed to get rid of little square if it doesn't work revert this block back to what it was before
  if (isMobile && minimized) {
    return (
      <div className={panelClass}>
        <div className="absolute opacity-0 pointer-events-none" style={{ position: 'fixed', width: '1px', height: '1px', overflow: 'hidden', left: '-9999px' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="640"
            height="480"
          ></video>
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
          ></canvas>
        </div>
      </div>
    );
  }
  */
  
  // Full view
  return (
    <div className={panelClass + " transition-all duration-300"}>
      {/* Header with minimize button for mobile */}
      {isMobile && initialized && (
        <div className="bg-[#1A3D61] text-white p-2 flex justify-between items-center">
          <span className="text-sm font-medium">Gesture Controls</span>
          <button
            onClick={toggleMinimized}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#17405f]"
            aria-label="Minimize Gesture Controls"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Video and canvas container */}
      <div className="relative w-full bg-gray-900 overflow-hidden" style={{ height: '160px' }}>
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        ></video>
        <canvas 
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        ></canvas>
        
        {/* Error overlay */}
        {hasError && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-4">
            <p className="text-red-400 mb-2">Camera error</p>
            <p className="text-xs mb-3 text-center">Make sure camera permissions are granted</p>
            <button 
              onClick={resetWebcam}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Reset Camera
            </button>
          </div>
        )}
        
        {/* Close button */}
        <button 
          onClick={onToggle}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          aria-label="Disable Gestures"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Gesture output display */}
      {gestureOutput && (
        <div className="bg-gray-800 text-white p-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Gesture:</span>
            <span>{gestureOutput.gesture}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Confidence:</span>
            <span>{gestureOutput.confidence}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Hand:</span>
            <span>{gestureOutput.handedness}</span>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="bg-white p-3 text-sm">
        {!isMobile && (
          <h4 className="font-bold text-[#1A3D61] mb-2 text-center">Gesture Controls</h4>
        )}
        <div className="grid grid-cols-2 gap-2">
          {displayInstructions.map((instruction, index) => (
            <div key={index} className="text-center border border-gray-100 rounded p-1">
              <p className="font-bold">{instruction.gesture}</p>
              <p className="text-xs text-gray-600">{instruction.action}</p>
            </div>
          ))}
        </div>
        
        {/* Reset button */}
        <button 
          onClick={resetWebcam}
          className="w-full mt-2 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs"
        >
          Reset Camera
        </button>
      </div>
    </div>
  );
};

export default GestureControl;