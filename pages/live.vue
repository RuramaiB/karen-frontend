<template>
    <div class="h-screen min-w-screen bg-gray-500 p-5">
      <h1>Hello World</h1>
    </div>
    <div class="floating-window">
      <div class="p-4 bg-white shadow-md rounded-md w-80">
        <h2 class="text-lg font-bold mb-2">Proctoring Tool</h2>
        <p class="text-gray-600 mb-4">Monitoring in progress...</p>
  
        <!-- Video Feed -->
        <div class="relative">
          <video ref="camera" autoplay muted class="w-full rounded-md border"></video>
          <canvas ref="overlay" class="absolute top-0 left-0 w-full h-full"></canvas>
        </div>
  
        <!-- Alerts -->
        <div v-if="alertMessage" class="mt-4 bg-red-100 text-red-700 p-2 rounded-md">
          {{ alertMessage }}
        </div>
        <div v-if="distanceFromCamera" class="mt-4 bg-blue-100 text-blue-700 p-2 rounded-md">
          Distance: {{ distanceFromCamera }} (approx.)
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
  import * as faceapi from "face-api.js";
  
  // State
  const camera = ref(null);
  const overlay = ref(null);
  const alertMessage = ref(null);
  const monitoringInterval = ref(null);
  const distanceFromCamera = ref(null);
  
  const settings = reactive({
    faceDetectionInterval: 100, // Frequency of face detection (ms)
    inputSize: 320, // Higher input size for better accuracy
    scoreThreshold: 0.4, // Lower threshold for better detection accuracy
    maxAwayFrames: 50, // Maximum frames without face detection
  });
  
  const state = reactive({
    awayFrames: 0,
    active: false,
  });
  
  // Initialize Camera
  const startCamera = async () => {
    const video = camera.value;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  };
  
  // Stop Camera
  const stopCamera = () => {
    const video = camera.value;
    if (video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };
  
  // Start Monitoring
  const startMonitoring = () => {
    state.awayFrames = 0;
    state.active = true;
  
    monitoringInterval.value = setInterval(async () => {
      const video = camera.value;
      const canvas = overlay.value;
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
  
      // Draw Face Landmarks
      context.fillStyle = "red";
      landmarks.positions.forEach((point) => {
        context.beginPath();
        context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        context.fill();
      });
  
      // Estimate Distance
      const faceWidth = boundingBox.width;
      const estimatedDistance = Math.round((settings.inputSize / faceWidth) * 100); // Estimate based on face size
      distanceFromCamera.value = `${estimatedDistance} cm`;
      console.log(`Distance from camera: ${estimatedDistance} cm`);
  
      // Reset away frames if face is detected
      state.awayFrames = 0;
      alertMessage.value = null;
    }, settings.faceDetectionInterval);
  };
  
  // Stop Monitoring
  const stopMonitoring = () => {
    state.active = false;
    clearInterval(monitoringInterval.value);
    alertMessage.value = "Proctoring stopped.";
  };
  
  onMounted(async () => {
    await startCamera();
    faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    faceapi.nets.faceLandmark68Net.loadFromUri("/models");
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
  