<template>
  <NuxtLayout name="admin-layout">
    <div class="min-h-screen bg-gray-100">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold mb-8">Available Exams</h1>
        <!-- <button @click="startExam" class="bg-green-600 text-white px-6 py-3 rounded-lg mb-6">
          Load
        </button> -->
        <div class="space-y-4">
          <div v-for="(form, index) in forms" :key="form.testId" class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">{{ form.title }}</h2>
            <p class="text-gray-600 mb-4">{{ form.description }}</p>
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-500">Duration: {{ form.settings.duration }} minutes</p>
                <p class="text-sm text-gray-500">Start Time: {{ formatDate(form.settings.startTime) }}</p>
              </div>
              <NuxtLink 
                :to="`/admin/exams/${form.testId}`"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                v-if="canStartExam(form)"
              >
                Start Exam
              </NuxtLink>
              
              <span v-else class="text-gray-500 text-sm">
                {{ getExamStatus(form) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Temporary data source
const forms = ref([
  {
    title: "Computer Science Exam",
    description: "Final year exam",
    settings: {
      duration: 60,
      startTime: "2025-02-26T20:35",
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
]);

const isElectron = ref(false);

// Detect if running in Electron
onMounted(() => {
  isElectron.value = !!window.api;
});

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};
// Start exam in Electron
const startExam = async () => {
  try {
    // Send request to start Electron
    const response = await fetch('http://localhost:4000/start-electron', {
      method: 'POST',
    });
    const data = await response.json();
    console.log(data); // Logs 'Electron started'

    // Optionally, trigger Electron to open the exam window
    if (window.api) {
      window.api.startExam('http://localhost:3000/admin/class/exam/');
    }
  } catch (error) {
    console.error('Failed to start Electron:', error);
  }
};
// Check if exam can be started
const canStartExam = (form) => {
  const now = new Date();
  const startTime = new Date(form.settings.startTime);
  return now >= startTime && now <= new Date(startTime.getTime() + form.settings.duration * 60000);
  
};

// Display exam status
const getExamStatus = (form) => {
  const now = new Date();
  const startTime = new Date(form.settings.startTime);
  if (now < startTime) return 'Exam not started yet';
  if (now > new Date(startTime.getTime() + form.settings.duration * 60000)) return 'Exam ended';
  return '';
};


</script>

<style scoped>
/* Make sure the container takes full width in Electron */
:deep(.max-w-3xl) {
  max-width: 100% !important;
}

/* Ensure proper display on different screen sizes */
@media (min-width: 1024px) {
  .max-w-7xl {
    max-width: 80%;
  }
}
</style>