<template>
    <div class="space-y-4">
        <div v-if="loading" class="flex justify-center py-4">
            <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400" />
        </div>

        <div v-else-if="groupedPermissions.length === 0" class="text-center py-4 text-gray-500 text-sm">
            No permissions available.
        </div>

        <div v-else class="space-y-6">
            <div v-for="group in groupedPermissions" :key="group.category">
                <h4 class="text-sm font-medium text-gray-900 mb-3 capitalize">{{ group.category }}</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div v-for="permission in group.permissions" :key="permission.id"
                        class="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
                        @click="togglePermission(permission.id)">
                        <Checkbox :id="`perm-${permission.id}`" :checked="selectedIds.includes(permission.id)"
                            @update:checked="(checked) => handleCheckboxChange(checked, permission.id)" />
                        <div class="grid gap-1.5 leading-none">
                            <label :for="`perm-${permission.id}`"
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer pointer-events-none">
                                {{ permission.name }}
                            </label>
                            <p class="text-xs text-muted-foreground">
                                {{ permission.description || 'No description' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import type { Permission } from '@/types/admin'

const props = defineProps<{
    permissions: Permission[]
    selectedPermissions: number[]
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:selectedPermissions', value: number[]): void
}>()

const selectedIds = computed({
    get: () => props.selectedPermissions,
    set: (val) => emit('update:selectedPermissions', val)
})

const groupedPermissions = computed(() => {
    const groups: Record<string, Permission[]> = {}

    props.permissions.forEach(p => {
        const category = p.category || 'Other'
        if (!groups[category]) {
            groups[category] = []
        }
        groups[category].push(p)
    })

    return Object.keys(groups).sort().map(category => ({
        category,
        permissions: groups[category]
    }))
})

const togglePermission = (id: number) => {
    const newSelected = [...selectedIds.value]
    const index = newSelected.indexOf(id)
    if (index === -1) {
        newSelected.push(id)
    } else {
        newSelected.splice(index, 1)
    }
    emit('update:selectedPermissions', newSelected)
}

const handleCheckboxChange = (checked: boolean, id: number) => {
    // This is handled by togglePermission usually, but if checkbox clicked directly:
    const newSelected = [...selectedIds.value]
    if (checked && !newSelected.includes(id)) {
        newSelected.push(id)
    } else if (!checked && newSelected.includes(id)) {
        const index = newSelected.indexOf(id)
        if (index !== -1) newSelected.splice(index, 1)
    }
    emit('update:selectedPermissions', newSelected)
}
</script>
