<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Exam Header -->
      <div v-if="form" class="bg-white rounded-lg p-6 mb-4">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-medium mb-2">{{ form.title }}</h1>
            <p class="text-gray-600">{{ form.description }}</p>
          </div>
          <div class="text-right">
            <p class="text-xl font-bold">{{ formatTime(timeRemaining) }}</p>
            <p class="text-sm text-gray-500">Time Remaining</p>
          </div>
        </div>
      </div>

      <!-- If exam not found -->
      <!-- <div v-else class="text-center text-red-500">
        <p>Exam not found or failed to load.</p>
      </div> -->

      <!-- Questions -->
      <div v-if="form" class="space-y-4">
        <div v-for="(question, index) in displayedQuestions" :key="index" class="bg-white rounded-lg p-6">
          <p class="text-lg font-medium mb-4">{{ question.title }}</p>

          <!-- Multiple Choice -->
          <div v-if="question.type === 'multiple_choice'" class="space-y-2">
            <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center space-x-2">
              <input
                type="radio"
                :name="'question-' + (currentPage * questionsPerPage + index)"
                v-model="answers[currentPage * questionsPerPage + index]"
                :value="optionIndex"
                class="text-purple-600"
              />
              <span>{{ option.text }}</span>
            </div>
          </div>

          <!-- Short Answer -->
          <div v-if="question.type === 'short_answer'">
            <input
              type="text"
              v-model="answers[currentPage * questionsPerPage + index]"
              class="w-full border-b border-gray-300 focus:outline-none focus:border-purple-600 py-2"
              placeholder="Your answer"
            />
          </div>

          <!-- Paragraph -->
          <div v-if="question.type === 'paragraph'">
            <textarea
              v-model="answers[currentPage * questionsPerPage + index]"
              rows="4"
              class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
              placeholder="Your answer"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="form" class="mt-6 flex justify-between items-center">
        <button @click="previousPage" :disabled="currentPage === 0" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50">Previous</button>
        <span class="text-gray-600">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages - 1" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50">Next</button>
      </div>

      <!-- Live Feed Section -->
      <div class="fixed bottom-4 right-4 z-50 flex flex-col items-center">
        <div class="relative w-48 sm:w-64 h-36 sm:h-48 bg-white shadow-lg rounded-md">
          <video ref="camera" autoplay muted class="w-full h-full rounded-md border"></video>
          <canvas ref="overlay" class="absolute top-0 left-0 w-full h-full pointer-events-none"></canvas>

          <!-- Blinking Live Button -->
          <div class="absolute top-2 left-2 flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <span class="text-red-500 font-semibold text-xs sm:text-sm">Live</span>
          </div>
        </div>

        <!-- Alerts -->
        <div v-if="alertMessage" class="mt-4 bg-red-100 text-red-700 p-2 rounded-md shadow-md text-xs sm:text-sm">
          {{ alertMessage }}
        </div>
      </div>

      <!-- Submit Button -->
      <button v-if="form && currentPage === totalPages - 1" @click="submitExam" class="mt-4 bg-purple-600 text-white rounded-lg p-4 w-full hover:bg-purple-700">
        Submit Exam
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as faceapi from 'face-api.js';

const route = useRoute();
const router = useRouter();
const form = ref(null);
const answers = ref({});
const currentPage = ref(0);
const questionsPerPage = 5;
const timeRemaining = ref(0);
const timer = ref(null);
const camera = ref(null);
const overlay = ref(null);
const monitoringInterval = ref(null);
const alertMessage = ref(null);
const distanceFromCamera = ref(null);

// Settings for face detection
const settings = reactive({
  faceDetectionInterval: 100,
  inputSize: 320,
  scoreThreshold: 0.4,
  maxAwayFrames: 50,
});

// State for proctoring
const state = reactive({
  awayFrames: 0,
  active: false,
});

// Computed properties
const totalPages = computed(() => form.value ? Math.ceil(form.value.questions.length / questionsPerPage) : 0);

const displayedQuestions = computed(() => {
  if (!form.value) return [];
  const start = currentPage.value * questionsPerPage;
  const end = start + questionsPerPage;
  return form.value.questions.slice(start, end);
});

// Pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) currentPage.value++;
};

const previousPage = () => {
  if (currentPage.value > 0) currentPage.value--;
};

// Timer formatting
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Load Exam Data
const loadExamData = () => {
  const examId = route.params.id; // Get the exam ID from the route
  console.log('Route ID:', examId);

  // Temporary data source (replace with API call or database fetch)
  const exams = [
    {
      title: "Computer Science Exam",
      description: "Final year exam",
      settings: {
        duration: 60,
        startTime: "2025-02-26T10:05",
        proctoring: {
          webcam: true,
          screenShare: false,
        },
      },
      questions: [
        {
          title: "What is a computer?",
          type: "paragraph",
          options: [{ text: "" }, { text: "" }],
        },
        {
          title: "What is computer science?",
          type: "paragraph",
          options: [{ text: "" }, { text: "" }],
        },
        {
          title: "What is a keyboard?",
          type: "paragraph",
          options: [{ text: "" }, { text: "" }],
        },
        {
          title: "What are input devices?",
          type: "paragraph",
          options: [{ text: "" }, { text: "" }],
        },
        {
          title: "What are output devices?",
          type: "short_answer",
          options: [{ text: "" }, { text: "" }],
        },
      ],
      testId: "test-1740520453739",
    },
  ];

  // Find the exam by ID
  const exam = exams.find(exam => exam.testId === examId);
  console.log('Found Exam:', exam);

  if (!exam) {
    alert('Exam not found');
    router.push('/admin/');
    return;
  }

  form.value = exam;
  console.log('Form Data:', form.value);

  // Timer Setup
  const now = new Date();
  const startTime = new Date(form.value.settings.startTime);
  if (now < startTime) {
    alert('Exam has not started yet');
    router.push('/admin/');
    return;
  }

  const endTime = new Date(startTime.getTime() + form.value.settings.duration * 60000);
  timeRemaining.value = Math.floor((endTime - now) / 1000);

  timer.value = setInterval(() => {
    timeRemaining.value--;
    if (timeRemaining.value <= 0) {
      clearInterval(timer.value);
      alert('Time is up! Submitting exam...');
      submitExam();
    }
  }, 1000);
};

// Submit Exam
const submitExam = () => {
  clearInterval(timer.value);
  console.log('Exam submitted:', answers.value);
  alert('Exam submitted successfully!');
  router.push('/admin/');
};

// Camera Functions
const startCamera = async () => {
  try {
    const video = camera.value;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (error) {
    alert('Failed to access camera.');
  }
};

const stopCamera = () => {
  const video = camera.value;
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
};

// Proctoring Functions
const startMonitoring = () => {
  state.awayFrames = 0;
  state.active = true;

  monitoringInterval.value = setInterval(async () => {
    const video = camera.value;
    const canvas = overlay.value;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

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
        alertMessage.value = 'No face detected. Please stay in view of the camera.';
      }
      return;
    }

    // Draw landmarks
    const landmarks = detection.landmarks;
    context.fillStyle = 'red';
    landmarks.positions.forEach(point => {
      context.beginPath();
      context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      context.fill();
    });

    state.awayFrames = 0;
    alertMessage.value = null;
  }, settings.faceDetectionInterval);
};

const stopMonitoring = () => {
  state.active = false;
  clearInterval(monitoringInterval.value);
  alertMessage.value = 'Proctoring stopped.';
};

// Lifecycle Hooks
onMounted(async () => {
  console.log('Component mounted');
  await startCamera();
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  startMonitoring();
  loadExamData();
});

onBeforeUnmount(() => {
  stopCamera();
  clearInterval(monitoringInterval.value);
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>