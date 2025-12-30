<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>User Details</SheetTitle>
            </SheetHeader>
            <div v-if="user" class="py-6 space-y-6">
                <div class="flex flex-col items-center gap-4">
                    <Avatar class="w-20 h-20">
                        <AvatarImage :src="user.avatar" :alt="user.name" />
                        <AvatarFallback class="bg-gray-300 text-gray-700 text-lg">{{ user.initials }}</AvatarFallback>
                    </Avatar>
                    <div class="text-center">
                        <h3 class="text-lg font-semibold text-gray-900">{{ user.name }}</h3>
                        <p class="text-sm text-gray-500">{{ user.email }}</p>
                    </div>
                    <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200 capitalize">
                        {{ user.status }}
                    </Badge>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div>
                        <p class="text-sm text-gray-500">Joined</p>
                        <p class="text-sm font-medium text-gray-900">{{ user.joined }}</p>
                    </div>
                    <!-- Add more details here as needed -->
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
    user: any
}>()

defineEmits(['update:open'])
</script>
