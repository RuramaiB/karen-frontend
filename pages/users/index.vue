<template>
  <NuxtLayout name="user-layout">
    <div class="h-full bg-white flex flex-col">
      <!-- Top Bar: Teams Header -->
      <div class="flex justify-between items-center px-8 py-4 border-b border-gray-200 shrink-0">
        <h1 class="text-xl font-bold text-[#242424]">Teams</h1>
        <div class="flex items-center space-x-3">
          <button @click="joinClassModal" class="flex items-center space-x-2 bg-[#464EB8] hover:bg-[#3d44a2] text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span>Join or create team</span>
          </button>
          <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content: Card Grid -->
      <div class="flex-1 overflow-y-auto p-8 bg-[#F5F5F5]">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-lg border border-gray-200 h-[240px] animate-pulse">
            <div class="h-32 bg-gray-100 rounded-t-lg"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-100 rounded w-3/4"></div>
              <div class="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="course in courses" :key="course.courseID" class="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col h-[240px]">
             <!-- Card Content Wrap -->
            <NuxtLink :to="`/users/class/${course.courseID}`" class="flex-1 flex flex-col">
              <!-- Top Image/Color Section -->
              <div class="h-32 w-full flex items-center justify-center relative overflow-hidden shrink-0" :style="{ backgroundColor: getCourseColor(course.courseCode) }">
                <!-- Abstract Design Overlay -->
                <div class="absolute inset-0 opacity-20 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0 L100 100 Z" fill="white" />
                  </svg>
                </div>
                
                <div class="z-10 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg">
                  <div class="w-16 h-16 bg-white/95 rounded-lg flex items-center justify-center text-[#242424] font-bold text-2xl shadow-sm">
                    {{ course.courseCode.substring(0, 2) }}
                  </div>
                </div>

                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <!-- Content Section -->
              <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-bold text-[#242424] text-sm line-clamp-2 leading-snug mb-1 group-hover:text-[#464EB8] transition-colors">
                    {{ course.courseName }}
                  </h3>
                  <div class="text-[11px] text-[#616161] font-medium uppercase tracking-tight">{{ course.courseCode }}</div>
                </div>
                
                <div class="flex items-center mt-2 group-hover:translate-x-1 transition-transform">
                  <div class="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-[10px] font-bold text-gray-500 mr-2">
                    {{ course.lecturer.firstname[0] }}
                  </div>
                  <span class="text-xs text-[#616161] truncate">{{ course.lecturer.firstname }} {{ course.lecturer.lastname }}</span>
                </div>
              </div>
            </NuxtLink>

            <!-- More Options Toolbar (Absolute positioned) -->
            <button class="absolute top-2 right-2 p-1 text-white hover:bg-white/20 rounded transition-colors z-20 opacity-0 group-hover:opacity-100">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>

          <!-- "Join or Create" placeholder card at the end -->
          <div @click="joinClassModal" class="bg-white rounded-lg border border-dashed border-gray-300 h-[240px] flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#464EB8] hover:text-[#464EB8] transition-all cursor-pointer group">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#464EB8]/10">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <span class="text-sm font-semibold">Join or create team</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const email = ref(null)
const loading = ref(true)
const token = ref(null)
const courses = ref([])

// MS Teams brand colors for cards
const teamsColors = [
    '#5C5C5C', // Charcoal
    '#464EB8', // Teams Purple
    '#20AB3B', // Green
    '#D83B01', // Orange
    '#0078D4', // Blue
    '#008272', // Teal
    '#7E7E7E', // Gray
    '#C43E1C', // Brick
    '#B4009E', // Magenta
];

const getCourseColor = (courseCode) => {
  const hash = courseCode.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return teamsColors[hash % teamsColors.length];
};

const getCourses = async() => {
  loading.value = true
  try {
    const { data } = await useFetch(`http://localhost:7210/courses/get-all-courses-by-/${email.value}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      }
    })
    courses.value = data.value || []
  } catch (err) {
    console.error("Error fetching courses:", err)
  } finally {
    loading.value = false
  }
}

const joinClassModal = () => {
  // Logic from layout or parent to open modal
  // For now we'll just alert
  alert("Join class functionality coming soon!")
}

onMounted(() => {
  email.value = localStorage.getItem("Email")
  token.value = localStorage.getItem("Token")
  if (email.value) {
    getCourses()
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* MS Teams standard font weights and shadows */
h3 {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}
</style>

<style>
/* Custom styles */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>