<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Subcategory Details</SheetTitle>
            </SheetHeader>
            <div v-if="subcategory" class="py-6 space-y-6 h-[calc(100vh-1rem)] overflow-y-auto custom-scroll">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <img :src="subcategory.image" :alt="subcategory.name" class="w-full h-full object-cover">
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
                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <h4 class="text-sm font-semibold text-gray-900">Attributes</h4>
                    <div v-if="loadingAttributes" class="flex justify-center py-4">
                        <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                    <div v-else class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        <div v-for="attr in categoryAttributes" :key="attr.id"
                            class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <Checkbox :id="`attr-${attr.id}`" v-model="checkedMap[attr.id]"
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

const emit = defineEmits(['update:open'])

const api = useApi()

const categoryAttributes = ref<Attribute[]>([])
const checkedMap = reactive<Record<number, boolean>>({})
const loadingAttributes = ref(false)

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
    console.log('about to toggle attribute', attribute, isChecked);
    if (!props.subcategory) return

    const attributeId = Number(attribute.id)
    const subcategoryId = props.subcategory.id

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
    }
}

watch(() => props.open, (isOpen) => {
    if (isOpen && props.subcategory) {
        fetchAttributes()
    } else if (!isOpen) {
        categoryAttributes.value = []
        Object.keys(checkedMap).forEach(key => delete checkedMap[Number(key)])
    }
})

watch(() => props.subcategory?.id, (newId) => {
    if (props.open && newId) {
        fetchAttributes()
    }
})
</script>
