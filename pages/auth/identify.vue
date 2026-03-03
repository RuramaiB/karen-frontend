<template>
  <div class="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
    <div class="w-full max-w-2xl bg-white rounded-lg p-12 shadow-sm border border-[#e1dfdd]">
      <!-- <div class="w-16 h-16 flex mx-auto mb-6">
        <img src="/assets/logo.png" class="h-full w-full object-contain" alt="Microsoft Teams">
      </div> -->
      <h1 class="text-2xl font-bold text-center text-[#242424] mb-2">Secure Face Verification</h1>
      <p class="text-sm text-[#616161] text-center mb-8">Please look at the camera to verify your identity before the assessment begins</p>
      <faceTrainer />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as faceapi from "face-api.js";

const loadModels = async () => {
  const modelUrl = "/models";
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl),
    faceapi.nets.mtcnn.loadFromUri(modelUrl), // If using MTCNN for detection
    faceapi.nets.tinyFaceDetector.loadFromUri( modelUrl),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
    faceapi.nets.faceRecognitionNet.loadFromUri( modelUrl),
  ]);
  console.log("Models loaded successfully");
};

onMounted(() => {
  
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (gl) {
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      console.error("WebGL context lost. Reloading models or reinitializing.");
    });

    canvas.addEventListener("webglcontextrestored", async () => {
      console.log("WebGL context restored. Reloading models.");
      await loadModels();
    });
  }

  loadModels().catch((err) => console.error("Error loading models:", err));
});
</script>

  