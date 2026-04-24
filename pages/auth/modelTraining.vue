<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <!-- Centered White Card -->
    <div class="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Train and Recognize Faces</h2>

      <!-- Image Training Section -->
      <div>
        <h3 class="text-lg font-semibold mb-3 text-gray-700">Upload Images for Training</h3>
        <input
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          class="mb-4 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          multiple
        />
        <div class="flex justify-between">
          <button
            v-if="!loading"
            @click="addOrUpdateLabel"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
          >
            Upload
          </button>
          <button
            v-else
            disabled
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-not-allowed"
          >
            Loading...
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script setup>
  import { ref, reactive, onMounted } from "vue";
  import * as faceapi from "face-api.js";
  
  // State Variables
  const email = ref("");
  const images = ref([]);
  const loading = ref(false);
  const labeledDescriptors = reactive([]); // Unified dataset with name and email
  // On Component Mount
  onMounted(async () => {
    loading.value = true;
    const storedEmail = localStorage.getItem("Email");
    if (storedEmail) {
      email.value = storedEmail;
    } else {
      console.error("Email not found in localStorage");
      alert("System error: Your email session has expired. Please sign in again.");
      navigateTo("/auth/signin");
      return;
    }

    try {
      // Load Models
      console.log("Loading models...");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      console.log("Models loaded successfully.");

      // Fetch existing dataset
      const response = await fetch("http://localhost:7210/dataset/get-dataset-by-/master");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          labeledDescriptors.splice(0, labeledDescriptors.length, ...data.map(item => ({
            email: item.email,
            label: item.label || item.email,
            descriptors: item.descriptors.map(d => new Float32Array(d))
          })));
          console.log("Existing dataset loaded.");
        }
      }
      
      loading.value = false
    } catch (error) {
      console.error("Error loading models or dataset:", error);
      loading.value = false
    }
  });
  
  // Handle Image Upload for Training
  const handleFileUpload = (event) => {
    images.value = Array.from(event.target.files);
    console.log(`Uploaded ${images.value.length} image(s) for training.`);
  };
  
  // Add or Update Label with Email
  const addOrUpdateLabel = async () => {
    loading.value = true;
    console.log("Checking upload requirements:", { email: email.value, imagesCount: images.value.length });
    
    if (!email.value || !images.value.length) {
      alert(`Missing requirements: ${!email.value ? 'Email' : 'Images'} not found.`);
      loading.value = false;
      return;
    }
  
    console.log(`Processing ${images.value.length} images...`);
    const descriptors = [];
    for (const [index, image] of images.value.entries()) {
      try {
        const img = await faceapi.bufferToImage(image);
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
    
        if (detection) {
          descriptors.push(detection.descriptor);
          console.log(`Face detected in image ${index + 1}`);
        } else {
          console.warn(`No face detected in image ${index + 1}`);
        }
      } catch (err) {
        console.error(`Error processing image ${index + 1}:`, err);
      }
    }

    if (descriptors.length === 0) {
      alert("No faces were detected in the uploaded images. Please try with clearer photos.");
      loading.value = false;
      return;
    }
  
    const existingIndex = labeledDescriptors.findIndex((desc) => desc.email === email.value);
    if (existingIndex !== -1) {
      console.log(`Email "${email.value}" exists. Adding ${descriptors.length} descriptors.`);
      labeledDescriptors[existingIndex].descriptors.push(...descriptors);
    } else {
      console.log(`Email "${email.value}" does not exist. Creating new entry with ${descriptors.length} descriptors.`);
      labeledDescriptors.push({
        email: email.value,
        label: email.value,
        descriptors: descriptors,
      });
    }
    await saveTrainedData();
    images.value = [];
    loading.value = false;
  };
  
  // Save Trained Data
  const saveTrainedData = async () => {
  loading.value = true
  // Convert labeled descriptors to JSON
  const json = JSON.stringify(
    labeledDescriptors.map((desc) => ({
      label: desc.label,
      email: desc.email,
      descriptors: desc.descriptors.map((descriptor) => Array.from(descriptor)),
    }))
  );

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Upload the dataset to the server before initiating the download
  const formData = new FormData();
  formData.append("datasetFile", blob, "trained_data.json"); // Pass blob with a filename
  formData.append("datasetName", "master");

  const token = localStorage.getItem("Token");

  try {
    const response = await fetch(
      `http://localhost:7210/dataset/update-dataset-by-/master`,
      {
        method: "PUT",
        body: formData,
        // headers: {
        //   Authorization: `Bearer ${token}`, // No 'Content-Type' header for FormData
        // },
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      alert(responseData.msg);
      localStorage.setItem('train', true);
      navigateTo("/auth/onboarding")
    } else {
      console.error("Failed to update dataset:", responseData.msg);
    }
  } catch (error) {
    console.error("Error occurred while updating dataset:", error);
  }
  loading.value = false
};

  </script>
  
  <style>
  body {
    font-family: "Arial", sans-serif;
  }
  </style>
  
  