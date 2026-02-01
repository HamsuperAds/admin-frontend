<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">User Feedback</h1>

        <!-- Feedback Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card v-for="stat in feedbackStats" :key="stat.name">
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

        <!-- Feedback Table -->
        <Card>
            <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                    <div class="font-medium text-lg">Feedbacks</div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-16">S/N</TableHead>
                            <TableHead>From User</TableHead>
                            <TableHead>To User</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Stats</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead class="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="loading" class="h-24">
                            <TableCell colspan="8" class="text-center text-gray-500">
                                Loading feedback...
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="feedbacks.length === 0" class="h-24">
                            <TableCell colspan="8" class="text-center text-gray-500">
                                No feedback found
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="(feedback, index) in feedbacks" :key="feedback.id"
                            :class="{ 'opacity-60': feedback.status === 'hidden' }">
                            <TableCell class="font-medium"
                                :class="{ 'bg-gradient-to-r from-red-100 to-transparent': feedback.status === 'hidden' }">
                                {{ (currentPage - 1) * pagination.perPage + index + 1 }}
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center gap-2">
                                    <img :src="feedback.from_user?.avatar || 'https://placehold.co/40x40'"
                                        class="w-8 h-8 rounded-full object-cover" />
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium">{{ feedback.from_user?.first_name }} {{
                                            feedback.from_user?.last_name }}</span>
                                        <span class="text-xs text-muted-foreground">{{ feedback.from_user?.email
                                        }}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center gap-2">
                                    <img :src="feedback.to_user?.avatar || 'https://placehold.co/40x40'"
                                        class="w-8 h-8 rounded-full object-cover" />
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium">{{ feedback.to_user?.first_name }} {{
                                            feedback.to_user?.last_name }}</span>
                                        <span class="text-xs text-muted-foreground">{{ feedback.to_user?.email }}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell class="max-w-[300px]">
                                <p class="truncate" :title="feedback.message">{{ feedback.message }}</p>
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center">
                                    <Icon name="lucide:star" class="w-4 h-4 text-yellow-400 fill-current" />
                                    <span class="ml-1">{{ feedback.rating }}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div class="flex flex-col gap-1 text-xs text-gray-500">
                                    <div class="flex items-center gap-1" title="Useful">
                                        <Icon name="lucide:thumbs-up" class="w-3 h-3" /> {{ feedback.helpful_count }}
                                    </div>
                                    <div class="flex items-center gap-1" title="Unclear">
                                        <Icon name="lucide:help-circle" class="w-3 h-3" /> {{ feedback.unclear_count }}
                                    </div>
                                    <div class="flex items-center gap-1" title="Offensive">
                                        <Icon name="lucide:flag" class="w-3 h-3 text-red-400" /> {{
                                            feedback.offensive_count }}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{{ new Date(feedback.created_at).toLocaleDateString() }}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="ghost" class="h-8 w-8 p-0">
                                            <span class="sr-only">Open menu</span>
                                            <Icon name="lucide:more-horizontal" class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem @click="deleteFeedback(feedback.id)"
                                            class="text-red-600 focus:text-red-600">
                                            <Icon name="lucide:trash" class="mr-2 h-4 w-4" />
                                            Delete feedback
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="hideFeedback(feedback)">
                                            <Icon :name="feedback.status === 'hidden' ? 'lucide:eye' : 'lucide:eye-off'"
                                                class="mr-2 h-4 w-4" />
                                            {{ feedback.status === 'hidden' ? 'Show feedback' : 'Hide feedback' }}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
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
    PaginationItem,
    PaginationLast,
    PaginationNext,
    PaginationPrevious as PaginationPrev,
} from '@/components/ui/pagination'
import { toast } from 'vue-sonner'
import type { Feedback, FeedbackStatsResponse, FeedbackResponse } from '@/types/feedback'

definePageMeta({
    layout: 'dashboard'
})

const api = useApi()

const feedbacks = ref<Feedback[]>([])
const loading = ref(false)
const loadingStats = ref(false)

const pagination = ref({
    total: 0,
    perPage: 15,
})

const currentPage = ref(1)

const feedbackStats = ref([
    { name: 'Total Feedback', value: '0', icon: 'lucide:message-square' },
    { name: 'Useful Counts', value: '0', icon: 'lucide:thumbs-up' },
    { name: 'Unclear Counts', value: '0', icon: 'lucide:help-circle' },
    { name: 'Offensive Counts', value: '0', icon: 'lucide:flag' }
]);

const fetchStats = async () => {
    loadingStats.value = true
    try {
        const response = await api.fetchGet('/user-feedbacks/stats') as FeedbackStatsResponse
        if (response && response.success) {
            const stats = response.data
            feedbackStats.value = [
                { name: 'Total Feedback', value: stats.total_feedback.toString(), icon: 'lucide:message-square' },
                { name: 'Useful Counts', value: stats.useful_counts.toString(), icon: 'lucide:thumbs-up' },
                { name: 'Unclear Counts', value: stats.unclear_count.toString(), icon: 'lucide:help-circle' },
                { name: 'Offensive Counts', value: stats.offensive_count.toString(), icon: 'lucide:flag' }
            ]
        }
    } catch (err) {
        console.error('Failed to fetch feedback stats:', err)
        toast.error('Failed to load feedback statistics')
    } finally {
        loadingStats.value = false
    }
}

const fetchFeedbacks = async (page = 1) => {
    loading.value = true
    try {
        const response = await api.fetchGet('/user-feedbacks', {
            params: {
                page: page // Assuming 'page' is the param based on typical Laravel/Nuxt patterns, or 'current_page' if manual. 
                // The ads page used 'current_page'. The sample response has 'current_page' in pagination object.
                // Usually query param is 'page'. I will try 'page' first.
            }
        }) as FeedbackResponse

        if (response && response.success) {
            feedbacks.value = response.data
            pagination.value.total = response.pagination.total
            pagination.value.perPage = response.pagination.per_page
            // Update current page if backend adjusts it (optional)
        }
    } catch (err) {
        console.error('Failed to fetch feedbacks:', err)
        toast.error('Failed to load feedbacks')
    } finally {
        loading.value = false
    }
}

const deleteFeedback = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return

    const loadingToast = toast.loading('Deleting feedback...')
    try {
        await api.fetchDelete(`/user-feedbacks/${id}`)
        toast.success('Feedback deleted successfully', { id: loadingToast })
        fetchFeedbacks(currentPage.value)
        fetchStats()
    } catch (err) {
        console.error('Failed to delete feedback:', err)
        toast.error('Failed to delete feedback', { id: loadingToast })
    }
}

const hideFeedback = async (feedback: Feedback) => {
    const newStatus = feedback.status === 'hidden' ? 'visible' : 'hidden'
    const loadingToast = toast.loading(`Updating feedback status to ${newStatus}...`)

    try {
        await api.fetchPost(`/user-feedbacks/${feedback.id}/status`, {
            _method: 'PUT',
            status: newStatus
        })
        toast.success(`Feedback ${newStatus === 'hidden' ? 'hidden' : 'visible'} successfully`, { id: loadingToast })
        fetchFeedbacks(currentPage.value)
    } catch (err) {
        console.error('Failed to update feedback status:', err)
        toast.error('Failed to update feedback status', { id: loadingToast })
    }
}

watch(currentPage, (newPage) => {
    fetchFeedbacks(newPage)
}, { immediate: true })

onMounted(() => {
    fetchStats()
})
</script>
