// GestureService.js - Reusable gesture recognition service
import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils
} from "@mediapipe/tasks-vision";

class GestureService {
  constructor() {
    // Recognition setup
    this.gestureRecognizer = null;
    this.runningMode = "IMAGE";
    
    // Elements
    this.video = null;
    this.canvas = null;
    this.canvasCtx = null;
    
    // State
    this.webcamRunning = false;
    this.lastVideoTime = -1;
    this.animationFrame = null;
    this.isInitialized = false;
    
    // Gesture detection settings
    this.lastGestureTimestamp = 0;
    this.gestureCooldown = 3000; // 3 seconds cooldown
    this.confidenceThreshold = 0.7; // 70% confidence threshold
    
    // Callbacks
    this.onGestureDetected = null; // Callback for navigation
    this.onGestureUpdate = null;   // Callback for UI updates
    
    // Bind methods to preserve 'this' context
    this.predictWebcam = this.predictWebcam.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  /**
   * Initialize the gesture service with required elements and callbacks
   */
  async initialize(videoElement, canvasElement, onGestureCallback, onGestureUpdate) {
    if (!videoElement || !canvasElement) {
      console.error("Video and canvas elements are required");
      return false;
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
      
      this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/gesture_recognizer.task",
          delegate: "CPU"
        },
        runningMode: this.runningMode
      });

      this.isInitialized = true;
      console.log("GestureRecognizer initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing GestureRecognizer:", error);
      return false;
    }
  }

  /**
   * Default callback if none provided
   */
  defaultGestureCallback(gesture, confidence) {
    console.log(`Gesture detected: ${gesture} with confidence ${confidence}`);
  }

  /**
   * Start the webcam and gesture detection
   */
  async startWebcam() {
    if (!this.isInitialized) {
      console.warn("GestureRecognizer not initialized");
      return false;
    }

    try {
      // Request camera access
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Set up video stream
      this.video.srcObject = stream;
      this.webcamRunning = true;

      // Remove any existing loadeddata listeners to prevent duplicates
      this.video.removeEventListener("loadeddata", this.startDetection);
      
      // Add new loadeddata listener
      this.video.addEventListener("loadeddata", () => {
        // Set canvas dimensions to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        // Reset state
        this.lastVideoTime = -1;
        this.lastGestureTimestamp = 0;
        
        // Add visibility change listener
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Start prediction loop
        this.predictWebcam();
      });
      
      return true;
    } catch (error) {
      console.error("Error starting webcam:", error);
      return false;
    }
  }

  /**
   * Stop the webcam and gesture detection
   */
  stopWebcam() {
    this.webcamRunning = false;
    
    // Remove event listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Cancel animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Stop all video tracks
    if (this.video && this.video.srcObject) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.video.srcObject = null;
    }
  }

  /**
   * Handle visibility changes to pause/resume detection when tab is switched
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Pause when tab is hidden
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    } else {
      // Resume when tab is visible again
      if (this.webcamRunning && !this.animationFrame) {
        this.lastVideoTime = -1;
        this.predictWebcam();
      }
    }
  }

  /**
   * Restart the animation loop after gesture navigation
   */
  restartLoop() {
    // Cancel any existing animation frame first
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Only restart if webcam is still running
    if (this.webcamRunning) {
      // Reset state
      this.lastVideoTime = -1;
      
      // Start the prediction loop again
      this.predictWebcam();
      return true;
    }
    
    return false;
  }

  /**
   * Reset cooldown to allow immediate gesture detection
   */
  resetCooldown() {
    this.lastGestureTimestamp = 0;
  }

  /**
   * Main prediction loop for webcam frames
   */
  predictWebcam() {
    // Exit if webcam is no longer running or elements are missing
    if (!this.webcamRunning || !this.video || !this.canvas) {
      console.log("Webcam stopped or elements missing, exiting prediction loop");
      return;
    }
  
    // Check if video dimensions are valid
    if (this.video.videoWidth <= 0 || this.video.videoHeight <= 0) {
      // Schedule next frame and wait for valid dimensions
      this.animationFrame = requestAnimationFrame(this.predictWebcam);
      return;
    }
    
    // Switch from IMAGE to VIDEO mode if needed
    if (this.runningMode === "IMAGE") {
      this.runningMode = "VIDEO";
      this.gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    
    const nowInMs = Date.now();
    
    // Skip if video is not ready
    if (this.video.readyState !== 4 || this.video.paused || this.video.ended) {
      this.animationFrame = requestAnimationFrame(this.predictWebcam);
      return;
    }
    
    // Only process if video time has changed
    if (this.video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.video.currentTime;
      
      // Update canvas dimensions if needed
      if (this.canvas.width !== this.video.videoWidth || 
          this.canvas.height !== this.video.videoHeight) {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
      }
      
      try {
        // Process the current frame
        const results = this.gestureRecognizer.recognizeForVideo(this.video, nowInMs);
        
        // Clear canvas
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
        
        // Process gestures if any were detected
        if (results.gestures.length > 0) {
          const gesture = results.gestures[0][0].categoryName;
          const confidence = results.gestures[0][0].score;
          const handedness = results.handednesses[0][0].displayName;
          
          // Always update UI
          if (this.onGestureUpdate) {
            this.onGestureUpdate(gesture, confidence, handedness);
          }
          
          // Check cooldown and confidence for action triggers
          const timeSinceLastGesture = nowInMs - this.lastGestureTimestamp;
          const cooldownElapsed = timeSinceLastGesture >= this.gestureCooldown;
          const confidenceOk = confidence >= this.confidenceThreshold;
          
          // Debug logging
          console.log(`Gesture: ${gesture}, Confidence: ${confidence.toFixed(2)}, Cooldown: ${cooldownElapsed ? "Ready" : `${timeSinceLastGesture}ms/${this.gestureCooldown}ms`}`);
          
          // Trigger action if cooldown elapsed and confidence is high enough
          if (cooldownElapsed && confidenceOk) {
            // Update timestamp FIRST to prevent double-triggering
            this.lastGestureTimestamp = nowInMs;
            
            // Notify consumer of the gesture in a separate async call
            if (this.onGestureDetected) {
              console.log(`Triggering action for gesture: ${gesture}`);
              
              // Use setTimeout to avoid blocking the animation loop
              setTimeout(() => {
                if (this.onGestureDetected) {
                  this.onGestureDetected(gesture, confidence, handedness);
                }
              }, 0);
            }
          }
        }
      } catch (error) {
        console.error("Error in gesture recognition:", error);
      }
    }

    // Schedule next frame
    this.animationFrame = requestAnimationFrame(this.predictWebcam);
  }
}

// Create and export a singleton instance
const gestureService = new GestureService();
export default gestureService;