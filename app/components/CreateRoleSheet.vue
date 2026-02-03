<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent class="sm:max-w-md overflow-y-auto custom-scroll">
            <SheetHeader>
                <SheetTitle>Create New Role</SheetTitle>
                <SheetDescription>
                    Define a new role and assign its permissions.
                </SheetDescription>
            </SheetHeader>
            <div class="p-6 space-y-6">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="space-y-2">
                        <Label for="name">Role Name</Label>
                        <Input id="name" v-model="form.name" placeholder="e.g. Content Manager" required />
                    </div>

                    <div class="space-y-2">
                        <Label for="description">Description</Label>
                        <Input id="description" v-model="form.description"
                            placeholder="Optional description of the role" />
                    </div>

                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <Label>Permissions</Label>
                            <span class="text-xs text-gray-500">{{ selectedPermissionIds.length }} selected</span>
                        </div>
                        <div class="border rounded-md p-4 bg-gray-50/50">
                            <PermissionSelector :permissions="permissions"
                                v-model:selectedPermissions="selectedPermissionIds" :loading="loadingPermissions" />
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-2 border-t mt-4">
                        <Button type="button" variant="outline" @click="$emit('update:open', false)">Cancel</Button>
                        <Button type="submit" :disabled="loading">
                            <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                            Create Role
                        </Button>
                    </div>
                </form>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PermissionSelector from '@/components/PermissionSelector.vue'
import type { Permission } from '@/types/admin'

const props = defineProps<{
    open: boolean
    permissions: Permission[]
    loadingPermissions?: boolean
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'create', data: any): void
}>()

// Local loading ref removed, using prop.loading
const selectedPermissionIds = ref<number[]>([])

const form = reactive({
    name: '',
    description: ''
})

const handleSubmit = () => {
    emit('create', { ...form, permission_ids: selectedPermissionIds.value })
}
</script>
