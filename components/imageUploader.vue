<template>
    <div class="w-full max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 class="text-2xl font-bold mb-4">Upload Image for Face Recognition</h2>
      <input type="file" accept="image/*" @change="handleFileUpload" class="mb-4" />
      <canvas ref="canvasRef" class="w-full"></canvas>
      <div v-if="result" class="mt-4">
        <p class="text-green-600">Face(s) Detected: {{ result.length }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import * as faceapi from 'face-api.js';
  
  const canvasRef = ref(null);
  const result = ref(null);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = canvasRef.value;
      const ctx = canvas.getContext('2d');
  
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;
  
      // Draw the uploaded image on the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
  
      // Perform face recognition
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.MtcnnOptions())
        .withFaceLandmarks();
  
      result.value = detections;
  
      // Draw detections on the canvas
      faceapi.draw.drawDetections(canvas, detections);
      faceapi.draw.drawFaceLandmarks(canvas, detections);
    };
  };
  </script>
  
  <style>
  /* Tailwind classes are used, no custom styles needed */
  </style>
  