<template>
  <NuxtLayout name="admin-layout">
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">My Courses</h1>
        <div class="flex space-x-3">
          <button 
            @click="refreshCourses"
            class="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Refresh"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
          <button 
            @click="addCourse"
            class="flex items-center space-x-1 bg-[#464775] text-white px-4 py-2 rounded-md hover:bg-[#5c5c8a] transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
            </svg>
            <span>New Course</span>
          </button>
        </div>
      </div>

      <!-- Courses Grid -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#464775]"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Course Cards -->
        <div v-for="course in courses" :key="course.courseID" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <NuxtLink :to="`/admin/class/${course.courseID}`" class="block h-full">
            <!-- Course Header -->
            <div class="h-32 bg-gradient-to-r from-[#464775] to-[#5c5c8a] relative p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-semibold text-white truncate">{{ course.courseCode }}</h3>
                  <p class="text-gray-200 text-sm mt-1 truncate">{{ course.courseName }}</p>
                </div>
                <button class="text-white hover:bg-white/10 p-1 rounded-full">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Lecturer Avatar -->
              <div class="absolute -bottom-6 right-4">
                <div class="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-white">
                  <span class="text-[#464775] font-bold text-xl">{{ course.lecturer.firstname[0] }}</span>
                </div>
              </div>
            </div>

            <!-- Course Details -->
            <div class="p-4 pt-8">
              <div class="flex items-center text-sm text-gray-600 mb-2">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                <span>{{ course.lecturer.firstname }} {{ course.lecturer.lastname }}</span>
              </div>
              
              <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <div class="flex space-x-3">
                  <button class="text-gray-500 hover:text-[#464775] p-1">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7.55 0c.14-.15.33-.25.55-.25s.41.1.55.25c.12.13.2.31.2.5 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.19.08-.37.2-.5zM19 5v10.79C16.52 14.37 13.23 14 12 14s-4.52.37-7 1.79V5h14zM5 19v-.77C6.74 16.66 10.32 16 12 16s5.26.66 7 2.23V19H5z"></path>
                    </svg>
                  </button>
                  <button class="text-gray-500 hover:text-[#464775] p-1">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"></path>
                    </svg>
                  </button>
                </div>
                <span class="text-xs text-gray-500">Last updated: Today</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-if="courses.length === 0" class="col-span-full text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No courses yet</h3>
          <p class="mt-1 text-gray-500">Get started by creating a new course.</p>
          <div class="mt-6">
            <button 
              @click="addCourse"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#464775] hover:bg-[#5c5c8a] focus:outline-none"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
              </svg>
              New Course
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const email = ref(null)
email.value = localStorage.getItem("Email")
const loading = ref(true)
const token = localStorage.getItem("Token")
const courses = ref([])

const getCourses = async() => {
  loading.value = true
  const { data } = await useFetch(`http://localhost:7210/courses/get-all-courses-by-lecturer-/${email.value}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  courses.value = data.value
  loading.value = false
}

const refreshCourses = () => {
  getCourses()
}

const addCourse = () => {
  // This would trigger the add course modal from your layout
  // You might need to emit an event or use a store to communicate with the layout
  console.log("Add course clicked")
}

onMounted(() => {
  getCourses()
})
</script>

<style scoped>
/* Custom transitions */
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: translateY(-2px);
}
</style>