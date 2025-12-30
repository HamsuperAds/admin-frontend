<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Users</h1>

    <!-- User stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card v-for="stat in userStats" :key="stat.name">
        <CardContent class="p-6">
          <div class="flex items-start gap-3">
            <div class="p-2 bg-blue-100 rounded">
              <Icon :name="stat.icon" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">{{ stat.name }}</p>
              <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>


    <!-- Users Table -->
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 flex-1 max-w-md">
            <div class="relative flex-1">
              <Icon name="lucide:search" class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input v-model="searchQuery" :placeholder="`Find user by ${searchCriteria.toLowerCase()}...`"
                class="pl-9 h-9" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" class="h-9 gap-2 text-xs font-normal whitespace-nowrap">
                  <span>Search by {{ searchCriteria }}</span>
                  <Icon name="lucide:chevron-down" class="w-3.5 h-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="searchCriteria = 'Name'">Name</DropdownMenuItem>
                <DropdownMenuItem @click="searchCriteria = 'Email'">Email</DropdownMenuItem>
                <DropdownMenuItem @click="searchCriteria = 'Phone number'">Phone number</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" class="h-8 gap-2 text-xs font-normal">
                <Icon name="lucide:filter" class="w-3.5 h-3.5" />
                <span>{{ selectedFilter }}</span>
                <Icon name="lucide:chevron-down" class="w-3.5 h-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-[150px]">
              <DropdownMenuItem @click="selectedFilter = 'All users'">All users</DropdownMenuItem>
              <DropdownMenuItem @click="selectedFilter = 'Active users'">Active users</DropdownMenuItem>
              <DropdownMenuItem @click="selectedFilter = 'Inactive users'">Inactive users</DropdownMenuItem>
              <DropdownMenuItem @click="selectedFilter = 'Suspended users'">Suspended users</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead class="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user.id">
              <TableCell>{{ user.id }}</TableCell>
              <TableCell class="cursor-pointer hover:bg-gray-50" @click="openUserSheet(user)">
                <div class="flex items-center gap-3">
                  <Avatar class="w-10 h-10">
                    <AvatarImage :src="user.avatar" :alt="user.name" />
                    <AvatarFallback class="bg-gray-300 text-gray-700 text-sm">{{ user.initials }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200 capitalize">
                  {{ user.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-gray-500">{{ user.joined }}</TableCell>
              <TableCell>
                <UserActions />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <UserDetailsSheet v-model:open="isSheetOpen" :user="selectedUser" />
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
import UserActions from '@/components/UserActions.vue'
import UserDetailsSheet from '@/components/UserDetailsSheet.vue'

definePageMeta({
  layout: 'dashboard'
})

const selectedFilter = ref('All users')
const searchCriteria = ref('Name')
const searchQuery = ref('')

const isSheetOpen = ref(false)
const selectedUser = ref(null)

const openUserSheet = (user: any) => {
  selectedUser.value = user
  isSheetOpen.value = true
}

const userStats = [
  { name: 'Total Users', value: '2,345', icon: 'lucide:users' },
  { name: 'Active Users', value: '2,345', icon: 'lucide:user-check' },
  { name: 'Inactive Users', value: '2,345', icon: 'lucide:user-x' },
  { name: 'Suspended Users', value: '2,345', icon: 'lucide:user-minus' }
];
const users = [
  { id: 1, name: 'Mark Lura', email: 'mlura@gmail.com', joined: '1hr ago', avatar: '', initials: 'ML', status: 'active' },
  { id: 2, name: 'Gina Tui', email: 'gina@gmail.com', joined: '2days ago', avatar: '', initials: 'GT', status: 'active' },
  { id: 3, name: 'Gina Tui', email: 'gina@gmail.com', joined: '2days ago', avatar: '', initials: 'GT', status: 'active' },
  { id: 4, name: 'Gina Tui', email: 'gina@gmail.com', joined: '2days ago', avatar: '', initials: 'GT', status: 'active' }
]
</script>
