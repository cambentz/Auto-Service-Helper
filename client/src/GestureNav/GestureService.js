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
    this.isMobile = this.checkIfMobile();
    this.isWebcamStarted = false;
    this.isInitializing = false;
    this.initializationInProgress = false;
    this.resetAttempts = 0;
    this._lastFrameTime = 0;
    
    // Gesture detection settings
    this.lastGestureTimestamp = 0;
    this.gestureCooldown = this.isMobile ? 1200 : 2000; // Shorter cooldown on mobile
    this.confidenceThreshold = this.isMobile ? 0.45 : 0.6; // Lower threshold for mobile
    
    // Callbacks
    this.onGestureDetected = null; // Callback for navigation
    this.onGestureUpdate = null;   // Callback for UI updates
    
    // Bind methods to preserve 'this' context
    this.predictWebcam = this.predictWebcam.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handlePageHidden = this.handlePageHidden.bind(this);
    this.handleOrientationChange = this.handleOrientationChange.bind(this);
    
    console.log("GestureService created, mobile device:", this.isMobile);
  }
  
  /**
   * Check if running on a mobile device
   */
  checkIfMobile() {
    // Check if we have touch capabilities
    const hasTouchScreen = (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0
    );
    
    // Check user agent for mobile devices
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check screen size
    const isSmallScreen = window.innerWidth < 768;
    
    // To avoid false positives, require both touch capability AND either a mobile user agent OR small screen
    const isMobile = hasTouchScreen && (isMobileUserAgent || isSmallScreen);
    
    // Log the detection results for debugging
    console.log("Mobile detection:", {
      hasTouchScreen,
      isMobileUserAgent,
      isSmallScreen,
      isMobile
    });
    
    return isMobile;
  }
  
  setMobileMode(isMobile) {
    const mobileMode = !!isMobile; // Convert to boolean
    
    // Only update if it's actually changing
    if (this.isMobile !== mobileMode) {
      this.isMobile = mobileMode;
      console.log(`Mobile mode ${this.isMobile ? 'enabled' : 'disabled'}`);
      
      // Update settings based on mobile status
      this.gestureCooldown = this.isMobile ? 1200 : 2000;
      this.confidenceThreshold = this.isMobile ? 0.45 : 0.6;
      
      // Additional mobile-specific settings
      if (this.isMobile) {
        // Lower resolution for better performance on mobile
        this.preferredVideoConstraints = {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
          frameRate: { ideal: 15 }
        };
      } else {
        // Higher quality for desktop
        this.preferredVideoConstraints = {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
          frameRate: { ideal: 30 }
        };
      }
    }
    
    return this.isMobile;
  }
  
  /**
   * Initialize the gesture service with required elements and callbacks
   */
  async initialize(videoElement, canvasElement, onGestureCallback, onGestureUpdate) {
    // Prevent concurrent initialization
    if (this.initializationInProgress) {
      console.log("Already initializing, please wait");
      return false;
    }
    
    if (this.isInitialized) {
      console.log("Already initialized");
      return true;
    }
    
    this.initializationInProgress = true;
    
    try {
      if (!videoElement) {
        console.error("Video element is required but not provided");
        this.initializationInProgress = false;
        return false;
      }
      
      if (!canvasElement) {
        console.error("Canvas element is required but not provided");
        this.initializationInProgress = false;
        return false;
      }

      // Set up references
      this.video = videoElement;
      this.canvas = canvasElement;
      this.canvasCtx = this.canvas.getContext("2d");
      this.onGestureDetected = onGestureCallback || this.defaultGestureCallback;
      this.onGestureUpdate = onGestureUpdate;

      // Check for device camera capabilities
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("This browser does not support camera access");
        this.initializationInProgress = false;
        return false;
      }

      // Initialize MediaPipe
      try {
        console.log("Loading MediaPipe vision tasks...");
        console.log("Running on mobile device:", this.isMobile);
        
        // Load the MediaPipe wasm modules
        const vision = await FilesetResolver.forVisionTasks(
          "/mediapipe/wasm"
        );
        
        // Create the gesture recognizer with appropriate options
        this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/gesture_recognizer.task",
            delegate: "CPU" // GPU doesn't work well on some mobile devices
          },
          runningMode: this.runningMode,
          numHands: 1, // Limit to 1 hand for better performance, especially on mobile
          minHandDetectionConfidence: this.isMobile ? 0.5 : 0.6,
          minHandPresenceConfidence: this.iMobile ? 0.5 : 0.6,
          minTrackingConfidence: this.iMobile ? 0.5 : 0.6
        });

        this.isInitialized = true;
        console.log("GestureRecognizer initialized successfully");
        this.initializationInProgress = false;
        return true;
      } catch (error) {
        console.error("Error initializing GestureRecognizer:", error);
        this.initializationInProgress = false;
        return false;
      }
    } catch (error) {
      console.error("Error during initialization:", error);
      this.initializationInProgress = false;
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
    
    if (this.isWebcamStarted) {
      console.log("Webcam already running");
      return true;
    }

    // Use a Promise with both timeout and success conditions
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Starting webcam...");
        // Request camera access with appropriate constraints for mobile
        const constraints = {
          video: this.preferredVideoConstraints || {
            facingMode: "user", // Use front camera for mobile
            width: { ideal: this.isMobile ? 640 : 1280 },
            height: { ideal: this.isMobile ? 480 : 720 },
            frameRate: { ideal: this.iMobile ? 15 : 30 } // Lower frameRate for mobile
          }
        };
        
        // Set a timeout as a fallback
        const timeoutId = setTimeout(() => {
          reject(new Error("Camera initialization timeout"));
        }, 10000); // 10-second timeout
        
        // Get the media stream
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Set up video stream
        this.video.srcObject = stream;
        console.log("Camera stream obtained successfully");
        
        // Remove any existing loadeddata listeners to prevent duplicates
        this.video.removeEventListener("loadeddata", this.startDetection);
        
        // Wait for video to be properly loaded
        const videoLoaded = () => {
          clearTimeout(timeoutId);
          this.video.removeEventListener("loadeddata", videoLoaded);
          console.log("Video data loaded, setting up canvas");
          
          if (this.video.videoWidth > 0 && this.video.videoHeight > 0) {
            // Set canvas dimensions to match video
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            
            console.log(`Video dimensions: ${this.video.videoWidth}x${this.video.videoHeight}`);
            
            // Reset state
            this.lastVideoTime = -1;
            this.lastGestureTimestamp = 0;
            
            // Add event listeners for mobile-specific events
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            document.addEventListener('pagehide', this.handlePageHidden);
            window.addEventListener('orientationchange', this.handleOrientationChange);
            
            // Start prediction loop
            this.webcamRunning = true;
            this.isWebcamStarted = true;
            this.animationFrame = requestAnimationFrame(this.predictWebcam);
            
            resolve(true);
          } else {
            // Try again if dimensions are not available yet
            setTimeout(() => {
              if (this.video.videoWidth > 0 && this.video.videoHeight > 0) {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                
                console.log(`Video dimensions: ${this.video.videoWidth}x${this.video.videoHeight}`);
                
                // Reset state
                this.lastVideoTime = -1;
                this.lastGestureTimestamp = 0;
                
                // Add event listeners
                document.addEventListener('visibilitychange', this.handleVisibilityChange);
                document.addEventListener('pagehide', this.handlePageHidden);
                window.addEventListener('orientationchange', this.handleOrientationChange);
                
                // Start prediction loop
                this.webcamRunning = true;
                this.isWebcamStarted = true;
                this.animationFrame = requestAnimationFrame(this.predictWebcam);
                
                clearTimeout(timeoutId);
                resolve(true);
              } else {
                reject(new Error("Failed to get video dimensions"));
              }
            }, 1000);
          }
        };
        
        if (this.video.readyState >= 2) {
          // Video is already loaded
          videoLoaded();
        } else {
          // Wait for video to load
          this.video.addEventListener("loadeddata", videoLoaded);
        }
      } catch (error) {
        console.error("Error starting webcam:", error);
        this.isWebcamStarted = false;
        reject(error);
      }
    });
  }

  /**
   * Stop the webcam and gesture detection
   */
  stopWebcam() {
    console.log("Stopping webcam");
    this.webcamRunning = false;
    this.isWebcamStarted = false;
    
    // Remove event listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    document.removeEventListener('pagehide', this.handlePageHidden);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    
    // Cancel animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Stop all video tracks
    if (this.video && this.video.srcObject) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn("Error stopping track:", e);
        }
      });
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
        this.animationFrame = requestAnimationFrame(this.predictWebcam);
      }
    }
  }
  
  /**
   * Handle page hidden event (mobile browsers)
   */
  handlePageHidden() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  /**
   * Handle device orientation change
   */
  handleOrientationChange() {
    // Give time for orientation change to complete
    setTimeout(() => {
      if (this.webcamRunning && this.video) {
        // Update canvas dimensions
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        // Reset prediction loop
        this.lastVideoTime = -1;
        
        // Restart prediction if needed
        if (!this.animationFrame) {
          this.animationFrame = requestAnimationFrame(this.predictWebcam);
        }
      }
    }, 500);
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
      this.animationFrame = requestAnimationFrame(this.predictWebcam);
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
   * Reset the webcam connection
   */
  async resetWebcam() {
    console.log("Attempting to reset webcam");
    
    // Track the reset attempts to avoid infinite loops
    if (!this.resetAttempts) this.resetAttempts = 0;
    this.resetAttempts++;
    
    // If we've tried too many times, give up
    if (this.resetAttempts > 3) {
      console.error("Too many webcam reset attempts, giving up");
      this.resetAttempts = 0;
      return false;
    }
    
    try {
      // First stop any existing camera
      if (this.isWebcamStarted) {
        this.stopWebcam();
        // Short delay to ensure resources are released
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Reset cooldown
      this.lastGestureTimestamp = 0;
      
      // Only try to start if refs are valid
      if (!this.video || !this.canvas) {
        console.error("Invalid video/canvas references");
        return false;
      }
      
      // Start again
      const success = await this.startWebcam();
      
      if (success) {
        console.log("Webcam reset successfully");
        this.resetAttempts = 0;
        return true;
      } else {
        console.error("Failed to reset webcam");
        return false;
      }
    } catch (error) {
      console.error("Error resetting webcam:", error);
      return false;
    }
  }

  /**
   * Main prediction loop for webcam frames
   */
  predictWebcam() {
    // Exit if webcam is no longer running or elements are missing
    if (!this.webcamRunning || !this.video || !this.canvas || !this.gestureRecognizer) {
      console.log("Webcam stopped or elements missing, exiting prediction loop");
      this.animationFrame = null;
      return;
    }
    
    // Throttle frame rate for mobile
    if (this.isMobile && this._lastFrameTime) {
      const now = Date.now();
      const elapsed = now - this._lastFrameTime;
      
      // Only process ~15 fps on mobile (66ms between frames)
      if (elapsed < 66) {
        this.animationFrame = requestAnimationFrame(this.predictWebcam);
        return;
      }
      this._lastFrameTime = now;
    } else {
      this._lastFrameTime = Date.now();
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
        if (results.landmarks && results.landmarks.length > 0) {
          const drawingUtils = new DrawingUtils(this.canvasCtx);
          
          for (const landmarks of results.landmarks) {
            // Use different colors for mobile vs desktop for better visibility
            const connectorColor = this.isMobile ? "#00FF00" : "#00FF00";
            const landmarkColor = this.isMobile ? "#FF0000" : "#FF0000";
            const lineWidth = this.isMobile ? 3 : 5; // Thinner lines on mobile
            const pointSize = this.isMobile ? 1 : 2; // Smaller points on mobile
            
            drawingUtils.drawConnectors(
              landmarks,
              GestureRecognizer.HAND_CONNECTIONS,
              { color: connectorColor, lineWidth: lineWidth }
            );
            
            drawingUtils.drawLandmarks(landmarks, {
              color: landmarkColor,
              lineWidth: pointSize,
              radius: this.isMobile ? 3 : 5 // Smaller landmarks on mobile
            });
          }
        }
        this.canvasCtx.restore();
        
        // Process gestures if any were detected
        if (results.gestures && results.gestures.length > 0) {
          const gesture = results.gestures[0][0].categoryName;
          const confidence = results.gestures[0][0].score;
          const handedness = results.handednesses && results.handednesses[0] ? 
                             results.handednesses[0][0].displayName : "Unknown";
          
          // Always update UI
          if (this.onGestureUpdate) {
            this.onGestureUpdate(gesture, confidence, handedness);
          }
          
          // Check cooldown and confidence for action triggers
          const timeSinceLastGesture = nowInMs - this.lastGestureTimestamp;
          const cooldownElapsed = timeSinceLastGesture >= this.gestureCooldown;
          const confidenceOk = confidence >= this.confidenceThreshold;
          
          // Debug logging but limit frequency on mobile
          if (!this.isMobile || nowInMs % 1000 < 100) {
            console.log(`Gesture: ${gesture}, Confidence: ${confidence.toFixed(2)}, Cooldown: ${cooldownElapsed ? "Ready" : `${timeSinceLastGesture}ms/${this.gestureCooldown}ms`}`);
          }
          
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

    // Schedule next frame with more conservative timing on mobile
    // This helps reduce CPU/battery usage
    if (this.isMobile) {
      // On mobile, we use a slower frame rate
      setTimeout(() => {
        this.animationFrame = requestAnimationFrame(this.predictWebcam);
      }, 60); // ~16fps instead of 60fps
    } else {
      this.animationFrame = requestAnimationFrame(this.predictWebcam);
    }
  }
}

// Create and export a singleton instance
const gestureService = new GestureService();
export default gestureService;