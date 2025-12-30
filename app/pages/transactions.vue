<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Transactions</h1>

        <!-- Transaction stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card v-for="stat in transactionStats" :key="stat.name">
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
                        <TableRow v-for="transaction in transactions" :key="transaction.id">
                            <TableCell class="font-medium">{{ transaction.id }}</TableCell>
                            <TableCell class="cursor-pointer hover:bg-gray-50"
                                @click="openTransactionSheet(transaction)">
                                <span class="text-sm font-medium text-blue-600">#{{ transaction.id }}</span>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">{{ transaction.product }}</p>
                                    <p class="text-xs text-gray-500">{{ transaction.boostedBy }}</p>
                                </div>
                            </TableCell>
                            <TableCell class="font-semibold">{{ transaction.amount }}</TableCell>
                            <TableCell>{{ transaction.user }}</TableCell>
                            <TableCell>
                                <Badge :variant="transaction.statusVariant">{{ transaction.status }}</Badge>
                            </TableCell>
                            <TableCell>{{ transaction.date }}</TableCell>
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
import { ref } from 'vue'
import { Badge } from '@/components/ui/badge'
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

definePageMeta({
    layout: 'dashboard'
})

const selectedFilter = ref('All transactions')
const searchCriteria = ref('Transaction ID')
const searchQuery = ref('')

const isSheetOpen = ref(false)
const selectedTransaction = ref(null)

const openTransactionSheet = (transaction: any) => {
    selectedTransaction.value = transaction
    isSheetOpen.value = true
}

const transactionStats = [
    { name: 'Total Transactions', value: '8,456', icon: 'lucide:credit-card' },
    { name: 'Successful', value: '7,200', icon: 'lucide:check-circle' },
    { name: 'Pending', value: '856', icon: 'lucide:clock' },
    { name: 'Failed', value: '300', icon: 'lucide:x-circle' },
    { name: 'Refunded', value: '100', icon: 'lucide:rotate-ccw' }
];

const transactions = [
    {
        id: 1,
        amount: '₦7,500',
        product: 'Tecno Camnon 20',
        boostedBy: 'boosted to bronze',
        user: 'Dina Gap',
        status: 'successful',
        statusVariant: 'default' as const,
        date: '23/04/2025'
    },
    {
        id: 2,
        amount: '₦15,500',
        product: 'Hero Electric Bike x40',
        boostedBy: 'boosted to silver',
        user: 'John Gap',
        status: 'pending',
        statusVariant: 'secondary' as const,
        date: '23/04/2025'
    },
    {
        id: 3,
        amount: '₦7,500',
        product: 'Tecno Camnon 20',
        boostedBy: 'boosted to bronze',
        user: 'Dina Gap',
        status: 'failed',
        statusVariant: 'destructive' as const,
        date: '22/04/2025'
    },
    {
        id: 4,
        amount: '₦25,000',
        product: 'Samsung Galaxy S25',
        boostedBy: 'boosted to gold',
        user: 'Jane Smith',
        status: 'successful',
        statusVariant: 'default' as const,
        date: '22/04/2025'
    },
    {
        id: 5,
        amount: '₦10,000',
        product: 'HP Laptop',
        boostedBy: 'boosted to silver',
        user: 'Mike Johnson',
        status: 'pending',
        statusVariant: 'secondary' as const,
        date: '21/04/2025'
    }
]
</script>
