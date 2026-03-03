<template>
  <NuxtLayout name="admin-layout">
    <div class="flex h-full bg-gray-50">
      <!-- Side Navigation -->
      <div class="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <h2 class="text-lg font-semibold text-gray-800 mb-6 px-2">Settings</h2>
        <nav class="space-y-1">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center px-3 py-2 rounded-md text-left"
            :class="activeTab === tab.id ? 'bg-[#464775]/10 text-[#464775]' : 'text-gray-600 hover:bg-gray-100'"
          >
            <component :is="tab.icon" class="h-5 w-5 mr-3" />
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden bg-white border-b border-gray-200 p-4 w-full">
        <select 
          v-model="activeTab" 
          class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#464775] focus:outline-none focus:ring-[#464775] sm:text-sm"
        >
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ tab.label }}
          </option>
        </select>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Profile Settings -->
        <div v-if="activeTab === 'profile'" class="max-w-3xl mx-auto">
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800">Profile Settings</h2>
            <p class="text-gray-500 mt-1">Manage your personal information</p>
          </div>
          <p v-if="loading">Loading</p>
          <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6">
              <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div class="relative">
                  <div class="h-20 w-20 rounded-full bg-[#464775]/10 flex items-center justify-center text-[#464775] text-2xl font-bold">
                    {{ userInitials }}
                  </div>
                  <button class="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                    <PencilIcon class="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-800">{{ userInfo.name }}</h3>
                  <p class="text-gray-500">{{ userInfo.email }}</p>
                </div>
              </div>

              <form class="mt-8 space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                    <input 
                      type="text" 
                      id="first-name" 
                      v-model="userInfo.firstname"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#464775] focus:ring-[#464775] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                    <input 
                      type="text" 
                      id="last-name" 
                      v-model="userInfo.lastname"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#464775] focus:ring-[#464775] sm:text-sm"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="userInfo.email"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#464775] focus:ring-[#464775] sm:text-sm"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label for="phone" class="block text-sm font-medium text-gray-700">Date of birth</label>
                    <input 
                      type="text" 
                      id="phone" 
                      v-model="userInfo.dateOfBirth"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#464775] focus:ring-[#464775] sm:text-sm"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Account Settings -->
        <div v-if="activeTab === 'account'" class="max-w-3xl mx-auto">
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800">Account Settings</h2>
            <p class="text-gray-500 mt-1">Manage your account preferences</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="divide-y divide-gray-200">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-800 mb-4">Language & Region</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label for="language" class="block text-sm font-medium text-gray-700">Language</label>
                    <select 
                      id="language" 
                      v-model="accountForm.language"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#464775] focus:ring-[#464775] sm:text-sm"
                    >
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label for="timezone" class="block text-sm font-medium text-gray-700">Time zone</label>
                    <select 
                      id="timezone" 
                      v-model="accountForm.timezone"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#464775] focus:ring-[#464775] sm:text-sm"
                    >
                      <option>(UTC-08:00) Pacific Time</option>
                      <option>(UTC-05:00) Eastern Time</option>
                      <option>(UTC+00:00) London</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-800 mb-4">Security</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Two-factor authentication</h4>
                      <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      v-model="accountForm.twoFactorEnabled"
                      :class="accountForm.twoFactorEnabled ? 'bg-[#464775]' : 'bg-gray-200'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#464775] focus:ring-offset-2"
                    >
                      <span
                        aria-hidden="true"
                        :class="accountForm.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Login notifications</h4>
                      <p class="text-sm text-gray-500">Get notified when your account is accessed</p>
                    </div>
                    <Switch
                      v-model="accountForm.loginNotifications"
                      :class="accountForm.loginNotifications ? 'bg-[#464775]' : 'bg-gray-200'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#464775] focus:ring-offset-2"
                    >
                      <span
                        aria-hidden="true"
                        :class="accountForm.loginNotifications ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-800 mb-4">Danger Zone</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Delete account</h4>
                      <p class="text-sm text-gray-500">Permanently remove your account and all data</p>
                    </div>
                    <button 
                      @click="showDeleteAccountModal = true"
                      class="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-if="activeTab === 'notifications'" class="max-w-3xl mx-auto">
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800">Notification Settings</h2>
            <p class="text-gray-500 mt-1">Manage how you receive notifications</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="divide-y divide-gray-200">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-800 mb-4">Email Notifications</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Course announcements</h4>
                      <p class="text-sm text-gray-500">Receive emails about new course announcements</p>
                    </div>
                    <Switch
                      v-model="notificationForm.courseAnnouncements"
                      :class="notificationForm.courseAnnouncements ? 'bg-[#464775]' : 'bg-gray-200'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#464775] focus:ring-offset-2"
                    >
                      <span
                        aria-hidden="true"
                        :class="notificationForm.courseAnnouncements ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Assignment deadlines</h4>
                      <p class="text-sm text-gray-500">Receive reminders about upcoming deadlines</p>
                    </div>
                    <Switch
                      v-model="notificationForm.assignmentDeadlines"
                      :class="notificationForm.assignmentDeadlines ? 'bg-[#464775]' : 'bg-gray-200'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#464775] focus:ring-offset-2"
                    >
                      <span
                        aria-hidden="true"
                        :class="notificationForm.assignmentDeadlines ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-800 mb-4">In-App Notifications</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">New messages</h4>
                      <p class="text-sm text-gray-500">Show notifications for new messages</p>
                    </div>
                    <Switch
                      v-model="notificationForm.newMessages"
                      :class="notificationForm.newMessages ? 'bg-[#464775]' : 'bg-gray-200'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#464775] focus:ring-offset-2"
                    >
                      <span
                        aria-hidden="true"
                        :class="notificationForm.newMessages ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Grading updates</h4>
                      <p class="text-sm text-gray-500">Show notifications when grades are posted</p>
                    </div>
                    <Switch
                      v-model="notificationForm.gradingUpdates"
                      :class="notificationForm.gradingUpdates ? 'bg-[#464775]' : 'bg-gray-200'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#464775] focus:ring-offset-2"
                    >
                      <span
                        aria-hidden="true"
                        :class="notificationForm.gradingUpdates ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Account Modal -->
        <TransitionRoot as="template" :show="showDeleteAccountModal">
          <Dialog as="div" class="relative z-50" @close="showDeleteAccountModal = false">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in duration-200"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <TransitionChild
                  as="template"
                  enter="ease-out duration-300"
                  enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enter-to="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100 translate-y-0 sm:scale-100"
                  leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div class="sm:flex sm:items-start">
                      <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                      </div>
                      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Delete account</DialogTitle>
                        <div class="mt-2">
                          <p class="text-sm text-gray-500">Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.</p>
                        </div>
                      </div>
                    </div>
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="deleteAccount"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#464775] focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                        @click="showDeleteAccountModal = false"
                      >
                        Cancel
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { Switch } from '@headlessui/vue'
const loading = ref(true)
// Icons
const UserIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>`
}

const CogIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>`
}

const BellIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>`
}

const PencilIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>`
}

// Tabs
const tabs = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'account', label: 'Account', icon: CogIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
]

const activeTab = ref('profile')
const showDeleteAccountModal = ref(false)
const userInfo = ref([])

const userInitials = computed(() => {
  return userInfo.value.firstname.split(' ').map(n => n[0]).join('').toUpperCase()
})

const accountForm = ref({
  language: 'English',
  timezone: '(UTC-08:00) Pacific Time',
  twoFactorEnabled: true,
  loginNotifications: false,
})

const notificationForm = ref({
  courseAnnouncements: true,
  assignmentDeadlines: true,
  newMessages: true,
  gradingUpdates: false,
})


const deleteAccount = () => {
  console.log('Account deletion requested')
  showDeleteAccountModal.value = false
  // In a real app, you would call an API to delete the account
}
onMounted(async () => {
        loading.value = true
        const email = localStorage.getItem("Email")
        const { data } = await useFetch(`http://localhost:7210/api/v1/auth/get-user-by-/${email}`, {headers:{
            'Content-Type': 'application/json'
        }})
        userInfo.value = data.value
        loading.value = false
        
        
      })
</script>

<style scoped>
/* Custom styles */
</style>