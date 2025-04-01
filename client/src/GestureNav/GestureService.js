// GestureService.js - Reusable gesture recognition service
import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils
} from "@mediapipe/tasks-vision";

class GestureService {
  constructor() {
    this.gestureRecognizer = null;
    this.webcamRunning = false;
    this.video = null;
    this.canvas = null;
    this.canvasCtx = null;
    this.lastVideoTime = -1;
    this.lastGestureTimestamp = 0;
    this.gestureCooldown = 3000; // 3 second cooldown
    this.confidenceThreshold = 0.7; // 70% confidence threshold
    this.onGestureDetected = null; // Callback function
    this.onGestureUpdate = null; // Callback for UI updates only
    this.animationFrame = null;
    this.runningMode = "IMAGE";
    this.lastGesture = null;
    this.isProcessing = false; // Flag to prevent concurrent processing
    
    // Bind methods to preserve 'this' context
    this.predictWebcam = this.predictWebcam.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  async initialize(videoElement, canvasElement, onGestureCallback, onGestureUpdate) {
    if (!videoElement || !canvasElement) {
      throw new Error("Video and canvas elements are required");
    }

    // Set up references
    this.video = videoElement;
    this.canvas = canvasElement;
    this.canvasCtx = this.canvas.getContext("2d");
    this.onGestureDetected = onGestureCallback || this.defaultGestureCallback;
    this.onGestureUpdate = onGestureUpdate;

    // Initialize MediaPipe
    try {
      console.log("Loading MediaPipe vision tasks...");
      const vision = await FilesetResolver.forVisionTasks(
        "/node_modules/@mediapipe/tasks-vision/wasm"
      );
      
      console.log("Creating GestureRecognizer with model path: /models/gesture_recognizer.task");
      
      this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/gesture_recognizer.task",
          delegate: "CPU"
        },
        runningMode: this.runningMode
      });

      console.log("GestureRecognizer initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing GestureRecognizer:", error);
      return false;
    }
  }

  defaultGestureCallback(gesture, confidence) {
    console.log(`Gesture detected: ${gesture} with confidence ${confidence}`);
  }

  async startWebcam() {
    if (!this.gestureRecognizer) {
      console.warn("GestureRecognizer not initialized");
      return false;
    }

    try {
      console.log("Requesting camera access...");
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log("Camera access granted, setting up video stream");
      this.video.srcObject = stream;
      this.webcamRunning = true;

      // Start detection when video is loaded
      this.video.addEventListener("loadeddata", this.startDetection.bind(this));
      
      return true;
    } catch (error) {
      console.error("Error starting webcam:", error);
      return false;
    }
  }

  stopWebcam() {
    this.webcamRunning = false;
    
    // Remove visibility change listener
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Cancel the animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Stop all tracks
    if (this.video && this.video.srcObject) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.video.srcObject = null;
    }
  }

  startDetection() {
    console.log("Video loaded, starting detection");
    // Set canvas dimensions to match video
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    
    // Reset last video time
    this.lastVideoTime = -1;
    
    // Add visibility change listener to handle tab switching
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Start prediction loop
    this.predictWebcam();
  }

  // Handle visibility changes
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause processing but keep webcam running
      console.log("Page hidden, pausing gesture recognition");
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    } else {
      // Page is visible again, restart processing
      console.log("Page visible, resuming gesture recognition");
      if (this.webcamRunning && !this.animationFrame) {
        this.lastVideoTime = -1;
        this.predictWebcam();
      }
    }
  }

  // Restart the animation loop after navigation
  restartLoop() {
    console.log("Attempting to restart gesture detection loop");
    
    // Cancel any existing animation frame first to avoid duplicates
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Reset state for a clean restart
    this.lastVideoTime = -1;
    this.isProcessing = false;
    this.lastGesture = null;
    
    // Reset the gesture timestamp to allow immediate next gesture
    this.lastGestureTimestamp = Date.now() - this.gestureCooldown;
    
    // Only restart if webcam is still running
    if (this.webcamRunning) {
      console.log("Webcam still running, restarting detection loop");
      
      // Update canvas dimensions if needed
      if (this.video && this.canvas && this.video.videoWidth > 0 && this.video.videoHeight > 0) {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
      }
      
      // Start the prediction loop again
      this.predictWebcam();
      return true;
    } else {
      console.log("Webcam not running, cannot restart detection loop");
      return false;
    }
  }
  predictWebcam() {
    // Exit if webcam is no longer running
    if (!this.webcamRunning || !this.video || !this.canvas) {
      console.log("Webcam stopped or elements missing, exiting prediction loop");
      return;
    }
  
    // Check if video dimensions are valid
    if (this.video.videoWidth <= 0 || this.video.videoHeight <= 0) {
      console.log("Video dimensions are invalid, scheduling next frame and waiting");
      // Schedule next frame even when dimensions are invalid
      this.animationFrame = requestAnimationFrame(this.predictWebcam);
      return;
    }
    
    // If we're still in IMAGE mode, switch to VIDEO
    if (this.runningMode === "IMAGE") {
      console.log("Switching from IMAGE to VIDEO mode");
      this.runningMode = "VIDEO";
      this.gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    
    const nowInMs = Date.now();
    
    // Skip if video is not ready or not playing
    if (this.video.readyState !== 4 || this.video.paused || this.video.ended) {
      console.log("Video is not ready, paused, or ended");
      this.animationFrame = requestAnimationFrame(this.predictWebcam);
      return;
    }
    
    // Only process if video is playing and time has changed
    if (this.video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.video.currentTime;
      
      // Set canvas dimensions to match video (in case they changed)
      if (this.canvas.width !== this.video.videoWidth || 
          this.canvas.height !== this.video.videoHeight) {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
      }
      
      // Process the current frame
      try {
        const results = this.gestureRecognizer.recognizeForVideo(this.video, nowInMs);
        
        // Clear and prepare canvas
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw hand landmarks
        if (results.landmarks) {
          const drawingUtils = new DrawingUtils(this.canvasCtx);
          
          for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              GestureRecognizer.HAND_CONNECTIONS,
              { color: "#00FF00", lineWidth: 5 }
            );
            
            drawingUtils.drawLandmarks(landmarks, {
              color: "#FF0000",
              lineWidth: 2
            });
          }
        }
        this.canvasCtx.restore();
        
        // Process gestures
        if (results.gestures.length > 0) {
          const gesture = results.gestures[0][0].categoryName;
          const confidence = results.gestures[0][0].score;
          const handedness = results.handednesses[0][0].displayName;
          
          // Update UI for all detected gestures
          if (this.onGestureUpdate) {
            this.onGestureUpdate(gesture, confidence, handedness);
          }
          
          // For gesture actions, only trigger after cooldown and with sufficient confidence
          const currentTime = Date.now();
          const cooldownElapsed = currentTime - this.lastGestureTimestamp >= this.gestureCooldown;
          const confidenceOk = confidence >= this.confidenceThreshold;
          
          // Log cooldown status for debugging
          console.log(`Gesture: ${gesture}, Confidence: ${confidence.toFixed(2)}, Cooldown: ${cooldownElapsed ? "Ready" : "Waiting"}, Last: ${this.lastGesture}`);
          
          // Only trigger actions for gestures after cooldown with sufficient confidence
          // Note: We've removed the lastGesture !== gesture condition to allow repeated gestures
          if (confidenceOk && cooldownElapsed) {
            this.lastGestureTimestamp = currentTime;
            // Store the gesture that triggered an action
            this.lastGesture = gesture;
            
            // Only notify consumer of significant gestures in a separate async call
            if (this.onGestureDetected) {
              // Use Promise to avoid blocking
              Promise.resolve().then(() => {
                if (this.onGestureDetected) {
                  console.log(`Triggering action for gesture: ${gesture}`);
                  this.onGestureDetected(gesture, confidence, handedness);
                }
              });
            }
          }
        } else {
          // No gesture detected in this frame
        }
      } catch (error) {
        console.error("Error in gesture recognition:", error);
      }
    }

    // Always schedule the next frame at the end
    this.animationFrame = requestAnimationFrame(this.predictWebcam);
  }
}

// Create and export a singleton instance
const gestureService = new GestureService();
export default gestureService;