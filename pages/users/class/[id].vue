<template>
  <NuxtLayout name="user-layout">
    <div class="flex flex-col h-screen bg-gray-50">
      <!-- Top navigation bar -->
      <div class="bg-white border-b border-gray-200">
        <div class="px-6 py-3 flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-800" v-if="!loading">
            {{courseData.courseCode}} - {{courseData.courseName}}
          </h1>
          <div v-else class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          
          <div class="flex items-center space-x-4">
            <button class="p-2 rounded-full hover:bg-gray-100">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <button class="p-2 rounded-full hover:bg-gray-100">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Horizontal navigation tabs -->
        <nav class="flex border-b border-gray-200">
          <NuxtLink 
            :to="`/users/class/${courseID}`" 
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="{
              'border-blue-500 text-blue-600': $route.path === `/users/class/${courseID}`,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': $route.path !== `/users/class/${courseID}`
            }"
          >
            Stream
          </NuxtLink>
          <NuxtLink 
            :to="`/users/class/material?courseId=${courseID}`" 
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="{
              'border-blue-500 text-blue-600': $route.path.includes('/material'),
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': !$route.path.includes('/material')
            }"
          >
            Material
          </NuxtLink>
        </nav>
      </div>

      <!-- Content area -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <!-- Course banner -->
        <div class="relative w-full h-48 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg mb-8 overflow-hidden">
          <div class="absolute bottom-0 left-0 p-6">
            <h2 v-if="!loading" class="text-2xl font-bold text-white">{{courseData.courseCode}} - {{courseData.courseName}}</h2>
            <div v-else class="h-8 w-64 bg-blue-500 rounded animate-pulse mb-2"></div>
            <p v-if="!loading" class="text-blue-100">{{courseData.courseDescription}}</p>
            <div v-else class="h-4 w-80 bg-blue-400 rounded animate-pulse"></div>
          </div>
        </div>

        <!-- Stream items -->
        <div class="space-y-4">
          <div v-if="loading" class="space-y-4">
            <div v-for="n in 3" :key="n" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-24 animate-pulse"></div>
          </div>
          <div v-else v-for="stream in streams" :key="stream.contentID" class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="block p-4">
              <div class="flex items-start">
                <div class="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between">
                    <h3 class="font-medium text-gray-900">{{stream.streamTitle}}</h3>
                    <div class="flex space-x-2">
                      <NuxtLink 
                        v-if="stream.streamType === 'exam'"
                        :to="`/users/exams/${stream.contentID}`"
                        class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Start Exam
                      </NuxtLink>
                      <button class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{stream.streamDate}}</p>
                  <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{stream.streamDescription}}</p>
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
import { useRoute } from "vue-router";
const email = ref(null)
email.value = localStorage.getItem("Email")
const loading = ref(true)
const token = localStorage.getItem("Token")
const courseData = ref(null)
const streams = ref([])
const route = useRoute();
const courseID = route.params.id

const getCourse = async() => {
  loading.value = true
  const { data } = await useFetch(`http://localhost:7210/courses/get-course-by-/${courseID}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  courseData.value = data.value.course
  loading.value = false
}

const getStream = async() => {
  loading.value = true
  const { data } = await useFetch(`http://localhost:7210/stream/get-all-streams-by-/${courseID}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  streams.value = data.value.content
  loading.value = false
}

onMounted(() => {
  getCourse()
  getStream()
})
</script>

<style>
/* Custom styles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Active tab indicator */
.router-link-active {
  border-bottom-color: #3b82f6;
  color: #2563eb;
}
</style>