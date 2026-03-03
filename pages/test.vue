<template>
    <div class="grid items-center justify-center min-h-screen bg-gray-100">
          <faceTrainer />            
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


  