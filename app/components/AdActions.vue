<template>
    <div class="relative" ref="target">
        <button @click="isOpen = !isOpen" :disabled="updating"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon v-if="updating" name="lucide:loader-2" class="w-4 h-4 text-gray-500 animate-spin" />
            <Icon v-else name="lucide:more-horizontal" class="w-4 h-4 text-gray-500" />
        </button>

        <div v-if="isOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1">
            <button :disabled="ad.status === 'active'"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                @click="handleStatusUpdate('active')">
                <Icon name="lucide:check-circle" class="w-4 h-4" />
                Approve ad
            </button>
            <button :disabled="ad.status === 'sold'"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                @click="handleStatusUpdate('sold')">
                <Icon name="lucide:shopping-bag" class="w-4 h-4" />
                Mark as sold
            </button>
            <button :disabled="ad.status === 'suspended'"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                @click="handleStatusUpdate('suspended')">
                <Icon name="lucide:ban" class="w-4 h-4" />
                Suspend ad
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { toast } from 'vue-sonner'
import type { Ad } from '@/types/ad'

const props = defineProps<{
    ad: Ad
}>()

const emit = defineEmits(['updated'])

const api = useApi()
const isOpen = ref(false)
const target = ref(null)
const updating = ref(false)

onClickOutside(target, () => isOpen.value = false)

const handleStatusUpdate = async (status: 'active' | 'sold' | 'suspended') => {
    isOpen.value = false
    updating.value = true

    try {
        const response = await api.fetchPost(`/ads/${props.ad.id}/status`, {
            status,
            _method: 'PUT'
        })

        if (response) {
            const statusLabels = {
                active: 'approved',
                sold: 'marked as sold',
                suspended: 'suspended'
            }
            toast.success(`Ad ${statusLabels[status]} successfully`)
            emit('updated')
        }
    } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to update ad status')
    } finally {
        updating.value = false
    }
}
</script>
