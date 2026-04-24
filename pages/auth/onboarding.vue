<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center px-4">
    <div class="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      
      <!-- Left Section -->
      <div class="bg-purple-800 text-white p-10 flex flex-col justify-center">
        <h2 class="text-4xl font-bold mb-6">Welcome Aboard!</h2>
        <p class="text-base text-purple-200 mb-8">Follow the checklist to quickly set up your account.</p>
          <ol class="space-y-6 text-sm">
          <li class="flex items-start space-x-4">
            <div class="h-8 w-8 bg-white text-purple-800 font-bold rounded-full flex items-center justify-center">1</div>
            <span>Understand the platform’s purpose</span>
          </li>
          <li class="flex items-start space-x-4">
            <div class="h-8 w-8 bg-white text-purple-800 font-bold rounded-full flex items-center justify-center">2</div>
            <span>Upload training images for your model</span>
          </li>
        </ol>
      </div>

      <!-- Right Section -->
      <div v-if="!loading" class="p-10 flex flex-col justify-between space-y-8">
        <div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Your Checklist</h3>
          <p class="text-gray-600 text-sm mb-6">Complete all steps to activate your account:</p>

          <ul class="space-y-6">
            <li class="flex justify-between items-center">
              <div class="flex items-center space-x-4">
                <span :class="[steps ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500', 'h-8 w-8 flex items-center justify-center font-bold rounded-full']">1</span>
                <span class="text-base">Understand the platform</span>
              </div>
              <button
                v-if="!steps"
                @click="completeStep(0)"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-lg font-semibold transition"
              >
                Start
              </button>
            </li>

            <li class="flex justify-between items-center">
              <div class="flex items-center space-x-4">
                <span :class="[train ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500', 'h-8 w-8 flex items-center justify-center font-bold rounded-full']">2</span>
                <span class="text-base">Upload training images</span>
              </div>
              <button
                v-if="!train"
                @click="navigateTo('auth/modelTraining')"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg font-semibold transition"
              >
                Start
              </button>
            </li>
          </ul>
        </div>

        <div v-if="train" class="text-right">
          <button @click="handleNavigation" class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-semibold transition duration-200">
            Finish Setup
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const verify = ref(false);
const train = ref(false);
const steps = ref(true);
const loading = ref(true);

const navigateTo = (page) => {
  router.push(`/${page}`);
};

const handleNavigation = async () => {
  const email = localStorage.getItem("Email");
  if (email) {
    try {
      await fetch(`http://localhost:7210/api/v1/auth/update-is-first-time-by-/${email}`, {
        method: 'PUT'
      });
      localStorage.setItem('isFirstTime', 'false');
    } catch (error) {
      console.error("Error updating first time status:", error);
    }
  }
  navigateTo("auth/signin");
};

onMounted(() => {
  loading.value = true;
  train.value = localStorage.getItem("train") === "true";
  verify.value = localStorage.getItem("verify") === "true";
  loading.value = false;
});
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
