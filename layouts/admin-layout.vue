<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- Top App Bar -->
    <div class="h-14 bg-[#464775] text-white flex items-center justify-between px-4 shadow-md">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <!-- App Icon -->
        <div class="flex items-center">
          <svg class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        
        <!-- Title -->
        <h1 class="text-xl font-bold">Microsoft Teams Learning Platform</h1>
        
        <!-- Navigation Tabs -->
      
      </div>
      
      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search" 
            class="bg-[#5c5c8a] text-white px-4 py-1 rounded-full w-64 focus:outline-none focus:ring-1 focus:ring-white placeholder-gray-300"
          >
          <svg class="h-5 w-5 absolute right-3 top-1.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        
        <!-- Add Button -->
        <div class="relative">
          <button @click="toggleOptions" class="p-1 rounded-full hover:bg-[#5c5c8a]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
            </svg>
          </button>
          <div v-if="optionsVisible" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <button @click="addCourseModal" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Add Course</button>
            <button @click="toggleUploadMaterial" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Upload material</button>
            <!-- <NuxtLink to="/admin/exam" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">New Exam</NuxtLink> -->
            <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
          </div>
        </div>
        
        <!-- Profile -->
        <div class="relative">
          <div @click="toggleDropdown" class="h-8 w-8 rounded-full bg-white flex items-center justify-center cursor-pointer">
            <span class="text-[#464775] font-bold">A</span>
          </div>
          <div v-if="dropdownVisible" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <NuxtLink to="/users/settings/" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">View Profile</NuxtLink>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <div :class="[
          isExpanded ? 'w-60' : 'w-16',
          'h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col'
        ]">
        <!-- Sidebar Header -->
        <div class="p-3 border-b border-gray-200 flex items-center justify-between">
          <span v-if="isExpanded" class="font-semibold text-gray-700">Menu</span>
          <button @click="toggleSidebar" class="p-1 rounded-full hover:bg-gray-100">
            <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        <!-- Sidebar Navigation -->
        <nav class="flex-1 overflow-y-auto">
          <ul class="space-y-1 p-2">
            <NuxtLink 
              to="/admin/" 
              class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              active-class="bg-[#e6e6fa] text-[#464775]"
            >
              <svg class="h-5 w-5" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.918 10.0005H7.082C6.66587 9.99708 6.26541 10.1591 5.96873 10.4509C5.67204 10.7427 5.50343 11.1404 5.5 11.5565V17.4455C5.5077 18.3117 6.21584 19.0078 7.082 19.0005H9.918C10.3341 19.004 10.7346 18.842 11.0313 18.5502C11.328 18.2584 11.4966 17.8607 11.5 17.4445V11.5565C11.4966 11.1404 11.328 10.7427 11.0313 10.4509C10.7346 10.1591 10.3341 9.99708 9.918 10.0005Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.918 4.0006H7.082C6.23326 3.97706 5.52559 4.64492 5.5 5.4936V6.5076C5.52559 7.35629 6.23326 8.02415 7.082 8.0006H9.918C10.7667 8.02415 11.4744 7.35629 11.5 6.5076V5.4936C11.4744 4.64492 10.7667 3.97706 9.918 4.0006Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.082 13.0007H17.917C18.3333 13.0044 18.734 12.8425 19.0309 12.5507C19.3278 12.2588 19.4966 11.861 19.5 11.4447V5.55666C19.4966 5.14054 19.328 4.74282 19.0313 4.45101C18.7346 4.1592 18.3341 3.9972 17.918 4.00066H15.082C14.6659 3.9972 14.2654 4.1592 13.9687 4.45101C13.672 4.74282 13.5034 5.14054 13.5 5.55666V11.4447C13.5034 11.8608 13.672 12.2585 13.9687 12.5503C14.2654 12.8421 14.6659 13.0041 15.082 13.0007Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.082 19.0006H17.917C18.7661 19.0247 19.4744 18.3567 19.5 17.5076V16.4936C19.4744 15.6449 18.7667 14.9771 17.918 15.0006H15.082C14.2333 14.9771 13.5256 15.6449 13.5 16.4936V17.5066C13.525 18.3557 14.2329 19.0241 15.082 19.0006Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span v-if="isExpanded" class="ml-3">Dashboard</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/admin/exams" 
              class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              active-class="bg-[#e6e6fa] text-[#464775]"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 512 512">
                <path d="M0,0v512h402.002V0H0z M371.585,481.583H30.417V30.417h341.168V481.583z M474.744,41.496l-37.255,51.403v366.897H512V92.899L474.744,41.496z M467.906,102.763l6.838-9.435l6.839,9.435v275.917 h-13.677V102.763z M481.583,429.379h-13.677v-20.281h13.677V429.379z M138.145,78.557h125.704v30.417H138.145z M80.879,129.253h240.255v30.417H80.879z M80.879,179.958h240.255v30.417H80.879z M80.879,230.653h240.255v30.417H80.879z M80.879,352.332h240.255v30.417H80.879z M80.879,403.027h240.255v30.417H80.879z"/>
              </svg>
              <span v-if="isExpanded" class="ml-3">Exams</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/admin/scoreboard" 
              class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              active-class="bg-[#e6e6fa] text-[#464775]"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 481.825 481.825">
                <path d="M240.212,724.085L240.212,724.085c18,0,32.6-14.5,32.6-32.3s-14.6-32.3-32.6-32.3s-32.6,14.5-32.6,32.3 S222.212,724.085,240.212,724.085z M240.212,674.385c9.7,0,17.6,7.7,17.6,17.3c0,9.5-7.9,17.3-17.6,17.3s-17.6-7.7-17.6-17.3 C222.613,682.185,230.513,674.385,240.212,674.385z M290.413,724.185c4.1,0,7.5-3.4,7.5-7.5v-4.3l23.2,11c1,0.5,2.1,0.7,3.2,0.7c2.8,0,5.5-1.6,6.7-4c1.8-3.7,0.2-8.2-3.5-10 l-20.2-9.6l20.4-10.5c2.5-1.3,4.1-3.9,4.1-6.7v-16.2c0-4.1-3.4-7.5-7.5-7.5h-33.9c-4.1,0-7.5,3.4-7.5,7.5v33.5v16.1 C282.913,720.785,286.312,724.185,290.413,724.185z M297.913,674.385h18.9v4.1l-18.9,9.7V674.385z M180.613,723.685c4.3,0,8.6-0.9,12.6-3.1c3.7-1.8,5.2-6.3,3.4-10s-6.3-5.2-10-3.4c-6.3,3.1-13.8,1-18.2-5.1 c-0.1-0.2-0.3-0.3-0.4-0.5c-5.1-5.9-5.1-14.1,0-20c0.1-0.1,0.3-0.3,0.4-0.5c4.3-6.1,12.1-8.6,18.9-6.1c3.8,1.5,8.2-0.5,9.6-4.4 c1.5-3.8-0.5-8.2-4.4-9.6c-12.9-4.8-27.7-0.2-36.1,11.1c-9.7,11.4-9.7,27.7,0,39.1 C162.313,719.285,171.413,723.685,180.613,723.685z M383.413,674.485c4.1,0,7.5-3.4,7.5-7.5s-3.4-7.5-7.5-7.5h-33.9c-4.1,0-7.5,3.4-7.5,7.5v49.7c0,4.1,3.4,7.5,7.5,7.5h33.9 c4.1,0,7.5-3.4,7.5-7.5s-3.4-7.6-7.5-7.6v0h-26.4v-9.8h8.8c4.1,0,7.5-3.4,7.5-7.5s-3.4-7.5-7.5-7.5h-8.8v-9.8H383.413z M90.813,716.585c0,4.1,3.4,7.5,7.5,7.5h33.9c2.8,0,5.3-1.6,6.6-4c1.3-2.4,1.2-5.4-0.4-7.7l-25.9-38h19.7 c4.1,0,7.5-3.4,7.5-7.5s-3.4-7.5-7.5-7.5h-33.9c-2.7,0-5.3,1.5-6.6,4c-1.3,2.4-1.2,5.4,0.4,7.7l25.9,38h-19.7 C94.212,709.085,90.813,712.485,90.813,716.585z M90.813,972.485h300.1v-213.8h-300.1V972.485z M340.712,773.785h35.2v50.8h-35.2V773.785z M340.613,839.585h35.2v52.1 h-35.2V839.585z M340.613,906.685h35.2v50.8h-35.2V906.685z M290.413,773.685h35.2v50.8h-35.2V773.685z M290.413,839.585h35.2 v52.1h-35.2V839.585z M290.413,906.685h35.2v50.8h-35.2V906.685z M156.013,773.785h119.4v50.8h-119.4V773.785z M156.013,839.585 h119.4v52.1h-119.4V839.585z M156.013,906.685h119.4v50.8h-119.4V906.685z M105.813,773.685h35.2v50.8h-35.2V773.685z M105.813,839.585h35.2v52.1h-35.2V839.585z M105.813,906.685h35.2v50.8h-35.2V906.685z M323.712,593.485v-17.4h-35.1c-3.4-12.4-11.6-22.8-23.3-29.2c-14.9-8.7-34-8.7-48.8,0c-11.7,6.4-19.9,16.8-23.3,29.2 h-35.1v17.4h-108.7l1.3,428.7h381.7v-428.7H323.712z M223.613,560.085l0.3-0.2c10.3-6.1,23.5-6.1,33.8,0l0.3,0.2 c6.8,3.7,11.9,9.3,14.7,16h-63.8C211.812,569.385,216.913,563.685,223.613,560.085z M173.012,591.085h135.7v18.5h-135.7V591.085z M65.512,1007.185l-1.2-398.7h93.6v16.2h165.7v-16.2h93.6v398.7H65.512z"/>
              </svg>
              <span v-if="isExpanded" class="ml-3">Scoreboard</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/admin/reports" 
              class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              active-class="bg-[#e6e6fa] text-[#464775]"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path clip-rule="evenodd" d="m12 3.75c-4.55635 0-8.25 3.69365-8.25 8.25 0 4.5563 3.69365 8.25 8.25 8.25 4.5563 0 8.25-3.6937 8.25-8.25 0-4.55635-3.6937-8.25-8.25-8.25zm-9.75 8.25c0-5.38478 4.36522-9.75 9.75-9.75 5.3848 0 9.75 4.36522 9.75 9.75 0 5.3848-4.3652 9.75-9.75 9.75-5.38478 0-9.75-4.3652-9.75-9.75zm9.75-4.25c.4142 0 .75.33579.75.75v3.5c0 .4142-.3358.75-.75.75s-.75-.3358-.75-.75v-3.5c0-.41421.3358-.75.75-.75zm0 6.25c-.5523 0-1 .4477-1 1s.4477 1 1 1h.01c.5523 0 1-.4477 1-1s-.4477-1-1-1z" fill-rule="evenodd"></path>
              </svg>
              <span v-if="isExpanded" class="ml-3">Reports</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/admin/settings" 
              class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              active-class="bg-[#e6e6fa] text-[#464775]"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"></circle>
                <path d="M3.66122 10.6392C4.13377 10.9361 4.43782 11.4419 4.43782 11.9999C4.43781 12.558 4.13376 13.0638 3.66122 13.3607C3.33966 13.5627 3.13248 13.7242 2.98508 13.9163C2.66217 14.3372 2.51966 14.869 2.5889 15.3949C2.64082 15.7893 2.87379 16.1928 3.33973 16.9999C3.80568 17.8069 4.03865 18.2104 4.35426 18.4526C4.77508 18.7755 5.30694 18.918 5.83284 18.8488C6.07287 18.8172 6.31628 18.7185 6.65196 18.5411C7.14544 18.2803 7.73558 18.2699 8.21895 18.549C8.70227 18.8281 8.98827 19.3443 9.00912 19.902C9.02332 20.2815 9.05958 20.5417 9.15224 20.7654C9.35523 21.2554 9.74458 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8478 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.9021C15.0117 19.3443 15.2977 18.8281 15.7811 18.549C16.2644 18.27 16.8545 18.2804 17.3479 18.5412C17.6837 18.7186 17.9271 18.8173 18.1671 18.8489C18.693 18.9182 19.2249 18.7756 19.6457 18.4527C19.9613 18.2106 20.1943 17.807 20.6603 17C20.8677 16.6407 21.029 16.3614 21.1486 16.1272M20.3387 13.3608C19.8662 13.0639 19.5622 12.5581 19.5621 12.0001C19.5621 11.442 19.8662 10.9361 20.3387 10.6392C20.6603 10.4372 20.8674 10.2757 21.0148 10.0836C21.3377 9.66278 21.4802 9.13092 21.411 8.60502C21.3591 8.2106 21.1261 7.80708 20.6601 7.00005C20.1942 6.19301 19.9612 5.7895 19.6456 5.54732C19.2248 5.22441 18.6929 5.0819 18.167 5.15113C17.927 5.18274 17.6836 5.2814 17.3479 5.45883C16.8544 5.71964 16.2643 5.73004 15.781 5.45096C15.2977 5.1719 15.0117 4.6557 14.9909 4.09803C14.9767 3.71852 14.9404 3.45835 14.8478 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74458 2.35523 9.35523 2.74458 9.15224 3.23463C9.05958 3.45833 9.02332 3.71848 9.00912 4.09794C8.98826 4.65566 8.70225 5.17191 8.21891 5.45096C7.73557 5.73002 7.14548 5.71959 6.65205 5.4588C6.31633 5.28136 6.0729 5.18269 5.83285 5.15108C5.30695 5.08185 4.77509 5.22436 4.35427 5.54727C4.03866 5.78945 3.80569 6.19297 3.33974 7C3.13231 7.35929 2.97105 7.63859 2.85138 7.87273" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
              </svg>
              <span v-if="isExpanded" class="ml-3">Settings</span>
            </NuxtLink>
          </ul>
        </nav>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <slot />
      </div>
    </div>
  </div>
  
  <!-- Modals -->
  <div v-if="createCourse" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Create Class</h2>
        <input
          type="text"
          v-model="courseName"
          placeholder="Enter course Name"
          class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#464775]"
        />
        <input
          type="text"
          v-model="courseCode"
          placeholder="Enter course code"
          class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#464775]"
        />
        <div class="flex justify-end">
          <button
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
            @click="cancel"
          >
            Cancel
          </button>
          <button
            class="bg-[#464775] text-white px-4 py-2 rounded hover:bg-[#5c5c8a]"
            @click="addCourse"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div v-if="uploadMaterial" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Upload Course Material</h2>
        <form @submit.prevent="UploadMatService()">
          <select 
            v-model="selectedCourse" 
            class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#464775]"
          >
            <option disabled value="">Select a course</option>
            <option v-for="course in courses" :key="course.id" :value="course.courseID">
              {{ course.courseName }}
            </option>
          </select>

          <input
            type="text"
            v-model="title"
            placeholder="Enter material title"
            class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#464775]"
          />
          <input
            type="text"
            v-model="instruction"
            placeholder="Add instruction (optional)"
            class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#464775]"
          />
          <input
            type="file"
            @change="handleFileUpload"
            class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#464775]"
            multiple
          />

          <div class="flex justify-end">
            <button
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
              @click="cancel"
            >
              Cancel
            </button>
            <button
              class="bg-[#464775] text-white px-4 py-2 rounded hover:bg-[#5c5c8a]"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isModalVisible = ref(false);
const dropdownVisible = ref(false);
const optionsVisible = ref(false);
const isExpanded = ref(true);
const createCourse = ref(false)
const uploadMaterial = ref(false)
const loading = ref(true)
const images = ref([]);
const courseName = ref(null)
const title = ref(null)
const instruction = ref(null)
const courseCode = ref(null)
const email = ref(null)
const selectedCourse = ref(null)
email.value = localStorage.getItem("Email")
const token = localStorage.getItem("Token")
const notifications = ref([
{ title: 'New Investment', message: 'Your investment has been confirmed.', time: '10 mins ago' },
{ title: 'System Update', message: 'Scheduled maintenance tomorrow at 3 PM.', time: '1 hour ago' },
]);

const handleFileUpload = (event) => {
    images.value = Array.from(event.target.files);
    console.log(`Uploaded ${images.value.length} image(s) for training.`);
  };

const toggleDropdown = () => {
dropdownVisible.value = !dropdownVisible.value;
};
const toggleOptions = () => {
optionsVisible.value = !optionsVisible.value;
};
const addCourseModal = () => {
createCourse.value = !createCourse.value
}
const toggleUploadMaterial = () => {
uploadMaterial.value = !uploadMaterial.value
}
const logout = () => {
navigateTo('/');
};
const showModal = () => {
isModalVisible.value = !isModalVisible.value;
};
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};
const cancel = () => {
  createCourse.value = false
  uploadMaterial.value = false
}
const addCourse = async () => {
  loading.value = true
  const email = localStorage.getItem("Email")
  const token = localStorage.getItem("Token")
    const { data : responseData } = await useFetch(`http://localhost:7210/courses/add-new-course`, {
      method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: {
      courseName: courseName.value,
      courseCode: courseCode.value,
      lecturerEmail: email
    }
  })
  alert(responseData.value.msg)
createCourse.value = !createCourse.value
loading.value = false;  
reloadNuxtApp()
}
const startExam = async () => {
    try {
      // Send request to start Electron
      const response = await fetch('http://localhost:4000/start-electron', {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data); // Logs 'Electron started'
  
      // Optionally, trigger Electron to open the exam window
      if (window.api) {
        
        window.api.startExam('http://localhost:3000/admin/class/exam/');
      }
    } catch (error) {
      console.error('Failed to start Electron:', error);
    }
  };
const UploadMatService = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("comment", instruction.value);
  formData.append("courseID", selectedCourse.value);

  // Append each file individually
  images.value.forEach((file, index) => {
    formData.append("attachments", file);
  });

  try {
    const response = await fetch(
      "http://localhost:7210/material/add-new-course-material",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload material");
    }

    const responseData = await response.json();
    console.log("Upload successful:", responseData);
    alert(responseData.msg);
    reloadNuxtApp()
  } catch (error) {
    console.error("Error uploading material:", error);
    alert("Failed to upload material. Please try again.");
  } finally {
    loading.value = false;
  }
};

const courses = ref([])

const getCourses = async()  =>{
    loading.value = true
const { data } = await useFetch(`http://localhost:7210/courses/get-all-courses-by-lecturer-/${email.value}`, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
courses.value = data.value
console.log("These are the courses: " + courses.value)
loading.value = false
}
onMounted(() => {
getCourses()
})
</script>