<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Subcategory Details</SheetTitle>
            </SheetHeader>
            <div v-if="subcategory" class="py-6 space-y-6 h-[calc(100vh-1rem)] overflow-y-auto custom-scroll">
                <div class="flex flex-col items-center gap-4">
                    <div class="relative group" :class="subcategory.is_active ? 'cursor-pointer' : 'cursor-not-allowed'"
                        @click="triggerFileInput">
                        <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent transition-all"
                            :class="{ 'group-hover:border-blue-500': subcategory.is_active }">
                            <img :src="previewImage || subcategory.image" :alt="subcategory.name"
                                class="w-full h-full object-cover"
                                :class="{ 'opacity-50': isUploadingImage || !subcategory.is_active }">
                        </div>
                        <div v-if="subcategory.is_active"
                            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div class="bg-black/50 p-2 rounded-full text-white">
                                <Icon v-if="isUploadingImage" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                                <Icon v-else name="lucide:camera" class="w-5 h-5" />
                            </div>
                        </div>
                        <input v-if="subcategory.is_active" type="file" ref="fileInput" class="hidden" accept="image/*"
                            @change="handleFileChange">
                    </div>
                    <div class="text-center">
                        <h3 class="text-lg font-semibold text-gray-900">{{ subcategory.name }}</h3>
                        <p class="text-sm text-gray-500">{{ subcategory.slug }}</p>
                    </div>
                    <Badge variant="outline" :class="{
                        'bg-green-50 text-green-700 border-green-200': subcategory.is_active,
                        'bg-red-50 text-red-700 border-red-200': !subcategory.is_active
                    }">
                        {{ subcategory.is_active ? 'Active' : 'Inactive' }}
                    </Badge>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500">Parent Category</p>
                            <p class="text-sm font-medium text-gray-900">{{ subcategory.category?.name || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Ads Count</p>
                            <p class="text-sm font-medium text-gray-900">{{ subcategory.adsCount }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Created</p>
                            <p class="text-sm font-medium text-gray-900">{{ new
                                Date(subcategory.created_at).toLocaleDateString() }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Updated</p>
                            <p class="text-sm font-medium text-gray-900">{{ new
                                Date(subcategory.updated_at).toLocaleDateString() }}</p>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <Button variant="outline" :class="{
                        'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700': subcategory.is_active,
                        'border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700': !subcategory.is_active
                    }" :disabled="isTogglingStatus" @click="toggleSubcategoryStatus">
                        <Icon v-if="isTogglingStatus" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                        {{ subcategory.is_active ? 'Deactivate' : 'Activate' }} {{ subcategory.name }}
                    </Button>
                </div>
                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <h4 class="text-sm font-semibold text-gray-900">Attributes</h4>
                    <div v-if="loadingAttributes" class="flex justify-center py-4">
                        <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                    <div v-else class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        <div v-for="attr in categoryAttributes" :key="attr.id"
                            class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <Icon v-if="togglingAttributes.has(attr.id)" name="lucide:loader-2"
                                    class="w-4 h-4 animate-spin text-blue-500" />
                                <Checkbox v-else :id="`attr-${attr.id}`" v-slot="slotProps"
                                    v-model="checkedMap[attr.id]" :disabled="!subcategory.is_active"
                                    @update:model-value="(val) => toggleAttribute(attr, !!val)" />
                                <label :for="`attr-${attr.id}`" class="text-sm font-medium leading-none cursor-pointer">
                                    {{ attr.name }} <span class="text-xs text-gray-400 font-normal">({{ attr.type
                                        }})</span>
                                </label>
                            </div>
                        </div>
                        <p v-if="categoryAttributes.length === 0" class="text-sm text-gray-500 italic">No attributes
                            found for this category.</p>
                    </div>
                </div>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { Subcategory, Attribute } from '@/types'
import { toast } from 'vue-sonner'

const props = defineProps<{
    open: boolean
    subcategory: Subcategory | null
}>()

const emit = defineEmits(['update:open', 'updated'])

const api = useApi()

const categoryAttributes = ref<Attribute[]>([])
const checkedMap = reactive<Record<number, boolean>>({})
const togglingAttributes = ref<Set<number>>(new Set())
const loadingAttributes = ref(false)
const isTogglingStatus = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)
const isUploadingImage = ref(false)
const previewImage = ref<string | null>(null)

const triggerFileInput = () => {
    if (isUploadingImage.value) return
    fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file || !props.subcategory) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
        previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    await uploadSubcategoryImage(file)
}

const uploadSubcategoryImage = async (file: File) => {
    if (!props.subcategory || !props.subcategory.is_active) return

    isUploadingImage.value = true
    const formData = new FormData()
    formData.append('image', file)
    formData.append('_method', 'PUT')

    try {
        const res: any = await api.fetchPost(`/subcategories/${props.subcategory.id}`, formData)
        if (res && res.success) {
            toast.success('Subcategory image updated')
            // Emit updated event if parent needs to know
            emit('updated')
        } else {
            throw new Error(res?.message || 'Failed to update image')
        }
    } catch (err) {
        console.error('Failed to upload image', err)
        toast.error('Failed to update image')
        // Revert preview on error
        previewImage.value = null
    } finally {
        isUploadingImage.value = false
        if (fileInput.value) fileInput.value.value = ''
    }
}

const fetchAttributes = async () => {
    if (!props.subcategory) return

    loadingAttributes.value = true
    try {
        const [catRes, subRes]: any[] = await Promise.all([
            api.fetchGet(`/categories/${props.subcategory.category_id}/attributes`),
            api.fetchGet(`/subcategories/${props.subcategory.id}/attributes`)
        ])

        if (catRes && catRes.success) {
            categoryAttributes.value = catRes.data
        }

        // Clear previous state
        Object.keys(checkedMap).forEach(key => {
            checkedMap[Number(key)] = false
        })

        if (subRes && subRes.success && Array.isArray(subRes.data)) {
            subRes.data.forEach((attr: any) => {
                if (attr && attr.id) {
                    checkedMap[Number(attr.id)] = true
                }
            })
        }
    } catch (err) {
        console.error('Failed to fetch attributes', err)
        toast.error('Failed to load attributes')
    } finally {
        loadingAttributes.value = false
    }
}

const toggleAttribute = async (attribute: Attribute, isChecked: boolean) => {
    if (!props.subcategory || !props.subcategory.is_active) return

    const attributeId = Number(attribute.id)
    const subcategoryId = props.subcategory.id

    // Set loading state
    togglingAttributes.value.add(attributeId)

    // Optimistic update of UI state
    checkedMap[attributeId] = isChecked

    const payload = {
        subcategory_id: subcategoryId.toString(),
        attribute_id: attributeId.toString()
    }

    try {
        const endpoint = isChecked ? '/attributes/assign' : '/attributes/unassign'
        const res: any = await api.fetchPost(endpoint, payload)

        if (res && res.success) {
            toast.success(res.message || (isChecked ? 'Attribute assigned' : 'Attribute unassigned'))
        } else {
            throw new Error(res?.message || 'Action failed')
        }
    } catch (err) {
        console.error(`Status toggle failed for attribute ${attributeId}:`, err)
        toast.error('Failed to update assignment')
        // Revert UI state on error
        checkedMap[attributeId] = !isChecked
    } finally {
        togglingAttributes.value.delete(attributeId)
    }
}

const toggleSubcategoryStatus = async () => {
    if (!props.subcategory) return

    isTogglingStatus.value = true
    try {
        const res: any = await api.fetchPost(`/subcategories/${props.subcategory.id}`, {
            is_active: !props.subcategory.is_active,
            _method: 'PUT'
        })
        if (res && res.success) {
            toast.success(res.message || `Subcategory ${props.subcategory.is_active ? 'deactivated' : 'activated'} successfully`)
            emit('updated')
        } else {
            throw new Error(res?.message || 'Failed to update subcategory status')
        }
    } catch (err) {
        console.error('Failed to toggle subcategory status', err)
        toast.error('Failed to update status')
    } finally {
        isTogglingStatus.value = false
    }
}

watch(() => props.open, (isOpen) => {
    if (isOpen && props.subcategory) {
        fetchAttributes()
    } else if (!isOpen) {
        categoryAttributes.value = []
        Object.keys(checkedMap).forEach(key => delete checkedMap[Number(key)])
        previewImage.value = null
    }
})

watch(() => props.subcategory?.id, (newId) => {
    if (props.open && newId) {
        fetchAttributes()
    }
})
</script>
