<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent class="w-full sm:max-w-xl overflow-y-auto custom-scroll">
            <SheetHeader>
                <SheetTitle>Ad Details</SheetTitle>
            </SheetHeader>
            <div v-if="ad" class="p-6 space-y-6">
                <!-- Image Gallery -->
                <div class="space-y-3">
                    <img :src="ad.primary_image?.image_path || 'https://placehold.co/600x400'" :alt="ad.title"
                        class="w-full h-64 object-cover rounded-lg" />
                    <div v-if="ad.images && ad.images.length > 1" class="grid grid-cols-4 gap-2">
                        <img v-for="image in ad.images.slice(0, 4)" :key="image.id" :src="image.image_path"
                            :alt="ad.title"
                            class="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80" />
                    </div>
                </div>

                <!-- Title and Price -->
                <div>
                    <h3 class="text-xl font-semibold text-gray-900">{{ ad.title }}</h3>
                    <div class="flex items-center gap-3 mt-2">
                        <p class="text-2xl font-bold text-blue-600">₦{{ Number(ad.price).toLocaleString() }}</p>
                        <Badge v-if="ad.is_negotiable" variant="outline" class="text-xs">Negotiable</Badge>
                    </div>
                </div>

                <!-- Status Badges -->
                <div class="flex flex-wrap gap-2">
                    <Badge :class="getStatusClass(ad.status)" variant="outline" class="capitalize">
                        {{ ad.status }}
                    </Badge>
                    <Badge v-if="ad.promotion_plan" variant="outline"
                        class="capitalize border-purple-200 text-purple-700 bg-purple-50">
                        {{ ad.promotion_plan.name }}
                    </Badge>
                    <Badge v-else variant="outline" class="border-gray-200 text-gray-700 bg-gray-50">
                        Standard
                    </Badge>
                </div>

                <!-- Description -->
                <div v-if="ad.description" class="space-y-2">
                    <h4 class="text-sm font-semibold text-gray-900">Description</h4>
                    <p class="text-sm text-gray-700 leading-relaxed">{{ ad.description }}</p>
                </div>

                <!-- Ad Information -->
                <div class="space-y-4 pt-4 border-t border-gray-200">
                    <h4 class="text-sm font-semibold text-gray-900">Ad Information</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Category</p>
                            <p class="text-sm font-medium text-gray-900">{{ ad.category?.name || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Subcategory</p>
                            <p class="text-sm font-medium text-gray-900">{{ ad.subcategory?.name || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Location</p>
                            <p class="text-sm font-medium text-gray-900">{{ ad.location || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Place</p>
                            <p class="text-sm font-medium text-gray-900">{{ ad.place || 'N/A' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Statistics -->
                <div class="space-y-4 pt-4 border-t border-gray-200">
                    <h4 class="text-sm font-semibold text-gray-900">Statistics</h4>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="text-center p-3 bg-blue-50 rounded-lg">
                            <Icon name="lucide:eye" class="w-5 h-5 text-blue-600 mx-auto mb-1" />
                            <p class="text-lg font-bold text-gray-900">{{ ad.views || 0 }}</p>
                            <p class="text-xs text-gray-600">Views</p>
                        </div>
                        <div class="text-center p-3 bg-purple-50 rounded-lg">
                            <Icon name="lucide:bar-chart" class="w-5 h-5 text-purple-600 mx-auto mb-1" />
                            <p class="text-lg font-bold text-gray-900">{{ ad.impressions || 0 }}</p>
                            <p class="text-xs text-gray-600">Impressions</p>
                        </div>
                        <div class="text-center p-3 bg-pink-50 rounded-lg">
                            <Icon name="lucide:heart" class="w-5 h-5 text-pink-600 mx-auto mb-1" />
                            <p class="text-lg font-bold text-gray-900">{{ ad.likes || 0 }}</p>
                            <p class="text-xs text-gray-600">Likes</p>
                        </div>
                    </div>
                </div>

                <!-- User Information -->
                <div v-if="ad.user" class="space-y-4 pt-4 border-t border-gray-200">
                    <h4 class="text-sm font-semibold text-gray-900">Posted By</h4>
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div
                            class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {{ ad.user.first_name.charAt(0) }}{{ ad.user.last_name.charAt(0) }}
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">{{ ad.user.first_name }} {{ ad.user.last_name
                                }}</p>
                            <p class="text-xs text-gray-600">{{ ad.user.email }}</p>
                            <p v-if="ad.user.phone_number" class="text-xs text-gray-600">{{ ad.user.phone_number }}</p>
                        </div>
                    </div>
                </div>

                <!-- Dates -->
                <div class="space-y-4 pt-4 border-t border-gray-200">
                    <h4 class="text-sm font-semibold text-gray-900">Timeline</h4>
                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:calendar-plus" class="w-4 h-4 text-gray-500" />
                            <div class="flex-1">
                                <p class="text-xs text-gray-500">Created</p>
                                <p class="text-sm font-medium text-gray-900">{{ formatDateTime(ad.created_at) }}</p>
                            </div>
                        </div>
                        <div v-if="ad.published_at" class="flex items-center gap-2">
                            <Icon name="lucide:send" class="w-4 h-4 text-gray-500" />
                            <div class="flex-1">
                                <p class="text-xs text-gray-500">Published</p>
                                <p class="text-sm font-medium text-gray-900">{{ formatDateTime(ad.published_at) }}</p>
                            </div>
                        </div>
                        <div v-if="ad.expires_at" class="flex items-center gap-2">
                            <Icon name="lucide:calendar-x" class="w-4 h-4 text-gray-500" />
                            <div class="flex-1">
                                <p class="text-xs text-gray-500">Expires</p>
                                <p class="text-sm font-medium text-gray-900">{{ formatDateTime(ad.expires_at) }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:clock" class="w-4 h-4 text-gray-500" />
                            <div class="flex-1">
                                <p class="text-xs text-gray-500">Last Updated</p>
                                <p class="text-sm font-medium text-gray-900">{{ formatDateTime(ad.updated_at) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ad ID -->
                <div class="pt-4 border-t border-gray-200">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="text-xs text-gray-500">Ad ID</span>
                        <span class="text-xs font-mono font-medium text-gray-900">{{ ad.id }}</span>
                    </div>
                </div>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup lang="ts">
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import type { Ad } from '@/types/ad'

defineProps<{
    open: boolean
    ad: Ad | null
}>()

defineEmits(['update:open'])

const getStatusClass = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-50 text-green-700 border-green-200'
        case 'pending':
            return 'bg-orange-50 text-orange-700 border-orange-200'
        case 'suspended':
            return 'bg-red-50 text-red-700 border-red-200'
        case 'rejected':
            return 'bg-red-50 text-red-700 border-red-200'
        case 'sold':
            return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'expired':
            return 'bg-gray-50 text-gray-700 border-gray-200'
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200'
    }
}

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>
