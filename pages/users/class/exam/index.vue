<template>
  <NuxtLayout name="user-layout">
    <div class="flex flex-col h-screen bg-gray-50">
      <!-- Top navigation bar -->
      <div class="bg-white border-b border-gray-200 px-6 py-3">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-800">Available Exams</h1>
          <div class="flex items-center space-x-4">
            <button 
              @click="refreshPage"
              class="p-2 rounded-full hover:bg-gray-100"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Content area -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="space-y-4">
          <div v-for="n in 3" :key="n" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-32 animate-pulse"></div>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="(form, index) in exams" 
            :key="form.examID" 
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h2 class="text-xl font-semibold text-gray-800">{{ form.examTitle }}</h2>
                  <p class="text-gray-600 mt-1">{{ form.examDescription }}</p>
                </div>
                <div class="bg-blue-100 px-3 py-1 rounded-full">
                  <span class="text-sm font-medium text-blue-800">
                    {{ getExamStatus(form) || 'Active' }}
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between items-center">
                <div class="space-y-1">
                  <p class="text-sm text-gray-500 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Duration: {{ form.duration }} minutes
                  </p>
                  <p class="text-sm text-gray-500 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {{ formatDate(form.startTime) }}
                  </p>
                </div>
                
                <NuxtLink 
                  v-if="canStartExam(form)"
                  :to="`/users/exams/${form.examID}`"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Start Exam
                </NuxtLink>
                
                <div v-else class="text-sm text-gray-500 px-4 py-2">
                  {{ getExamStatus(form) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);
const token = localStorage.getItem("Token");
const email = localStorage.getItem("Email");
const exams = ref([]);

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

const getExams = async() => {
  loading.value = true;
  try {
    const { data } = await useFetch(`http://localhost:7210/exams/get-all-exams`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    exams.value = data.value || [];
  } catch (error) {
    console.error("Error fetching exams:", error);
  } finally {
    loading.value = false;
  }
};

const canStartExam = (form) => {
  const now = new Date();
  const startTime = new Date(form.startTime);
  return now >= startTime && now <= new Date(startTime.getTime() + form.duration * 60000);
};

const getExamStatus = (form) => {
  const now = new Date();
  const startTime = new Date(form.startTime);
  if (now < startTime) return 'Starts ' + startTime.toLocaleString();
  if (now > new Date(startTime.getTime() + form.duration * 60000)) return 'Exam ended';
  return '';
};

const refreshPage = () => {
  getExams();
};

onMounted(() => {
  getExams();
});
</script>

<style scoped>
/* Smooth transitions */
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

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