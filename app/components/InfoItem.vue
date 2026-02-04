<template>
    <div class="space-y-1">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ label }}</p>
        <p class="text-sm font-semibold text-gray-900 truncate">{{ value }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string
    value: string
}>()
</script>