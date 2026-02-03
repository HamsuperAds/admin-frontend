<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent class="sm:max-w-md overflow-auto custom-scroll">
            <SheetHeader>
                <SheetTitle>Create New Admin</SheetTitle>
                <SheetDescription>
                    Add a new administrator to the system. They will receive an email with login credentials.
                </SheetDescription>
            </SheetHeader>
            <div class="p-6 space-y-6">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="first_name">First Name</Label>
                            <Input id="first_name" v-model="form.first_name" placeholder="John" required />
                        </div>
                        <div class="space-y-2">
                            <Label for="last_name">Last Name</Label>
                            <Input id="last_name" v-model="form.last_name" placeholder="Doe" required />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="email">Email Address</Label>
                        <Input id="email" type="email" v-model="form.email" placeholder="e.g. john@example.com"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="password">Initial Password</Label>
                        <Input id="password" type="password" v-model="form.password" placeholder="Min. 8 characters"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="password_confirmation">Confirm Password</Label>
                        <Input id="password_confirmation" type="password" v-model="form.password_confirmation"
                            placeholder="Confirm password" required />
                    </div>

                    <div class="space-y-2">
                        <Label>Initial Roles</Label>
                        <div class="border rounded-md p-4 space-y-3 max-h-[200px] overflow-y-auto">
                            <div v-if="loadingRoles" class="text-sm text-gray-500">Loading roles...</div>
                            <div v-else-if="roles.length === 0" class="text-sm text-gray-500">No roles available</div>
                            <div v-else v-for="role in roles" :key="role.id" class="flex items-center space-x-2">
                                <Checkbox :id="`role-${role.id}`" :checked="selectedRoleIds.includes(role.id)"
                                    @update:checked="(checked: boolean) => handleRoleChange(checked, role.id)" />
                                <label :for="`role-${role.id}`"
                                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    {{ role.name }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label>Status</Label>
                        <div class="relative">
                            <select v-model="form.status"
                                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <Icon name="lucide:chevron-down"
                                class="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" @click="$emit('update:open', false)">Cancel</Button>
                        <Button type="submit" :disabled="loading">
                            <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                            Create Admin
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
import { Checkbox } from '@/components/ui/checkbox'
import type { Role } from '@/types/admin'

const props = defineProps<{
    open: boolean
    roles: Role[]
    loadingRoles?: boolean
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'create', data: any): void
}>()

// Local loading ref removed, using prop.loading
const selectedRoleIds = ref<number[]>([])

const form = reactive({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    status: 'active'
})

const handleRoleChange = (checked: boolean | 'indeterminate', id: number) => {
    if (checked === true) {
        selectedRoleIds.value.push(id)
    } else {
        selectedRoleIds.value = selectedRoleIds.value.filter(roleId => roleId !== id)
    }
}

const handleSubmit = () => {
    emit('create', { ...form, role_ids: selectedRoleIds.value })
}
</script>
