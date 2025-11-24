<template>
    <div class="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
        <!-- Default Icon -->
        <img :src="icon" class="w-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{ icon?: string }>();
</script>