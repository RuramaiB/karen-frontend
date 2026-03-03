<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Top Actions -->
      <div class="flex justify-end mb-4 space-x-4">
        <button
          @click="togglePreview"
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          {{ isPreview ? 'Edit Form' : 'Preview' }}
        </button>
        <button
          v-if="!isPreview"
          @click="saveForm"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Form
        </button>
      </div>

      <!-- Edit Mode -->
      <template v-if="!isPreview">
        <!-- Form Header -->
        <div class="bg-white rounded-t-lg border-t-8 border-purple-600 p-6 mb-2">
          <div class="space-y-4">
            <input
              type="text"
              v-model="currentForm.title"
              class="text-3xl font-medium w-full focus:outline-none focus:border-b-2 focus:border-purple-600"
              placeholder="Untitled form"
            />
            <input
              type="text"
              v-model="currentForm.description"
              class="text-base w-full focus:outline-none focus:border-b-2 focus:border-purple-600"
              placeholder="Form description"
            />
          </div>
        </div>

        <!-- Questions Container -->
        <div class="space-y-2">
          <div v-for="(question, index) in currentForm.questions" :key="index" class="bg-white rounded-lg p-6">
            <div class="flex items-start space-x-4">
              <div class="flex-grow">
                <input
                  type="text"
                  v-model="question.title"
                  class="text-base w-full mb-4 focus:outline-none focus:border-b-2 focus:border-purple-600"
                  placeholder="Question"
                />
                
                <!-- Multiple Choice Options -->
                <div v-if="question.type === 'multiple_choice'" class="space-y-2">
                  <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center space-x-2">
                    <input
                      type="radio"
                      :name="'question-' + index"
                      disabled
                      class="text-purple-600"
                    />
                    <input
                      type="text"
                      v-model="option.text"
                      class="flex-grow focus:outline-none focus:border-b-2 focus:border-purple-600"
                      placeholder="Option"
                    />
                  </div>
                  <button
                    @click="addOption(question)"
                    class="text-gray-600 hover:text-purple-600 text-sm mt-2"
                  >
                    Add option
                  </button>
                </div>

                <!-- Short Answer Input -->
                <div v-if="question.type === 'short_answer'" class="border-b border-gray-300 py-2">
                  <span class="text-gray-400">Short answer text</span>
                </div>

                <!-- Paragraph Input -->
                <div v-if="question.type === 'paragraph'" class="border-b border-gray-300 py-4">
                  <span class="text-gray-400">Long answer text</span>
                </div>
              </div>

              <!-- Question Type Selector -->
              <select
                v-model="question.type"
                class="bg-white border rounded-md px-2 py-1 text-sm"
              >
                <option value="multiple_choice">Multiple choice</option>
                <option value="short_answer">Short answer</option>
                <option value="paragraph">Paragraph</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Add Question Button -->
        <button
          @click="addQuestion"
          class="mt-4 bg-white rounded-lg p-4 w-full hover:bg-gray-50 flex items-center justify-center"
        >
          <span class="text-purple-600">Add question</span>
        </button>
      </template>

      <!-- Preview Mode -->
      <template v-else>
        <div class="bg-white rounded-lg p-6 mb-4">
          <h1 class="text-3xl font-medium mb-2">{{ currentForm.title }}</h1>
          <p class="text-gray-600">{{ currentForm.description }}</p>
        </div>

        <div class="space-y-4">
          <div v-for="(question, index) in currentForm.questions" :key="index" class="bg-white rounded-lg p-6">
            <p class="text-lg font-medium mb-4">{{ question.title }}</p>

            <!-- Multiple Choice Preview -->
            <div v-if="question.type === 'multiple_choice'" class="space-y-2">
              <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center space-x-2">
                <input
                  type="radio"
                  :name="'preview-question-' + index"
                  v-model="answers[index]"
                  :value="optionIndex"
                  class="text-purple-600"
                />
                <span>{{ option.text }}</span>
              </div>
            </div>

            <!-- Short Answer Preview -->
            <div v-if="question.type === 'short_answer'">
              <input
                type="text"
                v-model="answers[index]"
                class="w-full border-b border-gray-300 focus:outline-none focus:border-purple-600 py-2"
                placeholder="Your answer"
              />
            </div>

            <!-- Paragraph Preview -->
            <div v-if="question.type === 'paragraph'">
              <textarea
                v-model="answers[index]"
                rows="4"
                class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
                placeholder="Your answer"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          @click="submitForm"
          class="mt-4 bg-purple-600 text-white rounded-lg p-4 w-full hover:bg-purple-700"
        >
          Submit
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
const isPreview = ref(false)
const forms = ref([])
const answers = ref({})

const emptyForm = {
  title: 'Untitled form',
  description: '',
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

const addQuestion = () => {
  currentForm.value.questions.push({
    title: '',
    type: 'multiple_choice',
    options: [
      { text: '' },
      { text: '' }
    ]
  })
}

const addOption = (question) => {
  question.options.push({ text: '' })
}

const togglePreview = () => {
  isPreview.value = !isPreview.value
  if (isPreview.value) {
    answers.value = {}
  }
}

const saveForm = () => {
  const formToSave = JSON.parse(JSON.stringify(currentForm.value))
  forms.value.push(formToSave)
  currentForm.value = { ...emptyForm }
  alert('Form saved successfully!')
}

const submitForm = () => {
  console.log('Submitted answers:', answers.value)
  alert('Form submitted successfully!')
  answers.value = {}
}
</script>

<style>
input::placeholder {
  color: #9CA3AF;
}
</style>