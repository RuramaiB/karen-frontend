<template>
  <NuxtLayout name="user-layout">
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header section -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">My Courses</h1>
        <!-- <button class="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Join Class</span>
        </button> -->
      </div>

      <!-- Courses grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Course Card 1 -->
        <NuxtLink 
          to="/users/class/" 
          class="group block h-full rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden"
        >
          <div class="h-32 relative bg-gradient-to-r from-blue-600 to-blue-800">
            <div class="absolute top-4 left-4 right-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-semibold text-white line-clamp-1">ICS 4103</h3>
                  <p class="text-sm text-white/90 mt-1 line-clamp-1">Parallel and Distributed Systems</p>
                </div>
                <button class="text-white/80 hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                  </svg>
                </button>
              </div>
              <p class="text-sm text-white/90 mt-2">Mr Mafirabadza</p>
            </div>
            
            <!-- Lecturer avatar -->
            <div class="absolute -bottom-6 right-4">
              <div class="h-12 w-12 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm">
                <span class="text-lg font-medium text-blue-600">C</span>
              </div>
            </div>
          </div>

          <!-- Course footer -->
          <div class="p-4 pt-8">
            <div class="flex items-center justify-end space-x-2">
              <button class="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </button>
              <button class="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </NuxtLink>

        <!-- Course Card 2 -->
        <div class="group block h-full rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden">
          <div class="h-32 relative bg-gradient-to-r from-purple-600 to-purple-800">
            <div class="absolute top-4 left-4 right-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-semibold text-white line-clamp-1">ICS 4103</h3>
                  <p class="text-sm text-white/90 mt-1 line-clamp-1">Parallel and Distributed Systems</p>
                </div>
                <button class="text-white/80 hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                  </svg>
                </button>
              </div>
              <p class="text-sm text-white/90 mt-2">Mr Mafirabadza</p>
            </div>
            
            <div class="absolute -bottom-6 right-4">
              <div class="h-12 w-12 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm">
                <span class="text-lg font-medium text-purple-600">C</span>
              </div>
            </div>
          </div>

          <div class="p-4 pt-8">
            <div class="flex items-center justify-end space-x-2">
              <button class="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </button>
              <button class="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Add new course card -->
        <!-- <div 
          class="h-full rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center"
          @click="showNewCourseModal"
        >
          <div class="text-center p-6">
            <svg class="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-700">Add new course</h3>
          </div>
        </div> -->
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const showNewCourseModal = () => {
  // Implement modal logic here
  console.log("Show new course modal");
}
</script>

<style>
/* Custom styles */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>