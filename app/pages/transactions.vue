<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Transactions</h1>

        <!-- Transaction stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <!-- Loading State -->
            <Card v-if="statsPending" v-for="n in 5" :key="n">
                <CardContent class="p-6">
                    <div class="flex items-start gap-3">
                        <div class="p-2 bg-gray-100 rounded animate-pulse">
                            <div class="w-5 h-5 bg-gray-300 rounded"></div>
                        </div>
                        <div class="flex-1">
                            <div class="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                            <div class="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Actual Stats -->
            <Card v-else v-for="stat in transactionStats" :key="stat.name">
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


        <!-- Transactions Table -->
        <Card>
            <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 flex-1 max-w-md">
                        <div class="relative flex-1">
                            <Icon name="lucide:search" class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input v-model="searchQuery"
                                :placeholder="`Find transaction by ${searchCriteria.toLowerCase()}...`"
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
                                <DropdownMenuItem @click="searchCriteria = 'Transaction ID'">Transaction ID
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="searchCriteria = 'User'">User</DropdownMenuItem>
                                <DropdownMenuItem @click="searchCriteria = 'Product'">Product</DropdownMenuItem>
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
                        <DropdownMenuContent align="end" class="w-[160px]">
                            <DropdownMenuItem @click="selectedFilter = 'All transactions'">All transactions
                            </DropdownMenuItem>
                            <DropdownMenuItem @click="selectedFilter = 'Successful'">Successful</DropdownMenuItem>
                            <DropdownMenuItem @click="selectedFilter = 'Pending'">Pending</DropdownMenuItem>
                            <DropdownMenuItem @click="selectedFilter = 'Failed'">Failed</DropdownMenuItem>
                            <DropdownMenuItem @click="selectedFilter = 'Refunded'">Refunded</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-16">S/N</TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead class="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="pending">
                            <TableCell colspan="8" class="text-center py-8 text-gray-500">
                                Loading transactions...
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="error">
                            <TableCell colspan="8" class="text-center py-8 text-red-500">
                                Error loading transactions. Please try again.
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="transactions.length === 0">
                            <TableCell colspan="8" class="text-center py-8 text-gray-500">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="(transaction, index) in transactions" :key="transaction.id">
                            <TableCell class="font-medium">{{ index + 1 }}</TableCell>
                            <TableCell class="cursor-pointer hover:bg-gray-50"
                                @click="openTransactionSheet(transaction)">
                                <span class="text-sm font-medium text-blue-600">#{{ transaction.reference }}</span>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">{{ transaction.ad?.title || 'N/A' }}
                                    </p>
                                    <p class="text-xs text-gray-500">boosted to {{ transaction.promotion_plan?.name ||
                                        'N/A' }}</p>
                                </div>
                            </TableCell>
                            <TableCell class="font-semibold">{{ formatAmount(transaction.amount) }}</TableCell>
                            <TableCell>{{ getUserName(transaction) }}</TableCell>
                            <TableCell>
                                <Badge :variant="getStatusVariant(transaction.status)">{{ transaction.status }}</Badge>
                            </TableCell>
                            <TableCell>{{ formatDate(transaction.created_at) }}</TableCell>
                            <TableCell>
                                <TransactionActions />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <TransactionDetailsSheet v-model:open="isSheetOpen" :transaction="selectedTransaction" />
    </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { Badge } from '@/components/ui/badge'

useSeoMeta({
  title: 'Transactions - Hamsuper',
  description: 'Monitor and manage all financial transactions on Hamsuper.'
})
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TransactionActions from '@/components/TransactionActions.vue'
import TransactionDetailsSheet from '@/components/TransactionDetailsSheet.vue'
import type { Transaction, TransactionsApiResponse, TransactionStatsResponse } from '@/types/transaction'

definePageMeta({
    layout: 'dashboard'
})

const { get } = useApi()

const selectedFilter = ref('All transactions')
const searchCriteria = ref('Transaction ID')
const searchQuery = ref('')

const isSheetOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

// Fetch transactions from API
const { data: transactionsData, pending, error, refresh } = await get<TransactionsApiResponse>('/transactions')

// Fetch transaction stats from API
const { data: statsData, pending: statsPending } = await get<TransactionStatsResponse>('/transactions/stats')

const openTransactionSheet = (transaction: Transaction) => {
    selectedTransaction.value = transaction
    isSheetOpen.value = true
}

// Helper function to get status variant for Badge component
const getStatusVariant = (status: string) => {
    switch (status) {
        case 'successful':
            return 'default'
        case 'pending':
            return 'secondary'
        case 'failed':
        case 'refunded':
            return 'destructive'
        default:
            return 'default'
    }
}

// Helper function to format amount
const formatAmount = (amount: string) => {
    return `₦${parseFloat(amount).toLocaleString()}`
}

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Helper function to get user full name
const getUserName = (transaction: Transaction) => {
    if (!transaction.user) return 'N/A'
    return `${transaction.user.first_name} ${transaction.user.last_name}`
}

// Compute transaction stats from API data
const transactionStats = computed(() => {
    if (!statsData.value?.data) {
        return [
            { name: 'Total Transactions', value: '0', icon: 'lucide:credit-card' },
            { name: 'Successful', value: '0', icon: 'lucide:check-circle' },
            { name: 'Pending', value: '0', icon: 'lucide:clock' },
            { name: 'Failed', value: '0', icon: 'lucide:x-circle' },
            { name: 'Total Revenue', value: '₦0', icon: 'lucide:banknote' }
        ]
    }

    const stats = statsData.value.data

    return [
        {
            name: 'Total Transactions',
            value: stats.total_transactions.toLocaleString(),
            icon: 'lucide:credit-card'
        },
        {
            name: 'Successful',
            value: stats.successful_transactions.toLocaleString(),
            icon: 'lucide:check-circle'
        },
        {
            name: 'Pending',
            value: stats.pending_transactions.toLocaleString(),
            icon: 'lucide:clock'
        },
        {
            name: 'Failed',
            value: stats.failed_transactions.toLocaleString(),
            icon: 'lucide:x-circle'
        },
        {
            name: 'Total Revenue',
            value: formatAmount(stats.total_revenue),
            icon: 'lucide:banknote'
        }
    ]
})

// Get transactions array from API response
const transactions = computed(() => {
    return transactionsData.value?.data?.data || []
})
</script>
