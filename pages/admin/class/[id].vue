<template>
  <NuxtLayout name="admin-layout">
    <div class="bg-white border-b border-gray-200">
      <!-- Class Navigation -->
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex space-x-6">
          <NuxtLink 
            to="/admin/class/" 
            class="text-sm font-medium pb-2 border-b-2"
            :class="$route.path.includes('/admin/class/') && !$route.path.includes('material') ? 'border-[#464775] text-[#464775]' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            Stream
          </NuxtLink>
          <NuxtLink 
            :to="`/admin/class/material?courseId=${courseID}`"
            class="text-sm font-medium pb-2 border-b-2"
            :class="$route.path.includes('material') ? 'border-[#464775] text-[#464775]' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            Material
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 min-h-screen p-6">
      <!-- Course Header -->
      <div class="max-w-4xl mx-auto">
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6 animate-pulse h-40"></div>
        <div v-else class="relative rounded-lg overflow-hidden bg-gradient-to-r from-[#464775] to-[#5c5c8a] h-40 flex items-end p-6">
          <div class="text-white">
            <h1 class="text-2xl font-bold">{{courseData.courseCode}} - {{courseData.courseName}}</h1>
            <p class="text-[#464775]/90">{{courseData.courseDescription}}</p>
          </div>
        </div>

        <!-- Stream Content -->
        <div class="mt-6 space-y-4 max-w-4xl mx-auto">
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-sm p-6 animate-pulse h-24"></div>
          </div>
          
          <div v-else-if="streams.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No content yet</h3>
            <p class="mt-1 text-gray-500">Get started by adding new content to this class.</p>
          </div>

          <div v-else v-for="stream in streams" :key="stream.contentID" class="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#464775]/50 transition-colors overflow-hidden">
            <NuxtLink :to="`/admin/class/${stream.streamType}/${stream.contentID}`" class="block">
              <div class="p-6">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 bg-[#464775]/10 p-3 rounded-lg">
                    <svg class="h-6 w-6 text-[#464775]" viewBox="0 0 256 256" fill="currentColor">
                      <rect width="256" height="256" fill="none"/>
                      <line x1="96" y1="152" x2="160" y2="152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                      <line x1="96" y1="120" x2="160" y2="120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                      <path d="M160,40h40a8,8,0,0,1,8,8V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                      <path d="M88,72V64a40,40,0,0,1,80,0v8Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-gray-900">{{stream.streamTitle}}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{stream.streamDate}}</p>
                  </div>
                  <div class="flex-shrink-0 text-gray-400 hover:text-gray-500">
                    <svg class="h-5 w-5" viewBox="0 0 128 512">
                      <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            </NuxtLink>
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
const props = defineProps({
  courseId: String,
});

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

<style scoped>
/* Custom transition for hover effects */
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: translateY(-2px);
}
</style>