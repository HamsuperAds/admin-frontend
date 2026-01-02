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
              <div v-if="loadingStats" class="flex items-center h-9">
                <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin" />
              </div>
              <p v-else class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
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
            <TableRow v-if="loading" class="h-24">
              <TableCell colspan="5" class="text-center text-gray-500">
                Loading users...
              </TableCell>
            </TableRow>
            <TableRow v-else-if="users.length === 0" class="h-24">
              <TableCell colspan="5" class="text-center text-gray-500">
                No users found
              </TableCell>
            </TableRow>
            <TableRow v-else v-for="(user, index) in users" :key="user.id">
              <TableCell>{{ (currentPage - 1) * pagination.perPage + index + 1 }}</TableCell>
              <TableCell class="cursor-pointer hover:bg-gray-50" @click="openUserSheet(user)">
                <div class="flex items-center gap-3">
                  <Avatar class="w-10 h-10">
                    <AvatarImage :src="user.avatar || undefined" :alt="user.first_name" />
                    <AvatarFallback class="bg-gray-300 text-gray-700 text-sm">
                      {{ user.first_name?.[0] }}{{ user.last_name?.[0] }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" :class="{
                  'bg-green-50 text-green-700 border-green-200': user.status === 'active',
                  'bg-yellow-50 text-yellow-700 border-yellow-200': user.status === 'suspended',
                  'bg-gray-50 text-gray-700 border-gray-200': user.status === 'inactive'
                }" class="capitalize">
                  {{ user.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-gray-500">{{ new Date(user.created_at).toLocaleDateString() }}</TableCell>
              <TableCell>
                <UserActions />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div class="mt-4 flex justify-end" v-if="pagination.total > 0">
          <Pagination v-model:page="currentPage" :total="pagination.total" :items-per-page="pagination.perPage"
            :sibling-count="1" show-edges>
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
              <PaginationFirst />
              <PaginationPrev />

              <template v-for="(item, index) in items">
                <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                  <Button class="w-10 h-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'">
                    {{ item.value }}
                  </Button>
                </PaginationItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext />
              <PaginationLast />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>

    <UserDetailsSheet v-if="isSheetOpen" v-model:open="isSheetOpen" :user="selectedUser" :loading="loadingDetails" />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious as PaginationPrev,
  PaginationItem,
} from '@/components/ui/pagination'
import UserActions from '@/components/UserActions.vue'
import UserDetailsSheet from '@/components/UserDetailsSheet.vue'
import { useApi } from '@/composables/useApi'
import type { User } from '@/types/user'

definePageMeta({
  layout: 'dashboard'
})

const api = useApi()

const selectedFilter = ref('All users')
const searchCriteria = ref('Name')
const searchQuery = ref('')
const users = ref<User[]>([])
const loading = ref(false)
const loadingDetails = ref(false)

const pagination = ref({
  total: 0,
  perPage: 15,
})

const currentPage = ref(1)

const isSheetOpen = ref(false)
const selectedUser = ref<User | null>(null)

// Map filter text to API status param
const getStatusParam = () => {
  switch (selectedFilter.value) {
    case 'Active users': return 'active';
    case 'Inactive users': return 'inactive';
    case 'Suspended users': return 'suspended';
    default: return undefined;
  }
}

const fetchUsers = async (page = 1) => {
  loading.value = true

  try {
    const params: Record<string, any> = {
      current_page: page,
    }

    const status = getStatusParam()
    if (status) {
      params.status = status
    }

    const response = await api.fetchGet('/users', {
      params
    })

    if (response) {
      const data = response as any
      users.value = data.data.data

      // Only update total and perPage - don't touch currentPage to avoid reset loop
      pagination.value.total = Number(data.data.total)
      pagination.value.perPage = Number(data.data.per_page)
    }
  } catch (err) {
    console.error('Failed to fetch users:', err)
  } finally {
    loading.value = false
  }
}

// Watch for filter changes
watch(selectedFilter, () => {
  // Reset to first page when filter changes
  if (currentPage.value !== 1) {
    currentPage.value = 1
  } else {
    fetchUsers(1)
  }
})

const openUserSheet = async (user: User) => {
  selectedUser.value = user
  isSheetOpen.value = true

  // Fetch full details
  loadingDetails.value = true
  try {
    const response = await api.fetchGet(`/users/${user.id}`)
    if (response) {
      const data = response as any
      // Merge existing user data with fresh detailed data
      selectedUser.value = { ...user, ...data.data }
    }
  } catch (err) {
    console.error('Failed to fetch user details:', err)
  } finally {
    loadingDetails.value = false
  }
}

// Watch for pagination changes - immediate: true handles initial load
watch(currentPage, (newPage) => {
  fetchUsers(newPage)
}, { immediate: true })

// User stats
const loadingStats = ref(true)
const userStats = ref([
  { name: 'Total Users', value: '0', icon: 'lucide:users' },
  { name: 'Active Users', value: '0', icon: 'lucide:user-check' },
  { name: 'Inactive Users', value: '0', icon: 'lucide:user-x' },
  { name: 'Suspended Users', value: '0', icon: 'lucide:user-minus' }
])

const fetchUserStats = async () => {
  loadingStats.value = true
  try {
    const response = await api.fetchGet('/users/stats')
    if (response) {
      const data = response as any
      const stats = data.data
      userStats.value = [
        { name: 'Total Users', value: stats.total_users.toLocaleString(), icon: 'lucide:users' },
        { name: 'Active Users', value: stats.active_users.toLocaleString(), icon: 'lucide:user-check' },
        { name: 'Inactive Users', value: stats.inactive_users.toLocaleString(), icon: 'lucide:user-x' },
        { name: 'Suspended Users', value: stats.suspended_users.toLocaleString(), icon: 'lucide:user-minus' }
      ]
    }
  } catch (err) {
    console.error('Failed to fetch user stats:', err)
  } finally {
    loadingStats.value = false
  }
}

// Fetch stats on mount
onMounted(() => {
  fetchUserStats()
})
</script>
