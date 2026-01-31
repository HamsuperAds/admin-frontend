<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
                <CardContent class="p-6">
                    <div class="flex items-start gap-3">
                        <div class="p-2 bg-blue-100 rounded">
                            <Icon name="lucide:users" class="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-600 mb-1">Total Users</p>
                            <div v-if="loading" class="flex items-center h-9">
                                <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                            <p v-else class="text-3xl font-bold text-gray-900">{{
                                dashboardData?.total_users?.toLocaleString() || '0' }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="p-6">
                    <div class="flex items-start gap-3">
                        <div class="p-2 bg-blue-100 rounded">
                            <Icon name="lucide:megaphone" class="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-600 mb-1">Total Ads</p>
                            <div v-if="loading" class="flex items-center h-9">
                                <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                            <p v-else class="text-3xl font-bold text-gray-900">{{
                                dashboardData?.total_ads?.toLocaleString() || '0' }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="p-6">
                    <div class="flex items-start gap-3">
                        <div class="p-2 bg-blue-100 rounded">
                            <Icon name="lucide:credit-card" class="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-600 mb-1">Total Transactions</p>
                            <div v-if="loading" class="flex items-center h-9">
                                <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                            <p v-else class="text-3xl font-bold text-gray-900">₦{{
                                Number(dashboardData?.total_transaction_sum || 0).toLocaleString() }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="p-6">
                    <div class="flex items-start gap-3">
                        <div class="p-2 bg-blue-100 rounded">
                            <Icon name="lucide:eye" class="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-600 mb-1">Total Ad Views</p>
                            <div v-if="loading" class="flex items-center h-9">
                                <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                            <p v-else class="text-3xl font-bold text-gray-900">{{ Number(dashboardData?.total_ad_views
                                || 0).toLocaleString() }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Latest Users, Transactions, and Ads -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Latest Users -->
            <Card>
                <CardHeader class="pb-3">
                    <div class="flex items-center justify-between">
                        <CardTitle class="text-base font-semibold">Latest Users</CardTitle>
                        <button class="text-xs text-blue-600 hover:underline">view all</button>
                    </div>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div v-if="loading" class="flex items-center justify-center py-8">
                        <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin" />
                    </div>
                    <div v-else-if="latestUsers.length === 0" class="text-center py-8 text-gray-500 text-sm">
                        No users yet
                    </div>
                    <div v-else v-for="user in latestUsers" :key="user.email" class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <Avatar class="w-10 h-10">
                                <AvatarImage :src="user.avatar" :alt="user.name" />
                                <AvatarFallback class="bg-gray-300 text-gray-700 text-sm">{{ user.initials
                                    }}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                                <p class="text-xs text-gray-500">{{ user.email }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-500">joined</p>
                            <p class="text-xs font-medium text-gray-700">{{ user.joined }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Latest Transactions -->
            <Card>
                <CardHeader class="pb-3">
                    <div class="flex items-center justify-between">
                        <CardTitle class="text-base font-semibold">Latest Transactions</CardTitle>
                        <button class="text-xs text-blue-600 hover:underline">view all</button>
                    </div>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div v-if="loading" class="flex items-center justify-center py-8">
                        <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin" />
                    </div>
                    <div v-else-if="latestTransactions.length === 0" class="text-center py-8 text-gray-500 text-sm">
                        No transactions yet
                    </div>
                    <div v-else v-for="transaction in latestTransactions" :key="transaction.id"
                        class="flex items-start justify-between">
                        <div class="flex-1">
                            <p class="text-base font-bold text-gray-900 mb-1">{{ transaction.amount }}</p>
                            <p class="text-xs font-medium text-gray-700 mb-0.5">{{ transaction.product }}</p>
                            <p class="text-xs text-gray-500">{{ transaction.boostedBy }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-500 mb-1">status</p>
                            <Badge :variant="transaction.statusVariant" class="text-xs">
                                {{ transaction.status }}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Latest Feedback -->
            <Card>
                <CardHeader class="pb-3">
                    <div class="flex items-center justify-between">
                        <CardTitle class="text-base font-semibold">Latest Feedback</CardTitle>
                        <button class="text-xs text-blue-600 hover:underline">view all</button>
                    </div>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div v-if="loading" class="flex items-center justify-center py-8">
                        <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin" />
                    </div>
                    <div v-else-if="latestFeedback.length === 0" class="text-center py-8 text-gray-500 text-sm">
                        No feedback yet
                    </div>
                    <div v-else v-for="ad in latestFeedback" :key="ad.email" class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <Avatar class="w-10 h-10">
                                <AvatarImage :src="ad.avatar" :alt="ad.name" />
                                <AvatarFallback class="bg-gray-300 text-gray-700 text-sm">{{ ad.initials
                                    }}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ ad.name }}</p>
                                <p class="text-xs text-gray-500">{{ ad.email }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-500">joined</p>
                            <p class="text-xs font-medium text-gray-700">{{ ad.joined }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Recent Ads Table -->
        <Card>
            <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                    <CardTitle class="text-base font-semibold">Recent ads</CardTitle>
                    <button class="text-xs text-blue-600 hover:underline">View all ads</button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-16">S/N</TableHead>
                            <TableHead>Advert</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Created by</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="loading">
                            <TableCell colspan="6" class="text-center py-8">
                                <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin mx-auto" />
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="recentAds.length === 0">
                            <TableCell colspan="6" class="text-center py-8 text-gray-500 text-sm">
                                No ads yet
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="ad in recentAds" :key="ad.id">
                            <TableCell class="font-medium">{{ ad.id }}</TableCell>
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <img :src="ad.image" :alt="ad.title" class="w-10 h-10 rounded object-cover" />
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">{{ ad.title }}</p>
                                        <p class="text-xs text-gray-500">{{ ad.price }}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{{ ad.type }}</TableCell>
                            <TableCell>
                                <Badge :variant="ad.statusVariant">{{ ad.status }}</Badge>
                            </TableCell>
                            <TableCell>{{ ad.created }}</TableCell>
                            <TableCell>{{ ad.createdBy }}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Badge } from '@/components/ui/badge'

definePageMeta({
    layout: 'dashboard'
})

const api = useApi()

const dashboardData = ref<any>(null)
const loading = ref(false)

const fetchDashboardData = async () => {
    loading.value = true
    try {
        const response = await api.fetchGet('/dashboard')
        if (response) {
            dashboardData.value = (response as any).data
        }
    } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
    } finally {
        loading.value = false
    }
}

const latestUsers = computed(() => {
    if (!dashboardData.value?.latest_users) return []
    return dashboardData.value.latest_users.map((user: any) => ({
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        joined: formatRelativeTime(user.created_at),
        avatar: '',
        initials: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
    }))
})

const latestTransactions = computed(() => {
    if (!dashboardData.value?.latest_transactions) return []
    return dashboardData.value.latest_transactions.map((transaction: any) => ({
        id: transaction.id,
        amount: `₦${Number(transaction.amount).toLocaleString()}`,
        product: transaction.ad_title,
        boostedBy: `boosted to ${transaction.promotion_plan} by ${transaction.user_name}`,
        status: transaction.status,
        statusVariant: getTransactionStatusVariant(transaction.status)
    }))
})

const latestFeedback = computed(() => {
    if (!dashboardData.value?.latest_feedback) return []
    return dashboardData.value.latest_feedback.map((feedback: any) => ({
        name: feedback.from_user.name,
        email: feedback.message.substring(0, 50) + (feedback.message.length > 50 ? '...' : ''),
        joined: formatRelativeTime(feedback.created_at),
        avatar: feedback.from_user.avatar,
        initials: feedback.from_user.name.split(' ').map((n: string) => n.charAt(0)).join('')
    }))
})

const recentAds = computed(() => {
    if (!dashboardData.value?.latest_ads) return []
    return dashboardData.value.latest_ads.map((ad: any, index: number) => ({
        id: index + 1,
        title: ad.title,
        price: `₦${Number(ad.price).toLocaleString()}`,
        image: ad.primary_image || 'https://placehold.co/40x40',
        type: ad.promotion_plan || 'Standard',
        status: ad.status,
        statusVariant: getAdStatusVariant(ad.status),
        created: formatDate(ad.created_at),
        createdBy: ad.user_name
    }))
})

const getTransactionStatusVariant = (status: string) => {
    switch (status) {
        case 'successful':
            return 'default'
        case 'pending':
            return 'secondary'
        case 'failed':
            return 'destructive'
        default:
            return 'outline'
    }
}

const getAdStatusVariant = (status: string) => {
    switch (status) {
        case 'active':
            return 'default'
        case 'pending':
            return 'secondary'
        case 'sold':
            return 'outline'
        case 'suspended':
            return 'destructive'
        default:
            return 'outline'
    }
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 60) {
        return `${diffInMinutes}min ago`
    } else if (diffInHours < 24) {
        return `${diffInHours}hr ago`
    } else if (diffInDays === 1) {
        return '1 day ago'
    } else {
        return `${diffInDays} days ago`
    }
}

onMounted(() => {
    fetchDashboardData()
})
</script>
