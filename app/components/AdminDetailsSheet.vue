<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent class="overflow-y-auto">
            <SheetHeader>
                <SheetTitle>Admin Details</SheetTitle>
            </SheetHeader>
            <div v-if="admin" class="p-6 space-y-6">
                <div class="flex flex-col items-center gap-4">
                    <Avatar class="w-20 h-20">
                        <AvatarImage :src="admin?.avatar || ''" :alt="fullName || 'Admin Avatar'" />
                        <AvatarFallback class="bg-gray-300 text-gray-700 text-lg">{{ admin?.initials ||
                            initials }}</AvatarFallback>
                    </Avatar>
                    <div class="text-center">
                        <h3 class="text-lg font-semibold text-gray-900">{{ fullName }}</h3>
                        <p class="text-sm text-gray-500">{{ admin?.email }}</p>
                    </div>
                    <div class="flex gap-2">
                        <Badge variant="outline" :class="statusColor(admin.status)">
                            {{ admin.status }}
                        </Badge>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-tight">Phone Number</p>
                        <p class="text-sm font-medium text-gray-900">{{ admin.phone_number || 'N/A' }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-tight">Gender</p>
                        <p class="text-sm font-medium text-gray-900 capitalize">{{ admin.gender || 'N/A' }}</p>
                    </div>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500">Created</p>
                            <p class="text-sm font-medium text-gray-900">{{ formatDate(admin.created_at) }}</p>
                        </div>
                        <div v-if="admin.creator">
                            <p class="text-sm text-gray-500 mb-1">Created By</p>
                            <div class="flex items-center gap-2">
                                <Avatar class="w-8 h-8 border border-gray-100">
                                    <AvatarImage :src="admin.creator.avatar || ''"
                                        :alt="admin.creator.first_name || 'Admin'" />
                                    <AvatarFallback class="bg-gray-100 text-gray-600 text-[10px]">{{
                                        admin.creator.first_name?.charAt(0) || '?' }}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p class="text-xs font-medium text-gray-900 leading-none mb-1">{{
                                        admin.creator.first_name }} {{ admin.creator.last_name }}</p>
                                    <p class="text-[10px] text-gray-500 leading-none">{{ admin.creator.email }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <p class="text-sm text-gray-500">Roles</p>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <Badge v-for="role in admin.roles" :key="role.id" variant="secondary" class="pr-1.5 gap-1">
                                {{ role.name }}
                                <button @click="$emit('removeRole', admin.id, role.id)"
                                    class="rounded-full hover:bg-gray-200 p-0.5 inline-flex" title="Remove role">
                                    <Icon name="lucide:x" class="w-3 h-3 text-gray-500" />
                                </button>
                            </Badge>
                            <span v-if="!admin.roles || admin.roles.length === 0"
                                class="text-sm text-gray-400 italic">No roles assigned</span>
                        </div>

                        <div class="pt-2">
                            <Label class="text-xs mb-1.5 block">Assign New Role</Label>
                            <div class="flex gap-2">
                                <div class="relative flex-1">
                                    <select v-model="selectedRoleId"
                                        class="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                                        <option value="" disabled>Select role</option>
                                        <option v-for="role in availableRoles" :key="role.id" :value="String(role.id)">
                                            {{ role.name }}
                                        </option>
                                    </select>
                                    <Icon name="lucide:chevron-down"
                                        class="absolute right-3 top-2.5 h-3 w-3 opacity-50 pointer-events-none" />
                                </div>
                                <Button size="sm" variant="secondary" class="h-8" @click="handleAssignRole"
                                    :disabled="!selectedRoleId || isAssigning">
                                    <Icon v-if="isAssigning" name="lucide:loader-2" class="w-3 h-3 mr-1 animate-spin" />
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pt-6 border-t border-gray-100 flex gap-3">
                    <Button variant="destructive" class="flex-1" @click="$emit('delete', admin)" :disabled="isDeleting">
                        <Icon v-if="isDeleting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                        Delete Admin
                    </Button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Admin, Role } from '@/types/admin'
import { Icon } from '#components'

const props = defineProps<{
    open: boolean
    admin: Admin | null
    allRoles: Role[]
    isAssigning?: boolean
    isDeleting?: boolean
    isUpdatingStatus?: Record<string, boolean>
}>()

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'assignRole', adminId: string | number, roleId: number): void
    (e: 'removeRole', adminId: string | number, roleId: number): void
    (e: 'delete', admin: Admin): void
    // (e: 'edit', admin: Admin): void
}>()

const selectedRoleId = ref('')

const fullName = computed(() => {
    if (!props.admin) return ''
    return `${props.admin.first_name} ${props.admin.last_name}`
})

const initials = computed(() => {
    if (!props.admin) return '?'
    return `${props.admin.first_name.charAt(0)}${props.admin.last_name.charAt(0)}`.toUpperCase()
})

const availableRoles = computed(() => {
    if (!props.admin?.roles) return props.allRoles
    const assignedIds = props.admin.roles.map(r => r.id)
    return props.allRoles.filter(r => !assignedIds.includes(r.id))
})

const handleAssignRole = () => {
    if (selectedRoleId.value) {
        if (props.admin) {
            emit('assignRole', props.admin.id, parseInt(selectedRoleId.value))
        }
        selectedRoleId.value = ''
    }
}

const statusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-50 text-green-700 border-green-200 capitalize'
        case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200 capitalize'
        case 'suspended': return 'bg-red-50 text-red-700 border-red-200 capitalize'
        default: return 'bg-gray-50 text-gray-700 border-gray-200 capitalize'
    }
}

const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
}
</script>
