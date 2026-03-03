<template>
  <NuxtLayout name="admin-layout">
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Exam Responses</h1>
          <p class="text-gray-500 mt-1">Review student submissions and performance</p>
        </div>
        <button 
          @click="fetchExamResponses"
          class="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Refresh responses"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="responseStatus === 'Loading...'" class="flex justify-center items-center h-64">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#464775]"></div>
          <span class="text-gray-600 mt-3">Loading responses...</span>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="responseStatus === 'Failed to load responses'" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center space-x-3">
          <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="font-medium text-red-800">Failed to load data. Please try again later.</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="Object.keys(groupedByExamAndEmail).length === 0" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No responses yet</h3>
        <p class="mt-1 text-gray-500">No students have submitted responses to any exams.</p>
      </div>

      <!-- Exam Response Cards -->
      <div v-else class="space-y-6">
        <div 
          v-for="(examGroup, examId) in groupedByExamAndEmail" 
          :key="examId" 
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <!-- Exam Header -->
          <div class="bg-[#464775]/5 px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center">
              <svg class="h-5 w-5 text-[#464775] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
              </svg>
              {{ getExamTitle(examId) }}
            </h2>
            <p class="text-xs text-gray-500 mt-1">Exam ID: {{ examId }}</p>
          </div>
          
          <!-- Student Responses -->
          <div class="divide-y divide-gray-200">
            <div 
              v-for="(studentResponses, email) in examGroup" 
              :key="email" 
              class="p-6 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center mb-4">
                <div class="h-10 w-10 rounded-full bg-[#464775]/10 flex items-center justify-center text-[#464775] font-bold mr-3">
                  {{ getInitials(email) }}
                </div>
                <div class="flex-grow">
                  <h3 class="font-medium text-gray-900">{{ email.split('@')[0] }}</h3>
                  <p class="text-xs text-gray-500 truncate max-w-xs">{{ email }}</p>
                </div>
                <div class="flex-shrink-0">
                  <span class="bg-[#464775]/10 text-[#464775] text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ studentResponses.length }} responses
                  </span>
                </div>
              </div>
              
              <!-- Responses Table -->
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                      <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr 
                      v-for="(response, idx) in studentResponses" 
                      :key="idx" 
                      class="hover:bg-gray-50 transition-colors"
                    >
                      <td class="px-4 py-3 text-sm text-gray-900 max-w-xs">
                        <div class="line-clamp-2">{{ response.question }}</div>
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-500 max-w-xs">
                        <div class="line-clamp-2">{{ response.answer }}</div>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <button
                          @click="openModal(response)"
                          class="text-[#464775] hover:text-[#5c5c8a] p-1 focus:outline-none"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Response Detail Modal -->
      <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="modalVisible"
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          @click.self="closeModal"
        >
          <div 
            class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
              <h3 class="text-xl font-semibold text-gray-800">Response Details</h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-500 p-1 focus:outline-none"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-6">
              <!-- Student Info -->
              <div class="bg-[#464775]/5 rounded-lg p-4">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-full bg-[#464775]/10 flex items-center justify-center text-[#464775] font-bold">
                    {{ getInitials(selectedResponse.studentEmail) }}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ selectedResponse.studentEmail }}</h4>
                    <p class="text-sm text-gray-500">Exam: {{ selectedResponse.examTitle }}</p>
                  </div>
                </div>
              </div>

              <!-- Question -->
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-2">Question</h4>
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <p class="text-gray-800">{{ selectedResponse.question }}</p>
                </div>
              </div>

              <!-- Answer -->
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-2">Student Answer</h4>
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <p class="text-gray-800 whitespace-pre-line">{{ selectedResponse.answer }}</p>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                @click="closeModal"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const examResponses = ref([]);
const responseStatus = ref('Loading...');
const modalVisible = ref(false);
const selectedResponse = ref({});

const fetchExamResponses = async () => {
  try {
    responseStatus.value = 'Loading...';
    const token = localStorage.getItem('Token');
    if (!token) throw new Error('No auth token found');

    const res = await fetch('http://localhost:7210/answers/get-all-answers', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    examResponses.value = data;
    responseStatus.value = 'Success';
  } catch (err) {
    console.error('Fetch failed:', err);
    responseStatus.value = 'Failed to load responses';
  }
};

const openModal = (response) => {
  selectedResponse.value = response;
  modalVisible.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modalVisible.value = false;
  document.body.style.overflow = '';
};

const getInitials = (email) => {
  const username = email.split('@')[0];
  return username.substring(0, 2).toUpperCase();
};

const groupedResponses = computed(() => {
  return examResponses.value.map(item => ({
    studentEmail: item.user.email,
    examId: item.exam.examID,
    examTitle: item.exam.examTitle || 'Untitled Exam',
    response: item.response,
    question: item.question,
    answer: item.answer
  }));
});

const groupedByExamAndEmail = computed(() => {
  const result = {};
  
  groupedResponses.value.forEach(response => {
    if (!result[response.examId]) {
      result[response.examId] = {};
    }
    
    if (!result[response.examId][response.studentEmail]) {
      result[response.examId][response.studentEmail] = [];
    }
    
    result[response.examId][response.studentEmail].push(response);
  });
  
  return result;
});

const getExamTitle = (examId) => {
  const response = groupedResponses.value.find(r => r.examId === examId);
  return response ? response.examTitle : 'Untitled Exam';
};

onMounted(() => {
  fetchExamResponses();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>