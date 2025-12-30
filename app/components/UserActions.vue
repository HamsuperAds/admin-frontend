<template>
    <div class="relative" ref="target">
        <button @click="isOpen = !isOpen" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Icon name="lucide:more-horizontal" class="w-4 h-4 text-gray-500" />
        </button>

        <div v-if="isOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1">
            <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Icon name="lucide:user-x" class="w-4 h-4" />
                Suspend user
            </button>
            <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Icon name="lucide:edit-2" class="w-4 h-4" />
                Edit user
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const isOpen = ref(false)
const target = ref(null)

onClickOutside(target, () => isOpen.value = false)
</script>
