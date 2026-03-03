<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Left sidebar (Teams-like navigation) -->
    <div class="w-16 bg-gray-900 flex flex-col items-center py-4">
      <div class="mb-8">
       <svg class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
      </div>
      <div class="flex flex-col items-center space-y-4 w-full">
        <!-- Activity -->
        <NuxtLink to="/users/" class="p-2 w-full flex flex-col items-center text-gray-400 hover:text-white transition-colors group">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span class="text-[10px] mt-1">Activity</span>
        </NuxtLink>

        <!-- Chat -->
        <NuxtLink to="/users/" class="p-2 w-full flex flex-col items-center text-gray-400 hover:text-white transition-colors group">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <span class="text-[10px] mt-1">Chat</span>
        </NuxtLink>

        <!-- Teams (Active) -->
        <NuxtLink 
          to="/users/" 
          class="p-2 w-full flex flex-col items-center text-white bg-gray-800 border-l-2 border-[#464EB8]"
          active-class="bg-gray-800"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="text-[10px] mt-1">Teams</span>
        </NuxtLink>

        <!-- Assignments -->
        <NuxtLink to="/users/" class="p-2 w-full flex flex-col items-center text-gray-400 hover:text-white transition-colors group">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"/>
          </svg>
          <span class="text-[10px] mt-1">Assignments</span>
        </NuxtLink>

        <!-- Calendar -->
        <NuxtLink to="/users/" class="p-2 w-full flex flex-col items-center text-gray-400 hover:text-white transition-colors group">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span class="text-[10px] mt-1">Calendar</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top header -->
      <div class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="mr-4 p-2 rounded-full hover:bg-gray-100 md:hidden">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-gray-800">Microsoft Teams Learning Platform</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="joinClassModal" class="p-2 rounded-full hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </button>
          <div class="relative">
            <button @click="toggleDropdown" class="flex items-center space-x-2">
              <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {{ userInitials }}
              </div>
            </button>
            <div v-if="dropdownVisible" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <NuxtLink to="/users/settings/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</NuxtLink>
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content area -->
      <div class="flex-1 overflow-y-auto bg-gray-50 p-6">
        <slot />
      </div>
    </div>

    <!-- Join Class Modal -->
    <div v-if="joinClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Join Class</h2>
            <button @click="cancel" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <input
            type="text"
            v-model="classCode"
            placeholder="Class code"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
          />
          <p class="text-sm text-gray-600 mb-4">
            Ask your teacher for the class code, then enter it here.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="cancel"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="join"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const dropdownVisible = ref(false);
const joinClass = ref(false);
const loading = ref(false);
const classCode = ref(null);
const token = localStorage.getItem("Token");
const email = localStorage.getItem("Email");
const userInitials = computed(() => {
  return email ? email.charAt(0).toUpperCase() : 'A';
});

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const joinClassModal = () => {
  joinClass.value = !joinClass.value;
};

const logout = () => {
  navigateTo('/');
};

const toggleSidebar = () => {
  const sidebar = document.querySelector('.w-16');
  sidebar.classList.toggle('hidden');
  sidebar.classList.toggle('md:flex');
};

const cancel = () => {
  joinClass.value = false;
  classCode.value = null;
};

const join = async () => {
  loading.value = true;
  try {
    const { data: responseData } = await useFetch(
      `http://localhost:7210/courses/join-class-by-/${classCode.value}/${email}`,
      {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    alert(responseData.value.msg);
    joinClass.value = false;
  } catch (error) {
    console.error("Error joining class:", error);
    alert("Failed to join class");
  } finally {
    loading.value = false;
  }
};

const startExam = async () => {
  try {
    const { data, error } = await useFetch('http://localhost:4000/start-electron', {
      method: 'POST',
    });

    if (error.value) {
      throw new Error("Electron start request failed");
    }

    if (window.api) {
      await window.api.startExam('http://localhost:3000/users/class/exam/');
    }
  } catch (error) {
    console.error('Failed to start Electron:', error);
    alert("Failed to start Electron: " + error.message);
  }
};
</script>

<style>
/* Smooth transitions for dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>