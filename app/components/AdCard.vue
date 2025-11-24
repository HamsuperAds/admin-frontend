<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <!-- Product Image -->
    <div class="aspect-video bg-gray-200 relative">
      <img :src="ad?.image" :alt="ad.title" class="w-full h-full object-cover">
      <div class="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
        {{ ad.condition }}
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <div class="text-blue-600 font-bold text-lg mb-1">{{ ad.price }}</div>
      <h3 class="font-semibold text-gray-800 mb-2">{{ ad.title }}</h3>
      <p class="text-gray-600 text-sm mb-3">{{ ad.description }}</p>

      <!-- Location and Date -->
      <div class="flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center space-x-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clip-rule="evenodd"></path>
          </svg>
          <span>{{ ad.location }}</span>
        </div>
        <span>{{ ad.date }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Ad } from '@/types'

defineProps({
  ad: {
    type: Object as PropType<Ad>,
    required: true
  }
});
</script>

<style></style>