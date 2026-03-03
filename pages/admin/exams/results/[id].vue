<template>
  <NuxtLayout name="admin-layout">
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <NuxtLink to="/admin/exams" class="text-sm text-[#464EB8] hover:underline flex items-center mb-2">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Exams
          </NuxtLink>
          <h1 class="text-2xl font-semibold text-gray-800">Exam Results</h1>
          <p class="text-gray-500 mt-1" v-if="exam">{{ exam.examTitle }} - Submission Tracking</p>
        </div>
        <div class="flex items-center space-x-3">
           <button 
            @click="fetchResults"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Refresh Results
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#464EB8]"></div>
      </div>

      <!-- Results Content -->
      <div v-else-if="groupedSubmissions.length > 0" class="space-y-6">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Submissions</p>
            <p class="text-3xl font-bold text-[#464EB8] mt-2">{{ groupedSubmissions.length }}</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Unique Questions</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">{{ exam?.questions?.length || 0 }}</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Exam Status</p>
            <p class="text-3xl font-bold text-green-600 mt-2">Active</p>
          </div>
        </div>

        <!-- Submissions List -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answers Provided</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="submission in groupedSubmissions" :key="submission.email">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-[#464EB8]/10 rounded-full flex items-center justify-center">
                      <span class="text-[#464EB8] font-bold">{{ submission.email.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ submission.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ submission.answers.length }} / {{ exam?.questions?.length || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="selectedSubmission = submission"
                    class="text-[#464EB8] hover:text-[#3a42a0] font-semibold"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
        <p class="mt-1 text-sm text-gray-500">Results will appear here once students complete the exam.</p>
      </div>

      <!-- Detail Modal -->
      <div v-if="selectedSubmission" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="selectedSubmission = null"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div class="bg-[#464EB8] px-6 py-4 flex justify-between items-center text-white">
              <h3 class="text-lg font-bold">Submission Details: {{ selectedSubmission.email }}</h3>
              <button @click="selectedSubmission = null">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <div v-for="(answer, idx) in selectedSubmission.answers" :key="idx" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p class="text-sm font-semibold text-[#464EB8] mb-1">Question {{ idx + 1 }}</p>
                <p class="text-gray-900 font-medium mb-3">{{ answer.question }}</p>
                <div class="bg-white p-3 rounded border border-gray-100 text-gray-700">
                  <span class="text-xs font-bold text-gray-400 uppercase block mb-1">Student's Answer:</span>
                  {{ answer.answer || 'No answer provided' }}
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-6 py-4 flex justify-end">
              <button @click="selectedSubmission = null" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const examID = route.params.id;
const loading = ref(true);
const exam = ref(null);
const rawAnswers = ref([]);
const selectedSubmission = ref(null);
const token = localStorage.getItem("Token");

const fetchResults = async () => {
  loading.value = true;
  try {
    // 1. Fetch Exam Details
    const examRes = await fetch(`http://localhost:7210/exams/get-exam/${examID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (examRes.ok) exam.value = await examRes.json();

    // 2. Fetch All Answers
    const answersRes = await fetch(`http://localhost:7210/answers/get-answers-by-exam-/${examID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (answersRes.ok) rawAnswers.value = await answersRes.json();
  } catch (err) {
    console.error("Failed to fetch results:", err);
  } finally {
    loading.value = false;
  }
};

const groupedSubmissions = computed(() => {
  const groups = {};
  rawAnswers.value.forEach(ans => {
    const email = ans.user?.email || 'Unknown Student';
    if (!groups[email]) {
      groups[email] = {
        email,
        answers: []
      };
    }
    groups[email].answers.push(ans);
  });
  return Object.values(groups);
});

onMounted(() => {
  fetchResults();
});
</script>
