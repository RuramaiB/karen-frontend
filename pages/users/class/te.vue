<template>
    <NuxtLayout name="class-layout" class="min-h-screen bg-gray-50 py-10">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Available Exams</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="exam in exams"
            :key="exam.id"
            class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all"
          >
            <h2 class="text-lg font-semibold text-gray-800">{{ exam.title }}</h2>
            <p class="text-gray-600 text-sm mt-2">{{ exam.description }}</p>
            <p class="text-gray-500 text-sm mt-1">Duration: {{ exam.duration }} minutes</p>
            <button
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              @click="startExam(exam.id)"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </template>
  
  <script setup>
  import { ref } from "#imports";
  import { useRouter } from "#imports";
  
  const router = useRouter();
  
  const exams = ref([
    {
      id: 1,
      title: "Math Fundamentals",
      description: "Test your basic math skills with this exam.",
      duration: 30, // duration in minutes
    },
    {
      id: 2,
      title: "Science Concepts",
      description: "Evaluate your understanding of core science concepts.",
      duration: 40,
    },
    {
      id: 3,
      title: "History Quiz",
      description: "A brief history test to gauge your knowledge.",
      duration: 20,
    },
  ]);
  
  const startExam = (examId) => {
    // Navigate to the exam page, passing the exam ID
    router.push(`/users/class/exam${examId}`);
  };
  </script>
  