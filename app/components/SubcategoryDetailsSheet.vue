<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Subcategory Details</SheetTitle>
            </SheetHeader>
            <div v-if="subcategory" class="py-6 space-y-6">
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
                <!-- Attributes -->
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup lang="ts">
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import type { Subcategory } from '@/types'

defineProps<{
    open: boolean
    subcategory: Subcategory | null
}>()

defineEmits(['update:open'])
</script>
