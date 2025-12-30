<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Transaction Details</SheetTitle>
            </SheetHeader>
            <div v-if="transaction" class="py-6 space-y-6">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon name="lucide:credit-card" class="w-8 h-8 text-blue-600" />
                    </div>
                    <div class="text-center w-full">
                        <h3 class="text-2xl font-bold text-gray-900">{{ transaction.amount }}</h3>
                        <p class="text-sm text-gray-500 mt-1">{{ transaction.product }}</p>
                    </div>

                    <Badge :variant="transaction.statusVariant" class="capitalize">
                        {{ transaction.status }}
                    </Badge>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Transaction ID</span>
                        <span class="text-sm font-medium text-gray-900">#{{ transaction.id }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm text-gray-500">User</span>
                        <span class="text-sm font-medium text-gray-900">{{ transaction.user }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Product</span>
                        <span class="text-sm font-medium text-gray-900">{{ transaction.product }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Date</span>
                        <span class="text-sm font-medium text-gray-900">{{ transaction.date }}</span>
                    </div>
                    <div v-if="transaction.boostedBy" class="flex justify-between">
                        <span class="text-sm text-gray-500">Boosted By</span>
                        <span class="text-sm font-medium text-gray-900">{{ transaction.boostedBy }}</span>
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
    transaction: any
}>()

defineEmits(['update:open'])
</script>
