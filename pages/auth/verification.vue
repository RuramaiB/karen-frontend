<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700">
      <div class="bg-white w-full max-w-lg rounded-lg shadow-lg p-8">
        <!-- Page Title -->
        <h2 class="text-3xl font-bold text-gray-800 mb-4 text-center">Email Verification</h2>
        <p class="text-gray-600 text-center mb-6">
          A verification code has been sent to <span class="text-purple-600 font-semibold">{{ email }}</span>.
        </p>
  
        <!-- Verification Code Boxes -->
        <div class="flex justify-center space-x-4 mb-6">
          <input
            v-for="(box, index) in 6"
            :key="index"
            type="text"
            maxlength="1"
            class="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
            v-model="code[index]"
            @input="focusNext(index)"
          />
        </div>
  
        <!-- Submit Button -->
        <button
          @click="submitCode"
          class="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition"
        >
          Verify Code
        </button>
  
        <!-- Resend Link -->
        <div class="mt-4 text-center text-sm text-gray-500">
          Didn't receive the code?
          <button
            @click="resendCode"
            class="text-purple-600 font-semibold hover:underline"
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const email = ref(null)
  
  // Display email for verification
  email.value = localStorage.getItem("Email");
  
  // Array to hold the verification code
  const code = ref(new Array(6).fill(''));
  
  // Function to focus the next box automatically
  const focusNext = (index) => {
    if (index < 5 && code.value[index].length === 1) {
      const nextInput = document.querySelectorAll('input')[index + 1];
      if (nextInput) nextInput.focus();
    }
  };
  
  const submitCode = async () => {
    const enteredCode = code.value.join('');
    const { data: responseData } = await useFetch(`http://localhost:7210/api/v1/auth/validate-verification-code-by-/${email.value}/${enteredCode}`, {
        method: 'put',
    })
    alert(responseData.value)
    if(responseData.value = "Verification successful."){
        navigateTo("/auth/onboarding")
        localStorage.setItem('verify', true);
    }else{
        alert("Verification failed. Please try again.")
        navigateTo("/")
    }
}
const resendCode = async () => {
    const { data: responseData } = await useFetch(`http://localhost:7210/api/v1/auth/generate-verification-code-by-/${email.value}`, {
        method: 'post',
        body: {},
    })
    alert(responseData.value)
    alert("Reset code resend was successful. Check for new code.")
}
const handleSubmit = async () => {
    
        const { data: responseData } = await useFetch(`http://localhost:7210/api/v1/auth/generate-verification-code-by-/${email.value}`, {
        method: 'post',
        body: { 
          email: email
        },
    })

   
    
}
onMounted(() => {
    handleSubmit()
  });
  </script>
  
  <style>
  /* Add any additional custom styles here */
  </style>
  