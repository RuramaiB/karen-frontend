<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f3f2f1] p-4">
    <div class="w-full max-w-[500px] bg-white border border-[#e1dfdd] shadow-[0_3.2px_7.2px_0_rgba(0,0,0,0.132),0_0.6px_1.8px_0_rgba(0,0,0,0.108)] rounded-lg p-10">
      <!-- Logo and Title -->
      <div class="mb-8">
        <div class="flex items-center space-x-2 mb-6">
            <div class="w-10 h-10 bg-[#464EB8] rounded flex items-center justify-center">
                <i class="fas fa-users text-white text-xl"></i>
            </div>
            <h1 class="text-[#242424] text-xl font-bold">Microsoft Teams</h1>
        </div>
        <h2 class="text-2xl font-semibold text-[#242424]">Create account</h2>
        <p class="text-sm text-[#616161] mt-2">Enter your details to register as a student</p>
      </div>

      <!-- Loading State -->
      <p v-if="loading" class="text-center text-sm text-[#464EB8] animate-pulse">Loading...</p>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit()" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
            <!-- Firstname -->
            <div>
              <input v-model="signup.firstname" type="text" placeholder="First Name"
                class="w-full px-0 py-2 border-b border-[#8a8886] text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors placeholder:text-[#616161] text-sm" />
              <p v-if="errors.firstname" class="text-xs text-[#a4262c] mt-1">{{ errors.firstname }}</p>
            </div>

            <!-- Lastname -->
            <div>
              <input v-model="signup.lastname" type="text" placeholder="Last Name"
                class="w-full px-0 py-2 border-b border-[#8a8886] text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors placeholder:text-[#616161] text-sm" />
              <p v-if="errors.lastname" class="text-xs text-[#a4262c] mt-1">{{ errors.lastname }}</p>
            </div>
        </div>

        <!-- Date of Birth -->
        <div>
          <label class="block text-xs text-[#616161] mb-1">Date of Birth</label>
          <input v-model="signup.dateOfBirth" type="date"
            class="w-full px-0 py-2 border-b border-[#8a8886] text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors text-sm" />
          <p v-if="errors.dateOfBirth" class="text-xs text-[#a4262c] mt-1">{{ errors.dateOfBirth }}</p>
        </div>

        <!-- Gender -->
        <div>
          <select v-model="signup.gender"
            class="w-full px-0 py-2 border-b border-[#8a8886] text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors text-sm bg-transparent">
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <p v-if="errors.gender" class="text-xs text-[#a4262c] mt-1">{{ errors.gender }}</p>
        </div>

        <!-- Address -->
        <div>
          <input v-model="signup.physicalAddress" type="text" placeholder="Physical Address"
            class="w-full px-0 py-2 border-b border-[#8a8886] text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors placeholder:text-[#616161] text-sm" />
          <p v-if="errors.physicalAddress" class="text-xs text-[#a4262c] mt-1">{{ errors.physicalAddress }}</p>
        </div>

        <div class="pt-4 space-y-4">
            <button
              type="submit"
              class="w-full py-2 px-6 bg-[#464EB8] hover:bg-[#3d44a2] text-white text-sm font-semibold rounded transition-colors shadow-sm">
              Create account
            </button>
            
            <NuxtLink to="/auth/signin" class="block w-full text-center py-2 px-6 bg-white border border-[#8a8886] text-[#242424] text-sm font-semibold rounded hover:bg-[#f3f2f1] transition-colors">
              Back to sign in
            </NuxtLink>
        </div>
      </form>

      <div class="mt-10 text-xs text-[#616161] flex justify-between">
        <span>© 2026 Microsoft</span>
        <div class="space-x-4">
            <a href="#" class="hover:underline">Terms of use</a>
            <a href="#" class="hover:underline">Privacy & cookies</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const signup = ref({})
const errors = ref([])
const loading = ref(false)

const handleSubmit = async () => {
  if (!signup.value.firstname) {
    errors.value.firstname = "Firstname is required"
    return
  } else if (!signup.value.lastname) {
    errors.value.lastname = "Lastname is required"
    return
  } else if (!signup.value.gender) {
    errors.value.gender = "Gender is required"
    return
  } else if (!signup.value.dateOfBirth) {
    errors.value.dateOfBirth = "Date of Birth is required"
    return
  } else if (!signup.value.physicalAddress) {
    errors.value.physicalAddress = "Physical address is required"
    return
  } else {
    localStorage.clear()
    localStorage.setItem('Firstname', signup.value.firstname)
    localStorage.setItem('Lastname', signup.value.lastname)
    localStorage.setItem('DateOfBirth', signup.value.dateOfBirth)
    localStorage.setItem('Gender', signup.value.gender)
    localStorage.setItem('physicalAddress', signup.value.physicalAddress)
    navigateTo("/auth/credentials")
  }
}
</script>
