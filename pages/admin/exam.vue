<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Top Actions -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Exam Builder</h1>
        <div class="flex space-x-3">
          <button
            @click="togglePreview"
            class="flex items-center space-x-1 px-4 py-2 rounded-md transition-colors"
            :class="isPreview ? 'bg-[#464775] text-white hover:bg-[#5c5c8a]' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ isPreview ? 'Edit Exam' : 'Preview' }}</span>
          </button>
          <button
            v-if="!isPreview"
            @click="saveForm"
            class="flex items-center space-x-1 px-4 py-2 bg-[#464775] text-white rounded-md hover:bg-[#5c5c8a] transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Save Exam</span>
          </button>
        </div>
      </div>

      <!-- Edit Mode -->
      <template v-if="!isPreview">
        <!-- Exam Header -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="space-y-6">
            <div>
              <input
                type="text"
                v-model="currentForm.title"
                class="text-2xl font-semibold w-full focus:outline-none focus:border-b-2 focus:border-[#464775] pb-1"
                placeholder="Exam title"
              />
              <input
                type="text"
                v-model="currentForm.description"
                class="text-gray-600 w-full focus:outline-none focus:border-b-2 focus:border-[#464775] pb-1 mt-2"
                placeholder="Exam description"
              />
            </div>
            
            <!-- Exam Settings -->
            <div class="border-t border-gray-100 pt-4">
              <h3 class="text-lg font-medium text-gray-800 mb-4">Exam Settings</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    v-model="currentForm.settings.duration"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#464775] focus:ring focus:ring-[#464775]/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    v-model="currentForm.settings.startTime"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#464775] focus:ring focus:ring-[#464775]/50"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <select 
                    v-model="selectedCourse" 
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#464775] focus:ring focus:ring-[#464775]/50"
                  >
                    <option disabled value="">Select a course</option>
                    <option v-for="course in courses" :key="course.id" :value="course.courseID">
                      {{ course.courseName }} ({{ course.courseCode }})
                    </option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Proctoring Settings</label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="currentForm.settings.proctoring.webcam"
                        class="rounded text-[#464775] focus:ring-[#464775]"
                      />
                      <span class="ml-2 text-sm text-gray-700">Require webcam monitoring</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions Container -->
        <div class="space-y-4">
          <div 
            v-for="(question, index) in currentForm.questions" 
            :key="index" 
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-[#464775]/50 transition-colors"
          >
            <div class="flex items-start space-x-4">
              <div class="flex-grow">
                <div class="flex items-center mb-1">
                  <span class="text-sm font-medium text-gray-500 mr-2">Q{{ index + 1 }}</span>
                  <input
                    type="text"
                    v-model="question.title"
                    class="text-base w-full focus:outline-none focus:border-b-2 focus:border-[#464775] pb-1"
                    placeholder="Question text"
                  />
                </div>
                
                <!-- Multiple Choice Options -->
                <div v-if="question.type === 'multiple_choice'" class="space-y-3 mt-4">
                  <div 
                    v-for="(option, optionIndex) in question.options" 
                    :key="optionIndex" 
                    class="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      :name="'question-' + index"
                      disabled
                      class="text-[#464775] focus:ring-[#464775]"
                    />
                    <input
                      type="text"
                      v-model="option.text"
                      class="flex-grow focus:outline-none focus:border-b-2 focus:border-[#464775] pb-1"
                      placeholder="Option"
                    />
                    <button 
                      @click="removeOption(question, optionIndex)"
                      class="text-gray-400 hover:text-red-500 p-1"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                  <button
                    @click="addOption(question)"
                    class="text-sm text-[#464775] hover:text-[#5c5c8a] mt-2 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
                    </svg>
                    Add option
                  </button>
                </div>

                <!-- Short Answer Input -->
                <div v-if="question.type === 'short_answer'" class="mt-4">
                  <div class="border-b border-gray-300 py-2">
                    <span class="text-gray-400 text-sm">Short answer text</span>
                  </div>
                </div>

                <!-- Paragraph Input -->
                <div v-if="question.type === 'paragraph'" class="mt-4">
                  <div class="border-b border-gray-300 py-4">
                    <span class="text-gray-400 text-sm">Long answer text</span>
                  </div>
                </div>
              </div>

              <!-- Question Type Selector -->
              <div class="flex-shrink-0">
                <select
                  v-model="question.type"
                  class="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:border-[#464775] focus:ring focus:ring-[#464775]/50"
                >
                  <option value="multiple_choice">Multiple choice</option>
                  <option value="short_answer">Short answer</option>
                  <option value="paragraph">Paragraph</option>
                </select>
              </div>
            </div>
            
            <!-- Question Actions -->
            <div class="flex justify-end mt-4 space-x-3">
              <button 
                @click="removeQuestion(index)"
                class="text-sm text-red-500 hover:text-red-700 flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Add Question Button -->
        <button
          @click="addQuestion"
          class="mt-6 w-full flex items-center justify-center space-x-2 bg-white border border-dashed border-gray-300 rounded-lg p-4 hover:border-[#464775] hover:bg-[#464775]/5 transition-colors"
        >
          <svg class="w-5 h-5 text-[#464775]" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-[#464775] font-medium">Add question</span>
        </button>
      </template>

      <!-- Preview Mode -->
      <template v-else>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 class="text-2xl font-semibold text-gray-800 mb-2">{{ currentForm.title || 'Exam Preview' }}</h1>
          <p class="text-gray-600">{{ currentForm.description || 'No description provided' }}</p>
          <div class="mt-4 text-sm text-gray-500 space-y-1">
            <p class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
              Duration: {{ currentForm.settings.duration }} minutes
            </p>
            <p class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
              </svg>
              Start Time: {{ formatDate(currentForm.settings.startTime) }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div 
            v-for="(question, index) in displayedQuestions" 
            :key="index" 
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <p class="text-lg font-medium text-gray-800 mb-4">
              Q{{ currentPage * questionsPerPage + index + 1 }}. {{ question.title || 'Untitled question' }}
            </p>

            <!-- Multiple Choice Preview -->
            <div v-if="question.type === 'multiple_choice'" class="space-y-3">
              <div 
                v-for="(option, optionIndex) in question.options" 
                :key="optionIndex" 
                class="flex items-center space-x-3"
              >
                <input
                  type="radio"
                  :name="'preview-question-' + index"
                  v-model="answers[currentPage * questionsPerPage + index]"
                  :value="optionIndex"
                  class="text-[#464775] focus:ring-[#464775]"
                />
                <span class="text-gray-700">{{ option.text || 'Option ' + (optionIndex + 1) }}</span>
              </div>
            </div>

            <!-- Short Answer Preview -->
            <div v-if="question.type === 'short_answer'" class="mt-2">
              <input
                type="text"
                v-model="answers[currentPage * questionsPerPage + index]"
                class="w-full border-b border-gray-300 focus:outline-none focus:border-[#464775] py-2"
                placeholder="Your answer"
              />
            </div>

            <!-- Paragraph Preview -->
            <div v-if="question.type === 'paragraph'" class="mt-2">
              <textarea
                v-model="answers[currentPage * questionsPerPage + index]"
                rows="4"
                class="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-[#464775] focus:ring focus:ring-[#464775]/50"
                placeholder="Your answer"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-between items-center">
          <button
            @click="previousPage"
            :disabled="currentPage === 0"
            class="flex items-center space-x-1 px-4 py-2 rounded-md transition-colors"
            :class="currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Previous</span>
          </button>
          <span class="text-sm text-gray-600">
            Page {{ currentPage + 1 }} of {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage >= totalPages - 1"
            class="flex items-center space-x-1 px-4 py-2 rounded-md transition-colors"
            :class="currentPage >= totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
          >
            <span>Next</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>

        <!-- Submit Button -->
        <button
          v-if="currentPage === totalPages - 1"
          @click="submitForm"
          class="mt-6 w-full flex items-center justify-center space-x-2 bg-[#464775] text-white rounded-lg p-4 hover:bg-[#5c5c8a] transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="font-medium">Submit Exam</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const loading = ref(false)
const token = localStorage.getItem("Token")
const email = localStorage.getItem("Email")
const router = useRouter()
const selectedCourse = ref(null)
const courses = ref([])
const isPreview = ref(false)
const forms = useState('forms', () => [])
const answers = ref({})
const currentPage = ref(0)
const questionsPerPage = 5
const nguva = ref(null)

const emptyForm = {
  title: '',
  description: '',
  settings: {
    duration: 60,
    startTime: nguva.value,
    proctoring: {
      webcam: false,
      screenShare: false
    }
  },
  questions: [
    {
      title: '',
      type: 'multiple_choice',
      options: [
        { text: '' },
        { text: '' }
      ]
    }
  ]
}

const currentForm = ref({ ...emptyForm })

const formatDate = (date) => {
  if (!date) return 'Not set'
  return new Date(date).toLocaleString()
}

const addQuestion = () => {
  currentForm.value.questions.push({
    title: '',
    type: 'multiple_choice',
    options: [{ text: '' }, { text: '' }]
  })
}

const removeQuestion = (index) => {
  currentForm.value.questions.splice(index, 1)
}

const addOption = (question) => {
  question.options.push({ text: '' })
}

const removeOption = (question, index) => {
  if (question.options.length > 1) {
    question.options.splice(index, 1)
  }
}

const togglePreview = () => {
  isPreview.value = !isPreview.value
  if (isPreview.value) {
    answers.value = {}
    currentPage.value = 0
  }
}

const saveForm = async () => {
  if (!selectedCourse.value) {
    alert('Please select a course for this exam')
    return
  }

  const testId = `test-${Date.now()}`
  const formToSave = { ...currentForm.value, testId }

  try {
    loading.value = true
    // Send the exam data to the backend
    const response = await fetch('http://localhost:7210/exams/add-new-exam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        examTitle: formToSave.title,
        examDescription: formToSave.description,
        dueDate: formToSave.settings.startTime,
        courseID: selectedCourse.value,
        questions: formToSave.questions,
        startTime: formToSave.settings.startTime,
        duration: formToSave.settings.duration,
        proctoringSettings: formToSave.settings.proctoring
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save exam');
    }

    const data = await response.json();
    console.log('Exam saved successfully:', data);
    alert('Exam saved successfully!');
    navigateTo('/admin/exams/');
  } catch (error) {
    console.error('Error saving exam:', error);
    alert('Failed to save exam. Please try again.');
  } finally {
    loading.value = false
  }
}

const getCourses = async() => {
  loading.value = true
  const { data } = await useFetch(`http://localhost:7210/courses/get-all-courses-by-lecturer-/${email}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  courses.value = data.value
  loading.value = false
}

const submitForm = () => {
  console.log('Submitted answers:', answers.value)
  alert('Exam submitted successfully!')
  answers.value = {}
  currentPage.value = 0
}

// Pagination
const totalPages = computed(() => Math.ceil(currentForm.value.questions.length / questionsPerPage))

const displayedQuestions = computed(() => {
  const start = currentPage.value * questionsPerPage
  return currentForm.value.questions.slice(start, start + questionsPerPage)
})

const previousPage = () => {
  if (currentPage.value > 0) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) currentPage.value++
}

onMounted(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  nguva.value = `${year}-${month}-${day}T${hours}:${minutes}`
  getCourses()
})
</script>

<style scoped>
input::placeholder {
  color: #9CA3AF;
  opacity: 1;
}

textarea::placeholder {
  color: #9CA3AF;
  opacity: 1;
}
</style>