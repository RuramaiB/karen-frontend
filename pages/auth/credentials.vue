<template>
  <div class="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-lg p-8 shadow-sm border border-[#e1dfdd]">
      <!-- <div class="w-12 h-12 mb-6">
        <img src="/assets/logo.png" class="h-full w-full object-contain" alt="Logo">
      </div> -->
      
      <h2 class="text-2xl font-bold text-[#242424] mb-2">Create your account</h2>
      <p class="text-sm text-[#616161] mb-8">
        Use your official student email to register
      </p>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="w-8 h-8 border-4 border-[#464EB8] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit()" class="space-y-6">
        <!-- Email Input -->
        <div>
          <label class="block text-xs font-semibold text-[#616161] uppercase tracking-wider mb-1">Student Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="e.g. john.doe@students.example.com"
            class="w-full border-b border-[#8a8886] py-2 text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors bg-transparent sm:text-sm"
          />
          <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-xs font-semibold text-[#616161] uppercase tracking-wider mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Create a strong password"
            class="w-full border-b border-[#8a8886] py-2 text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors bg-transparent sm:text-sm"
          />
          <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password Input -->
        <div>
          <label class="block text-xs font-semibold text-[#616161] uppercase tracking-wider mb-1">Confirm Password</label>
          <input
            v-model="cpassword"
            type="password"
            placeholder="Verify your password"
            class="w-full border-b border-[#8a8886] py-2 text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors bg-transparent sm:text-sm"
          />
          <p v-if="errors.cpassword" class="text-xs text-red-600 mt-1">{{ errors.cpassword }}</p>
        </div>

        <div class="pt-2">
            <button
                type="submit"
                class="w-full py-2 bg-[#464EB8] hover:bg-[#3d44a2] text-white font-semibold rounded shadow-sm transition">
                Create account
            </button>
        </div>
      </form>

      <div class="mt-8 pt-6 border-t border-[#f0f0f0]">
        <p class="text-sm text-[#242424]">
            Already have an account?
            <NuxtLink to="/auth/signin" class="text-[#464EB8] font-semibold hover:underline ml-1">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const password = ref(null)
const cpassword = ref(null)
const email = ref(null)
const errors = ref({})
const loading = ref(false)

const handleSubmit = async () => {
  errors.value = {}

  if (!email.value) {
    errors.value.email = 'Official student email is required'
    return
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
    return
  }

  if (password.value !== cpassword.value) {
    errors.value.cpassword = 'Passwords do not match'
    return
  }

  loading.value = true

  const firstname = localStorage.getItem("Firstname")
  const lastname = localStorage.getItem("Lastname")
  const gender = localStorage.getItem("Gender")
  const dateOfBirth = localStorage.getItem("DateOfBirth")
  const physicalAddress = localStorage.getItem("physicalAddress")

  const { data: responseData } = await useFetch('http://localhost:7210/api/v1/auth/register', {
    method: 'post',
    body: {
      firstname,
      lastname,
      email: email.value,
      dateOfBirth,
      gender,
      physicalAddress,
      password: password.value,
      role: "STUDENT"
    }
  })

  if (responseData.value.accessToken) {
    localStorage.setItem("Token", responseData.value.accessToken)
    localStorage.setItem("Email", responseData.value.email)
    localStorage.setItem("Role", responseData.value.role)
    localStorage.setItem("Firstname", responseData.value.firstname || firstname) // Fallback to local if not in response
  }

  loading.value = false
  navigateTo("/auth/onboarding")
}
</script>
