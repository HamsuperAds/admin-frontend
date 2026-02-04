<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-colors"
                :disabled="loading">
                <Icon v-if="loading" name="lucide:loader-2" class="h-4 w-4 animate-spin text-blue-600" />
                <Icon v-else name="lucide:more-horizontal" class="h-4 w-4 text-gray-500" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuItem v-if="user.status !== 'active'" class="cursor-pointer gap-2"
                @click="$emit('action', 'active')">
                <Icon name="lucide:user-check" class="w-4 h-4 text-green-600" />
                <span>Make active</span>
            </DropdownMenuItem>

            <DropdownMenuItem v-if="user.status !== 'inactive'" class="cursor-pointer gap-2"
                @click="$emit('action', 'inactive')">
                <Icon name="lucide:user-x" class="w-4 h-4 text-gray-500" />
                <span>Make inactive</span>
            </DropdownMenuItem>

            <DropdownMenuItem v-if="user.status !== 'suspended'"
                class="cursor-pointer gap-2 text-red-600 focus:text-red-600" @click="$emit('action', 'suspended')">
                <Icon name="lucide:user-minus" class="w-4 h-4" />
                <span>Suspend user</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/user'

defineProps<{
    user: User
    loading?: boolean
}>()

defineEmits<{
    (e: 'action', value: 'active' | 'inactive' | 'suspended'): void
}>()
</script>
