<template>
  <div class="h-screen min-w-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
    <!-- Lockdown Overlay (Shown when proctoring is breached) -->
    <div v-if="!isFullscreen || !isFocused" class="fixed inset-0 z-[2000] bg-black bg-opacity-95 flex flex-col items-center justify-center p-10 text-center">
      <div class="bg-red-600 text-white p-8 rounded-xl shadow-2xl max-w-md animate-pulse">
        <h2 class="text-3xl font-bold mb-4">SECURITY BREACH</h2>
        <p class="text-lg mb-6">
          The exam has been paused because you exited fullscreen mode or navigated away.
          Please re-enter fullscreen to continue.
        </p>
        <button 
          @click="enterFullscreen" 
          class="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-lg"
        >
          Return to Exam
        </button>
      </div>
    </div>

    <!-- Start Exam Overlay -->
    <div v-if="!proctoringActive" class="fixed inset-0 z-[1500] bg-gray-800 flex items-center justify-center">
      <div class="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Exam Entry</h1>
        <p class="text-gray-600 mb-8 leading-relaxed">
          To ensure academic integrity, this exam requires <strong>Forced Fullscreen</strong> mode. 
          Your camera, focus, and clipboard will be monitored throughout the session.
        </p>
        <button 
          @click="startExam" 
          class="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-2xl hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-xl"
        >
          Start & Enter Fullscreen
        </button>
      </div>
    </div>

    <!-- Main Exam Interface (Placeholder) -->
    <div class="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 relative">
      <div class="flex justify-between items-center mb-10 border-b pb-5">
        <h1 class="text-2xl font-bold text-gray-800">Advanced AI Proctoring Demo</h1>
        <div class="flex items-center space-x-4">
          <span class="flex h-3 w-3 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span class="text-green-600 font-medium tracking-wider">SECURE SESSION ACTIVE</span>
        </div>
      </div>

      <div class="space-y-8">
        <div class="p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 class="text-xl font-semibold mb-4 text-gray-700">Question 1 of 1</h3>
          <p class="text-gray-600 mb-6 text-lg">
            Describe the security implications of using a client-side browser proctoring system vs. an Electron-based application.
          </p>
          <textarea 
            class="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-40 text-gray-700"
            placeholder="Type your answer here..."
            @contextmenu.prevent
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Floating Proctoring Tool -->
    <div class="floating-window transition-all duration-500 hover:scale-105">
      <div class="p-4 bg-white shadow-2xl rounded-2xl w-80 border-2 border-indigo-100 overflow-hidden">
        <div class="flex items-center justify-between mb-3 border-b pb-2">
          <h2 class="text-md font-bold text-gray-800">Proctoring AI</h2>
          <div class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-bold uppercase tracking-tighter">Live</div>
        </div>

        <!-- Video Feed -->
        <div class="relative group">
          <video ref="camera" autoplay muted class="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-inner"></video>
          <canvas ref="overlay" class="absolute top-0 left-0 w-full h-full pointer-events-none"></canvas>
          <div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            FACE TRACKER v1.2
          </div>
        </div>

        <!-- Alerts -->
        <div class="mt-4 space-y-2">
          <div v-if="alertMessage" class="bg-red-50 text-red-600 p-3 rounded-xl flex items-start space-x-3 text-sm font-medium animate-bounce border border-red-100">
            <span class="mt-1">⚠️</span>
            <span>{{ alertMessage }}</span>
          </div>
          <div v-if="distanceFromCamera" class="bg-indigo-50 text-indigo-700 p-3 rounded-xl flex items-center justify-between text-sm font-semibold border border-indigo-100">
            <span class="flex items-center"><span class="mr-2">📏</span>Distance:</span>
            <span>{{ distanceFromCamera }}</span>
          </div>
          <div v-if="proctoringAlert" class="bg-orange-50 text-orange-700 p-3 rounded-xl flex items-start space-x-3 text-sm font-medium border border-orange-100">
            <span class="mt-1">🔔</span>
            <span>{{ proctoringAlert }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import * as faceapi from "face-api.js";
import { useProctoring } from "~/composables/useProctoring";

// Proctoring State
const { 
  isFullscreen, 
  isFocused, 
  alertMessage: proctoringAlert, 
  enterFullscreen 
} = useProctoring({
  enforceFullscreen: true,
  monitorFocus: true,
  blockInteractions: true
});

const proctoringActive = ref(false);

// Audio Monitoring State
const audioContext = ref(null);
const analyser = ref(null);
const microphone = ref(null);
const voiceDetected = ref(false);

const startAudioMonitoring = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
    analyser.value = audioContext.value.createAnalyser();
    microphone.value = audioContext.value.createMediaStreamSource(stream);
    microphone.value.connect(analyser.value);

    analyser.value.fftSize = 256;
    const bufferLength = analyser.value.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudio = () => {
      if (!proctoringActive.value) return;
      analyser.value.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((p, c) => p + c, 0) / bufferLength;
      
      // Threshold for voice detection (tuned for whispering/voices)
      if (average > 40) {
        voiceDetected.value = true;
        proctoringAlert.value = "Voice or background noise detected.";
      } else {
        voiceDetected.value = false;
      }
      requestAnimationFrame(checkAudio);
    };
    checkAudio();
  } catch (err) {
    console.error("Audio access denied:", err);
  }
};

const startExam = async () => {
  await enterFullscreen();
  await startAudioMonitoring();
  proctoringActive.value = true;
};

// Original Face Detection State
const camera = ref(null);
const overlay = ref(null);
const alertMessage = ref(null); // Face detection specific alert
const monitoringInterval = ref(null);
const distanceFromCamera = ref(null);

const settings = reactive({
  faceDetectionInterval: 100,
  inputSize: 320,
  scoreThreshold: 0.4,
  maxAwayFrames: 50,
});

const state = reactive({
  awayFrames: 0,
  active: false,
});

// Initialize Camera
const startCamera = async () => {
  try {
    const video = camera.value;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alertMessage.value = "Camera access denied. Please enable camera to take the exam.";
  }
};

// Stop Camera
const stopCamera = () => {
  const video = camera.value;
  if (video && video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
  }
};

// Gaze & Pose Estimation Helpers
const estimatePose = (landmarks) => {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const nose = landmarks.getNose();
  const mouth = landmarks.getMouth();
  const jaw = landmarks.getJawOutline();

  // Simple Yaw estimation (horizontal rotation)
  const leftFaceWidth = nose[0].x - jaw[0].x;
  const rightFaceWidth = jaw[16].x - nose[0].x;
  const yaw = (leftFaceWidth - rightFaceWidth) / (leftFaceWidth + rightFaceWidth);

  // Simple Pitch estimation (vertical rotation)
  const noseHeight = nose[3].y - nose[0].y;
  const upperFaceHeight = nose[0].y - jaw[8].y; // Chin is index 8
  const pitch = noseHeight / Math.abs(upperFaceHeight);

  return { yaw, pitch };
};

const estimateGaze = (landmarks) => {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  const getEyeCenter = (eye) => {
    const x = eye.reduce((acc, p) => acc + p.x, 0) / 6;
    const y = eye.reduce((acc, p) => acc + p.y, 0) / 6;
    return { x, y };
  };

  // This is a very simplified gaze metric based on eye shape symmetry
  // Real gaze tracking usually requires iris segmentation
  return { left: getEyeCenter(leftEye), right: getEyeCenter(rightEye) };
};

// Start Monitoring
const startMonitoring = () => {
  state.awayFrames = 0;
  state.active = true;

  // Periodic Identity Check (Every 60s)
  const identityCheckInterval = setInterval(async () => {
    if (!proctoringActive.value) return;
    const video = camera.value;
    if (!video) return;

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      // In a real app, we would fetch the registered descriptor and compare
      // For this demo, we assume the initial detection is the baseline
      console.log("Continuous Identity Verification: Success");
    }
  }, 60000);

  onBeforeUnmount(() => clearInterval(identityCheckInterval));

  monitoringInterval.value = setInterval(async () => {
    if (!proctoringActive.value) return;

    const video = camera.value;
    const canvas = overlay.value;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");

    // Adjust canvas size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Detect Face and Landmarks
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({
        inputSize: settings.inputSize,
        scoreThreshold: settings.scoreThreshold,
      }))
      .withFaceLandmarks();

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!detection) {
      state.awayFrames++;
      if (state.awayFrames >= settings.maxAwayFrames) {
        alertMessage.value = "No face detected. Please stay in view of the camera.";
      }
      distanceFromCamera.value = null;
      return;
    }

    const landmarks = detection.landmarks;
    const boundingBox = detection.detection.box;

    // Head Pose Analysis
    const { yaw, pitch } = estimatePose(landmarks);
    if (Math.abs(yaw) > 0.4) {
      alertMessage.value = "Head turning detected. Please look at the screen.";
    } else if (pitch > 0.5) {
      alertMessage.value = "Looking down detected. Please look at the screen.";
    } else {
      alertMessage.value = null;
    }

    // Draw Face Landmarks with pose-aware colors
    context.fillStyle = Math.abs(yaw) > 0.4 || pitch > 0.5 ? "rgba(239, 68, 68, 0.6)" : "rgba(79, 70, 229, 0.6)";
    landmarks.positions.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      context.fill();
    });

    // Estimate Distance
    const faceWidth = boundingBox.width;
    const estimatedDistance = Math.round((settings.inputSize / faceWidth) * 100);
    distanceFromCamera.value = `${estimatedDistance} cm`;

    // Reset away frames if face is detected
    state.awayFrames = 0;
  }, settings.faceDetectionInterval);
};

onMounted(async () => {
  await startCamera();
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models")
  ]);
  startMonitoring();
});

onBeforeUnmount(() => {
  stopCamera();
  clearInterval(monitoringInterval.value);
});
</script>
  
  <style>
  body {
    font-family: "Arial", sans-serif;
  }
  
  /* Floating window styles */
  .floating-window {
    position: fixed;
    bottom: 16px;
    right: 16px;
    z-index: 1000;
  }
  
  video {
    display: block;
  }
  
  canvas {
    pointer-events: none;
  }
  </style>