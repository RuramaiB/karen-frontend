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
  const email = ref([]);
  const images = ref([]);
  const loading = ref(false);
  const labeledDescriptors = reactive([]); // Unified dataset with name and email
  email.value = localStorage.getItem("Email")
  // On Component Mount
  onMounted(async () => {
    loading.value = true
    try {
      // Load Models
      console.log("Loading models...");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      console.log("Models loaded successfully.");
      loading.value = false
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
    loading.value = true
    if (!email.value || !images.value.length) {
      alert("Please upload images.");
      return;
    }
  
    console.log(`Adding/Updating: Email - ${email.value}`);
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
        email: email.value,
        descriptors: descriptors,
      });
    }
    saveTrainedData()
    email.value = "";
    images.value = [];
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
  
  