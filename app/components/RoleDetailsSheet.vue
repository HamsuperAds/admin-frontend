<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent class="overflow-y-auto custom-scroll sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Role Details</SheetTitle>
            </SheetHeader>
            <div v-if="role" class="p-6 space-y-6">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon name="lucide:shield" class="w-8 h-8 text-blue-600" />
                    </div>
                    <div class="text-center w-full">
                        <h3 class="text-lg font-semibold text-gray-900">{{ role.name }}</h3>
                        <p class="text-sm text-gray-500 mt-1">{{ role.permissions?.length || 0 }} permissions</p>
                        <p v-if="role.description" class="text-sm text-gray-500 mt-1">{{ role.description }}</p>
                    </div>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div>
                        <p class="text-sm text-gray-500">Date Created</p>
                        <p class="text-sm font-medium text-gray-900">{{ formatDate(role.created_at) }}</p>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-gray-500">Permissions</p>
                            <Button variant="ghost" size="sm" class="h-6 text-xs"
                                @click="isEditingPermissions = !isEditingPermissions">
                                {{ isEditingPermissions ? 'Done' : 'Manage Permissions' }}
                            </Button>
                        </div>

                        <div v-if="isEditingPermissions" class="border rounded-md p-3 bg-gray-50">
                            <PermissionSelector :permissions="allPermissions"
                                :selectedPermissions="selectedPermissionIds"
                                @update:selectedPermissions="updateSelectedPermissions" />
                            <div class="mt-3 flex justify-end">
                                <Button size="sm" @click="savePermissions" :disabled="loading">
                                    <Icon v-if="loading" name="lucide:loader-2" class="w-3 h-3 mr-2 animate-spin" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        <div v-else class="flex flex-wrap gap-2">
                            <Badge v-for="permission in role.permissions" :key="permission.id" variant="outline"
                                class="text-xs">
                                {{ permission.name }}
                            </Badge>
                            <span v-if="!role.permissions || role.permissions.length === 0"
                                class="text-sm text-gray-400 italic">No permissions assigned</span>
                        </div>
                    </div>
                </div>

                <div class="pt-6 border-t border-gray-100 flex gap-3">
                    <Button variant="destructive" class="flex-1" @click="$emit('delete', role)" :disabled="isDeleting">
                        <Icon v-if="isDeleting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                        Delete Role
                    </Button>
                    <Button v-if="isEditingPermissions" size="sm" class="h-8" @click="savePermissions"
                        :disabled="isUpdatingPermissions">
                        <Icon v-if="isUpdatingPermissions" name="lucide:loader-2" class="w-3 h-3 mr-1 animate-spin" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import PermissionSelector from '@/components/PermissionSelector.vue'
import type { Role, Permission } from '@/types/admin'
import { Icon } from '#components'

const props = defineProps<{
    open: boolean
    role: Role | null
    allPermissions: Permission[]
    isDeleting?: boolean
    isUpdatingPermissions?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'updatePermissions', roleId: number, permissionIds: number[]): void
    (e: 'delete', role: Role): void
}>()

const isEditingPermissions = ref(false)
const selectedPermissionIds = ref<number[]>([])
const loading = ref(false)

watch(() => props.role, (newRole) => {
    if (newRole && newRole.permissions) {
        selectedPermissionIds.value = newRole.permissions.map(p => p.id)
    } else {
        selectedPermissionIds.value = []
    }
}, { immediate: true })

const updateSelectedPermissions = (ids: number[]) => {
    selectedPermissionIds.value = ids
}

const savePermissions = async () => {
    loading.value = true
    try {
        if (props.role) {
            emit('updatePermissions', props.role.id, selectedPermissionIds.value)
        }
        isEditingPermissions.value = false
    } finally {
        loading.value = false
    }
}

const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
}
</script>
