<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
    <div class="w-full max-w-[440px] bg-white border border-[#e1dfdd] shadow-[0_3.2px_7.2px_0_rgba(0,0,0,0.132),0_0.6px_1.8px_0_rgba(0,0,0,0.108)] rounded-lg p-10">
      <!-- Logo and Title -->
      <div class="mb-8">
        <div class="flex items-center space-x-2 mb-6">
            <div class="w-10 h-10 bg-[#464EB8] rounded flex items-center justify-center">
                <i class="fas fa-users text-white text-xl"></i>
            </div>
            <h1 class="text-[#242424] text-xl font-bold">Microsoft Teams</h1>
        </div>
        <h2 class="text-2xl font-semibold text-[#242424]">Sign in</h2>
        <p class="text-sm text-[#616161] mt-2">Use your student account to continue</p>
      </div>

      <p v-if="loading" class="text-center text-sm text-[#464EB8] animate-pulse">Loading...</p>

      <!-- Login Form -->
      <form class="space-y-6" v-else @submit.prevent="handleSubmit()">
        <!-- Email -->
        <div>
          <input
            v-model="loginForm.email"
            type="email"
            id="email"
            placeholder="Email"
            class="w-full px-0 py-2 border-b border-[#8a8886] text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors placeholder:text-[#616161]"
          />
          <p v-if="errors.email" class="text-xs text-[#a4262c] mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <input
            v-model="loginForm.password"
            type="password"
            id="password"
            placeholder="Password"
            class="w-full px-0 py-2 border-b border-[#8a8886] text-[#242424] focus:outline-none focus:border-[#464EB8] transition-colors placeholder:text-[#616161]"
          />
          <p v-if="errors.password" class="text-xs text-[#a4262c] mt-1">{{ errors.password }}</p>
        </div>

        <div class="pt-4 space-y-4">
            <button
              type="submit"
              class="w-full py-2 px-6 bg-[#464EB8] hover:bg-[#3d44a2] text-white text-sm font-semibold rounded transition-colors shadow-sm"
            >
              Sign in
            </button>
            
            <NuxtLink 
              to="/auth/signup" 
              class="block w-full text-center py-2 px-6 bg-white border border-[#8a8886] text-[#242424] text-sm font-semibold rounded hover:bg-[#f3f2f1] transition-colors"
            >
              Create new account
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
const loginForm = ref({
  email: '',
  password: '',
})
const errors = ref([])
const loading = ref(false)

// Access the global toast
const { $toast } = useNuxtApp()

const handleSubmit = async () => {
  loading.value = true
  const { data: responseData } = await useFetch('http://localhost:7210/api/v1/auth/authenticate', {
    method: 'post',
    body: {
      email: loginForm.value.email,
      password: loginForm.value.password,
    },
  })
  loading.value = false

  localStorage.clear()
  localStorage.setItem('Email', responseData.value.email)
  localStorage.setItem('name', responseData.value.firstname)
  localStorage.setItem('Token', responseData.value.access_token)
  localStorage.setItem('Role', responseData.value.role)
  localStorage.setItem('Verified', responseData.value.isVerified)
  localStorage.setItem('isFirstTime', responseData.value.isFirstTime)

  if (responseData.value.message === 'Bad credentials') {
    $toast.error('Login failed! Please check your email or password.', {
      position: 'bottom-right',
      autoClose: 3000,
    })
    navigateTo('/')
  } else {
    $toast.success(responseData.value.message, {
      position: 'bottom-right',
      autoClose: 3000,
    })

    setTimeout(() => {
      if (responseData.value.isFirstTime && responseData.value.role == 'STUDENT') {
        localStorage.setItem('verify', false)
        localStorage.setItem('train', false)
        navigateTo('/auth/onboarding')
      } else if (!responseData.value.isFirstTime && responseData.value.role == 'STUDENT') {
        navigateTo('/auth/identify')
      } else if (responseData.value.role == 'STUDENT') {
        navigateTo('/users/')
      } else if (responseData.value.role == 'LECTURER') {
        navigateTo('/admin/')
      }
    }, 1000)
  }
}
</script>


