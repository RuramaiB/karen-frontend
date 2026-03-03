<template>
    <div class="border rounded-lg mb-4">
      <button
        class="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50"
        @click="isOpen = !isOpen"
      >
        <div class="flex items-center">
          <span class="font-semibold">{{ title }}</span>
          <span class="text-sm text-gray-500 ml-2">{{ subtitle }}</span>
        </div>
        <span class="transform transition-transform" :class="{ 'rotate-180': isOpen }">
          &#9660;
        </span>
      </button>
      <div v-if="isOpen" class="p-4 border-t">
        <slot></slot>
      </div>
      <div v-else class="p-4 border-t flex items-center space-x-4">
        <template v-if="previewType === 'document'">
          <span class="text-blue-500">📄</span>
          <a :href="previewLink" class="text-blue-500 hover:underline">View Document</a>
        </template>
        <template v-else-if="previewType === 'video'">
          <span class="text-blue-500">🎥</span>
          <a :href="previewLink" class="text-blue-500 hover:underline">Watch Video</a>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    title: String,
    subtitle: String,
    previewType: String,
    previewLink: String,
  });
  
  const isOpen = ref(false);
  </script>