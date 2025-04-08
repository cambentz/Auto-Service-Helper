import {
    GestureRecognizer,
    FilesetResolver,
    DrawingUtils
  } from "@mediapipe/tasks-vision";
  
  const demosSection = document.getElementById("demos") as HTMLElement;
  let gestureRecognizer: GestureRecognizer;
  let runningMode = "IMAGE";
  let enableWebcamButton: HTMLButtonElement;
  let webcamRunning = false;
  
  // Variables to prevent multiple gesture triggers
  let lastGestureTimestamp = 0;
  const gestureCooldown = 2000; // 1 second cooldown between gesture actions
  const CONFIDENCE_THRESHOLD = 0.7; //70% confidence threshold for gesture activation
  
  // Before we can use HandLandmarker class we must wait for it to finish
  // loading. Machine Learning models can be large and take a moment to
  // get everything needed to run.
  const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "/node_modules/@mediapipe/tasks-vision/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
        "/models/gesture_recognizer.task",
        delegate: "CPU"
      },
      runningMode: "VIDEO"
    });
    demosSection.classList.remove("invisible");
  };
  createGestureRecognizer();
  
  // Elements we'll use for the app
  const video = document.getElementById("webcam") as HTMLVideoElement;
  const canvasElement = document.getElementById("output_canvas") as HTMLCanvasElement;
  const canvasCtx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
  const gestureOutput = document.getElementById("gesture_output") as HTMLElement;
  
  // Check if webcam access is supported.
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it.
  if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton") as HTMLButtonElement;
    enableWebcamButton.addEventListener("click", enableCam);
  } else {
    console.warn("getUserMedia() is not supported by your browser");
  }
  
  // Enable the live webcam view and start detection.
  function enableCam(event: Event) {
    if (!gestureRecognizer) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }
  
    if (webcamRunning) {
      webcamRunning = false;
      enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
      webcamRunning = true;
      enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
  
    // getUsermedia parameters.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
    });
  }
  
  // Handle PDF navigation based on gestures
  function handleGesture(gestureName: string, confiedenceScore: number) {
    //check if confidence is above threshold
    if(confiedenceScore < CONFIDENCE_THRESHOLD){
      return;
    }
    // Check if cooldown has elapsed
    const currentTime = Date.now();
    if (currentTime - lastGestureTimestamp < gestureCooldown) {
      return; // Still in cooldown period
    }
  
 
    // Handle gestures
    if (gestureName === "Thumb_Up" ) {
    
     // nextPageButton.click();
      lastGestureTimestamp = currentTime;
      
      // Visual feedback
      gestureOutput.style.backgroundColor = "rgba(0, 128, 0, 0.7)"; // Green background
      setTimeout(() => {
        gestureOutput.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Revert to original
      }, 500);
    } 
    else if (gestureName === "Thumb_Down" ) {
   
     // prevPageButton.click();
      lastGestureTimestamp = currentTime;
      
      // Visual feedback
      gestureOutput.style.backgroundColor = "rgba(128, 0, 0, 0.7)"; // Red background
      setTimeout(() => {
        gestureOutput.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Revert to original
      }, 500);
    }
  }
  
  let lastVideoTime = -1;
  let results: any = undefined;
  
  async function predictWebcam() {
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    }
  
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);
  
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          GestureRecognizer.HAND_CONNECTIONS,
          {
            color: "#00FF00",
            lineWidth: 5
          }
        );
        drawingUtils.drawLandmarks(landmarks, {
          color: "#FF0000",
          lineWidth: 2
        });
      }
    }
    canvasCtx.restore();
    
    if (results.gestures.length > 0) {
      gestureOutput.style.display = "block";
      const categoryName = results.gestures[0][0].categoryName;
      const categoryScore = results.gestures[0][0].score;
      const handedness = results.handednesses[0][0].displayName;
      gestureOutput.innerText = `Gesture: ${categoryName}\nConfidence: ${categoryScore} %\nHandedness: ${handedness}`;
      
    
    } else {
      gestureOutput.style.display = "none";
    }
    
    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  }