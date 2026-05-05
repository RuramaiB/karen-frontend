<template>
  <NuxtLayout name="admin-layout">
    <div class="p-8 bg-[#f8fafc] min-h-screen">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Security & Activity Reports</h1>
          <p class="text-slate-500 mt-1">Monitor real-time student activities and proctoring alerts.</p>
        </div>
        <button 
          @click="refreshNotifications"
          class="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          :class="{ 'opacity-50 pointer-events-none': loading }"
        >
          <svg class="w-5 h-5 text-slate-600" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span class="font-medium text-slate-700">Refresh</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !notifications.length" class="flex flex-col justify-center items-center h-96 space-y-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="text-slate-500 font-medium animate-pulse">Syncing activities...</p>
      </div>

      <!-- Notifications List -->
      <div v-else>
        <TransitionGroup 
          name="list" 
          tag="div" 
          v-if="notifications.length" 
          class="grid grid-cols-1 gap-4"
        >
          <div 
            v-for="notification in notifications"
            :key="notification.notificationID || notification.id"
            class="group bg-white rounded-2xl shadow-sm border p-5 transition-all hover:shadow-md hover:border-indigo-100 flex items-start space-x-5"
            :class="isSuspicious(notification.title) ? 'border-l-4 border-l-red-500 border-red-50' : 'border-slate-100'"
          >
            <!-- Icon/Status Indicator -->
            <div class="flex-shrink-0">
              <div 
                class="h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                :class="isSuspicious(notification.title) ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'"
              >
                <svg v-if="isSuspicious(notification.title)" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center space-x-2">
                    <h3 class="text-lg font-bold text-slate-800">{{ notification.title }}</h3>
                    <span 
                      v-if="isSuspicious(notification.title)" 
                      class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse"
                    >
                      Alert
                    </span>
                  </div>
                  <p class="text-slate-600 mt-1 leading-relaxed">{{ notification.message }}</p>
                </div>
                <div class="text-right flex flex-col items-end">
                  <span class="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                    {{ formatDate(notification.createdAt) }}
                  </span>
                </div>
              </div>

              <!-- Footer with Metadata -->
              <div class="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden">
                    <span class="text-xs font-bold text-slate-500">{{ notification.user?.firstname?.[0] || '?' }}</span>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-700">{{ notification.user?.firstname }} {{ notification.user?.lastname }}</p>
                    <p class="text-[10px] text-slate-400">{{ notification.user?.email }}</p>
                  </div>
                </div>
                
                <button class="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 group/btn">
                  <span>View Details</span>
                  <svg class="w-3 h-3 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div class="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Quiet for now</h3>
          <p class="text-slate-500 max-w-xs text-center mt-2">There are no recent activities or proctoring alerts to display.</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const loading = ref(true)
const token = typeof window !== 'undefined' ? localStorage.getItem("Token") : null
const notifications = ref([])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getNotifications = async() => {
  loading.value = true
  try {
    const response = await fetch(`http://localhost:7210/notifications/get-all-notifications`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.ok) {
      const data = await response.json()
      // Sort by latest first
      notifications.value = (data || []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }
  } catch (error) {
    console.error("Error fetching notifications:", error)
  } finally {
    loading.value = false
  }
}

const refreshNotifications = () => {
  getNotifications()
}

onMounted(() => {
  getNotifications()
  // Auto refresh every 30 seconds
  const interval = setInterval(getNotifications, 30000)
  onUnmounted(() => clearInterval(interval))
})

const isSuspicious = (title) => {
  return title?.toLowerCase().includes('suspicious') || title?.toLowerCase().includes('violation')
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>