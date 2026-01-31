<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Verification Requests</h1>

        <!-- Verification Request stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <Card v-for="stat in verificationStats" :key="stat.name">
                <CardContent class="p-6">
                    <div class="flex items-start gap-3">
                        <div :class="['p-2 rounded', stat.bgColor]">
                            <Icon :name="stat.icon" :class="['w-5 h-5', stat.iconColor]" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-600 mb-1">{{ stat.name }}</p>
                            <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>


        <!-- Verification Requests Table -->
        <Card>
            <CardHeader class="pb-3">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-2 flex-1 max-w-md">
                        <div class="relative flex-1">
                            <Icon name="lucide:search" class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input v-model="searchQuery" @input="handleSearch"
                                placeholder="Search by business name, user name, or email..." class="pl-9 h-9" />
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button variant="outline" class="h-9 gap-2 text-xs font-normal">
                                    <Icon name="lucide:filter" class="w-3.5 h-3.5" />
                                    <span>{{ getFilterLabel() }}</span>
                                    <Icon name="lucide:chevron-down" class="w-3.5 h-3.5 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" class="w-[160px]">
                                <DropdownMenuItem @click="handleFilterChange(null)">All requests
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handleFilterChange('pending')">Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handleFilterChange('under_review')">Under Review
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handleFilterChange('approved')">Approved
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handleFilterChange('rejected')">Rejected
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handleFilterChange('resubmitted')">Resubmitted
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button variant="outline" class="h-9 gap-2 text-xs font-normal">
                                    <span>{{ filters.per_page }} per page</span>
                                    <Icon name="lucide:chevron-down" class="w-3.5 h-3.5 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem @click="handlePerPageChange(15)">15 per page
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handlePerPageChange(25)">25 per page
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handlePerPageChange(50)">50 per page
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handlePerPageChange(100)">100 per page
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-16">S/N</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Business Name</TableHead>
                            <TableHead>ID Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead class="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="pending">
                            <TableCell colspan="7" class="text-center py-8 text-gray-500">
                                Loading verification requests...
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="error">
                            <TableCell colspan="7" class="text-center py-8 text-red-500">
                                Error loading verification requests. Please try again.
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="verificationRequests.length === 0">
                            <TableCell colspan="7" class="text-center py-8 text-gray-500">
                                No verification requests found.
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="(request, index) in verificationRequests" :key="request.id">
                            <TableCell class="font-medium">{{ getRowNumber(index) }}</TableCell>
                            <TableCell>
                                <div class="flex items-center gap-2">
                                    <img :src="request.user.avatar || '/default-avatar.png'"
                                        :alt="getUserFullName(request.user)" class="w-8 h-8 rounded-full" />
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">{{ getUserFullName(request.user) }}
                                        </p>
                                        <p class="text-xs text-gray-500">{{ request.user.email }}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p class="text-sm font-medium text-gray-900">{{ request.business_name }}</p>
                                <p class="text-xs text-gray-500">{{ request.business_phone_number }}</p>
                            </TableCell>
                            <TableCell>
                                <p class="text-sm text-gray-700">{{ request.id_type.label }}</p>
                            </TableCell>
                            <TableCell>
                                <Badge :variant="getStatusVariant(request.status.value)">{{ request.status.label
                                    }}</Badge>
                            </TableCell>
                            <TableCell>{{ formatDate(request.submitted_at) }}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="ghost" size="icon" class="h-8 w-8">
                                            <Icon name="lucide:more-vertical" class="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem @click="viewRequest(request.id)">
                                            <Icon name="lucide:eye" class="w-4 h-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem v-if="!request.is_final" @click="reviewRequest(request.id)">
                                            <Icon name="lucide:check-circle" class="w-4 h-4 mr-2" />
                                            Review
                                        </DropdownMenuItem>
                                        <DropdownMenuItem class="text-red-600" @click="confirmDelete(request)">
                                            <Icon name="lucide:trash-2" class="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <!-- Pagination -->
                <div v-if="meta" class="flex items-center justify-between mt-4">
                    <div class="text-sm text-gray-600">
                        Showing {{ meta.from }} to {{ meta.to }} of {{ meta.total }} entries
                    </div>
                    <div class="flex items-center gap-2">
                        <Button variant="outline" size="sm" :disabled="!links?.prev" @click="goToPage(1)">
                            First
                        </Button>
                        <Button variant="outline" size="sm" :disabled="!links?.prev"
                            @click="goToPage(meta.current_page - 1)">
                            Previous
                        </Button>
                        <span class="text-sm text-gray-600">
                            Page {{ meta.current_page }} of {{ meta.last_page }}
                        </span>
                        <Button variant="outline" size="sm" :disabled="!links?.next"
                            @click="goToPage(meta.current_page + 1)">
                            Next
                        </Button>
                        <Button variant="outline" size="sm" :disabled="!links?.next" @click="goToPage(meta.last_page)">
                            Last
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Delete Confirmation Dialog -->
        <AlertDialog v-model:open="showDeleteDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Verification Request</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this verification request for <strong>{{
                            requestToDelete?.business_name }}</strong>?
                        <br /><br />
                        This action cannot be undone. All associated documents will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="handleDelete" class="bg-red-600 hover:bg-red-700">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>


<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { VerificationRequest, VerificationStatus } from '@/types/verificationRequest'
import { toast } from 'vue-sonner'

definePageMeta({
    layout: 'dashboard'
})

const { getVerificationRequests, getVerificationStatistics, deleteVerificationRequest } = useVerificationRequests()

// Filters and search
const filters = ref({
    page: 1,
    per_page: 15,
    status: null as VerificationStatus | null,
    search: null as string | null,
})

const searchQuery = ref('')
const showDeleteDialog = ref(false)
const requestToDelete = ref<VerificationRequest | null>(null)

// Fetch data
const { data: requestsData, pending, error, refresh } = await getVerificationRequests(filters.value)
const { data: statsData } = await getVerificationStatistics()

// Computed properties
const verificationRequests = computed(() => requestsData.value?.data || [])
const meta = computed(() => requestsData.value?.meta)
const links = computed(() => requestsData.value?.links)

// Statistics with colors
const verificationStats = computed(() => {
    const stats = statsData.value?.data
    if (!stats) return []

    return [
        {
            name: 'Total',
            value: stats.total.toLocaleString(),
            icon: 'lucide:file-check',
            bgColor: 'bg-gray-100',
            iconColor: 'text-gray-600'
        },
        {
            name: 'Pending',
            value: stats.pending.toLocaleString(),
            icon: 'lucide:clock',
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
        },
        {
            name: 'Under Review',
            value: stats.under_review.toLocaleString(),
            icon: 'lucide:eye',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            name: 'Approved',
            value: stats.approved.toLocaleString(),
            icon: 'lucide:check-circle',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            name: 'Rejected',
            value: stats.rejected.toLocaleString(),
            icon: 'lucide:x-circle',
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600'
        },
        {
            name: 'Resubmitted',
            value: stats.resubmitted.toLocaleString(),
            icon: 'lucide:refresh-cw',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
        }
    ]
})

// Helper functions
const getStatusVariant = (status: VerificationStatus) => {
    switch (status) {
        case 'approved':
            return 'default'
        case 'pending':
            return 'secondary'
        case 'under_review':
            return 'outline'
        case 'rejected':
            return 'destructive'
        case 'resubmitted':
            return 'secondary'
        default:
            return 'default'
    }
}

const getUserFullName = (user: { first_name: string; last_name: string }) => {
    return `${user.first_name} ${user.last_name}`
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getRowNumber = (index: number) => {
    if (!meta.value) return index + 1
    return (meta.value.current_page - 1) * meta.value.per_page + index + 1
}

const getFilterLabel = () => {
    if (!filters.value.status) return 'All requests'
    return filters.value.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Event handlers
let searchTimeout: NodeJS.Timeout

const handleSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        filters.value.search = searchQuery.value || null
        filters.value.page = 1
        refresh()
    }, 500)
}

const handleFilterChange = (status: VerificationStatus | null) => {
    filters.value.status = status
    filters.value.page = 1
    refresh()
}

const handlePerPageChange = (perPage: number) => {
    filters.value.per_page = perPage
    filters.value.page = 1
    refresh()
}

const goToPage = (page: number) => {
    filters.value.page = page
    refresh()
}

const viewRequest = (id: string) => {
    navigateTo(`/verification-request/${id}`)
}

const reviewRequest = (id: string) => {
    navigateTo(`/verification-request/${id}?review=true`)
}

const confirmDelete = (request: VerificationRequest) => {
    requestToDelete.value = request
    showDeleteDialog.value = true
}

const handleDelete = async () => {
    if (!requestToDelete.value) return

    try {
        await deleteVerificationRequest(requestToDelete.value.id)
        toast.success('Verification request deleted successfully')
        showDeleteDialog.value = false
        requestToDelete.value = null
        refresh()
    } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete verification request')
    }
}

// Watch for filter changes
watch(filters, () => {
    refresh()
}, { deep: true })
</script>
