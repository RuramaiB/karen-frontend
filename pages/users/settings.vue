<template>
  <NuxtLayout name="user-layout">
    <div class="flex h-full bg-gray-50">
      <!-- Side Navigation -->
      <div class="w-64 bg-white border-r border-[#e1dfdd] p-4 hidden md:block mt-8">
        <h2 class="text-xl font-bold text-[#242424] mb-6 px-3">Settings</h2>
        <nav class="space-y-1">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center px-3 py-2 rounded-md text-left transition-colors"
            :class="activeTab === tab.id ? 'bg-[#464EB8]/10 text-[#464EB8] font-semibold' : 'text-[#616161] hover:bg-[#f5f5f5]'"
          >
            <component :is="tab.icon" class="h-5 w-5 mr-3" />
            <span class="text-sm">{{ tab.label }}</span>
          </button>
        </nav>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden bg-white border-b border-[#e1dfdd] p-4 w-full">
        <select 
          v-model="activeTab" 
          class="block w-full rounded-md border-[#e1dfdd] py-2 pl-3 pr-10 text-base focus:border-[#464EB8] focus:outline-none focus:ring-[#464EB8] sm:text-sm"
        >
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ tab.label }}
          </option>
        </select>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <!-- Profile Settings -->
        <div v-if="activeTab === 'profile'" class="max-w-3xl">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-[#242424]">Profile Settings</h2>
            <p class="text-sm text-[#616161] mt-1">Manage your personal information and student profile</p>
          </div>
          <div v-if="loading" class="flex justify-center py-12">
            <div class="w-8 h-8 border-4 border-[#464EB8] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div v-else class="bg-white rounded-lg border border-[#e1dfdd] shadow-sm overflow-hidden">
            <div class="p-8">
              <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8 pb-8 border-b border-[#f0f0f0]">
                <div class="relative">
                  <div class="h-24 w-24 rounded-full bg-[#464EB8]/10 flex items-center justify-center text-[#464EB8] text-3xl font-bold border-2 border-[#464EB8]/20">
                    {{ userInitials }}
                  </div>
                  <button class="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-[#e1dfdd] shadow-sm hover:bg-[#f5f5f5] transition-colors">
                    <PencilIcon class="h-4 w-4 text-[#464EB8]" />
                  </button>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-[#242424]">{{ userInfo.name }}</h3>
                  <p class="text-[#616161]">{{ userInfo.email }}</p>
                  <span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Student Account
                  </span>
                </div>
              </div>

              <form class="space-y-6">
                <div class="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                  <div>
                    <label class="block text-xs font-semibold text-[#616161] uppercase tracking-wider mb-1">First name</label>
                    <input 
                      type="text" 
                      v-model="userInfo.firstname"
                      class="block w-full border-b border-[#8a8886] py-2 text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-[#616161] uppercase tracking-wider mb-1">Last name</label>
                    <input 
                      type="text" 
                      v-model="userInfo.lastname"
                      class="block w-full border-b border-[#8a8886] py-2 text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors sm:text-sm"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-semibold text-[#616161] uppercase tracking-wider mb-1">Email address</label>
                    <input 
                      type="email" 
                      v-model="userInfo.email"
                      class="block w-full border-b border-[#8a8886] py-2 text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors sm:text-sm"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-semibold text-[#616161] uppercase tracking-wider mb-1">Date of birth</label>
                    <input 
                      type="text" 
                      v-model="userInfo.dateOfBirth"
                      class="block w-full border-b border-[#8a8886] py-2 text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors sm:text-sm"
                    />
                  </div>
                </div>
                <div class="pt-6">
                    <button type="button" class="bg-[#464EB8] hover:bg-[#3d44a2] text-white px-6 py-2 rounded text-sm font-semibold transition-colors shadow-sm">
                        Save changes
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Account Settings -->
        <div v-if="activeTab === 'account'" class="max-w-3xl">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-[#242424]">Account Settings</h2>
            <p class="text-sm text-[#616161] mt-1">Manage your account preferences and security</p>
          </div>

          <div class="bg-white rounded-lg border border-[#e1dfdd] shadow-sm overflow-hidden">
            <div class="divide-y divide-[#f0f0f0]">
              <div class="p-8">
                <h3 class="text-lg font-bold text-[#242424] mb-6">Language & Region</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label class="block text-xs font-semibold text-[#616161] uppercase mb-1">Language</label>
                    <select 
                      v-model="accountForm.language"
                      class="block w-full border-b border-[#8a8886] py-2 text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors sm:text-sm bg-transparent"
                    >
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-[#616161] uppercase mb-1">Time zone</label>
                    <select 
                      v-model="accountForm.timezone"
                      class="block w-full border-b border-[#8a8886] py-2 text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors sm:text-sm bg-transparent"
                    >
                      <option>(UTC-08:00) Pacific Time</option>
                      <option>(UTC-05:00) Eastern Time</option>
                      <option>(UTC+00:00) London</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="p-8">
                <h3 class="text-lg font-bold text-[#242424] mb-6">Security</h3>
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-semibold text-[#242424]">Two-factor authentication</h4>
                      <p class="text-xs text-[#616161]">Add an extra layer of security to your student account</p>
                    </div>
                    <Switch
                      v-model="accountForm.twoFactorEnabled"
                      :class="accountForm.twoFactorEnabled ? 'bg-[#464EB8]' : 'bg-[#e1dfdd]'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                    >
                      <span
                        aria-hidden="true"
                        :class="accountForm.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-semibold text-[#242424]">Login notifications</h4>
                      <p class="text-xs text-[#616161]">Get notified when your student account is accessed</p>
                    </div>
                    <Switch
                      v-model="accountForm.loginNotifications"
                      :class="accountForm.loginNotifications ? 'bg-[#464EB8]' : 'bg-[#e1dfdd]'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                    >
                      <span
                        aria-hidden="true"
                        :class="accountForm.loginNotifications ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                </div>
              </div>

              <div class="p-8">
                <h3 class="text-lg font-bold text-[#242424] mb-6">Danger Zone</h3>
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-semibold text-[#242424]">Delete account</h4>
                      <p class="text-xs text-[#616161]">Permanently remove your account and all learning data</p>
                    </div>
                    <button 
                      @click="showDeleteAccountModal = true"
                      class="inline-flex items-center rounded bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors border border-red-200"
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
        <div v-if="activeTab === 'notifications'" class="max-w-3xl">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-[#242424]">Notification Settings</h2>
            <p class="text-sm text-[#616161] mt-1">Manage how you receive updates and alerts</p>
          </div>

          <div class="bg-white rounded-lg border border-[#e1dfdd] shadow-sm overflow-hidden">
            <div class="divide-y divide-[#f0f0f0]">
              <div class="p-8">
                <h3 class="text-lg font-bold text-[#242424] mb-6">Email Notifications</h3>
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-semibold text-[#242424]">Course announcements</h4>
                      <p class="text-xs text-[#616161]">Receive emails about new course materials and updates</p>
                    </div>
                    <Switch
                      v-model="notificationForm.courseAnnouncements"
                      :class="notificationForm.courseAnnouncements ? 'bg-[#464EB8]' : 'bg-[#e1dfdd]'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                    >
                      <span
                        aria-hidden="true"
                        :class="notificationForm.courseAnnouncements ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-semibold text-[#242424]">Assignment deadlines</h4>
                      <p class="text-xs text-[#616161]">Receive reminders about upcoming exam and task deadlines</p>
                    </div>
                    <Switch
                      v-model="notificationForm.assignmentDeadlines"
                      :class="notificationForm.assignmentDeadlines ? 'bg-[#464EB8]' : 'bg-[#e1dfdd]'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                    >
                      <span
                        aria-hidden="true"
                        :class="notificationForm.assignmentDeadlines ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                </div>
              </div>

              <div class="p-8">
                <h3 class="text-lg font-bold text-[#242424] mb-6">In-App Notifications</h3>
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-semibold text-[#242424]">New messages</h4>
                      <p class="text-xs text-[#616161]">Show notifications for new direct messages</p>
                    </div>
                    <Switch
                      v-model="notificationForm.newMessages"
                      :class="notificationForm.newMessages ? 'bg-[#464EB8]' : 'bg-[#e1dfdd]'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                    >
                      <span
                        aria-hidden="true"
                        :class="notificationForm.newMessages ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
                      />
                    </Switch>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-semibold text-[#242424]">Grading updates</h4>
                      <p class="text-xs text-[#616161]">Show notifications when your exam grades are posted</p>
                    </div>
                    <Switch
                      v-model="notificationForm.gradingUpdates"
                      :class="notificationForm.gradingUpdates ? 'bg-[#464EB8]' : 'bg-[#e1dfdd]'"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                    >
                      <span
                        aria-hidden="true"
                        :class="notificationForm.gradingUpdates ? 'translate-x-5' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
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
              <div class="fixed inset-0 bg-[#242424] bg-opacity-40 transition-opacity" />
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
                        <DialogTitle as="h3" class="text-lg font-bold leading-6 text-[#242424]">Delete account</DialogTitle>
                        <div class="mt-2">
                          <p class="text-sm text-[#616161]">Are you sure you want to delete your student account? All of your learning data will be permanently removed. This action cannot be undone.</p>
                        </div>
                      </div>
                    </div>
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        class="inline-flex w-full justify-center rounded bg-red-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-700 transition-colors sm:ml-3 sm:w-auto sm:text-sm"
                        @click="deleteAccount"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded border border-[#e1dfdd] bg-white px-4 py-2 text-base font-semibold text-[#242424] shadow-sm hover:bg-[#f5f5f5] transition-colors sm:mt-0 sm:w-auto sm:text-sm"
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