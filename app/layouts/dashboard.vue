<template>
    <div class="flex h-screen overflow-hidden bg-gray-100">
        <!-- Sidebar -->
        <aside class="w-72 bg-[#3b9dd8] text-white flex flex-col">
            <!-- Header -->
            <div class="p-4 font-semibold text-lg border-b border-white/20">
                HamSuper Admin
            </div>

            <!-- Navigation -->
            <nav class="flex-1 py-4">
                <NuxtLink v-for="link in links" :key="link.name" :to="link.to"
                    class="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors"
                    active-class="bg-white/20">
                    <Icon :name="link.icon" class="w-4 h-4" />
                    <span class="text-sm">{{ link.name }}</span>
                </NuxtLink>
            </nav>

            <!-- Logout -->
            <div class="p-4 border-t border-white/20">
                <button @click="useLogout()"
                    class="flex items-center gap-2 text-sm hover:text-white/80 transition-colors">
                    <Icon name="lucide:log-out" class="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Bar -->
            <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end gap-4">
                <!-- Notifications Section -->
                <Sheet v-model:open="isSheetOpen">
                    <SheetTrigger as-child>
                        <button class="relative hover:bg-gray-50 p-2 rounded-full transition-colors"
                            @click="openNotifications">
                            <Icon name="lucide:bell" class="w-5 h-5 text-gray-600" />
                            <span v-if="unreadCount > 0"
                                class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" class="w-[400px] sm:w-[540px] flex flex-col p-0 text-gray-900">
                        <SheetHeader class="p-6 border-b">
                            <div class="flex items-center justify-between">
                                <SheetTitle class="text-xl font-bold">Notifications</SheetTitle>
                                <Badge variant="secondary" class="text-sm">
                                    Unread({{ unreadCount }})
                                </Badge>
                            </div>
                        </SheetHeader>

                        <!-- Notification List -->
                        <div class="flex-1 overflow-y-auto">
                            <div v-if="loadingNotifications && currentPage === 1" class="p-6 space-y-4">
                                <Skeleton v-for="i in 5" :key="i" class="h-24 w-full" />
                            </div>
                            <div v-else-if="notifications.length === 0" class="p-12 text-center text-gray-500">
                                <Icon name="lucide:bell-off" class="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No notifications found</p>
                            </div>
                            <div v-else class="divide-y">
                                <div v-for="notification in notifications" :key="notification.id"
                                    class="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                                    :class="{ 'bg-blue-50/50': !notification.read_at }"
                                    @click="handleNotificationClick(notification)">
                                    <div class="flex items-start gap-4">
                                        <div class="p-2 rounded-full" :class="getNotificationIconBg(notification)">
                                            <Icon :name="getNotificationIcon(notification)" class="w-5 h-5"
                                                :class="getNotificationIconColor(notification)" />
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-medium text-gray-900 leading-tight">
                                                {{ notification.data.message }}
                                            </p>
                                            <p class="text-xs text-gray-500 mt-1">
                                                {{ formatRelativeDate(notification.created_at) }}
                                            </p>

                                            <!-- Action Buttons -->
                                            <div class="flex items-center gap-2 mt-4" @click.stop>
                                                <Button v-if="!notification.read_at" size="sm" variant="outline"
                                                    class="h-8 text-xs px-3"
                                                    :disabled="actionLoading[notification.id] === 'read'"
                                                    @click="markAsRead(notification)">
                                                    <Icon v-if="actionLoading[notification.id] === 'read'"
                                                        name="lucide:loader-2" class="w-3 h-3 animate-spin mr-1" />
                                                    Mark as read
                                                </Button>
                                                <Button size="sm" variant="ghost"
                                                    class="h-8 text-xs px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    :disabled="actionLoading[notification.id] === 'delete'"
                                                    @click="deleteNotification(notification)">
                                                    <Icon v-if="actionLoading[notification.id] === 'delete'"
                                                        name="lucide:loader-2" class="w-3 h-3 animate-spin mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Pagination Area -->
                        <div v-if="pagination && (pagination.prev_page_url || pagination.next_page_url)"
                            class="p-4 border-t border-b flex justify-between bg-gray-50/50">
                            <Button variant="outline" size="sm"
                                :disabled="!pagination.prev_page_url || loadingNotifications"
                                @click="fetchNotifications(currentPage - 1)">
                                <Icon name="lucide:chevron-left" class="w-4 h-4 mr-1" />
                                Previous
                            </Button>
                            <span class="text-xs text-gray-500 flex items-center">
                                Page {{ currentPage }} of {{ pagination.last_page }}
                            </span>
                            <Button variant="outline" size="sm"
                                :disabled="!pagination.next_page_url || loadingNotifications"
                                @click="fetchNotifications(currentPage + 1)">
                                Next
                                <Icon name="lucide:chevron-right" class="w-4 h-4 ml-1" />
                            </Button>
                        </div>

                        <!-- Footer Actions -->
                        <div class="p-6 border-t bg-white space-y-3">
                            <Button class="w-full text-foreground" variant="outline"
                                :disabled="markingAllRead || unreadCount === 0" @click="markAllAsRead">
                                <Icon v-if="markingAllRead" name="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
                                <Icon v-else name="lucide:check-check" class="w-4 h-4 mr-2" />
                                Mark all as read
                            </Button>
                            <Button class="w-full" variant="outline"
                                :disabled="deletingAllRead || !hasReadNotifications" @click="deleteAllRead">
                                <Icon v-if="deletingAllRead" name="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
                                <Icon v-else name="lucide:trash-2" class="w-4 h-4 mr-2 text-red-600" />
                                <span class="text-red-600">Delete all read</span>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                <div class="flex items-center gap-2 cursor-pointer ml-2">
                    <img :src="$getAdmin()?.avatar" class="w-8 h-8 rounded-lg">
                    <span class="text-sm font-medium text-gray-700">{{ $getAdmin()?.name }}</span>
                    <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-600" />
                </div>
            </header>

            <!-- Page Content -->
            <main class="flex-1 overflow-y-auto custom-scroll">
                <slot />
            </main>

            <!-- Footer -->
            <footer class="bg-[#3b9dd8] text-white text-center py-3 text-sm">
                © 2025 Hamsuper.com
            </footer>
        </div>
        <Toaster />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'vue-sonner'
import 'vue-sonner/style.css'
import type { AdminNotification, NotificationResponse, UnreadCountResponse, NotificationPagination } from '@/types/notification'

const api = useApi()

const links = [
    { name: 'Dashboard', to: '/dashboard', icon: 'lucide:layout-dashboard' },
    { name: 'Users', to: '/users', icon: 'lucide:users' },
    { name: 'Ads', to: '/ads', icon: 'lucide:megaphone' },
    { name: 'Transactions', to: '/transactions', icon: 'lucide:credit-card' },
    { name: 'Verification Requests', to: '/verification-request', icon: 'lucide:user-check' },
    { name: 'Categories', to: '/categories', icon: 'lucide:list-tree' },
    { name: 'Admins', to: '/admins', icon: 'lucide:shield-check' },
    { name: 'Feedback', to: '/feedback', icon: 'lucide:message-square' },
    { name: 'Faq', to: '/faqs', icon: 'lucide:help-circle' },
]

const isSheetOpen = ref(false)
const unreadCount = ref(0)
const notifications = ref<AdminNotification[]>([])
const pagination = ref<NotificationPagination | null>(null)
const currentPage = ref(1)
const loadingNotifications = ref(false)
const actionLoading = ref<Record<string, 'read' | 'delete' | null>>({})
const markingAllRead = ref(false)
const deletingAllRead = ref(false)

const hasReadNotifications = computed(() => {
    return notifications.value.some(n => n.read_at !== null)
})

const fetchUnreadCount = async () => {
    try {
        const response = await api.fetchGet('/notifications/unread-count') as UnreadCountResponse
        if (response && response.success) {
            unreadCount.value = response.data.unread_count
        }
    } catch (err) {
        console.error('Failed to fetch unread count:', err)
    }
}

const fetchNotifications = async (page = 1) => {
    loadingNotifications.value = true
    try {
        const response = await api.fetchGet('/notifications', { params: { page } }) as NotificationResponse
        if (response && response.success) {
            notifications.value = response.data.data
            pagination.value = response.data
            currentPage.value = response.data.current_page
        }
    } catch (err) {
        console.error('Failed to fetch notifications:', err)
        toast.error('Failed to load notifications')
    } finally {
        loadingNotifications.value = false
    }
}

const openNotifications = () => {
    fetchNotifications(1)
}

const handleNotificationClick = async (notification: AdminNotification) => {
    const type = notification.data.type || ''

    if (!notification.read_at) {
        await markAsRead(notification, false)
    }

    isSheetOpen.value = false

    if (type.includes('transaction') || type === 'ad_promoted') {
        navigateTo('/transactions')
    } else if (type === 'new_verification_request' || notification.type.includes('VerificationRequest')) {
        navigateTo('/verification-request')
    }
}

const markAsRead = async (notification: AdminNotification, showToast = true) => {
    actionLoading.value[notification.id] = 'read'
    try {
        await api.fetchPost(`/notifications/${notification.id}/read`)
        notification.read_at = new Date().toISOString()
        await fetchUnreadCount()
        if (showToast) toast.success('Notification marked as read')
    } catch (err) {
        console.error('Failed to mark notification as read:', err)
        if (showToast) toast.error('Failed to mark notification as read')
    } finally {
        actionLoading.value[notification.id] = null
    }
}

const deleteNotification = async (notification: AdminNotification) => {
    actionLoading.value[notification.id] = 'delete'
    try {
        await api.fetchDelete(`/notifications/${notification.id}`)
        notifications.value = notifications.value.filter(n => n.id !== notification.id)
        unreadCount.value = Math.max(0, unreadCount.value - (notification.read_at ? 0 : 1))
        toast.success('Notification deleted')
        if (notifications.value.length === 0 && currentPage.value > 1) {
            fetchNotifications(currentPage.value - 1)
        }
    } catch (err) {
        console.error('Failed to delete notification:', err)
        toast.error('Failed to delete notification')
    } finally {
        actionLoading.value[notification.id] = null
    }
}

const markAllAsRead = async () => {
    markingAllRead.value = true
    try {
        await api.fetchPost('/notifications/read-all')
        notifications.value.forEach(n => n.read_at = new Date().toISOString())
        unreadCount.value = 0
        toast.success('All notifications marked as read')
    } catch (err) {
        console.error('Failed to mark all as read:', err)
        toast.error('Failed to mark all as read')
    } finally {
        markingAllRead.value = false
    }
}

const deleteAllRead = async () => {
    if (!confirm('Are you sure you want to delete all read notifications?')) return
    deletingAllRead.value = true
    try {
        await api.fetchDelete('/notifications/read/all')
        notifications.value = notifications.value.filter(n => !n.read_at)
        toast.success('Read notifications deleted')
        fetchNotifications(1)
    } catch (err) {
        console.error('Failed to delete all read:', err)
        toast.error('Failed to delete all read notifications')
    } finally {
        deletingAllRead.value = false
    }
}

const getNotificationIcon = (n: AdminNotification) => {
    const type = n.data.type || ''
    if (type === 'admin_login') return 'lucide:shield-check'
    if (type === 'new_verification_request') return 'lucide:user-plus'
    if (type === 'ad_promoted') return 'lucide:trending-up'
    return 'lucide:bell'
}

const getNotificationIconBg = (n: AdminNotification) => {
    const type = n.data.type || ''
    if (type === 'admin_login') return 'bg-purple-100'
    if (type === 'new_verification_request') return 'bg-green-100'
    if (type === 'ad_promoted') return 'bg-blue-100'
    return 'bg-gray-100'
}

const getNotificationIconColor = (n: AdminNotification) => {
    const type = n.data.type || ''
    if (type === 'admin_login') return 'text-purple-600'
    if (type === 'new_verification_request') return 'text-green-600'
    if (type === 'ad_promoted') return 'text-blue-600'
    return 'text-gray-600'
}

const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
}

onMounted(() => {
    fetchUnreadCount()
})
</script>
