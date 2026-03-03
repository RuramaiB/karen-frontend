<template>
  <div class="p-6 bg-white shadow-md rounded-md max-w-lg mx-auto mt-10">
    <!-- Camera Recognition Section -->
    <div class="relative w-full h-auto">
      <h3 class="text-lg font-semibold mb-2">Face Recognition with Camera</h3>
      
      <!-- Camera or captured image display -->
      <div class="relative w-full">
        <video ref="camera" autoplay class="w-full rounded-md border mb-4" v-if="!capturedImageUrl"></video>
        <canvas ref="overlay" class="absolute top-0 left-0 w-full h-full pointer-events-none" v-if="!capturedImageUrl"></canvas>
        <img :src="capturedImageUrl" alt="Captured Preview" class="w-full rounded-md border mb-4" v-if="capturedImageUrl" />
      </div>
      
      <div class="flex justify-between w-full">
        <button
          @click="captureAndRecognize"
          class="bg-purple-500 text-white px-4 py-2 rounded"
          :disabled="!modelsLoaded || processingCapture"
        >
          {{ processingCapture ? 'Processing...' : 'Capture and Recognize' }}
        </button>
        <button 
          @click="tryAgain"
          class="bg-gray-500 text-white px-4 py-2 rounded"
          v-if="capturedImageUrl"
        >
          Retake
        </button>
      </div>
      
      <p v-if="!modelsLoaded" class="text-gray-500 mt-2">Loading models... Please wait.</p>
      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import * as faceapi from "face-api.js";

// Since you may not be using Vue Router in your original code
// Let's implement a simple navigation function
const navigateTo = (path) => {
  window.location.href = path;
};

const labeledDescriptors = reactive([]);
const modelsLoaded = ref(false);
const camera = ref(null);
const capturedImageUrl = ref(null);
const recognitionResult = ref(null);
const overlay = ref(null);
const errorMessage = ref('');
const processingCapture = ref(false);
let detectionInterval = null;
let videoStream = null;

const tryAgain = async () => {
  capturedImageUrl.value = null;
  recognitionResult.value = null;
  errorMessage.value = '';
  reloadNuxtApp()
  // await setupCamera();
  // startFaceDetection();
};

const stopFaceDetection = () => {
  if (detectionInterval) {
    clearInterval(detectionInterval);
    detectionInterval = null;
  }
};

const loadModelsAndDataset = async () => {
  try {
    // Load models
    console.log("Loading models...");
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    console.log("Models loaded successfully.");

    // Fetch dataset from endpoint
    console.log("Fetching dataset...");
    try {
      const response = await fetch("http://localhost:7210/dataset/get-dataset-by-/master");
      if (!response.ok) throw new Error(`Failed to fetch dataset: ${response.status}`);

      const dataset = await response.json();
      console.log("Dataset received:", dataset);

      // Parse dataset
      if (Array.isArray(dataset) && dataset.length > 0) {
        labeledDescriptors.splice(
          0,
          labeledDescriptors.length,
          ...dataset.map((item) => {
            if (typeof item.email !== "string") {
              throw new Error("Invalid dataset format: 'email' must be a string");
            }
            return new faceapi.LabeledFaceDescriptors(
              item.email,
              item.descriptors.map((d) => new Float32Array(d))
            );
          })
        );
        console.log("Dataset loaded successfully.");
      } else {
        console.error("Empty or invalid dataset received");
        errorMessage.value = "No recognition data available. Please contact administrator.";
      }
    } catch (fetchError) {
      console.error("Dataset fetch error:", fetchError);
      errorMessage.value = "Failed to load recognition data. Please try again later.";
    }

    modelsLoaded.value = true;
  } catch (error) {
    console.error("Error loading models:", error);
    errorMessage.value = "Failed to initialize face recognition. Please reload the page.";
  }
};

const startFaceDetection = () => {
  const video = camera.value;
  const canvas = overlay.value;

  if (!video || !canvas) {
    console.error("Video or canvas element not found");
    return;
  }

  // Make sure video is playing before starting detection
  if (video.paused || video.ended) {
    video.play().catch(err => {
      console.error("Error playing video:", err);
    });
  }

  // Set canvas size immediately if video metadata is already loaded
  if (video.readyState >= 2) {
    resizeCanvasToVideo();
  } else {
    // Otherwise wait for metadata to load
    video.addEventListener('loadedmetadata', resizeCanvasToVideo);
  }

  function resizeCanvasToVideo() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
  }

  // Start detection interval
  detectionInterval = setInterval(async () => {
    if (video.readyState === 4) {
      try {
        // Make sure canvas is the right size
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          resizeCanvasToVideo();
        }

        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 })
        );

        // Always clear the canvas first
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          console.log(`Detected ${detections.length} faces`);
          
          // Create display size object
          const displaySize = { width: video.videoWidth, height: video.videoHeight };
          
          // Resize detections
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          // Draw detections
          faceapi.draw.drawDetections(canvas, resizedDetections);
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }
    }
  }, 100);
};

// Setup Camera
const setupCamera = async () => {
  try {
    const video = camera.value;
    if (!video) {
      console.error("Video element not found");
      return;
    }

    // Stop any existing stream
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }

    // Get camera stream
    videoStream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user" 
      } 
    });
    
    // Connect stream to video element
    video.srcObject = videoStream;
    
    // Wait for video to be ready
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play().then(() => {
          console.log("Camera started successfully");
          resolve();
        }).catch(err => {
          console.error("Error playing video:", err);
          resolve(); // Resolve anyway to prevent hanging
        });
      };
    });
  } catch (error) {
    console.error("Camera setup error:", error);
    errorMessage.value = "Failed to access camera. Please check permissions and try again.";
    throw error;
  }
};

// Capture and Recognize Face
const captureAndRecognize = async () => {
  console.log("Starting capture and recognition process...");
  processingCapture.value = true;
  errorMessage.value = '';

  try {
    const video = camera.value;
    if (!video || !video.srcObject) {
      throw new Error("Camera not initialized");
    }

    // Stop live face detection
    stopFaceDetection();

    if (!labeledDescriptors.length) {
      throw new Error("No trained data available for recognition");
    }

    // Capture image from video
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Stop video stream
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      videoStream = null;
    }
    video.srcObject = null;

    // Show captured image in UI
    const previewUrl = canvas.toDataURL("image/jpeg");
    capturedImageUrl.value = previewUrl;

    // Process the image for face recognition
    canvas.toBlob(async (blob) => {
      if (!blob) {
        throw new Error("Failed to convert canvas content to Blob");
      }

      try {
        // Begin recognition
        const img = await faceapi.bufferToImage(blob);
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({
            inputSize: 128,
            scoreThreshold: 0.5,
          }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          const email = localStorage.getItem("Email");

          if (bestMatch.label !== "unknown") {
            if (email === bestMatch.label) {
              const probability = ((1 - bestMatch.distance) * 100).toFixed(2);
              
              // Continuous Learning: Add the new descriptor to the existing label
              const targetDescriptor = labeledDescriptors.find(d => d.label === email);
              if (targetDescriptor) {
                targetDescriptor.descriptors.push(detection.descriptor);
                console.log("Continuous Learning: Updated descriptors for", email);
                await saveDataset();
              }

              alert(`Welcome ${bestMatch.label}`);
              recognitionResult.value = { label: bestMatch.label, probability };
              
              // Navigate based on environment
              if (window && window.api) {
                navigateTo("/users/class/exam/");
              } else {
                navigateTo("/users/");
              }
            } else {
              alert("Identity belongs to a different student.");
              navigateTo("/auth/signin");
            }
          } else {
            alert("Face not recognized.");
            recognitionResult.value = { label: null, probability: null };
            errorMessage.value = "Face not recognized. Please try again.";
          }
        } else {
          alert("No face detected in the captured image.");
          recognitionResult.value = { label: null, probability: null };
          errorMessage.value = "No face detected. Please position yourself clearly in front of the camera.";
        }
      } catch (recognitionError) {
        console.error("Recognition error:", recognitionError);
        errorMessage.value = "Error during recognition. Please try again.";
      } finally {
        processingCapture.value = false;
      }
    }, "image/jpeg");
  } catch (error) {
    console.error("Capture and recognition error:", error);
    errorMessage.value = error.message || "An error occurred during face recognition.";
    processingCapture.value = false;
    
    // Try to restart camera if there was an error
    tryAgain();
  }
};

const saveDataset = async () => {
  try {
    const json = JSON.stringify(
      labeledDescriptors.map((desc) => ({
        email: desc.label,
        descriptors: desc.descriptors.map((descriptor) => Array.from(descriptor)),
      }))
    );

    const blob = new Blob([json], { type: "application/json" });
    const formData = new FormData();
    formData.append("datasetFile", blob, "trained_data.json");
    formData.append("datasetName", "master");

    const response = await fetch(
      `http://localhost:7210/dataset/update-dataset-by-/master`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (response.ok) {
      console.log("Dataset updated successfully for continuous learning.");
    } else {
      console.error("Failed to update dataset for continuous learning.");
    }
  } catch (error) {
    console.error("Error saving dataset:", error);
  }
};

onMounted(async () => {
  console.log("Component mounted");
  try {
    await loadModelsAndDataset(); // Load models and dataset from server
    await setupCamera(); // Set up the camera
    console.log("Camera setup complete, starting face detection");
    setTimeout(() => {
      startFaceDetection();
      console.log("Face detection started");
    }, 1000); // Start detection after a delay
  } catch (error) {
    console.error("Initialization error:", error);
    errorMessage.value = "Failed to initialize the application. Please reload the page.";
  }
});

onBeforeUnmount(() => {
  console.log("Component unmounting, cleaning up resources");
  // Clean up resources when component is destroyed
  stopFaceDetection();
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
});
</script>

<style>
body {
  font-family: "Arial", sans-serif;
}
</style>