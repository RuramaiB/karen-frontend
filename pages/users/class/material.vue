<template>
  <NuxtLayout name="user-layout">
    <div class="flex flex-col h-screen bg-gray-50">
      <!-- Top navigation bar -->
      <div class="bg-white border-b border-gray-200">
        <div class="px-6 py-3 flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-800">Course Materials</h1>
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
            :to="`/users/class/${courseId}`" 
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="{
              'border-blue-500 text-blue-600': $route.path === `/users/class/${courseId}`,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': $route.path !== `/users/class/${courseId}`
            }"
          >
            Stream
          </NuxtLink>
          <NuxtLink 
            :to="`/users/class/material?courseId=${courseId}`" 
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
        <!-- Header section -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h2 class="font-semibold">Your work</h2>
          </div>
          <button class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
            New Material
          </button>
        </div>

        <!-- Materials list -->
        <div class="space-y-3">
          <div v-if="loading" class="space-y-4">
            <div v-for="n in 5" :key="n" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-24 animate-pulse"></div>
          </div>
          
          <div v-else v-for="(item, index) in material" :key="index" 
               class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
            <div class="p-4 cursor-pointer" @click="toggleCollapse(index)">
              <div class="flex items-start">
                <div class="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-medium text-gray-900">{{ item.title }}</h3>
                      <p class="text-sm text-gray-500 mt-1">{{ item.createdAt }}</p>
                    </div>
                    <button class="text-gray-400 hover:text-gray-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Expanded content -->
            <div v-if="item.isOpen" class="border-t border-gray-100 p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                  <div class="flex">
                    <div class="w-24 h-24 bg-gray-100 flex items-center justify-center">
                      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div class="p-3 flex-1">
                      <h4 class="font-medium text-gray-900 hover:text-blue-600 truncate">{{item.attachments.name}}</h4>
                      <p class="text-sm text-gray-500">{{ item.attachments.type }}</p>
                      <div class="mt-2 flex items-center text-sm text-gray-500">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Download
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="p-3 bg-gray-50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p class="text-sm text-gray-600">{{ item.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue';
const material = ref([])
const email = ref(null)
email.value = localStorage.getItem("Email")
const loading = ref(true)
const token = localStorage.getItem("Token")
import { useRoute } from 'vue-router';

const route = useRoute();
const courseId = route.query.courseId;

const toggleCollapse = (index) => {
  material.value[index].isOpen = !material.value[index].isOpen;
};

const getMaterial = async (cm) => {
  loading.value = true
  const { data } = await useFetch(`http://localhost:7210/material/get-all-material-by-/${cm}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  material.value = data.value
  loading.value = false
}

onMounted(() => {
  console.log("Retrieved course ID:", courseId)
  getMaterial(courseId)
})
</script>

<style>
/* Custom styles */
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.router-link-active {
  border-bottom-color: #3b82f6;
  color: #2563eb;
}
</style>