<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Admins & Roles</h1>

        <!-- Tabs -->
        <Tabs default-value="admins" class="w-full">
            <TabsList class="mb-6">
                <TabsTrigger value="admins" @click="activeTab = 'admins'">Admins</TabsTrigger>
                <TabsTrigger value="roles" @click="activeTab = 'roles'">Roles</TabsTrigger>
            </TabsList>

            <!-- Admins Tab Content -->
            <TabsContent value="admins">
                <Card>
                    <CardHeader class="pb-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 flex-1 max-w-md">
                                <div class="relative flex-1">
                                    <Icon name="lucide:search"
                                        class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input v-model="adminSearchQuery"
                                        :placeholder="`Find admin by ${adminSearchCriteria.toLowerCase()}...`"
                                        class="pl-9 h-9" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="outline"
                                            class="h-9 gap-2 text-xs font-normal whitespace-nowrap">
                                            <span>Search by {{ adminSearchCriteria }}</span>
                                            <Icon name="lucide:chevron-down" class="w-3.5 h-3.5 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem @click="adminSearchCriteria = 'Name'">Name</DropdownMenuItem>
                                        <DropdownMenuItem @click="adminSearchCriteria = 'Email'">Email
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div class="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="outline" class="h-8 gap-2 text-xs font-normal">
                                            <Icon name="lucide:filter" class="w-3.5 h-3.5" />
                                            <span>{{ adminSelectedFilter }}</span>
                                            <Icon name="lucide:chevron-down" class="w-3.5 h-3.5 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" class="w-[160px]">
                                        <DropdownMenuItem @click="adminSelectedFilter = 'All admins'">All admins
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="adminSelectedFilter = 'Active'">Active
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="adminSelectedFilter = 'Inactive'">Inactive
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="adminSelectedFilter = 'Suspended'">Suspended
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button size="sm" class="h-8 gap-2" @click="isCreateAdminOpen = true">
                                    <Icon name="lucide:plus" class="w-4 h-4" />
                                    Add Admin
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div v-if="loadingAdmins" class="flex justify-center py-8">
                            <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                        <Table v-else>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>S/N</TableHead>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Roles</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead class="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="(admin, index) in filteredAdmins" :key="admin.id">
                                    <TableCell>{{ index + 1 }}</TableCell>
                                    <TableCell class="cursor-pointer hover:bg-gray-50" @click="openAdminSheet(admin)">
                                        <div class="flex items-center gap-3">
                                            <Avatar class="w-10 h-10">
                                                <AvatarFallback class="bg-gray-300 text-gray-700 text-sm">{{
                                                    getInitials(admin.first_name + ' ' + admin.last_name) }}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p class="text-sm font-medium text-gray-900">{{ admin.first_name }} {{
                                                    admin.last_name }}</p>
                                                <p class="text-xs text-gray-500">{{ admin.email }}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div class="flex flex-wrap gap-1">
                                            <Badge v-for="role in admin.roles" :key="role.id" variant="outline"
                                                class="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0">
                                                {{ role.name }}
                                            </Badge>
                                            <span v-if="!admin.roles?.length" class="text-xs text-gray-400">-</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" :class="statusColor(admin.status)">
                                            {{ admin.status }}
                                        </Badge>
                                    </TableCell>
                                    <TableCell class="text-gray-500">{{ formatDate(admin.created_at) }}</TableCell>
                                    <TableCell>
                                        <AdminActions @action="(action) => handleAdminAction(action, admin)" />
                                    </TableCell>
                                </TableRow>
                                <TableRow v-if="filteredAdmins.length === 0">
                                    <TableCell colspan="6" class="text-center py-8 text-gray-500">
                                        No admins found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <!-- Roles Tab Content -->
            <TabsContent value="roles">
                <Card>
                    <CardHeader class="pb-3 flex-row items-center justify-between">
                        <div class="text-lg font-medium">System Roles</div>
                        <Button size="sm" class="h-8 gap-2" @click="isCreateRoleOpen = true">
                            <Icon name="lucide:plus" class="w-4 h-4" />
                            Add Role
                        </Button>
                    </CardHeader>
                    <CardContent class="pt-0">
                        <div v-if="loadingRoles" class="flex justify-center py-8">
                            <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                        <Table v-else>
                            <TableHeader>
                                <TableRow>
                                    <TableHead class="w-16">S/N</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>No. of Permissions</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Date created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="(role, index) in roles" :key="role.id"
                                    class="cursor-pointer hover:bg-gray-50" @click="openRoleSheet(role)">
                                    <TableCell class="font-medium">{{ index + 1 }}</TableCell>
                                    <TableCell>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-medium text-gray-900">{{ role.name }}</span>
                                            <span class="text-xs text-gray-500 truncate max-w-[200px]">{{
                                                role.description }}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{{ role.permissions ? role.permissions.length : 0 }}</TableCell>
                                    <TableCell>
                                        <span class="text-sm text-gray-600">
                                            {{getPermissionsPreview(role.permissions?.map(p => p.name) || [])}}
                                        </span>
                                    </TableCell>
                                    <TableCell class="text-gray-500">{{ formatDate(role.created_at) }}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <AdminDetailsSheet v-model:open="isAdminSheetOpen" :admin="selectedAdmin" :allRoles="roles"
            :isAssigning="isAssigningRole" :isDeleting="isDeletingAdmin" :isUpdatingStatus="isUpdatingStatus"
            @assignRole="handleAssignRole" @removeRole="handleRemoveRole" @delete="handleDeleteAdmin"
            @updateStatus="handleAdminAction" />

        <RoleDetailsSheet v-model:open="isRoleSheetOpen" :role="selectedRole" :allPermissions="permissions"
            @updatePermissions="handleUpdateRolePermissions" @delete="handleDeleteRole"
            :isUpdatingPermissions="isUpdatingPermissions" :isDeleting="isDeletingRole" />

        <CreateAdminSheet v-model:open="isCreateAdminOpen" :roles="roles" :loading="isCreatingAdmin"
            @create="handleCreateAdmin" />

        <CreateRoleSheet v-model:open="isCreateRoleOpen" :permissions="permissions" @create="handleCreateRole"
            :loadingPermissions="loadingRoles" :loading="isCreatingRole" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import AdminActions from '@/components/AdminActions.vue'
import AdminDetailsSheet from '@/components/AdminDetailsSheet.vue'
import RoleDetailsSheet from '@/components/RoleDetailsSheet.vue'
import CreateAdminSheet from '@/components/CreateAdminSheet.vue'
import CreateRoleSheet from '@/components/CreateRoleSheet.vue'
import type { Admin, Role, Permission } from '@/types/admin'

definePageMeta({
    layout: 'dashboard'
})

const {
    fetchAdmins,
    fetchRoles,
    fetchPermissions,
    createAdmin,
    createRole,
    assignRoleToAdmin,
    removeRoleFromAdmin,
    syncRolePermissions,
    deleteAdmin,
    deleteRole,
    updateAdminStatus
} = useAdmins()

// State
const activeTab = ref('admins')
const admins = ref<Admin[]>([])
const roles = ref<Role[]>([])
const permissions = ref<Permission[]>([])
const loadingAdmins = ref(false)
const loadingRoles = ref(false)

// Admin Filter State
const adminSelectedFilter = ref('All admins')
const adminSearchCriteria = ref('Name')
const adminSearchQuery = ref('')

// Sheet State
const isAdminSheetOpen = ref(false)
const selectedAdmin = ref<Admin | null>(null)
const isRoleSheetOpen = ref(false)
const selectedRole = ref<Role | null>(null)
const isCreateAdminOpen = ref(false)
const isCreateRoleOpen = ref(false)
const isCreatingAdmin = ref(false)
const isCreatingRole = ref(false)
const isUpdatingStatus = ref<Record<string, boolean>>({})
const isDeletingAdmin = ref(false)
const isDeletingRole = ref(false)
const isUpdatingPermissions = ref(false)
const isAssigningRole = ref(false)

// Initialization
onMounted(async () => {
    await Promise.all([
        loadAdmins(),
        loadRoles(),
        loadPermissions()
    ])
})

// Data Fetching
const loadAdmins = async () => {
    loadingAdmins.value = true
    try {
        const res = await fetchAdmins()
        const data = res.data.value as any
        if (data?.success) {
            admins.value = data.data
        }
    } catch (e) {
        console.error(e)
    } finally {
        loadingAdmins.value = false
    }
}

const loadRoles = async () => {
    loadingRoles.value = true
    try {
        const res = await fetchRoles()
        const data = res.data.value as any
        if (data?.success) {
            roles.value = data.data
        }
    } catch (e) {
        console.error(e)
    } finally {
        loadingRoles.value = false
    }
}

const loadPermissions = async () => {
    try {
        const res = await fetchPermissions()
        const data = res.data.value as any
        if (data?.success) {
            permissions.value = data.data
        }
    } catch (e) {
        console.error(e)
    }
}

// Computed Filtering
const filteredAdmins = computed(() => {
    let result = admins.value

    // Status Filter
    if (adminSelectedFilter.value !== 'All admins') {
        const status = adminSelectedFilter.value.toLowerCase()
        result = result.filter(a => a.status === status)
    }

    // Search
    if (adminSearchQuery.value) {
        const query = adminSearchQuery.value.toLowerCase()
        if (adminSearchCriteria.value === 'Name') {
            result = result.filter(a => {
                const fullName = `${a.first_name} ${a.last_name}`.toLowerCase()
                return fullName.includes(query)
            })
        } else if (adminSearchCriteria.value === 'Email') {
            result = result.filter(a => a.email.toLowerCase().includes(query))
        }
    }

    return result
})

// Helpers
const getInitials = (name: string) => {
    if (!name) return ''
    return name
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2)
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

const getPermissionsPreview = (permissions: string[]) => {
    if (!permissions || permissions.length === 0) return 'No permissions'
    if (permissions.length <= 3) {
        return permissions.join(', ')
    }
    const first3 = permissions.slice(0, 3).join(', ')
    const remaining = permissions.length - 3
    return `${first3} +${remaining}`
}

// Actions
const openAdminSheet = (admin: Admin) => {
    selectedAdmin.value = admin
    isAdminSheetOpen.value = true
}

const openRoleSheet = (role: Role) => {
    selectedRole.value = role
    isRoleSheetOpen.value = true
}

const handleCreateAdmin = async (data: any) => {
    isCreatingAdmin.value = true
    try {
        const res = await createAdmin(data)
        const resData = res.data.value as any
        if (resData?.success) {
            isCreateAdminOpen.value = false
            await loadAdmins()
            toast.success('Admin created successfully')
        } else {
            toast.error(resData?.message || 'Failed to create admin')
        }
    } catch (e) {
        console.error(e)
        toast.error('Failed to create admin')
    } finally {
        isCreatingAdmin.value = false
    }
}

const handleCreateRole = async (data: any) => {
    isCreatingRole.value = true
    try {
        const res = await createRole(data)
        const resData = res.data.value as any
        if (resData?.success) {
            isCreateRoleOpen.value = false
            await loadRoles()
            toast.success('Role created successfully')
        } else {
            toast.error(resData?.message || 'Failed to create role')
        }
    } catch (e) {
        console.error(e)
        toast.error('Failed to create role')
    } finally {
        isCreatingRole.value = false
    }
}

const handleAssignRole = async (adminId: string | number, roleId: number) => {
    isAssigningRole.value = true // Use same loading ref for role management
    try {
        const res = await assignRoleToAdmin(adminId, roleId)
        const resData = res.data.value as any
        if (resData?.success) {
            await loadAdmins()
            // Refresh selected admin
            const updated = admins.value.find(a => a.id === adminId)
            if (updated) selectedAdmin.value = updated
            toast.success('Role assigned successfully')
        } else {
            toast.error(resData?.message || 'Failed to assign role')
        }
    } catch (e) {
        console.error(e)
        toast.error('Failed to assign role')
    } finally {
        isAssigningRole.value = false
    }
}

const handleRemoveRole = async (adminId: string | number, roleId: number) => {
    isAssigningRole.value = true // Use same loading ref for role management
    try {
        const res = await removeRoleFromAdmin(adminId, roleId)
        const resData = res.data.value as any
        if (resData?.success) {
            await loadAdmins()
            // Refresh selected admin
            const updated = admins.value.find(a => a.id === adminId)
            if (updated) selectedAdmin.value = updated
            toast.success('Role removed successfully')
        } else {
            toast.error(resData?.message || 'Failed to remove role')
        }
    } catch (e) {
        console.error(e)
        toast.error('Failed to remove role')
    } finally {
        isAssigningRole.value = false
    }
}

const handleUpdateRolePermissions = async (roleId: number, permissionIds: number[]) => {
    isUpdatingPermissions.value = true
    try {
        const res = await syncRolePermissions(roleId, permissionIds)
        const resData = res.data.value as any
        if (resData?.success) {
            await loadRoles()
            // Refresh selected role
            const updated = roles.value.find(r => r.id === roleId)
            if (updated) selectedRole.value = updated
            toast.success('Permissions updated successfully')
        } else {
            toast.error(resData?.message || 'Failed to update permissions')
        }
    } catch (e) {
        console.error(e)
        toast.error('Failed to update permissions')
    } finally {
        isUpdatingPermissions.value = false
    }
}

const handleDeleteAdmin = async (admin: Admin) => {
    if (!confirm('Are you sure you want to delete this admin?')) return
    isDeletingAdmin.value = true
    try {
        const res = await deleteAdmin(admin.id)
        const resData = res.data.value as any
        if (resData?.success) {
            isAdminSheetOpen.value = false
            await loadAdmins()
            toast.success('Admin deleted successfully')
        } else {
            toast.error(resData?.message || 'Failed to delete admin')
        }
    } catch (e) {
        console.error(e)
        toast.error('Failed to delete admin')
    } finally {
        isDeletingAdmin.value = false
    }
}

const handleDeleteRole = async (role: Role) => {
    if (!confirm('Are you sure you want to delete this role?')) return
    isDeletingRole.value = true
    try {
        const res = await deleteRole(role.id)
        const resData = res.data.value as any
        if (resData?.success) {
            isRoleSheetOpen.value = false
            await loadRoles()
            toast.success('Role deleted successfully')
        } else {
            toast.error(resData?.message || 'Failed to delete role')
        }
    } catch (e) {
        console.error(e)
        toast.error('Failed to delete role')
    } finally {
        isDeletingRole.value = false
    }
}

const handleAdminAction = async (action: string, admin: Admin) => {
    isUpdatingStatus.value[admin.id] = true
    try {
        let status = ''
        if (action === 'suspend') status = 'suspended'
        else if (action === 'active') status = 'active'
        else if (action === 'inactive') status = 'inactive'

        if (status) {
            const res = await updateAdminStatus(admin.id, status as any)
            const resData = res.data.value as any
            if (resData?.success) {
                await loadAdmins()
                toast.success(`Admin marked as ${status} successfully`)
            } else {
                toast.error(resData?.message || `Failed to update admin status to ${status}`)
            }
        }
    } catch (e) {
        console.error(e)
        toast.error('Failed to update admin status')
    } finally {
        isUpdatingStatus.value[admin.id] = false
    }
}
</script>
