<template>
    <div class="p-6 max-w-4xl mx-auto">
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
                <p class="text-gray-500 text-sm mt-1">Manage your account information and preferences</p>
            </div>
            <Button variant="outline" @click="$router.back()">
                <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
                Back
            </Button>
        </div>

        <div v-if="admin" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Left Column: Avatar & Quick Info -->
            <Card class="md:col-span-1 border-none shadow-sm">
                <CardContent class="pt-6 pb-6 text-center">
                    <div class="relative inline-block mb-4 group cursor-pointer" @click="$refs.fileInput.click()">
                        <Avatar class="w-24 h-24 mx-auto border-2 border-white shadow-md relative overflow-hidden">
                            <AvatarImage :src="admin.avatar || undefined" :alt="admin.first_name" />
                            <AvatarFallback class="bg-blue-100 text-blue-700 text-2xl font-bold">
                                {{ admin.first_name?.[0] }}{{ admin.last_name?.[0] }}
                            </AvatarFallback>

                            <!-- Loading Overlay -->
                            <div v-if="isUploadingAvatar"
                                class="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Icon name="lucide:loader-2" class="w-6 h-6 text-white animate-spin" />
                            </div>

                            <!-- Hover Overlay -->
                            <div v-else
                                class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Icon name="lucide:camera" class="w-6 h-6 text-white" />
                            </div>
                        </Avatar>

                        <!-- Camera Icon Badge -->
                        <div class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center shadow-sm"
                            title="Change Avatar">
                            <Icon name="lucide:camera" class="w-4 h-4 text-white" />
                        </div>

                        <!-- Hidden File Input -->
                        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleAvatarChange">
                    </div>

                    <h2 class="text-xl font-bold text-gray-900">{{ fullName }}</h2>
                    <p class="text-sm text-gray-500 mb-4">{{ admin.email }}</p>

                    <div class="flex flex-wrap justify-center gap-2 mb-6">
                        <Badge v-for="role in admin.roles" :key="role.id" variant="secondary" class="capitalize">
                            {{ role.name }}
                        </Badge>
                    </div>

                    <div class="pt-4 border-t border-gray-100 space-y-3">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-500">Member Since</span>
                            <span class="text-gray-900 font-medium">{{ $formatDate(admin.created_at) }}</span>
                        </div>
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-500">Last Login</span>
                            <span class="text-gray-900 font-medium">{{ admin.last_login_at ?
                                $formatDateTime(admin.last_login_at) : 'N/A' }}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Right Column: Full Details -->
            <div class="md:col-span-2 space-y-6">
                <Card class="border-none shadow-sm">
                    <CardHeader class="pb-3 border-b border-gray-50">
                        <CardTitle class="text-lg font-bold flex items-center gap-2">
                            <Icon name="lucide:user" class="w-5 h-5 text-blue-600" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="pt-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                            <InfoItem label="First Name" :value="admin.first_name" />
                            <InfoItem label="Last Name" :value="admin.last_name" />
                            <InfoItem label="Middle Name" :value="admin.middle_name || 'N/A'" />
                            <InfoItem label="Gender" :value="admin.gender || 'Not specified'" />
                            <InfoItem label="Email Address" :value="admin.email" />
                            <InfoItem label="Phone Number" :value="admin.phone_number || 'Not available'" />
                        </div>
                    </CardContent>
                </Card>

                <Card class="border-none shadow-sm">
                    <CardHeader class="pb-3 border-b border-gray-50">
                        <CardTitle class="text-lg font-bold flex items-center gap-2">
                            <Icon name="lucide:shield-check" class="w-5 h-5 text-blue-600" />
                            Account Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="pt-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</p>
                                <div class="flex items-center gap-2">
                                    <Badge :class="getStatusClass(admin.status)">
                                        {{ admin.status }}
                                    </Badge>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Verified</p>
                                <div class="flex items-center gap-2 text-sm">
                                    <Icon v-if="admin.email_verified_at" name="lucide:check-circle-2"
                                        class="w-4 h-4 text-green-500" />
                                    <Icon v-else name="lucide:x-circle" class="w-4 h-4 text-red-500" />
                                    <span>{{ admin.email_verified_at ? 'Verified on ' +
                                        $formatDate(admin.email_verified_at) : 'Not verified' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Password Change Section -->
                        <div class="mt-8 pt-6 border-t border-gray-100">
                            <div v-if="!showPasswordForm">
                                <Button variant="outline" class="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    @click="showPasswordForm = true">
                                    <Icon name="lucide:key-round" class="w-4 h-4 mr-2" />
                                    Change password
                                </Button>
                            </div>

                            <div v-else class="space-y-4 max-w-md">
                                <h3 class="text-sm font-bold text-gray-900">Update Password</h3>
                                <div class="space-y-3">
                                    <div class="relative">
                                        <Input :type="showNewPassword ? 'text' : 'password'"
                                            v-model="passwordData.password" placeholder="New password" class="pr-10" />
                                        <button type="button"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            @click="showNewPassword = !showNewPassword">
                                            <Icon :name="showNewPassword ? 'lucide:eye-off' : 'lucide:eye'"
                                                class="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div class="relative">
                                        <Input :type="showConfirmPassword ? 'text' : 'password'"
                                            v-model="passwordData.password_confirmation"
                                            placeholder="Confirm new password" class="pr-10" />
                                        <button type="button"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            @click="showConfirmPassword = !showConfirmPassword">
                                            <Icon :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'"
                                                class="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div v-if="passwordError" class="text-xs text-red-600 flex items-center gap-1">
                                        <Icon name="lucide:alert-circle" class="w-3 h-3" />
                                        {{ passwordError }}
                                    </div>

                                    <div class="flex gap-2 pt-2">
                                        <Button
                                            :disabled="!!passwordError || !passwordData.password || isUpdatingPassword"
                                            @click="handlePasswordUpdate">
                                            <Icon v-if="isUpdatingPassword" name="lucide:loader-2"
                                                class="w-4 h-4 mr-2 animate-spin" />
                                            Update password
                                        </Button>
                                        <Button variant="ghost" :disabled="isUpdatingPassword"
                                            @click="showPasswordForm = false">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center p-20 text-gray-400">
            <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin mb-4" />
            <p>Loading profile details...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'

definePageMeta({
    layout: 'dashboard'
})

const { $getAdmin, $formatDate, $formatDateTime } = useNuxtApp() as any
const api = useApi()

const admin = computed(() => $getAdmin())
const isUploadingAvatar = ref(false)
const isUpdatingPassword = ref(false)
const showPasswordForm = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordData = reactive({
    password: '',
    password_confirmation: ''
})

const passwordError = computed(() => {
    if (!passwordData.password) return null
    if (passwordData.password.length < 8) return 'Password must be at least 8 characters'
    if (passwordData.password !== passwordData.password_confirmation) {
        if (!passwordData.password_confirmation) return null
        return 'Passwords do not match'
    }
    return null
})

const fullName = computed(() => {
    if (!admin.value) return ''
    if (admin.value.name) return admin.value.name
    const parts = [admin.value.first_name, admin.value.middle_name, admin.value.last_name]
    return parts.filter(Boolean).join(' ')
})

const handleAvatarChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    isUploadingAvatar.value = true
    try {
        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('avatar', file)

        const response = await api.fetchPost<any>('/auth/profile', formData)

        if (response.success) {
            toast.success('Avatar updated successfully')
            // Refresh session data to show new avatar
            const { getSession } = useAuth()
            await getSession()
        }
    } catch (err: any) {
        console.error('Failed to upload avatar:', err)
        toast.error(err.data?.message || 'Failed to update avatar')
    } finally {
        isUploadingAvatar.value = false
        target.value = ''
    }
}

const handlePasswordUpdate = async () => {
    if (passwordError.value) return

    isUpdatingPassword.value = true
    try {
        const response = await api.fetchPost<any>('/auth/profile', {
            _method: 'PUT',
            ...passwordData
        })

        if (response.success) {
            toast.success('Password updated successfully')
            showPasswordForm.value = false
            passwordData.password = ''
            passwordData.password_confirmation = ''
        }
    } catch (err: any) {
        console.error('Failed to update password:', err)
        toast.error(err.data?.message || 'Failed to update password')
    } finally {
        isUpdatingPassword.value = false
    }
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-700 hover:bg-green-100'
        case 'suspended': return 'bg-red-100 text-red-700 hover:bg-red-100'
        case 'inactive': return 'bg-gray-100 text-gray-700 hover:bg-gray-100'
        default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100'
    }
}

// Inline component for info items
/* const InfoItem = {
    props: ['label', 'value'],
    template: `
    <div class="space-y-1">
      <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ label }}</p>
      <p class="text-sm font-semibold text-gray-900 truncate">{{ value }}</p>
    </div>
  `
} */
</script>
