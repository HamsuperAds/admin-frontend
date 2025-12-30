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
                <button class="flex items-center gap-2 text-sm hover:text-white/80 transition-colors">
                    <Icon name="lucide:log-out" class="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Bar -->
            <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end gap-4">
                <button class="relative">
                    <Icon name="lucide:bell" class="w-5 h-5 text-gray-600" />
                    <span
                        class="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                </button>

                <div class="flex items-center gap-2 cursor-pointer">
                    <Avatar class="w-8 h-8">
                        <AvatarImage src="" alt="John Doe" />
                        <AvatarFallback class="bg-gray-300 text-gray-700 text-xs">JD</AvatarFallback>
                    </Avatar>
                    <span class="text-sm font-medium text-gray-700">John Doe</span>
                    <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-600" />
                </div>
            </header>

            <!-- Page Content -->
            <main class="flex-1 overflow-y-auto">
                <slot />
            </main>

            <!-- Footer -->
            <footer class="bg-[#3b9dd8] text-white text-center py-3 text-sm">
                © 2025 Hamsuper.com
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const links = [
    { name: 'Dashboard', to: '/dashboard', icon: 'lucide:layout-dashboard' },
    { name: 'Users', to: '/users', icon: 'lucide:users' },
    { name: 'Ads', to: '/ads', icon: 'lucide:megaphone' },
    { name: 'Transactions', to: '/transactions', icon: 'lucide:credit-card' },
    { name: 'FAQs', to: '/faqs', icon: 'lucide:help-circle' },
    { name: 'Admins & Roles', to: '/admins', icon: 'lucide:shield' },
]
</script>
