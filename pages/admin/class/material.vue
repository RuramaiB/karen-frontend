<template>
  <NuxtLayout name="admin-layout">
    <div class="flex h-screen bg-gray-50">

      <!-- Main content area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        
        <!-- Top header -->
        <div class="bg-white border-b border-gray-200 px-6 py-5 w-full flex  justify-between">
          <div class="flex items-center justify-between">
        <div class="flex space-x-6">
          <NuxtLink 
            :to="`/admin/class/${courseId}`"
            class="text-sm font-medium pb-2 border-b-2"
            :class="$route.path.includes('/admin/class/') && !$route.path.includes('material') ? 'border-[#464775] text-[#464775]' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            Stream
          </NuxtLink>
          <NuxtLink 
            :to="`/admin/class/material?courseId=${courseId}`" 
            class="text-sm font-medium pb-2 border-b-2"
            :class="$route.path.includes('material') ? 'border-[#464775] text-[#464775]' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            Material
          </NuxtLink>
        </div>
      </div>
        </div>

        <!-- Content area -->
        <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div class="max-w-4xl mx-auto">
            <!-- Assignment list header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h2 class="text-lg font-semibold text-blue-600">Your work</h2>
              </div>
              <div class="flex items-center space-x-2">
                <button class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md">New</button>
                <button class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md">Filter</button>
              </div>
            </div>

            <!-- Assignment cards -->
            <div class="space-y-4">
              <div 
                v-for="(item, index) in material" 
                :key="index" 
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div 
                  class="p-4 cursor-pointer flex justify-between items-center"
                  @click="toggleCollapse(index)"
                >
                  <div class="flex items-center">
                    <div class="bg-blue-100 p-2 rounded-lg mr-4">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900">{{ item.title }}</h3>
                      <p class="text-sm text-gray-500">{{ item.createdAt }}</p>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <button class="p-1 rounded-full hover:bg-gray-100">
                      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Expanded content -->
                <div v-if="item.isOpen" class="px-4 pb-4 border-t border-gray-100">
                  <div class="mt-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                        <div class="flex">
                          <div class="w-24 h-24 bg-gray-100 flex items-center justify-center">
                            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                            </svg>
                          </div>
                          <div class="p-3 flex-1">
                            <h4 class="font-medium text-gray-900 truncate hover:text-blue-600">{{ item.attachments.name }}</h4>
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
                    
                    <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 class="text-sm font-medium text-gray-700 mb-2">Description</h4>
                      <p class="text-sm text-gray-600">{{ item.comment }}</p>
                    </div>
                  </div>
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
import { ref } from 'vue';
const material = ref([])
const email = ref(null)
email.value = localStorage.getItem("Email")
const loading = ref(true)
const token = localStorage.getItem("Token")
import { useRoute } from 'vue-router';

const route = useRoute();
const courseId = route.query.courseId;
const items = ref([
  {
    title: 'Test 2 with solutions',
    date: 'Posted Oct 28, 2025',
    previewImage: '/path/to/document/image.jpg',
    description: 'Details about Test 2 with solutions.',
    isOpen: false
  },
  {
    title: 'Course Work',
    date: 'Posted Oct 28, 2024',
    previewImage: '/assets/banner.jpg',
    description: 'Details about Course Work.',
    isOpen: false
  },
  {
    title: 'Study Guide',
    date: 'Posted Oct 28, 2024',
    previewImage: '/path/to/studyguide/image.jpg',
    description: 'Details about the Study Guide.',
    isOpen: false
  },
  {
    title: 'Unit 3 - Distributed File Systems (HDFS)',
    date: 'Posted Sep 11, 2024',
    previewImage: '/path/to/video/thumbnail.jpg',
    description: 'Details about Unit 3 - Distributed File Systems (HDFS).',
    isOpen: false
  },
  {
    title: 'Practical Assignment 1',
    date: 'Due Sep 13, 2024',
    previewImage: '/path/to/assignment/image.jpg',
    description: 'Details about Practical Assignment 1.',
    isOpen: false
  }
]);

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
/* Add any custom styles here */
</style>