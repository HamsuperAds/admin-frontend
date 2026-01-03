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
                            <div v-if="loadingStats" class="flex items-center h-9">
                                <Icon name="lucide:loader-2" class="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                            <p v-else class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
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
                            <Icon v-if="loadingSearch" name="lucide:loader-2"
                                class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 animate-spin" />
                            <Icon v-else name="lucide:search" class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input v-model="searchQuery" placeholder="Search ads..." class="pl-9 h-9" />
                        </div>
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
                        <TableRow v-if="loading" class="h-24">
                            <TableCell colspan="7" class="text-center text-gray-500">
                                Loading ads...
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="ads.length === 0" class="h-24">
                            <TableCell colspan="7" class="text-center text-gray-500">
                                No ads found
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="(ad, index) in ads" :key="ad.id">
                            <TableCell class="font-medium">{{ (currentPage - 1) * pagination.perPage + index + 1 }}
                            </TableCell>
                            <TableCell class="cursor-pointer hover:bg-gray-50" @click="openAdSheet(ad)">
                                <div class="flex items-center gap-3">
                                    <img :src="ad.primary_image?.image_path || 'https://placehold.co/40x40'"
                                        :alt="ad.title" class="w-10 h-10 rounded object-cover" />
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">{{ ad.title }}</p>
                                        <p class="text-xs text-gray-500">₦{{ Number(ad.price).toLocaleString() }}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{{ ad.promotion_type || 'Standard' }}</TableCell>
                            <TableCell>
                                <Badge :class="getStatusClass(ad.status)" variant="outline">{{ ad.status }}</Badge>
                            </TableCell>
                            <TableCell>{{ new Date(ad.created_at).toLocaleDateString() }}</TableCell>
                            <TableCell>{{ ad.user?.first_name }} {{ ad.user?.last_name }}</TableCell>
                            <TableCell>
                                <AdActions />
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

        <AdDetailsSheet v-model:open="isSheetOpen" :ad="selectedAd" />
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationNext,
    PaginationPrevious as PaginationPrev,
} from '@/components/ui/pagination'
import AdActions from '@/components/AdActions.vue'
import AdDetailsSheet from '@/components/AdDetailsSheet.vue'
import type { Ad } from '@/types/ad'

definePageMeta({
    layout: 'dashboard'
})

const api = useApi()

const selectedFilter = ref('All ads')
const searchQuery = ref('')
const ads = ref<Ad[]>([])
const loading = ref(false)
const loadingStats = ref(false)
const loadingSearch = ref(false)
const isSheetOpen = ref(false)
const selectedAd = ref<Ad | null>(null)

const pagination = ref({
    total: 0,
    perPage: 15,
})

const currentPage = ref(1)

const openAdSheet = (ad: Ad) => {
    selectedAd.value = ad
    isSheetOpen.value = true
}

const adStats = ref([
    { name: 'Total Ads', value: '0', icon: 'lucide:megaphone' },
    { name: 'Active Ads', value: '0', icon: 'lucide:check-circle' },
    { name: 'Pending Ads', value: '0', icon: 'lucide:clock' },
    { name: 'Sold Ads', value: '0', icon: 'lucide:shopping-bag' },
    { name: 'Suspended Ads', value: '0', icon: 'lucide:ban' }
]);

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'active': return 'default'; // Using default for active/green-ish usually, but we customize classes below
        case 'pending': return 'secondary';
        case 'rejected': return 'destructive';
        case 'expired': return 'outline';
        case 'sold': return 'secondary';
        default: return 'outline';
    }
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-50 text-green-700 border-green-200';
        case 'pending': return 'bg-orange-50 text-orange-700 border-orange-200';
        case 'suspended': return 'bg-red-50 text-red-700 border-red-200';
        case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
        case 'sold': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'expired': return 'bg-gray-50 text-gray-700 border-gray-200';
        default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
}

const getStatusParam = () => {
    switch (selectedFilter.value) {
        case 'Active ads': return 'active';
        case 'Pending ads': return 'pending';
        case 'Sold ads': return 'sold';
        case 'Suspended ads': return 'suspended';
        default: return undefined;
    }
}

const fetchAdStats = async () => {
    loadingStats.value = true
    try {
        const response = await api.fetchGet('/ads/stats')
        if (response) {
            const data = response as any
            const stats = data.data
            adStats.value = [
                { name: 'Total Ads', value: stats.total_ads.toLocaleString(), icon: 'lucide:megaphone' },
                { name: 'Active Ads', value: stats.active_ads.toLocaleString(), icon: 'lucide:check-circle' },
                { name: 'Pending Ads', value: stats.pending_ads.toLocaleString(), icon: 'lucide:clock' },
                { name: 'Sold Ads', value: stats.sold_ads.toLocaleString(), icon: 'lucide:shopping-bag' },
                { name: 'Suspended Ads', value: stats.suspended_ads.toLocaleString(), icon: 'lucide:ban' }
            ]
        }
    } catch (err) {
        console.error('Failed to fetch ad stats:', err)
    } finally {
        loadingStats.value = false
    }
}

const fetchAds = async (page = 1) => {
    loading.value = true
    try {
        const params: Record<string, any> = {
            current_page: page,
        }

        const status = getStatusParam()
        if (status) {
            params.status = status
        }

        if (searchQuery.value && searchQuery.value.length >= 2) {
            params.query = searchQuery.value
        }

        const response = await api.fetchGet('/ads', { params })
        if (response) {
            const data = response as any
            ads.value = data.data.data
            pagination.value.total = Number(data.data.total)
            pagination.value.perPage = Number(data.data.per_page)
        }
    } catch (err) {
        console.error('Failed to fetch ads:', err)
    } finally {
        loading.value = false
    }
}

watch(selectedFilter, () => {
    if (currentPage.value !== 1) {
        currentPage.value = 1
    } else {
        fetchAds(1)
    }
})

watchDebounced(
    searchQuery,
    async (newQuery) => {
        if (newQuery.length >= 2 || newQuery.length === 0) {
            loadingSearch.value = true
            if (currentPage.value !== 1) {
                currentPage.value = 1
            } else {
                await fetchAds(1)
            }
            loadingSearch.value = false
        }
    },
    { debounce: 500, maxWait: 1000 }
)

watch(currentPage, (newPage) => {
    fetchAds(newPage)
}, { immediate: true })

onMounted(() => {
    fetchAdStats()
})
</script>
