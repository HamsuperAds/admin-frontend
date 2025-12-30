<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Ads</h1>

        <!-- Ad stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card v-for="stat in adStats" :key="stat.name">
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


        <!-- Ads Table -->
        <Card>
            <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 flex-1 max-w-md">
                        <div class="relative flex-1">
                            <Icon name="lucide:search" class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input v-model="searchQuery" :placeholder="`Find ad by ${searchCriteria.toLowerCase()}...`"
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
                                <DropdownMenuItem @click="searchCriteria = 'Title'">Title</DropdownMenuItem>
                                <DropdownMenuItem @click="searchCriteria = 'Created by'">Created by</DropdownMenuItem>
                                <DropdownMenuItem @click="searchCriteria = 'Type'">Type</DropdownMenuItem>
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
                            <DropdownMenuItem @click="selectedFilter = 'All ads'">All ads</DropdownMenuItem>
                            <DropdownMenuItem @click="selectedFilter = 'Active ads'">Active ads</DropdownMenuItem>
                            <DropdownMenuItem @click="selectedFilter = 'Pending ads'">Pending ads</DropdownMenuItem>
                            <DropdownMenuItem @click="selectedFilter = 'Sold ads'">Sold ads</DropdownMenuItem>
                            <DropdownMenuItem @click="selectedFilter = 'Suspended ads'">Suspended ads</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                            <TableHead class="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="ad in ads" :key="ad.id">
                            <TableCell class="font-medium">{{ ad.id }}</TableCell>
                            <TableCell class="cursor-pointer hover:bg-gray-50" @click="openAdSheet(ad)">
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
                            <TableCell>
                                <AdActions />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <AdDetailsSheet v-model:open="isSheetOpen" :ad="selectedAd" />
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
import AdActions from '@/components/AdActions.vue'
import AdDetailsSheet from '@/components/AdDetailsSheet.vue'

definePageMeta({
    layout: 'dashboard'
})

const selectedFilter = ref('All ads')
const searchCriteria = ref('Title')
const searchQuery = ref('')

const isSheetOpen = ref(false)
const selectedAd = ref(null)

const openAdSheet = (ad: any) => {
    selectedAd.value = ad
    isSheetOpen.value = true
}

const adStats = [
    { name: 'Total Ads', value: '12,345', icon: 'lucide:megaphone' },
    { name: 'Active Ads', value: '10,345', icon: 'lucide:check-circle' },
    { name: 'Pending Ads', value: '1,000', icon: 'lucide:clock' },
    { name: 'Sold Ads', value: '900', icon: 'lucide:shopping-bag' },
    { name: 'Suspended Ads', value: '100', icon: 'lucide:ban' }
];

const ads = [
    {
        id: 1,
        title: 'HP Elitebook G8 16gb RAM 254GB SSD',
        price: '₦7,500',
        image: 'https://placehold.co/40x40',
        type: 'Bronze',
        status: 'Available',
        statusVariant: 'default' as const, // Type assertion for Badge variant
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
        statusVariant: 'default' as const,
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
        statusVariant: 'default' as const,
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
        statusVariant: 'secondary' as const,
        created: '23/04/2025',
        createdBy: 'Kal Ginn'
    }
]
</script>
