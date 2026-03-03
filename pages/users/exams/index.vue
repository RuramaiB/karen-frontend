<template>
  <NuxtLayout name="user-layout">
    <div class="min-h-screen bg-[#f5f5f5] p-8">
      <div class="max-w-5xl mx-auto">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-[#242424]">Available Assessments</h1>
            <p class="text-sm text-[#616161]">View and start your scheduled exams</p>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
            <div class="w-8 h-8 border-4 border-[#464EB8] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="exams.length === 0" class="bg-white rounded-lg border border-[#e1dfdd] p-12 text-center">
            <div class="h-16 w-16 bg-[#f3f2f1] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-[#616161]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h3 class="text-lg font-bold text-[#242424]">No exams available</h3>
            <p class="text-sm text-[#616161]">There are currently no scheduled assessments for you.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="form in exams"
            :key="form.examID"
            class="bg-white rounded border border-[#e1dfdd] hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="h-10 w-10 bg-[#464EB8]/10 rounded flex items-center justify-center text-[#464EB8]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <h2 class="text-lg font-bold text-[#242424]">{{ form.examTitle }}</h2>
              </div>
              <p class="text-sm text-[#616161] mb-4 line-clamp-2 max-w-2xl">{{ form.examDescription }}</p>
              
              <div class="flex flex-wrap gap-x-6 gap-y-2">
                <div class="flex items-center text-xs text-[#616161]">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Duration: {{ form.duration }} minutes
                </div>
                <div class="flex items-center text-xs text-[#616161]">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Start: {{ formatDate(form.startTime) }}
                </div>
              </div>
            </div>

            <div class="flex flex-col items-end gap-2 shrink-0">
              <button
                @click="startExam()"
                class="w-full md:w-auto px-6 py-2 bg-[#464EB8] hover:bg-[#3d44a2] text-white rounded text-sm font-semibold transition-colors shadow-sm disabled:bg-[#e1dfdd] disabled:text-[#616161] disabled:cursor-not-allowed"
                :disabled="!canStartExam(form)"
              >
                {{ canStartExam(form) ? 'Start Assessment' : getExamStatus(form) }}
              </button>
              <p class="text-[10px] text-[#616161] mt-1" v-if="canStartExam(form)">
                Assessment proctoring will begin automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
const loading = ref(true);
const token = localStorage.getItem("Token");
const email = localStorage.getItem("Email");
const exams = ref([]);
const isElectron = ref(false);
const getExams = async () => {
  loading.value = true;
  const { data } = await useFetch(`http://localhost:7210/exams/get-all-exams`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  exams.value = data.value;
  loading.value = false;
};

onMounted(() => {
  isElectron.value = !!window.api;
  getExams();
});

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};
// Start exam in Electron
const startExam = async () => {
  try {
    // Send request to start Electron
    const response = await fetch("http://localhost:4000/start-electron", {
      method: "POST",
    });
    const data = await response.json();
    console.log(data); // Logs 'Electron started'

    // Optionally, trigger Electron to open the exam window
    if (window.api) {
      window.api.startExam("http://localhost:3000/admin/class/exam/");
    }
  } catch (error) {
    console.error("Failed to start Electron:", error);
  }
};
// Check if exam can be started
const canStartExam = (form) => {
  const now = new Date();
  const startTime = new Date(form.startTime);
  return (
    now >= startTime &&
    now <= new Date(startTime.getTime() + form.duration * 60000)
  );
};

// Display exam status
const getExamStatus = (form) => {
  const now = new Date();
  const startTime = new Date(form.startTime);
  if (now < startTime) return "Exam not started yet";
  if (now > new Date(startTime.getTime() + form.duration * 60000))
    return "Exam ended";
  return "";
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
