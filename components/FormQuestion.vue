<template>
    <div class="mt-6">
      <!-- Question Input -->
      <input
        type="text"
        v-model="question.question"
        placeholder="Question"
        class="w-full text-lg font-medium border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
      />
  
      <!-- Options -->
      <div v-if="question.type === 'multiple-choice'" class="mt-4 space-y-2">
        <div v-for="(option, index) in question.options" :key="index" class="flex items-center">
          <input
            type="text"
            v-model="question.options[index]"
            placeholder="Option"
            class="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button @click="removeOption(index)" class="ml-2 text-red-500 hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <button @click="addOption" class="mt-2 text-blue-500 hover:text-blue-600">
          Add Option
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    question: {
      type: Object,
      required: true,
    },
  });
  
  const addOption = () => {
    props.question.options.push("Option " + (props.question.options.length + 1));
  };
  
  const removeOption = (index) => {
    props.question.options.splice(index, 1);
  };
  </script>