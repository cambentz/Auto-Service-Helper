import React, { useRef, useEffect, useState } from "react";
import gestureService from "./GestureService.js";

const GestureControl = ({ 
  isEnabled, 
  onToggle,
  onGestureDetected,
  instructions = [] // Array of gesture instructions to display
}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [gestureOutput, setGestureOutput] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [frameCount, setFrameCount] = useState(0); // For debugging
    const [hasError, setHasError] = useState(false);
    
    // Default instructions if none provided
    const defaultInstructions = [
      { gesture: "👍 Thumb Up", action: "Next Step" },
      { gesture: "👎 Thumb Down", action: "Previous Step" }
    ];
    
    const displayInstructions = instructions.length > 0 ? instructions : defaultInstructions;
  
    // Function to reset webcam if there are issues
    const resetWebcam = async () => {
      setHasError(false);
      if (initialized) {
        try {
          // Stop current webcam
          gestureService.stopWebcam();
          
          // Short delay to ensure clean slate
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Start webcam again
          await gestureService.startWebcam();
          console.log("Webcam reset successfully");
        } catch (error) {
          console.error("Error resetting webcam:", error);
          setHasError(true);
        }
      }
    };
  
    // Separate callback for UI updates only (doesn't trigger navigation)
    const handleGestureUpdate = (gesture, confidence, handedness) => {
      // Update frame counter for debugging
      setFrameCount(prev => prev + 1);
      
      // Update the UI with gesture info
      setGestureOutput({
        gesture: gesture,
        confidence: confidence.toFixed(2),
        handedness: handedness
      });
    };
  
    // Callback for actual gesture actions (may trigger navigation)
    const handleGestureAction = (gesture, confidence, handedness) => {
        console.log(`Action trigger for ${gesture} gesture with confidence ${confidence}`);
        
        // Call the parent's callback for handling the gesture
        if (onGestureDetected) {
          try {
            // Perform the gesture action
            onGestureDetected(gesture, confidence);
            
            // Ensure the loop continues
            const continueDetection = () => {
              try {
                console.log("Continuing gesture detection after action");
                gestureService.restartLoop();
                
                // Double-check after a short delay that detection is still running
                setTimeout(() => {
                  if (!gestureService.animationFrame) {
                    console.log("Animation frame missing, forcing restart");
                    gestureService.restartLoop();
                  }
                }, 1000);
              } catch (err) {
                console.error("Error restarting gesture detection:", err);
              }
            };
            
            // Give UI time to update before continuing detection
            setTimeout(continueDetection, 500);
          } catch (error) {
            console.error("Error handling gesture action:", error);
          }
        }
      };
    // Initialize gesture service when enabled
    useEffect(() => {
      let initTimeout;
      
      if (isEnabled && !initialized) {
        const initGestures = async () => {
          try {
            console.log("Initializing gesture service");
            setHasError(false);
            
            // Initialize the service with our elements and callbacks
            const success = await gestureService.initialize(
              videoRef.current,
              canvasRef.current,
              handleGestureAction,
              handleGestureUpdate
            );
            
            if (success) {
              console.log("Gesture service initialized successfully, starting webcam");
              setInitialized(true);
              await gestureService.startWebcam();
            } else {
              console.error("Failed to initialize gesture service");
              setHasError(true);
            }
          } catch (error) {
            console.error("Failed to initialize gesture control:", error);
            setHasError(true);
          }
        };
        
        initGestures();
        
        // Set up automatic restart if webcam becomes black or unresponsive
        initTimeout = setTimeout(() => {
          if (videoRef.current && (!videoRef.current.videoWidth || !videoRef.current.videoHeight)) {
            console.log("Video dimensions not detected, attempting reset");
            resetWebcam();
          }
        }, 5000);
      } else if (!isEnabled && initialized) {
        // Stop webcam when gestures are disabled
        console.log("Stopping gesture service");
        gestureService.stopWebcam();
        // We don't reset initialized so we can quickly restart without reinitializing
      }
      
      // Cleanup when component unmounts or when disabled
      return () => {
        if (initTimeout) clearTimeout(initTimeout);
        if (initialized) {
          console.log("Cleaning up gesture service");
          gestureService.stopWebcam();
        }
      };
    }, [isEnabled, initialized]);
  
    // Monitor video element for errors
    useEffect(() => {
      const handleVideoError = (e) => {
        console.error("Video element error:", e);
        setHasError(true);
      };
      
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.addEventListener('error', handleVideoError);
        
        // Check for stalled video
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
      }
    }, [videoRef.current, initialized]);
  
    // Don't render anything if gestures are disabled
    if (!isEnabled) {
      return null;
    }
  
    return (
      <div className="gesture-control-inline shadow-lg rounded-lg bg-white border border-gray-200 overflow-hidden">
        <div className="flex flex-col">
          {/* Video and canvas container */}
          <div className="relative w-64 bg-gray-900 overflow-hidden">
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full"
            ></video>
            <canvas 
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            ></canvas>
            
            {/* Error overlay */}
            {hasError && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-4">
                <p className="text-red-400 mb-2">Camera error</p>
                <button 
                  onClick={resetWebcam}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Reset Camera
                </button>
              </div>
            )}
  
            {/* Close button (top right corner) */}
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
          
          {/* Gesture output display below video */}
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
          
          {/* Instruction box below the video */}
          <div className="bg-white p-3 text-sm">
            <h4 className="font-bold text-[#1A3D61] mb-2 text-center">Gesture Controls</h4>
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
      </div>
    );
  };
  

export default GestureControl;