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
                            <p class="text-3xl font-bold text-gray-900">2,345</p>
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
                            <p class="text-3xl font-bold text-gray-900">2,345</p>
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
                            <p class="text-3xl font-bold text-gray-900">N134k</p>
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
                            <p class="text-3xl font-bold text-gray-900">11,345k</p>
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
                    <div v-for="user in latestUsers" :key="user.email" class="flex items-center justify-between">
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
                    <div v-for="transaction in latestTransactions" :key="transaction.id"
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

            <!-- Latest Ads -->
            <Card>
                <CardHeader class="pb-3">
                    <div class="flex items-center justify-between">
                        <CardTitle class="text-base font-semibold">Latest Ads</CardTitle>
                        <button class="text-xs text-blue-600 hover:underline">view all</button>
                    </div>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div v-for="ad in latestAds" :key="ad.email" class="flex items-center justify-between">
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
                        <TableRow v-for="ad in recentAds" :key="ad.id">
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
import { Badge } from '@/components/ui/badge'

definePageMeta({
    layout: 'dashboard'
})

const latestUsers = [
    { name: 'Mark Lura', email: 'mlura@gmail.com', joined: '1hr ago', avatar: '', initials: 'ML' },
    { name: 'Gina Tui', email: 'gina@gmail.com', joined: '2days ago', avatar: '', initials: 'GT' },
    { name: 'Gina Tui', email: 'gina@gmail.com', joined: '2days ago', avatar: '', initials: 'GT' },
    { name: 'Gina Tui', email: 'gina@gmail.com', joined: '2days ago', avatar: '', initials: 'GT' }
]

const latestTransactions = [
    {
        id: 1,
        amount: '₦7,500',
        product: 'Tecno Camnon 20',
        boostedBy: 'boosted to bronze by Dina Gap!',
        status: 'successful',
        statusVariant: 'default'
    },
    {
        id: 2,
        amount: '₦15,500',
        product: 'Hero Electric Bike x40',
        boostedBy: 'boosted to silver by John Gap!',
        status: 'pending',
        statusVariant: 'secondary'
    },
    {
        id: 3,
        amount: '₦7,500',
        product: 'Tecno Camnon 20',
        boostedBy: 'boosted to bronze by Dina Gap!',
        status: 'failed',
        statusVariant: 'destructive'
    },
    {
        id: 4,
        amount: '₦7,500',
        product: 'Tecno Camnon 20',
        boostedBy: 'boosted to bronze by Dina Gap!',
        status: 'successful',
        statusVariant: 'default'
    }
]

const latestAds = [
    { name: 'Mark Lura', email: 'mlura@gmail.com', joined: '1hr ago', avatar: '', initials: 'ML' },
    { name: 'Gina Tui', email: 'gina@gmail.com', joined: '2days ago', avatar: '', initials: 'GT' },
    { name: 'Gina Tui', email: 'gina@gmail.com', joined: '2days ago', avatar: '', initials: 'GT' },
    { name: 'Gina Tui', email: 'gina@gmail.com', joined: '2days ago', avatar: '', initials: 'GT' }
]

const recentAds = [
    {
        id: 1,
        title: 'HP Elitebook G8 16gb RAM 254GB SSD',
        price: '₦7,500',
        image: 'https://placehold.co/40x40',
        type: 'Bronze',
        status: 'Available',
        statusVariant: 'default',
        created: '23/04/2025',
        createdBy: 'Kal Ginn'
    },
    {
        id: 2,
        title: 'Qlinq Motorcycle 2024 Black',
        price: '₦7,500',
        image: 'https://placehold.co/40x40',
        type: 'Silver',
        status: 'Available',
        statusVariant: 'default',
        created: '23/04/2025',
        createdBy: 'Kal Ginn'
    },
    {
        id: 3,
        title: 'Samsung Galaxy S25 4gb RAM',
        price: '₦7,500',
        image: 'https://placehold.co/40x40',
        type: 'Gold',
        status: 'Available',
        statusVariant: 'default',
        created: '23/04/2025',
        createdBy: 'Kal Ginn'
    },
    {
        id: 4,
        title: 'HP Elitebook G8 16gb RAM 254GB SSD',
        price: '₦7,500',
        image: 'https://placehold.co/40x40',
        type: 'Bronze',
        status: 'Unavailable',
        statusVariant: 'secondary',
        created: '23/04/2025',
        createdBy: 'Kal Ginn'
    }
]
</script>
