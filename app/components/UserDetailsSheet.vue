<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>User Details</SheetTitle>
            </SheetHeader>
            <div v-if="user" class="py-6 space-y-6">
                <div class="flex flex-col items-center gap-4">
                    <Avatar class="w-20 h-20">
                        <AvatarImage :src="user.avatar || undefined" :alt="user.first_name" />
                        <AvatarFallback class="bg-gray-300 text-gray-700 text-lg">
                            {{ user.first_name?.[0] }}{{ user.last_name?.[0] }}
                        </AvatarFallback>
                    </Avatar>
                    <div class="text-center">
                        <h3 class="text-lg font-semibold text-gray-900">{{ user.first_name }} {{ user.last_name }}</h3>
                        <p class="text-sm text-gray-500">{{ user.email }}</p>
                    </div>
                    <Badge variant="outline" :class="{
                        'bg-green-50 text-green-700 border-green-200': user.status === 'active',
                        'bg-yellow-50 text-yellow-700 border-yellow-200': user.status === 'suspended',
                        'bg-gray-50 text-gray-700 border-gray-200': user.status === 'inactive'
                    }" class="capitalize">
                        {{ user.status }}
                    </Badge>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div v-if="loading" class="flex justify-center py-4">
                        <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                    <template v-else>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Phone</p>
                                <p class="text-sm font-medium text-gray-900">{{ user.phone_number || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Gender</p>
                                <p class="text-sm font-medium text-gray-900 capitalize">{{ user.gender || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Joined</p>
                                <p class="text-sm font-medium text-gray-900">{{ new
                                    Date(user.created_at).toLocaleDateString() }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Verified</p>
                                <p class="text-sm font-medium text-gray-900">{{ user.verified ? 'Yes' : 'No' }}</p>
                            </div>
                        </div>

                        <div v-if="user.adsCount !== undefined">
                            <p class="text-sm text-gray-500">Ads Posted</p>
                            <p class="text-sm font-medium text-gray-900">{{ user.adsCount }}</p>
                        </div>
                    </template>
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
import type { User } from '@/types/user'

defineProps<{
    open: boolean
    user: User
    loading?: boolean
}>()

defineEmits(['update:open'])
</script>
