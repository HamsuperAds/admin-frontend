<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Role Details</SheetTitle>
            </SheetHeader>
            <div v-if="role" class="py-6 space-y-6">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon name="lucide:shield" class="w-8 h-8 text-blue-600" />
                    </div>
                    <div class="text-center w-full">
                        <h3 class="text-lg font-semibold text-gray-900">{{ role.name }}</h3>
                        <p class="text-sm text-gray-500 mt-1">{{ role.permissions.length }} permissions</p>
                    </div>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div>
                        <p class="text-sm text-gray-500">Date Created</p>
                        <p class="text-sm font-medium text-gray-900">{{ role.created }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-2">Permissions</p>
                        <div class="flex flex-wrap gap-2">
                            <Badge v-for="permission in role.permissions" :key="permission" variant="outline"
                                class="text-xs">
                                {{ permission }}
                            </Badge>
                        </div>
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
    role: any
}>()

defineEmits(['update:open'])
</script>
