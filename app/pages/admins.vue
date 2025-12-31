<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Admins & Roles</h1>

        <!-- Tabs -->
        <Tabs default-value="admins" class="w-full">
            <TabsList class="mb-6">
                <TabsTrigger value="admins">Admins</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
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
                                        <DropdownMenuItem @click="adminSearchCriteria = 'Role'">Role</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
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
                                    <DropdownMenuItem @click="adminSelectedFilter = 'Active'">Active</DropdownMenuItem>
                                    <DropdownMenuItem @click="adminSelectedFilter = 'Inactive'">Inactive
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @click="adminSelectedFilter = 'Suspended'">Suspended
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>S/N</TableHead>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead class="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="admin in admins" :key="admin.id">
                                    <TableCell>{{ admin.id }}</TableCell>
                                    <TableCell class="cursor-pointer hover:bg-gray-50" @click="openAdminSheet(admin)">
                                        <div class="flex items-center gap-3">
                                            <Avatar class="w-10 h-10">
                                                <AvatarImage :src="admin.avatar" :alt="admin.name" />
                                                <AvatarFallback class="bg-gray-300 text-gray-700 text-sm">{{
                                                    admin.initials }}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p class="text-sm font-medium text-gray-900">{{ admin.name }}</p>
                                                <p class="text-xs text-gray-500">{{ admin.email }}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" class="bg-blue-50 text-blue-700 border-blue-200">
                                            {{ admin.role }}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline"
                                            class="bg-green-50 text-green-700 border-green-200 capitalize">
                                            {{ admin.status }}
                                        </Badge>
                                    </TableCell>
                                    <TableCell class="text-gray-500">{{ admin.created }}</TableCell>
                                    <TableCell>
                                        <AdminActions />
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
                    <CardContent class="pt-6">
                        <Table>
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
                                <TableRow v-for="role in roles" :key="role.id" class="cursor-pointer hover:bg-gray-50"
                                    @click="openRoleSheet(role)">
                                    <TableCell class="font-medium">{{ role.id }}</TableCell>
                                    <TableCell>
                                        <span class="text-sm font-medium text-gray-900">{{ role.name }}</span>
                                    </TableCell>
                                    <TableCell>{{ role.permissions.length }}</TableCell>
                                    <TableCell>
                                        <span class="text-sm text-gray-600">{{ getPermissionsPreview(role.permissions)
                                            }}</span>
                                    </TableCell>
                                    <TableCell class="text-gray-500">{{ role.created }}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <AdminDetailsSheet v-model:open="isAdminSheetOpen" :admin="selectedAdmin" />
        <RoleDetailsSheet v-model:open="isRoleSheetOpen" :role="selectedRole" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

definePageMeta({
    layout: 'dashboard'
})

const adminSelectedFilter = ref('All admins')
const adminSearchCriteria = ref('Name')
const adminSearchQuery = ref('')

const isAdminSheetOpen = ref(false)
const selectedAdmin = ref(null)

const isRoleSheetOpen = ref(false)
const selectedRole = ref(null)

const openAdminSheet = (admin: any) => {
    selectedAdmin.value = admin
    isAdminSheetOpen.value = true
}

const openRoleSheet = (role: any) => {
    selectedRole.value = role
    isRoleSheetOpen.value = true
}

const getPermissionsPreview = (permissions: string[]) => {
    if (permissions.length <= 3) {
        return permissions.join(', ')
    }
    const first3 = permissions.slice(0, 3).join(', ')
    const remaining = permissions.length - 3
    return `${first3} +${remaining}`
}

const admins = [
    { id: 1, name: 'John Doe', email: 'john@admin.com', role: 'Super Admin', created: '1hr ago', avatar: '', initials: 'JD', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@admin.com', role: 'Admin', created: '2days ago', avatar: '', initials: 'JS', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@admin.com', role: 'Moderator', created: '3days ago', avatar: '', initials: 'MJ', status: 'inactive' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@admin.com', role: 'Admin', created: '1week ago', avatar: '', initials: 'SW', status: 'active' }
]

const roles = [
    {
        id: 1,
        name: 'Super Admin',
        permissions: ['view users', 'edit users', 'delete users', 'view ads', 'edit ads', 'delete ads', 'manage roles'],
        created: '23/04/2025'
    },
    {
        id: 2,
        name: 'Admin',
        permissions: ['view users', 'edit users', 'view ads', 'edit ads', 'view transactions'],
        created: '23/04/2025'
    },
    {
        id: 3,
        name: 'Moderator',
        permissions: ['view users', 'view ads', 'suspend ads'],
        created: '22/04/2025'
    },
    {
        id: 4,
        name: 'Support',
        permissions: ['view users', 'view transactions'],
        created: '22/04/2025'
    }
]
</script>
