<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Category Details</SheetTitle>
            </SheetHeader>
            <div v-if="category" class="py-6 space-y-6 h-[calc(100vh-1rem)] overflow-y-auto custom-scroll">
                <div class="flex flex-col items-center gap-4">
                    <div class="relative group" :class="category.is_active ? 'cursor-pointer' : 'cursor-not-allowed'"
                        @click="triggerFileInput">
                        <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent transition-all"
                            :class="{ 'group-hover:border-blue-500': category.is_active }">
                            <img :src="previewImage || category.image" :alt="category.name"
                                class="w-full h-full object-cover"
                                :class="{ 'opacity-50': isUploadingImage || !category.is_active }">
                        </div>
                        <div v-if="category.is_active"
                            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div class="bg-black/50 p-2 rounded-full text-white">
                                <Icon v-if="isUploadingImage" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                                <Icon v-else name="lucide:camera" class="w-5 h-5" />
                            </div>
                        </div>
                        <input v-if="category.is_active" type="file" ref="fileInput" class="hidden" accept="image/*"
                            @change="handleFileChange">
                    </div>
                    <div class="text-center">
                        <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
                        <p class="text-sm text-gray-500">{{ category.slug }}</p>
                    </div>
                    <Badge variant="outline" :class="{
                        'bg-green-50 text-green-700 border-green-200': category.is_active,
                        'bg-red-50 text-red-700 border-red-200': !category.is_active
                    }">
                        {{ category.is_active ? 'Active' : 'Inactive' }}
                    </Badge>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500">Ads Count</p>
                            <p class="text-sm font-medium text-gray-900">{{ category.adsCount }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Created</p>
                            <p class="text-sm font-medium text-gray-900">{{ new
                                Date(category.created_at).toLocaleDateString() }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Updated</p>
                            <p class="text-sm font-medium text-gray-900">{{ new
                                Date(category.updated_at).toLocaleDateString() }}</p>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <Button variant="outline" :class="{
                        'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700': category.is_active,
                        'border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700': !category.is_active
                    }" :disabled="isTogglingStatus" @click="toggleCategoryStatus">
                        <Icon v-if="isTogglingStatus" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                        {{ category.is_active ? 'Deactivate' : 'Activate' }} {{ category.name }}
                    </Button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types'
import { toast } from 'vue-sonner'

const props = defineProps<{
    open: boolean
    category: Category | null
}>()

const emit = defineEmits(['update:open', 'updated'])

const api = useApi()

const isTogglingStatus = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const isUploadingImage = ref(false)
const previewImage = ref<string | null>(null)

const triggerFileInput = () => {
    if (isUploadingImage.value || !props.category?.is_active) return
    fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file || !props.category) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
        previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    await uploadCategoryImage(file)
}

const uploadCategoryImage = async (file: File) => {
    if (!props.category || !props.category.is_active) return

    isUploadingImage.value = true
    const formData = new FormData()
    formData.append('image', file)
    formData.append('_method', 'PUT')

    try {
        const res: any = await api.fetchPost(`/categories/${props.category.id}`, formData)
        if (res && res.success) {
            toast.success('Category image updated')
            emit('updated')
        } else {
            throw new Error(res?.message || 'Failed to update image')
        }
    } catch (err) {
        console.error('Failed to upload image', err)
        toast.error('Failed to update image')
        previewImage.value = null
    } finally {
        isUploadingImage.value = false
        if (fileInput.value) fileInput.value.value = ''
    }
}

const toggleCategoryStatus = async () => {
    if (!props.category) return

    isTogglingStatus.value = true
    try {
        const res: any = await api.fetchPost(`/categories/${props.category.id}`, {
            is_active: !props.category.is_active,
            _method: 'PUT'
        })
        if (res && res.success) {
            toast.success(res.message || `Category ${props.category.is_active ? 'deactivated' : 'activated'} successfully`)
            emit('updated')
        } else {
            throw new Error(res?.message || 'Failed to update category status')
        }
    } catch (err) {
        console.error('Failed to toggle category status', err)
        toast.error('Failed to update status')
    } finally {
        isTogglingStatus.value = false
    }
}

watch(() => props.open, (isOpen) => {
    if (!isOpen) {
        previewImage.value = null
    }
})
</script>
