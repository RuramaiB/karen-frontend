<template>
  <NuxtLayout name="admin-layout">
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Available Exams</h1>
          <p class="text-gray-500 mt-1">Manage and monitor active exams</p>
        </div>
        <button 
          @click="refreshExams"
          class="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Refresh exams"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>

      <!-- Exam Cards -->
      <div class="space-y-4">
        <div 
          v-for="(form, index) in forms" 
          :key="form.examID" 
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:border-[#464775]/50 transition-colors"
        >
          <!-- Exam Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-800">{{ form.examTitle }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ form.examDescription }}</p>
              </div>
              <div class="flex-shrink-0">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getExamStatusClass(form)"
                >
                  {{ getExamStatus(form) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Exam Details -->
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-start space-x-3">
                <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p class="text-sm text-gray-500">Duration</p>
                  <p class="text-sm font-medium text-gray-900">{{ form.duration }} minutes</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p class="text-sm text-gray-500">Start Time</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(form.startTime) }}</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <div>
                  <p class="text-sm text-gray-500">Proctoring</p>
                  <p class="text-sm font-medium text-gray-900">Webcam required</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Exam Actions -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div class="flex items-center text-sm text-gray-500">
              <svg class="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ getExamStatus(form) }}
            </div>
            
            <div class="flex space-x-3">
              <NuxtLink 
                :to="`/admin/exams/results/${form.examID}`"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#464775]"
              >
                <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                View Results
              </NuxtLink>

              <button 
                v-if="canStartExam(form)"
                @click="startExam(form.examID)"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#464775] hover:bg-[#5c5c8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#464775]"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Start Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="forms.length === 0" 
        class="text-center py-12 bg-white rounded-lg border border-gray-200"
      >
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No exams available</h3>
        <p class="mt-1 text-gray-500">There are currently no exams scheduled.</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);
const token = localStorage.getItem("Token");
const email = localStorage.getItem("Email");
const forms = ref([]);
const isElectron = ref(false);

const getExams = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch(`http://localhost:7210/exams/get-all-exams-by-lecturer-/${email}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    forms.value = data.value || [];
  } catch (error) {
    console.error("Error fetching exams:", error);
  } finally {
    loading.value = false;
  }
};

// Detect if running in Electron
onMounted(() => {
  isElectron.value = !!window.api;
  getExams();
});

// Format date for display
const formatDate = (date) => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleString();
};

const refreshExams = () => {
  getExams();
};

// Start exam in Electron
const startExam = async (examID) => {
  try {
    const response = await fetch('http://localhost:4000/start-electron', {
      method: 'POST',
    });
    const data = await response.json();
    if (window.api) {
      window.api.startExam(`http://localhost:3000/users/exams/${examID}`);
    }
  } catch (error) {
    console.error('Failed to start Electron:', error);
  }
};

// Check if exam can be started
const canStartExam = (form) => {
  const now = new Date();
  const startTime = new Date(form.startTime);
  return now >= startTime && now <= new Date(startTime.getTime() + parseInt(form.duration) * 60000);
};

// Display exam status
const getExamStatus = (form) => {
  const now = new Date();
  const startTime = new Date(form.startTime);
  if (now < startTime) return 'Starts ' + formatDate(startTime);
  if (now > new Date(startTime.getTime() + parseInt(form.duration) * 60000)) return 'Exam ended';
  return 'In progress';
};

// Get status badge class
const getExamStatusClass = (form) => {
  const now = new Date();
  const startTime = new Date(form.startTime);
  if (now < startTime) return 'bg-blue-100 text-blue-800';
  if (now > new Date(startTime.getTime() + parseInt(form.duration) * 60000)) return 'bg-gray-100 text-gray-800';
  return 'bg-green-100 text-green-800';
};
</script>

<style scoped>
/* Custom styles */
</style>