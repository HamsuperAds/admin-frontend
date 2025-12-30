<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Ad Details</SheetTitle>
            </SheetHeader>
            <div v-if="ad" class="py-6 space-y-6">
                <div class="flex flex-col items-center gap-4">
                    <img :src="ad.image" :alt="ad.title" class="w-full h-48 object-cover rounded-md" />
                    <div class="text-center w-full">
                        <h3 class="text-lg font-semibold text-gray-900">{{ ad.title }}</h3>
                        <p class="text-xl font-bold text-gray-700 mt-1">{{ ad.price }}</p>
                    </div>

                    <div class="flex gap-2">
                        <Badge variant="outline" class="capitalize">
                            {{ ad.status }}
                        </Badge>
                        <Badge variant="outline" class="capitalize border-blue-200 text-blue-700 bg-blue-50">
                            {{ ad.type }}
                        </Badge>
                    </div>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Created At</span>
                        <span class="text-sm font-medium text-gray-900">{{ ad.created }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Created By</span>
                        <span class="text-sm font-medium text-gray-900">{{ ad.createdBy }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Ad ID</span>
                        <span class="text-sm font-medium text-gray-900">#{{ ad.id }}</span>
                    </div>
                </div>
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

defineProps<{
    open: boolean
    ad: any
}>()

defineEmits(['update:open'])
</script>
