<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Categories & Subcategories</h1>

        <Tabs v-model="activeTab" class="w-full">
            <TabsList class="mb-6">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
            </TabsList>

            <!-- Categories Tab Content -->
            <TabsContent value="categories">
                <Card>
                    <CardHeader class="pb-3">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-medium text-gray-700">All Categories</h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead class="w-16">ID</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Ads Count</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead class="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-if="loadingCategories" class="h-24">
                                    <TableCell colspan="6" class="text-center text-gray-500">
                                        <div class="flex justify-center items-center gap-2">
                                            <Icon name="lucide:loader-2" class="w-4 h-4 text-blue-600 animate-spin" />
                                            Loading categories...
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow v-else-if="categories.length === 0" class="h-24">
                                    <TableCell colspan="6" class="text-center text-gray-500">
                                        No categories found
                                    </TableCell>
                                </TableRow>
                                <TableRow v-else v-for="category in categories" :key="category.id"
                                    class="hover:bg-gray-50">
                                    <TableCell class="font-medium">{{ category.id }}</TableCell>
                                    <TableCell>
                                        <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                            <img :src="category.image" :alt="category.name"
                                                class="w-full h-full object-cover">
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        class="font-medium text-gray-900 cursor-pointer text-blue-600 hover:underline"
                                        @click="filterSubcategories(category)">{{ category.name }}</TableCell>
                                    <TableCell>{{ category.adsCount }}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline"
                                            :class="category.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'">
                                            {{ category.is_active ? 'Active' : 'Inactive' }}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger as-child>
                                                <Button variant="ghost" class="h-8 w-8 p-0">
                                                    <span class="sr-only">Open menu</span>
                                                    <Icon name="lucide:more-horizontal" class="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem v-if="!category.is_active"
                                                    @click="toggleCategoryStatus(category)">Activate</DropdownMenuItem>
                                                <DropdownMenuItem v-else @click="toggleCategoryStatus(category)">
                                                    Deactivate</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <!-- Subcategories Tab Content -->
            <TabsContent value="subcategories">
                <Card>
                    <CardHeader class="pb-3">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-medium text-gray-700">
                                {{ selectedCategory ? `Subcategories for "${selectedCategory.name}"` :
                                    'All Subcategories' }}
                            </h2>
                            <Button v-if="selectedCategory" variant="outline" size="sm" @click="clearCategoryFilter">
                                <Icon name="lucide:x" class="w-4 h-4 mr-2" />
                                Clear Filter
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead class="w-16">ID</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Parent Category</TableHead>
                                    <TableHead>Ads Count</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead class="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-if="loadingSubcategories" class="h-24">
                                    <TableCell colspan="7" class="text-center text-gray-500">
                                        <div class="flex justify-center items-center gap-2">
                                            <Icon name="lucide:loader-2" class="w-4 h-4 text-blue-600 animate-spin" />
                                            Loading subcategories...
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow v-else-if="subcategories.length === 0" class="h-24">
                                    <TableCell colspan="7" class="text-center text-gray-500">
                                        No subcategories found
                                    </TableCell>
                                </TableRow>
                                <TableRow v-else v-for="sub in subcategories" :key="sub.id" class="hover:bg-gray-50">
                                    <TableCell class="font-medium">{{ sub.id }}</TableCell>
                                    <TableCell>
                                        <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                            <img :src="sub.image" :alt="sub.name" class="w-full h-full object-cover">
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        class="font-medium text-gray-900 cursor-pointer text-blue-600 hover:underline"
                                        @click="openSubcategorySheet(sub)">{{ sub.name }}</TableCell>
                                    <TableCell class="text-gray-500">{{ sub.category?.name }}</TableCell>
                                    <TableCell>{{ sub.adsCount }}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline"
                                            :class="sub.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'">
                                            {{ sub.is_active ? 'Active' : 'Inactive' }}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger as-child>
                                                <Button variant="ghost" class="h-8 w-8 p-0">
                                                    <span class="sr-only">Open menu</span>
                                                    <Icon name="lucide:more-horizontal" class="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem v-if="!sub.is_active"
                                                    @click="toggleSubcategoryStatus(sub)">Activate</DropdownMenuItem>
                                                <DropdownMenuItem v-else @click="toggleSubcategoryStatus(sub)">
                                                    Deactivate</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <SubcategoryDetailsSheet v-model:open="isSubcategorySheetOpen" :subcategory="selectedSubcategory" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import SubcategoryDetailsSheet from '@/components/SubcategoryDetailsSheet.vue'
import type { Category, Subcategory } from '@/types'

definePageMeta({
    layout: 'dashboard'
})

const api = useApi()

const activeTab = ref('categories')
const categories = ref<Category[]>([])
const subcategories = ref<Subcategory[]>([])
const loadingCategories = ref(false)
const loadingSubcategories = ref(false)
const selectedCategory = ref<Category | null>(null)
const isSubcategorySheetOpen = ref(false)
const selectedSubcategory = ref<Subcategory | null>(null)

const openSubcategorySheet = (sub: Subcategory) => {
    selectedSubcategory.value = sub
    isSubcategorySheetOpen.value = true
}

const fetchCategories = async () => {
    loadingCategories.value = true
    try {
        const response: any = await api.fetchGet('/categories')
        if (response && response.success) {
            categories.value = response.data
        }
    } catch (err) {
        console.error('Failed to fetch categories', err)
    } finally {
        loadingCategories.value = false
    }
}

const fetchSubcategories = async () => {
    loadingSubcategories.value = true
    subcategories.value = [] // Clear previous data
    const url = selectedCategory.value
        ? `/categories/${selectedCategory.value.id}/subcategories`
        : '/subcategories'

    try {
        const response: any = await api.fetchGet(url)
        if (response && response.success) {
            let data = response.data
            if (selectedCategory.value) {
                // If we're filtering by category, the API might not return the full category object inside subcategory
                data = data.map((sub: Subcategory) => ({
                    ...sub,
                    category: sub.category || selectedCategory.value
                }))
            }
            subcategories.value = data
        }
    } catch (err) {
        console.error('Failed to fetch subcategories', err)
    } finally {
        loadingSubcategories.value = false
    }
}

const filterSubcategories = (category: Category) => {
    selectedCategory.value = category
    activeTab.value = 'subcategories'
    // Fetching will be triggered by watcher or we can call explicitly needed
    // The watcher on activeTab will trigger if tab changes, 
    // but if already on subcategories tab, we need to manually fetch.
    fetchSubcategories()
}

const clearCategoryFilter = () => {
    selectedCategory.value = null
    fetchSubcategories()
}

// Watchers
watch(activeTab, (newTab) => {
    if (newTab === 'subcategories') {
        fetchSubcategories()
    }
})

// Initial fetch
onMounted(() => {
    fetchCategories()
})

const toggleCategoryStatus = async (category: Category) => {
    // Optimistic update
    const originalStatus = category.is_active
    category.is_active = !originalStatus

    try {
        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('is_active', category.is_active ? '1' : '0')

        await api.fetchPost(`/categories/${category.id}`, formData)
        toast.success(`Category ${category.is_active ? 'activated' : 'deactivated'} successfully`)
    } catch (err) {
        // Revert on failure
        category.is_active = originalStatus
        console.error('Failed to update category status', err)
        toast.error('Failed to update category status')
    }
}

const toggleSubcategoryStatus = async (sub: Subcategory) => {
    // Optimistic update
    const originalStatus = sub.is_active
    sub.is_active = !originalStatus

    try {
        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('is_active', sub.is_active ? '1' : '0')

        await api.fetchPost(`/subcategories/${sub.id}`, formData)
        toast.success(`Subcategory ${sub.is_active ? 'activated' : 'deactivated'} successfully`)
    } catch (err) {
        // Revert on failure
        sub.is_active = originalStatus
        console.error('Failed to update subcategory status', err)
        toast.error('Failed to update subcategory status')
    }
}
</script>
