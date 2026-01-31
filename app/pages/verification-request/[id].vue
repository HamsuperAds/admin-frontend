<template>
    <div class="p-6">
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button variant="ghost" size="icon" @click="router.back()">
                    <Icon name="lucide:arrow-left" class="w-5 h-5" />
                </Button>
                <div>
                    <h1 class="text-2xl font-semibold text-gray-800">Verification Request Details</h1>
                    <p class="text-sm text-gray-500">Request ID: #{{ request?.id }}</p>
                </div>
            </div>
            <Badge v-if="request" :variant="getStatusVariant(request.status.value)" class="text-sm px-3 py-1">
                {{ request.status.label }}
            </Badge>
        </div>

        <div v-if="pending" class="flex items-center justify-center py-12">
            <div class="text-center">
                <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p class="text-gray-500">Loading verification request...</p>
            </div>
        </div>

        <div v-else-if="error" class="text-center py-12">
            <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p class="text-red-600 mb-4">Failed to load verification request</p>
            <Button @click="refresh">Try Again</Button>
        </div>

        <div v-else-if="request" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Section - Request Information -->
            <div class="lg:col-span-1 space-y-6">
                <!-- User Information -->
                <Card>
                    <CardHeader>
                        <CardTitle class="text-lg">User Information</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="flex items-center gap-3">
                            <img :src="request.user.avatar || '/default-avatar.png'"
                                :alt="getUserFullName(request.user)" class="w-16 h-16 rounded-full" />
                            <div>
                                <p class="font-semibold text-gray-900">{{ getUserFullName(request.user) }}</p>
                                <Badge v-if="request.user.verified" variant="default" class="text-xs">Verified</Badge>
                                <Badge v-else variant="secondary" class="text-xs">Not Verified</Badge>
                            </div>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:mail" class="w-4 h-4 text-gray-500" />
                                <span class="text-gray-700">{{ request.user.email }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:phone" class="w-4 h-4 text-gray-500" />
                                <span class="text-gray-700">{{ request.user.phone_number }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:calendar" class="w-4 h-4 text-gray-500" />
                                <span class="text-gray-700">Member since {{ formatDate(request.user.created_at)
                                    }}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Business Information -->
                <Card>
                    <CardHeader>
                        <CardTitle class="text-lg">Business Information</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-3 text-sm">
                        <div>
                            <p class="text-gray-500 text-xs mb-1">Business Name</p>
                            <p class="font-medium text-gray-900">{{ request.business_name }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 text-xs mb-1">Business Address</p>
                            <p class="text-gray-700">{{ request.business_address }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 text-xs mb-1">Business Phone</p>
                            <p class="text-gray-700">{{ request.business_phone_number }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 text-xs mb-1">ID Type</p>
                            <p class="font-medium text-gray-900">{{ request.id_type.label }}</p>
                            <p class="text-xs text-gray-500 mt-1">{{ request.id_type.description }}</p>
                        </div>
                    </CardContent>
                </Card>

                <!-- Submission Information -->
                <Card>
                    <CardHeader>
                        <CardTitle class="text-lg">Submission Information</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-3 text-sm">
                        <div>
                            <p class="text-gray-500 text-xs mb-1">Status</p>
                            <Badge :variant="getStatusVariant(request.status.value)">{{ request.status.label }}</Badge>
                        </div>
                        <div>
                            <p class="text-gray-500 text-xs mb-1">Submitted</p>
                            <p class="text-gray-700">{{ formatDateTime(request.submitted_at) }}</p>
                        </div>
                        <div v-if="request.reviewed_at">
                            <p class="text-gray-500 text-xs mb-1">Reviewed</p>
                            <p class="text-gray-700">{{ formatDateTime(request.reviewed_at) }}</p>
                        </div>
                        <div v-if="request.reviewer">
                            <p class="text-gray-500 text-xs mb-1">Reviewed By</p>
                            <div class="flex items-center gap-2">
                                <img :src="request.reviewer.avatar || '/default-avatar.png'"
                                    :alt="getUserFullName(request.reviewer)" class="w-6 h-6 rounded-full" />
                                <span class="text-gray-700">{{ getUserFullName(request.reviewer) }}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Previous Review Information -->
                <Card v-if="request.user_message || request.admin_notes || request.rejection_reasons">
                    <CardHeader>
                        <CardTitle class="text-lg">Previous Review</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-3 text-sm">
                        <div v-if="request.user_message">
                            <p class="text-gray-500 text-xs mb-1">User Message</p>
                            <p class="text-gray-700">{{ request.user_message }}</p>
                        </div>
                        <div v-if="request.admin_notes">
                            <p class="text-gray-500 text-xs mb-1">Admin Notes</p>
                            <p class="text-gray-700">{{ request.admin_notes }}</p>
                        </div>
                        <div v-if="request.rejection_reasons">
                            <p class="text-gray-500 text-xs mb-2">Rejection Reasons</p>
                            <div class="space-y-1">
                                <p v-for="(reason, key) in request.rejection_reasons" :key="key"
                                    class="text-xs text-red-600">
                                    • {{ formatRejectionKey(key) }}: {{ reason }}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Right Section - Documents & Review Form -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Document Viewer -->
                <Card>
                    <CardHeader>
                        <CardTitle class="text-lg">Submitted Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs default-value="government_id" class="w-full">
                            <TabsList class="grid w-full grid-cols-3">
                                <TabsTrigger value="government_id">Government ID</TabsTrigger>
                                <TabsTrigger value="business_cert">Business Certificate</TabsTrigger>
                                <TabsTrigger value="proof_of_address">Proof of Address</TabsTrigger>
                            </TabsList>
                            <TabsContent value="government_id" class="mt-4">
                                <DocumentViewer :url="request.images.government_id" title="Government ID" />
                            </TabsContent>
                            <TabsContent value="business_cert" class="mt-4">
                                <DocumentViewer :url="request.images.business_cert" title="Business Certificate" />
                            </TabsContent>
                            <TabsContent value="proof_of_address" class="mt-4">
                                <DocumentViewer :url="request.images.proof_of_address" title="Proof of Address" />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <!-- Review Form -->
                <Card v-if="!request.is_final && showReviewForm">
                    <CardHeader>
                        <CardTitle class="text-lg">Review Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form @submit.prevent="handleSubmitReview" class="space-y-4">
                            <!-- Status Selection -->
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                                <RadioGroup v-model="reviewForm.status" class="flex gap-4">
                                    <div class="flex items-center space-x-2">
                                        <RadioGroupItem value="approved" id="approved" />
                                        <Label for="approved" class="cursor-pointer">Approve</Label>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroupItem value="rejected" id="rejected" />
                                        <Label for="rejected" class="cursor-pointer">Reject</Label>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroupItem value="under_review" id="under_review" />
                                        <Label for="under_review" class="cursor-pointer">Under Review</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <!-- User Message -->
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">
                                    User Message
                                    <span class="text-gray-400 font-normal">({{ reviewForm.user_message?.length || 0
                                    }}/1000)</span>
                                </label>
                                <Textarea v-model="reviewForm.user_message"
                                    placeholder="Message that will be sent to the user..." :maxlength="1000" rows="3" />
                            </div>

                            <!-- Admin Notes -->
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-2 block">
                                    Admin Notes
                                    <span class="text-gray-400 font-normal">({{ reviewForm.admin_notes?.length || 0
                                    }}/1000)</span>
                                </label>
                                <Textarea v-model="reviewForm.admin_notes"
                                    placeholder="Internal notes (not visible to user)..." :maxlength="1000" rows="3" />
                            </div>

                            <!-- Rejection Reasons -->
                            <div v-if="reviewForm.status === 'rejected'" class="space-y-3">
                                <label class="text-sm font-medium text-gray-700 block">
                                    Rejection Reasons
                                    <span class="text-red-500">*</span>
                                </label>
                                <p class="text-xs text-gray-500">At least one rejection reason is required</p>

                                <div class="space-y-2">
                                    <div>
                                        <Label for="business_name_reason" class="text-xs">Business Name</Label>
                                        <Input v-model="reviewForm.rejection_reasons.business_name"
                                            id="business_name_reason" placeholder="Issue with business name..."
                                            :maxlength="255" />
                                    </div>
                                    <div>
                                        <Label for="business_cert_reason" class="text-xs">Business Certificate</Label>
                                        <Input v-model="reviewForm.rejection_reasons.business_cert"
                                            id="business_cert_reason" placeholder="Issue with business certificate..."
                                            :maxlength="255" />
                                    </div>
                                    <div>
                                        <Label for="government_id_reason" class="text-xs">Government ID</Label>
                                        <Input v-model="reviewForm.rejection_reasons.government_id"
                                            id="government_id_reason" placeholder="Issue with government ID..."
                                            :maxlength="255" />
                                    </div>
                                    <div>
                                        <Label for="proof_of_address_reason" class="text-xs">Proof of Address</Label>
                                        <Input v-model="reviewForm.rejection_reasons.proof_of_address"
                                            id="proof_of_address_reason" placeholder="Issue with proof of address..."
                                            :maxlength="255" />
                                    </div>
                                    <div>
                                        <Label for="business_address_reason" class="text-xs">Business Address</Label>
                                        <Input v-model="reviewForm.rejection_reasons.business_address"
                                            id="business_address_reason" placeholder="Issue with business address..."
                                            :maxlength="255" />
                                    </div>
                                    <div>
                                        <Label for="business_phone_reason" class="text-xs">Business Phone</Label>
                                        <Input v-model="reviewForm.rejection_reasons.business_phone"
                                            id="business_phone_reason" placeholder="Issue with business phone..."
                                            :maxlength="255" />
                                    </div>
                                    <div>
                                        <Label for="general_reason" class="text-xs">General Feedback</Label>
                                        <Textarea v-model="reviewForm.rejection_reasons.general" id="general_reason"
                                            placeholder="Additional information required..." :maxlength="500"
                                            rows="2" />
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex items-center gap-3 pt-4">
                                <Button type="submit" :disabled="submitting">
                                    <Icon v-if="submitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                                    Submit Review
                                </Button>
                                <Button type="button" variant="outline" @click="showReviewForm = false">
                                    Cancel
                                </Button>
                                <Button type="button" variant="destructive" @click="confirmDelete" class="ml-auto">
                                    <Icon name="lucide:trash-2" class="w-4 h-4 mr-2" />
                                    Delete Request
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <!-- Show Review Button if form is hidden -->
                <div v-else-if="!request.is_final && !showReviewForm" class="flex gap-3">
                    <Button @click="showReviewForm = true" class="flex-1">
                        <Icon name="lucide:check-circle" class="w-4 h-4 mr-2" />
                        Review Request
                    </Button>
                    <Button variant="destructive" @click="confirmDelete">
                        <Icon name="lucide:trash-2" class="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <AlertDialog v-model:open="showDeleteDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Verification Request</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this verification request for <strong>{{
                            request?.business_name }}</strong>?
                        <br /><br />
                        This action cannot be undone. All associated documents will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="handleDelete" class="bg-red-600 hover:bg-red-700">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <!-- Review Confirmation Dialog -->
        <AlertDialog v-model:open="showReviewDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Review</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div class="space-y-2">
                            <p>You are about to <strong>{{ reviewForm.status }}</strong> this verification request.</p>
                            <p v-if="reviewForm.user_message" class="text-sm">
                                <strong>User Message:</strong> {{ reviewForm.user_message }}
                            </p>
                            <p class="text-sm text-gray-500">This action will notify the user.</p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="submitReview">
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import DocumentViewer from '@/components/DocumentViewer.vue'
import type { VerificationStatus, RejectionReasons } from '@/types/verificationRequest'
import { toast } from 'vue-sonner'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { getVerificationRequest, reviewVerificationRequest, deleteVerificationRequest } = useVerificationRequests()

const requestId = route.params.id as string
const showReviewOnLoad = route.query.review === 'true'

// Fetch request data
const { data: requestData, pending, error, refresh } = await getVerificationRequest(requestId)

const request = computed(() => requestData.value?.data)

// Review form
const showReviewForm = ref(showReviewOnLoad)
const showDeleteDialog = ref(false)
const showReviewDialog = ref(false)
const submitting = ref(false)

const reviewForm = ref<{
    status: 'approved' | 'rejected' | 'under_review'
    user_message: string
    admin_notes: string
    rejection_reasons: RejectionReasons
}>({
    status: 'approved',
    user_message: '',
    admin_notes: '',
    rejection_reasons: {}
})

// Helper functions
const getStatusVariant = (status: VerificationStatus) => {
    switch (status) {
        case 'approved':
            return 'default'
        case 'pending':
            return 'secondary'
        case 'under_review':
            return 'outline'
        case 'rejected':
            return 'destructive'
        case 'resubmitted':
            return 'secondary'
        default:
            return 'default'
    }
}

const getUserFullName = (user: { first_name: string; last_name: string }) => {
    return `${user.first_name} ${user.last_name}`
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatRejectionKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Event handlers
const handleSubmitReview = () => {
    // Validate rejection reasons if status is rejected
    if (reviewForm.value.status === 'rejected') {
        const hasReason = Object.values(reviewForm.value.rejection_reasons).some(v => v && v.trim())
        if (!hasReason) {
            toast.error('At least one rejection reason is required')
            return
        }
    }

    showReviewDialog.value = true
}

const submitReview = async () => {
    if (!request.value) return

    submitting.value = true
    try {
        const data: any = {
            status: reviewForm.value.status,
        }

        if (reviewForm.value.user_message) {
            data.user_message = reviewForm.value.user_message
        }

        if (reviewForm.value.admin_notes) {
            data.admin_notes = reviewForm.value.admin_notes
        }

        if (reviewForm.value.status === 'rejected') {
            // Filter out empty rejection reasons
            const reasons: RejectionReasons = {}
            Object.entries(reviewForm.value.rejection_reasons).forEach(([key, value]) => {
                if (value && value.trim()) {
                    reasons[key as keyof RejectionReasons] = value
                }
            })
            data.rejection_reasons = reasons
        }

        await reviewVerificationRequest(request.value.id, data)
        toast.success(`Verification request ${reviewForm.value.status} successfully`)
        showReviewDialog.value = false
        router.push('/verification-request')
    } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to review verification request')
    } finally {
        submitting.value = false
    }
}

const confirmDelete = () => {
    showDeleteDialog.value = true
}

const handleDelete = async () => {
    if (!request.value) return

    try {
        await deleteVerificationRequest(request.value.id)
        toast.success('Verification request deleted successfully')
        router.push('/verification-request')
    } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete verification request')
    }
}
</script>
