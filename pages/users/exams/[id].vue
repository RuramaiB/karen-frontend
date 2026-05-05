<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Teams-like header -->
    <div class="bg-[#464EB8] text-white p-4 shadow-md">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <h1 class="text-xl font-semibold">Exam Portal</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div class="bg-white/20 rounded-full px-3 py-1 flex items-center">
            <span class="text-sm font-medium">{{ formatTime(timeRemaining) }}</span>
          </div>
          <button class="bg-white/10 hover:bg-white/20 p-2 rounded-full">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 mx-auto border-4 border-[#464EB8] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-lg font-medium text-gray-600">Loading exam...</p>
        </div>
      </div>
      
      <!-- Exam Content -->
      <div v-else-if="exam" class="flex flex-col lg:flex-row gap-6">
        <!-- Main Exam Area -->
        <div class="flex-1">
          <!-- Exam Header -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
            <div class="flex flex-col space-y-4">
              <h1 class="text-2xl font-semibold text-gray-800">{{ exam.examTitle }}</h1>
              <p class="text-gray-600">{{ exam.examDescription }}</p>
              <div class="pt-2 border-t border-gray-100">
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
                  <span>Time remaining: {{ formatTime(timeRemaining) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Questions -->
          <form @submit.prevent="submitExam()" class="space-y-4">
            <div v-for="(question, index) in displayedQuestions" :key="index" class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p class="text-xl font-medium mb-6 text-gray-900 leading-relaxed border-b border-gray-100 pb-4">
                <span class="text-[#464EB8] font-bold mr-3">Question {{ currentPage * questionsPerPage + index + 1 }}</span>
                <br v-if="question.title.length > 50" />
                <span class="mt-2 block lg:inline">{{ question.title }}</span>
              </p>

              <!-- Multiple Choice (Google Forms Style) -->
              <div v-if="question.type === 'multiple_choice' || question.type === 'MULTIPLE_CHOICE'" class="space-y-4">
                <div v-for="(option, optionIndex) in question.options" :key="optionIndex"
                  class="relative group"
                >
                  <label 
                    class="flex items-center p-4 bg-gray-50 border-2 border-transparent rounded-xl cursor-pointer transition-all duration-200 hover:bg-white hover:border-[#464EB8]/30 group-hover:shadow-md"
                    :class="{ 'border-[#464EB8] bg-white shadow-sm': qa.answers[currentPage * questionsPerPage + index] === (option.text || option) }"
                  >
                    <div class="flex items-center h-5">
                      <input 
                        type="radio" 
                        :name="'question-' + (currentPage * questionsPerPage + index)"
                        v-model="qa.answers[currentPage * questionsPerPage + index]" 
                        :value="option.text || option"
                        class="h-5 w-5 text-[#464EB8] border-gray-300 focus:ring-[#464EB8] transition-transform duration-200" 
                      />
                    </div>
                    <span class="ml-4 text-base font-medium text-gray-700">{{ option.text || option }}</span>
                  </label>
                </div>
              </div>

              <!-- Short Answer -->
              <div v-if="question.type === 'short_answer' || question.type === 'SHORT_ANSWER'" class="mt-2">
                <input type="text" v-model="qa.answers[currentPage * questionsPerPage + index]"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#464EB8] focus:border-[#464EB8] transition-all"
                  placeholder="Type your answer here..." />
              </div>

              <!-- Paragraph -->
              <div v-if="question.type === 'paragraph' || question.type === 'OPEN_ENDED' || question.type === 'paragraph'" class="mt-2">
                <textarea v-model="qa.answers[currentPage * questionsPerPage + index]" rows="6"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#464EB8] focus:border-[#464EB8] transition-all"
                  placeholder="Type your detailed answer here..."></textarea>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="exam && !loading" class="mt-6 flex justify-between items-center bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <button @click="previousPage" :disabled="currentPage === 0"
                class="px-4 py-2 flex items-center space-x-2 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-50">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>Previous</span>
              </button>
              <span class="text-sm text-gray-600">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage >= totalPages - 1"
                class="px-4 py-2 flex items-center space-x-2 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-50">
                <span>Next</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <!-- Submit Button -->
            <button v-if="exam && !loading && currentPage === totalPages - 1" type="submit"
              class="mt-6 w-full bg-[#464EB8] hover:bg-[#3a42a0] text-white font-medium py-3 px-4 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#464EB8]">
              Submit Exam
            </button>
          </form>
        </div>

        <!-- Sidebar (Teams-like right panel) -->
        <div class="lg:w-80 space-y-4">
          <!-- Proctoring Panel -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 class="font-medium text-gray-800 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#464EB8]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
              </svg>
              Proctoring Status
            </h3>
            
            <!-- Camera Feed -->
            <div class="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden mb-3">
              <video ref="camera" autoplay muted class="w-full h-full object-cover"></video>
              <canvas ref="overlay" class="absolute top-0 left-0 w-full h-full pointer-events-none"></canvas>

              <!-- Status Badge -->
              <div class="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                <div class="flex items-center space-x-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  <span class="w-2 h-2 rounded-full" :class="{
                    'bg-green-400': identityVerified,
                    'bg-red-400': !identityVerified && faceDetected,
                    'bg-gray-400': !faceDetected,
                    'animate-pulse': faceDetected && !identityVerified
                  }"></span>
                  <span>{{ 
                    identityVerified ? "Verified" : 
                    faceDetected ? "Unverified" : "No face detected"
                  }}</span>
                </div>
                <div class="flex items-center space-x-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>Live</span>
                </div>
              </div>
            </div>

            <!-- Status Details -->
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Face Detection:</span>
                <span :class="{
                  'text-green-600': faceDetected,
                  'text-red-600': !faceDetected
                }">
                  {{ faceDetected ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Identity Verification:</span>
                <span :class="{
                  'text-green-600': identityVerified,
                  'text-red-600': !identityVerified && faceDetected,
                  'text-gray-600': !faceDetected
                }">
                  {{ 
                    identityVerified ? 'Verified' : 
                    faceDetected ? 'Pending' : 'N/A'
                  }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">System Status:</span>
                <span class="text-green-600">Active</span>
              </div>
            </div>
          </div>

          <!-- Alerts -->
          <div v-if="alertMessage || proctoringAlert" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md space-y-2">
            <div v-if="alertMessage" class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700 font-bold uppercase">System Alert</p>
                <p class="text-sm text-red-700">{{ alertMessage }}</p>
              </div>
            </div>
            <div v-if="proctoringAlert" class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700 font-bold uppercase">AI Monitor</p>
                <p class="text-sm text-red-700">{{ proctoringAlert }}</p>
              </div>
            </div>
          </div>

          <!-- Help Section -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 class="font-medium text-gray-800 mb-2 flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#464EB8]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              Need Help?
            </h3>
            <p class="text-sm text-gray-600 mb-3">If you experience technical issues, please contact support immediately.</p>
            <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-2 px-4 rounded-md transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  ref,
  computed,
  reactive,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const route = useRoute();
const router = useRouter();
const currentPage = ref(0);
const questionsPerPage = 5;
const timeRemaining = ref(0);
const timer = ref(null);
const camera = ref(null);
const overlay = ref(null);
const monitoringInterval = ref(null);
const alertMessage = ref(null);
const labeledDescriptors = reactive([]);
const isMonitoring = ref(true);
const loading = ref(true);
const modelsLoaded = ref(false);
const token = localStorage.getItem("Token");
const email = localStorage.getItem("Email");
const exam = ref(null);
const isElectron = ref(false);
const examID = ref(null);
const faceDetected = ref(false);
const identityVerified = ref(false);
const faceStatus = ref("Initializing...");
const userConfidence = ref(0);
const qa = ref({
  questions: [],
  answers: []
})

// Advanced AI Proctoring
const ssdModel = ref(null);
const gazeAwayStartTime = ref(null);
const proctoringAlert = ref(null);

// Unified Incident & Notification Logging
const logIncident = async (type, detail, confidence = 1.0) => {
    // Prevent duplicate logs for the same incident in a short time
    const now = Date.now();
    const incidentKey = `${type}-${detail}`;
    if (state.lastIncidentTime[incidentKey] && (now - state.lastIncidentTime[incidentKey] < 5000)) {
        return;
    }
    state.lastIncidentTime[incidentKey] = now;

    // Categorize specifically requested behaviors as SUSPICIOUS_BEHAVIOR
    const refinedType = (type === 'GAZE_DEVIATION' || type === 'PHONE_DETECTED') ? 'SUSPICIOUS_BEHAVIOR' : type;
    const refinedDetail = type === refinedType ? detail : `[${type}] ${detail}`;

    console.log(`Backend Logging: ${refinedType} - ${refinedDetail}`);

    try {
        // 1. Log as structured incident
        await $fetch('http://localhost:7210/verification/log-incident', {
            method: 'POST',
            body: {
                examId: examID.value || "UNKNOWN_EXAM",
                studentEmail: email,
                incidentType: refinedType,
                detail: refinedDetail,
                confidence: confidence,
                timestamp: new Date().toISOString()
            }
        });

        // 2. Log as notification for Admin Dashboard
        await $fetch('http://localhost:7210/notifications/create-new-notification', {
            method: 'POST',
            body: {
                title: "Policy violation",
                message: refinedDetail,
                studentEmail: email,
            }
        });

        console.log(`Backend Persistence Success: ${refinedType}`);
    } catch (err) {
        console.error("Backend Persistence Failure:", err);
    }
};

const notify = (description) => {
    logIncident("POLICY_VIOLATION", description);
};

// Identity verification tracking
const identityTracker = reactive({
  verifiedCount: 0,
  unverifiedCount: 0,
  lastIdentity: null,
  suspiciousActivity: false,
  suspiciousSince: null,
  wrongIdentityConsecutiveFrames: 0,
  sameIdentityConsecutiveFrames: 0,
  identityChanges: [],
  confidenceThreshold: 0.6,
  notificationThreshold: 5, // Number of consecutive wrong identity frames before notification
  stabilityThreshold: 10, // Number of consecutive frames with same identity to confirm
});

// Advanced Behavioral Detection State
const behaviorState = reactive({
  headTiltFrames: 0,
  isWhispering: false,
  isHandSignaling: false,
  audioContext: null,
  analyser: null,
  microphone: null,
  lastSuspiciousTime: 0,
  isRecordingEvidence: false,
  mediaRecorder: null,
  recordedChunks: [],
  videoBuffer: [], // To store recent frames for evidence
});

const proctoringSettings = {
  headTiltThreshold: 25, // Degrees for head tilting
  whisperingThreshold: 0.2, // Amplitude threshold for whispering
  evidenceDuration: 20000, // 20 seconds evidence clip
};

// Get exam ID from route parameters
examID.value = route.params.id;

const getExamByID = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `http://localhost:7210/exams/get-exam/${examID.value}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exam data");
    }

    const data = await response.json();
    exam.value = data;

    // Initialize timer if exam duration is available
    if (exam.value && exam.value.duration) {
      timeRemaining.value = exam.value.duration * 60; // Convert minutes to seconds
      startTimer();
    }

    // Initialize answers list with empty values for each question
    if (exam.value && exam.value.questions) {
      qa.value.answers = new Array(exam.value.questions.length).fill("");
    }

    loading.value = false;
  } catch (error) {
    console.error("Error fetching exam:", error);
    alertMessage.value = "Failed to load exam. Please try again later.";
    loading.value = false;
  }
};

// Start exam timer
const startTimer = () => {
  timer.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(timer.value);
      submitExam();
    }
  }, 1000);
};

// Settings for face detection
const settings = reactive({
  faceDetectionInterval: 500, // Reduced to 500ms for better performance
  inputSize: 320,
  scoreThreshold: 0.5,
  maxAwayFrames: 10,
  maxLookAwayFrames: 20,
});

// State for proctoring
const state = reactive({
  awayFrames: 0,
  lookingAwayFrames: 0,
  active: false,
  detectionAttempts: 0,
  detectionFailures: 0,
  lastIncidentTime: {},
});

// Computed properties
const totalPages = computed(() => {
  if (!exam.value || !exam.value.questions) return 0;
  return Math.ceil(exam.value.questions.length / questionsPerPage);
});

const displayedQuestions = computed(() => {
  if (!exam.value || !exam.value.questions) return [];
  const start = currentPage.value * questionsPerPage;
  const end = start + questionsPerPage;
  return exam.value.questions.slice(start, end);
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
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Submit Exam
const submitExam = async () => {
  clearInterval(timer.value);
  
  try {
    // Create an array to hold all answer objects
    const answersList = [];
    
    // Prepare all question-answer pairs
    for (let i = 0; i < exam.value.questions.length; i++) {
      const currentQuestion = exam.value.questions[i];
      const currentAnswer = qa.value.answers[i];
      
      // Create each answer object
      const answerObject = {
        question: currentQuestion.title,
        answer: currentAnswer,
        // questionID: currentQuestion.id || i, // Add question ID if available
        // timestamp: new Date().toISOString()
      };
      
      // Add to our answers list
      answersList.push(answerObject);
    }
    
    // Create the exam data with all answers
    const examData = {
      examID: examID.value,
      studentEmail: email,
      answers: answersList // List of all answer objects
    };
    
    // Send the request with all answers
    const response = await useFetch("http://localhost:7210/answers/submit-exam-answers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: examData,
    });
    // alert(response.value)
    // alert("With data:" +response.data.msg)
    // alert("Without data:" +response.msg)
    // Check if response is successful
    // if (!response.ok) {
    //   throw new Error(`Failed to submit exam: ${response.msg}`);
    // }
    
    // Final notification after all questions have been submitted
    alert("Exam submitted successfully!");
    navigateTo("/users/")
    // router.push("/dashboard");
  } catch (error) {
    console.error("Error submitting exam:", error);
    alert("Failed to submit exam. Please try again.");
  }
};

// Evidence Recording Logic
const startEvidenceRecording = async () => {
    if (behaviorState.isRecordingEvidence) return;
    
    console.log("Starting evidence recording...");
    behaviorState.isRecordingEvidence = true;
    behaviorState.recordedChunks = [];
    
    try {
        const stream = camera.value.srcObject;
        behaviorState.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        
        behaviorState.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                behaviorState.recordedChunks.push(event.data);
            }
        };
        
        behaviorState.mediaRecorder.onstop = async () => {
            const blob = new Blob(behaviorState.recordedChunks, { type: 'video/webm' });
            await uploadEvidence(blob);
            behaviorState.isRecordingEvidence = false;
        };
        
        behaviorState.mediaRecorder.start();
        
        // Stop recording after 15 seconds (10s before + 5s after detection approx)
        setTimeout(() => {
            if (behaviorState.mediaRecorder && behaviorState.mediaRecorder.state === "recording") {
                behaviorState.mediaRecorder.stop();
            }
        }, 15000);
        
    } catch (err) {
        console.error("Error recording evidence:", err);
        behaviorState.isRecordingEvidence = false;
    }
};

const uploadEvidence = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "evidence.webm");
    formData.append("studentEmail", email);
    
    try {
        const response = await fetch("http://localhost:7210/evidence/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });
        
        if (response.ok) {
            const filename = await response.text();
            console.log("Evidence uploaded successfully:", filename);
        }
    } catch (err) {
        console.error("Failed to upload evidence:", err);
    }
};

// Whispering Detection (Audio Analysis)
const initAudioMonitoring = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        behaviorState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        behaviorState.microphone = behaviorState.audioContext.createMediaStreamSource(stream);
        behaviorState.analyser = behaviorState.audioContext.createAnalyser();
        behaviorState.analyser.fftSize = 256;
        behaviorState.microphone.connect(behaviorState.analyser);
        
        const bufferLength = behaviorState.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const checkAudio = () => {
            if (!isMonitoring.value) return;
            
            behaviorState.analyser.getByteTimeDomainData(dataArray);
            
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                const val = (dataArray[i] - 128) / 128;
                sum += val * val;
            }
            const rms = Math.sqrt(sum / bufferLength);
            
            // Basic threshold for whispering/talking
            if (rms > proctoringSettings.whisperingThreshold) {
                handleSuspiciousBehavior("Whispering detected");
            }
            
            requestAnimationFrame(checkAudio);
        };
        
        checkAudio();
    } catch (err) {
        console.warn("Microphone access denied or error:", err);
    }
};

const handleSuspiciousBehavior = (reason) => {
    const now = Date.now();
    if (now - behaviorState.lastSuspiciousTime < 10000) return; // Wait 10s between notifications
    
    behaviorState.lastSuspiciousTime = now;
    notify(reason);
    alertMessage.value = `Suspicious behavior: ${reason}`;
    
    // Start evidence recording
    startEvidenceRecording();
};

// Camera Functions
const startCamera = async () => {
  try {
    const video = camera.value;
    if (!video) return;

    faceStatus.value = "Starting camera...";

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user",
      },
    });
    video.srcObject = stream;

    // Wait for video to be ready
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        faceStatus.value = "Camera ready";
        resolve();
      };
    });
  } catch (error) {
    console.error("Failed to access camera:", error);
    faceStatus.value = "Camera error";
    alertMessage.value =
      "Camera access denied. Please enable camera permissions.";
  }
};

const stopCamera = () => {
  const video = camera.value;
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  }
};

// Load face recognition models
const loadModels = async () => {
  try {
    faceStatus.value = "Loading models...";
    // Load models
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    
    // Load Object Detection
    try {
      ssdModel.value = await cocoSsd.load();
      console.log("Object Detection Model Loaded");
    } catch (err) {
      console.error("Failed to load coco-ssd:", err);
    }

    modelsLoaded.value = true;
    faceStatus.value = "Models loaded";
    return true;
  } catch (error) {
    console.error("Error loading models:", error);
    alert("error: " + error);
    faceStatus.value = "Model loading failed";
    return false;
  }
};

// Fetch face recognition dataset
const fetchDataset = async () => {
  try {
    faceStatus.value = "Fetching identity data...";

    const response = await fetch(
      "http://localhost:7210/dataset/get-dataset-by-/master"
    );
    if (!response.ok) throw new Error("Failed to fetch dataset");

    const dataset = await response.json();

    // Parse dataset
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

    faceStatus.value = "Identity data ready";
    return true;
  } catch (error) {
    console.error("Error fetching dataset:", error);
    faceStatus.value = "Identity data failed";
    return false;
  }
};

const stopExam = () => {
  isMonitoring.value = false;
  clearInterval(timer.value);
  alert("Exam has been stopped due to policy violations.");

  // Close the Electron window
  if (isElectron.value && window.api) {
    window.api.close();
  } else if (window && window.close) {
    window.close();
  } else {
    console.error(
      "Unable to close the window. Not running in an Electron environment."
    );
    router.push("/dashboard");
  }
};

const handleIdentityChange = (newIdentity, confidence, eyeOrientation) => {
  const expectedIdentity = email;

  // Track eye orientation
  handleEyeOrientation(eyeOrientation);

  // If we've detected someone
  if (newIdentity) {
    // Reset away frames counter since we've detected someone
    state.awayFrames = 0;
    faceDetected.value = true;

    // Check if identity matches expected student
    const isMatching = newIdentity === expectedIdentity;

    if (isMatching) {
      // Correct identity detected
      identityTracker.wrongIdentityConsecutiveFrames = 0;
      identityTracker.sameIdentityConsecutiveFrames++;

      // Only verify identity after seeing the same face consistently
      if (
        identityTracker.sameIdentityConsecutiveFrames >=
        identityTracker.stabilityThreshold
      ) {
        identityVerified.value = true;

        // If there was a suspicious activity notification, clear it after consistent verification
        if (identityTracker.suspiciousActivity && identityVerified.value) {
          const timeNow = new Date();
          const suspiciousDuration =
            (timeNow - identityTracker.suspiciousSince) / 1000;

          // If verified for a while after suspicion, clear the suspicion
          if (
            identityTracker.sameIdentityConsecutiveFrames >
            identityTracker.stabilityThreshold * 2
          ) {
            identityTracker.suspiciousActivity = false;
            identityTracker.suspiciousSince = null;
            alertMessage.value = "";
          }
        }
      }

      userConfidence.value = confidence;
      faceStatus.value = "Identity verified";
    } else {
      // Wrong identity detected
      identityTracker.sameIdentityConsecutiveFrames = 0;
      identityTracker.wrongIdentityConsecutiveFrames++;

      // Only report wrong identity after multiple consistent detections to avoid false positives
      if (
        identityTracker.wrongIdentityConsecutiveFrames >=
        identityTracker.notificationThreshold
      ) {
        identityVerified.value = false;

        // Only notify once per suspicious activity period
        if (!identityTracker.suspiciousActivity) {
          identityTracker.suspiciousActivity = true;
          identityTracker.suspiciousSince = new Date();

          // Add to identity changes log
          identityTracker.identityChanges.push({
            timestamp: new Date(),
            detectedIdentity: newIdentity,
            confidence: confidence,
          });

          // Send notification about identity change
          notify(
            `Unauthorized user detected: ${newIdentity}. Expected: ${expectedIdentity}`
          );
          alertMessage.value = "Unauthorized user detected!";
        }

        faceStatus.value = "Wrong identity";
      } else {
        faceStatus.value = "Verifying...";
      }
    }

    // Update last identity
    identityTracker.lastIdentity = newIdentity;
  } else {
    // No face detected
    faceDetected.value = false;
    identityTracker.sameIdentityConsecutiveFrames = 0;
    state.awayFrames++;

    // Reset eye orientation tracking when no face is detected
    resetEyeOrientationTracking();

    if (state.awayFrames > settings.maxAwayFrames) {
      identityVerified.value = false;
      faceStatus.value = "No face detected";
      alert("Identity not confirmed. You are going to be exited from the exams.");
      notify("Student not visible in frame for an extended period");
      navigateTo("/users/")
      if (
        state.awayFrames > settings.maxAwayFrames * 2 &&
        !identityTracker.suspiciousActivity
      ) {
        identityTracker.suspiciousActivity = true;
        identityTracker.suspiciousSince = new Date();
        notify("Student not visible in frame for an extended period");
        alertMessage.value = "Please position yourself in front of the camera";
        alert("Identity not confirmed. You are going to be exited from the exam.");
        navigateTo("/users/")
      }
    } else {
      faceStatus.value = "Searching...";
    }
  }
};

// Initialize eye orientation tracker
const eyeTracker = {
  // Configuration
  lookDirectionThreshold: 10, // Consecutive frames to detect sustained looking direction
  notificationCooldown: 30000, // 30 seconds between notifications
  
  // State tracking
  lookingRightFrames: 0,
  lookingLeftFrames: 0,
  lookingStraightFrames: 0,
  currentDirection: "straight", // "left", "right", or "straight"
  lastNotificationTime: null,
  lastDirection: null
};

// Handle eye orientation information
const handleEyeOrientation = (eyeOrientation) => {
  if (!eyeOrientation) {
    // Reset counters if no eye orientation data
    resetEyeOrientationTracking();
    return;
  }
  
  const { lookingDirection } = eyeOrientation;
  
  // Increment counters based on looking direction
  if (lookingDirection === "right") {
    eyeTracker.lookingRightFrames++;
    eyeTracker.lookingLeftFrames = 0;
    eyeTracker.lookingStraightFrames = 0;
  } else if (lookingDirection === "left") {
    eyeTracker.lookingLeftFrames++;
    eyeTracker.lookingRightFrames = 0;
    eyeTracker.lookingStraightFrames = 0;
  } else {
    // Looking straight
    eyeTracker.lookingStraightFrames++;
    eyeTracker.lookingRightFrames = 0;
    eyeTracker.lookingLeftFrames = 0;
  }
  
  // Check for sustained looking in one direction
  checkSustainedLooking();
};

// Reset eye orientation tracking counters
const resetEyeOrientationTracking = () => {
  eyeTracker.lookingRightFrames = 0;
  eyeTracker.lookingLeftFrames = 0;
  eyeTracker.lookingStraightFrames = 0;
};

// Check if the user has been looking in one direction for too long
const checkSustainedLooking = () => {
  const now = new Date();
  const isOnCooldown = eyeTracker.lastNotificationTime && 
    (now - eyeTracker.lastNotificationTime) < eyeTracker.notificationCooldown;
  
  // Determine current looking direction state
  let newDirection = "straight";
  if (eyeTracker.lookingRightFrames >= eyeTracker.lookDirectionThreshold) {
    newDirection = "right";
  } else if (eyeTracker.lookingLeftFrames >= eyeTracker.lookDirectionThreshold) {
    newDirection = "left";
  }
  
  // Update direction state
  const directionChanged = eyeTracker.currentDirection !== newDirection;
  eyeTracker.currentDirection = newDirection;
  
  // Send notification if needed and not on cooldown
  if ((newDirection === "right" || newDirection === "left") && 
      !isOnCooldown && 
      (directionChanged || eyeTracker.lastDirection !== newDirection)) {
    
    // Send notification about sustained looking direction
    notify(`User has been looking ${newDirection} for an extended period`);
    alertMessage.value = `Please focus forward - looking ${newDirection} detected`;
    
    // Record notification time and direction
    eyeTracker.lastNotificationTime = now;
    eyeTracker.lastDirection = newDirection;
    
    // Log the event
    identityTracker.identityChanges.push({
      timestamp: now,
      event: "sustained_eye_direction",
      direction: newDirection,
      duration: `${eyeTracker.lookDirectionThreshold} frames`
    });
  }
  
  // Reset direction if user returns to looking straight ahead
  if (newDirection === "straight" && eyeTracker.lookingStraightFrames > eyeTracker.lookDirectionThreshold / 2) {
    eyeTracker.lastDirection = null;
    
    // Clear alert if it was related to eye direction
    if (alertMessage.value && alertMessage.value.includes("looking")) {
      alertMessage.value = "";
    }
  }
};

const drawFaceBox = (detection, canvas) => {
  if (!detection || !canvas) return;

  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw face detection box
  const box = detection.detection.box;
  context.strokeStyle = identityVerified.value ? "#4ade80" : "#f87171";
  context.lineWidth = 3;
  context.strokeRect(box.x, box.y, box.width, box.height);

  // Draw identity verification status
  if (faceDetected.value) {
    const textY = box.y - 10;
    context.font = "14px Arial";
    context.fillStyle = identityVerified.value ? "#4ade80" : "#f87171";
    context.fillText(
      identityVerified.value
        ? `Verified (${Math.round(userConfidence.value * 100)}%)`
        : "Unverified",
      box.x,
      textY > 0 ? textY : box.y + box.height + 20
    );

    // Draw eye landmarks to track gaze
    if (detection.landmarks) {
      // Draw eyes
      const rightEye = detection.landmarks.getRightEye();
      const leftEye = detection.landmarks.getLeftEye();

      context.fillStyle = "#ffffff";
      context.strokeStyle = "#3b82f6";
      context.lineWidth = 1;

      // Draw lines connecting eye points
      context.beginPath();
      context.moveTo(rightEye[0].x, rightEye[0].y);
      for (let i = 1; i < rightEye.length; i++) {
        context.lineTo(rightEye[i].x, rightEye[i].y);
      }
      context.closePath();
      context.stroke();

      context.beginPath();
      context.moveTo(leftEye[0].x, leftEye[0].y);
      for (let i = 1; i < leftEye.length; i++) {
        context.lineTo(leftEye[i].x, leftEye[i].y);
      }
      context.closePath();
      context.stroke();
    }
  }
};

const verifyFace = async () => {
  if (
    !camera.value ||
    !isMonitoring.value ||
    !overlay.value ||
    !modelsLoaded.value
  )
    return;

  state.detectionAttempts++;

  try {
    // Make sure video is ready
    if (camera.value.readyState !== 4) return;

    // Make sure canvas dimensions match video
    const video = camera.value;
    const canvas = overlay.value;

    if (
      canvas.width !== video.videoWidth ||
      canvas.height !== video.videoHeight
    ) {
      canvas.width = video.videoWidth || video.clientWidth;
      canvas.height = video.videoHeight || video.clientHeight;
    }

    // Clear canvas
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Detect face with landmarks and descriptor
    const detections = await faceapi
      .detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: settings.inputSize,
          scoreThreshold: settings.scoreThreshold,
        })
      )
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors();

    // Phone Detection
    if (ssdModel.value) {
      const predictions = await ssdModel.value.detect(video);
      const phone = predictions.find(p => p.class === 'cell phone' && p.score > 0.6);
      if (phone) {
        proctoringAlert.value = "Unauthorized device detected!";
        logIncident("PHONE_DETECTED", "Mobile phone detected in frame", phone.score);
      }
    }

    if (detections.length === 0) {
      handleIdentityChange(null, 0);
      gazeAwayStartTime.value = null;
      return;
    }

    if (detections.length > 1) {
      proctoringAlert.value = "Multiple persons detected!";
      logIncident("MULTIPLE_FACES", `${detections.length} people detected in frame`);
    }

    const detection = detections[0];

    // Draw face detection box
    drawFaceBox(detection, canvas);

    // Verify identity if we have labeled descriptors
    if (labeledDescriptors.length > 0) {
      const faceMatcher = new faceapi.FaceMatcher(
        labeledDescriptors,
        identityTracker.confidenceThreshold
      );
      const match = faceMatcher.findBestMatch(detection.descriptor);

      // Calculate confidence (1 - distance is the similarity score)
      const confidence = 1 - match.distance;

      // Handle identity verification
      handleIdentityChange(
        match.label !== "unknown" ? match.label : null,
        confidence
      );

        // Check for head orientation using landmarks
        if (detection.landmarks) {
          const landmarks = detection.landmarks.positions;
          const leftEye = landmarks[36]; // Left eye corner
          const rightEye = landmarks[45]; // Right eye corner
          const nose = landmarks[30]; // Nose tip
          const jawLeft = landmarks[2];
          const jawRight = landmarks[14];

          const eyeDistance = Math.abs(leftEye.x - rightEye.x);
          const noseOffset = Math.abs(nose.x - (leftEye.x + rightEye.x) / 2);

          // Head tilting detection (Roll approximation using jaw and eyes)
          const eyeMidpoint = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
          const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);
          
          if (Math.abs(angle) > proctoringSettings.headTiltThreshold) {
              behaviorState.headTiltFrames++;
              if (behaviorState.headTiltFrames > 15) {
                  handleSuspiciousBehavior("Excessive head tilting detected");
              }
          } else {
              behaviorState.headTiltFrames = 0;
          }

          // Mouth movement (talking) detection - simple proxy for whispering/signaling
          const topLip = landmarks[51];
          const bottomLip = landmarks[57];
          const mouthOpenDist = Math.abs(topLip.y - bottomLip.y);
          
          if (mouthOpenDist > eyeDistance * 0.2) {
              // Potential talking detected if combined with audio
              // (Already handled by audio rms, but this adds visual confirmation)
          }

          // Hand signaling approximation: Detect if any large object (hand) is near the face
          // by checking for landmark occlusion or unusual face box ratios (simplified for now)
          
          // Check if looking significantly to the side
          if (noseOffset > eyeDistance * 0.25) {
          state.lookingAwayFrames++;

            const direction =
              nose.x > (leftEye.x + rightEye.x) / 2 ? "right" : "left";

            if (!gazeAwayStartTime.value) {
              gazeAwayStartTime.value = Date.now();
            } else {
              const gazeDuration = (Date.now() - gazeAwayStartTime.value) / 1000;
              if (gazeDuration > 3) {
                proctoringAlert.value = "Please focus on the screen.";
                logIncident("GAZE_DEVIATION", `User looked to the ${direction} for ${gazeDuration.toFixed(1)}s`);
              }
            }

            // Only notify about looking away if we are reasonably sure about it
            if (
              state.lookingAwayFrames > settings.maxLookAwayFrames * 1.5 &&
              identityVerified.value
            ) {
              notify(
                `Student consistently looking to the ${direction} - possible screen sharing or assistance`
              );
              alertMessage.value = `Please look at your screen`;
            }
          }
        } else {
          // Reset counter when looking forward
          state.lookingAwayFrames = 0;
          gazeAwayStartTime.value = null;
          if (proctoringAlert.value && proctoringAlert.value.includes("focus")) {
            proctoringAlert.value = null;
          }
        }

        // Facial Expression Analysis
        const expressions = detection.expressions;
        if (expressions) {
            const dominant = Object.entries(expressions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
            if (['happy', 'surprised'].includes(dominant) && expressions[dominant] > 0.8) {
                // logIncident("SUSPICIOUS_EXPRESSION", `User showing ${dominant} expression during exam`);
            }
        }
    }
  } catch (error) {
    console.error("Error during face verification:", error);
    state.detectionFailures++;

    // If we have consistent failures, report it
    if (state.detectionFailures > 5) {
      faceStatus.value = "Detection error";
    }
  }
};


// Handle browser resize to adjust canvas size
const handleResize = () => {
  if (camera.value && overlay.value) {
    const video = camera.value;
    const canvas = overlay.value;

    // Update canvas dimensions to match current video display size
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;
  }
};

// Lifecycle Hooks
onMounted(async () => {
  isElectron.value = !!window.api;
  
  // Trigger Browser Extension Fullscreen
  console.log("Triggering proctoring extension...");
  window.dispatchEvent(new CustomEvent('PROCTOR_FORCE_FULLSCREEN'));

  // Fetch exam data
  await getExamByID();

  // Setup camera and face detection
  const cameraReady = await startCamera();
  const modelsReady = await loadModels();
  const datasetReady = await fetchDataset();
  if (modelsReady && datasetReady) {
    // Setup face verification interval
    monitoringInterval.value = setInterval(
      verifyFace,
      settings.faceDetectionInterval
    );
    faceStatus.value = "Monitoring active";
    
    // Initialize audio monitoring for whispering detection
    initAudioMonitoring();
  } else {
    alertMessage.value =
      "Some components failed to initialize. The proctoring may not work correctly.";
  }

  // Add window resize listener
  window.addEventListener("resize", handleResize);

  // Start video playback if it hasn't started automatically
  if (camera.value && camera.value.paused) {
    camera.value.play();
  }
});

onBeforeUnmount(() => {
  stopCamera();
  clearInterval(monitoringInterval.value);
  clearInterval(timer.value);
  isMonitoring.value = false;
  window.removeEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});

// Watch for camera element to setup canvas properly
watch(camera, async (videoEl) => {
  if (videoEl && overlay.value) {
    videoEl.onloadedmetadata = () => {
      const canvas = overlay.value;
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
    };
  }
});
</script>
