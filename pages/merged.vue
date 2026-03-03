<template>
    <div class="p-6 bg-white shadow-md rounded-md max-w-lg mx-auto mt-10">
      <h2 class="text-xl font-bold mb-4">Train and Recognize Faces</h2>
  
      <!-- Image Training Section -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Upload Images for Training</h3>
        <input
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          class="mb-4 block w-full border rounded p-2"
          multiple
        />
        <div class="flex items-center space-x-2 mb-4">
          <input
            v-model="label"
            type="text"
            placeholder="Enter name"
            class="border rounded p-2 flex-1"
          />
          <input
            v-model="email"
            type="email"
            placeholder="Enter email"
            class="border rounded p-2 flex-1"
          />
          <button @click="addOrUpdateLabel" class="bg-blue-500 text-white px-4 py-2 rounded">
            Add/Update
          </button>
        </div>
        <ul class="mt-4">
          <li v-for="item in labeledDescriptors" :key="item.email" class="text-green-600">
            {{ item.label }} ({{ item.email }}) - {{ item.descriptors.length }} images
          </li>
        </ul>
        <button
          @click="saveTrainedData"
          class="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Save Trained Data
        </button>
      </div>
  
      <hr class="my-6" />
  
      <!-- Image Recognition Section -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Upload Image for Recognition</h3>
        <input
          type="file"
          accept="image/*"
          @change="recognizeFace"
          class="mb-4 block w-full border rounded p-2"
        />
        <div v-if="recognitionResult" class="mt-4 p-4 bg-gray-100 rounded-md">
          <p v-if="recognitionResult.label" class="text-green-600">
            Match found: {{ recognitionResult.label }} ({{ recognitionResult.email }}) with
            {{ recognitionResult.probability }}% likelihood
          </p>
          <p v-else class="text-red-600">No match found.</p>
        </div>
        <button
          @click="loadTrainedData"
          class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Load Trained Data
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from "vue";
  import * as faceapi from "face-api.js";
  
  // State Variables
  const label = ref("");
  const email = ref("");
  const images = ref([]);
  const labeledDescriptors = reactive([]); // Unified dataset with name and email
  const recognitionResult = ref(null);
  
  // On Component Mount
  onMounted(async () => {
    try {
      // Load Models
      console.log("Loading models...");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      console.log("Models loaded successfully.");
    } catch (error) {
      console.error("Error loading models:", error);
    }
  });
  
  // Handle Image Upload for Training
  const handleFileUpload = (event) => {
    images.value = Array.from(event.target.files);
    console.log(`Uploaded ${images.value.length} image(s) for training.`);
  };
  
  // Add or Update Label with Email
  const addOrUpdateLabel = async () => {
    if (!label.value || !email.value || !images.value.length) {
      alert("Please enter a name, email, and upload images.");
      return;
    }
  
    console.log(`Adding/Updating: Name - ${label.value}, Email - ${email.value}`);
    const descriptors = [];
    for (const image of images.value) {
      const img = await faceapi.bufferToImage(image);
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
  
      if (detection) descriptors.push(detection.descriptor);
    }
  
    const existingIndex = labeledDescriptors.findIndex((desc) => desc.email === email.value);
    if (existingIndex !== -1) {
      console.log(`Email "${email.value}" exists. Updating descriptors.`);
      labeledDescriptors[existingIndex].descriptors.push(...descriptors);
    } else {
      console.log(`Email "${email.value}" does not exist. Creating new entry.`);
      labeledDescriptors.push({
        label: label.value,
        email: email.value,
        descriptors: descriptors,
      });
    }
  
    label.value = "";
    email.value = "";
    images.value = [];
  };
  
  // Save Trained Data
  const saveTrainedData = () => {
    console.log("Saving trained data...");
    const json = JSON.stringify(
      labeledDescriptors.map((desc) => ({
        label: desc.label,
        email: desc.email,
        descriptors: desc.descriptors.map((descriptor) => Array.from(descriptor)),
      }))
    );
  
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = `trained_data.json`;
    link.click();
  
    URL.revokeObjectURL(url);
    console.log("Trained data saved successfully.");
  };
  
  // Load Trained Data
  const loadTrainedData = async () => {
    console.log("Loading trained data...");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
  
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const json = await file.text();
      const data = JSON.parse(json);
  
      data.forEach((item) => {
        const existingIndex = labeledDescriptors.findIndex((desc) => desc.email === item.email);
        if (existingIndex !== -1) {
          console.log(`Merging descriptors for email: ${item.email}`);
          labeledDescriptors[existingIndex].descriptors.push(
            ...item.descriptors.map((d) => new Float32Array(d))
          );
        } else {
          console.log(`Adding new entry for email: ${item.email}`);
          labeledDescriptors.push({
            label: item.label,
            email: item.email,
            descriptors: item.descriptors.map((d) => new Float32Array(d)),
          });
        }
      });
  
      alert("Trained data loaded successfully.");
    };
  
    input.click();
  };
  
  // Recognize Faces
  const recognizeFace = async (event) => {
    console.log("Starting face recognition...");
    if (!labeledDescriptors.length) {
      alert("No trained data available for recognition.");
      return;
    }
  
    const imageFile = event.target.files[0];
    if (!imageFile) return;
  
    const img = await faceapi.bufferToImage(imageFile);
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
  
    if (detection) {
      const faceMatcher = new faceapi.FaceMatcher(
        labeledDescriptors.map((desc) => new faceapi.LabeledFaceDescriptors(desc.email, desc.descriptors))
      );
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
  
      const matchedEntry = labeledDescriptors.find((desc) => desc.email === bestMatch.label);
  
      recognitionResult.value = matchedEntry
        ? {
            label: matchedEntry.label,
            email: matchedEntry.email,
            probability:
              bestMatch.label !== "unknown"
                ? ((1 - bestMatch.distance) * 100).toFixed(2)
                : null,
          }
        : { label: null };
      console.log("Recognition Result:", recognitionResult.value);
    } else {
      console.warn("No face detected.");
      recognitionResult.value = { label: null };
    }
  };
  </script>
  
  <style>
  body {
    font-family: "Arial", sans-serif;
  }
  </style>
  