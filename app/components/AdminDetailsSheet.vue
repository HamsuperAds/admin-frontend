<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Admin Details</SheetTitle>
            </SheetHeader>
            <div v-if="admin" class="py-6 space-y-6">
                <div class="flex flex-col items-center gap-4">
                    <Avatar class="w-20 h-20">
                        <AvatarImage :src="admin.avatar" :alt="admin.name" />
                        <AvatarFallback class="bg-gray-300 text-gray-700 text-lg">{{ admin.initials }}</AvatarFallback>
                    </Avatar>
                    <div class="text-center">
                        <h3 class="text-lg font-semibold text-gray-900">{{ admin.name }}</h3>
                        <p class="text-sm text-gray-500">{{ admin.email }}</p>
                    </div>
                    <div class="flex gap-2">
                        <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200 capitalize">
                            {{ admin.status }}
                        </Badge>
                        <Badge variant="outline" class="bg-blue-50 text-blue-700 border-blue-200">
                            {{ admin.role }}
                        </Badge>
                    </div>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div>
                        <p class="text-sm text-gray-500">Role</p>
                        <p class="text-sm font-medium text-gray-900">{{ admin.role }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Created</p>
                        <p class="text-sm font-medium text-gray-900">{{ admin.created }}</p>
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

defineProps<{
    open: boolean
    admin: any
}>()

defineEmits(['update:open'])
</script>
