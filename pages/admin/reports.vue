<template>
  <NuxtLayout name="admin-layout">
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Notifications</h1>
        <button 
          @click="refreshNotifications"
          class="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Refresh notifications"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#464775]"></div>
      </div>

      <!-- Notifications List -->
      <div v-else>
        <div v-if="notifications.length" class="space-y-3">
          <div 
            v-for="(notification, index) in notifications"
            :key="index"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-[#464775]/50 transition-colors"
          >
            <div class="flex items-start space-x-3">
              <!-- Notification Icon -->
              <div class="flex-shrink-0 mt-1">
                <div class="h-10 w-10 rounded-full bg-[#464775]/10 flex items-center justify-center">
                  <svg class="h-5 w-5 text-[#464775]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                  </svg>
                </div>
              </div>

              <!-- Notification Content -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-base font-medium text-gray-800">{{ notification.title }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                  </div>
                  <span class="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {{ formatDate(notification.createdAt) }}
                  </span>
                </div>

                <!-- User Info -->
                <div class="mt-2 flex items-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#464775]/10 text-[#464775]">
                    <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-[#464775]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"></circle>
                    </svg>
                    {{ notification.user.firstname }} {{ notification.user.lastname }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
          <p class="mt-1 text-gray-500">You'll see notifications here when they arrive.</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const loading = ref(true)
const token = localStorage.getItem("Token")
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
    const { data } = await useFetch(`http://localhost:7210/notifications/get-all-notifications`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    notifications.value = data.value || []
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
})
</script>

<style scoped>
/* Custom transition for notification cards */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>