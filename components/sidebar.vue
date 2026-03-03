<template>
    <div
      class="h-screen w-64 bg-gray-800 text-white fixed left-0 top-0 flex flex-col shadow-lg"
    >
      <div class="p-4 text-lg font-semibold">Classroom</div>
      <ul class="flex flex-col mt-4">
        <li
          v-for="(item, index) in menuItems"
          :key="index"
          class="p-3 hover:bg-gray-700 cursor-pointer"
        >
          <span class="ml-4">{{ item }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const menuItems = ['Dashboard', 'Classes', 'Settings'];
  </script>
  
  <style scoped>
  </style>
  