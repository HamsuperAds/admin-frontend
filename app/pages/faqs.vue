<template>
    <div class="p-6">
        <div class="flex flex-col items-center mb-8">
            <h1 class="text-2xl font-semibold text-gray-800">Frequently Asked Questions (FAQs)</h1>
            <div class="flex items-center gap-2 mt-2">
                <p class="text-sm text-gray-500">Total FAQs: {{ faqs.length }}</p>
                <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 text-blue-600 animate-spin" />
            </div>
        </div>
        <div class="text-right mb-4">
            <Button variant="outline"
                class="border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 h-9 px-4" @click="">
                <Icon name="lucide:plus" class="w-4 h-4 mr-1" />
                Add New FAQ
            </Button>
        </div>
        <div v-if="loading && faqs.length === 0" class="flex justify-center py-12">
            <div class="flex flex-col items-center gap-3">
                <Icon name="lucide:loader-2" class="w-8 h-8 text-blue-600 animate-spin" />
                <p class="text-gray-500">Loading FAQs...</p>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div v-for="faq in faqs" :key="faq.id"
                class="p-6 bg-[#F8F9FC] rounded-xl border border-gray-100 flex flex-col">
                <div v-if="!faq.isEditing" class="flex-1">
                    <h3 class="text-center font-bold text-gray-900 mb-4">{{ faq.question }}</h3>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ faq.answer }}</p>
                </div>

                <div v-else class="flex-1 space-y-4">
                    <Input v-model="faq.editQuestion" placeholder="Enter question" class="text-center font-bold" />
                    <Textarea v-model="faq.editAnswer" placeholder="Enter answer" class="min-h-[100px] text-sm" />
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <template v-if="!faq.isEditing">
                        <Button variant="outline"
                            class="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 h-9 px-4"
                            @click="openDeleteDialog(faq)">
                            <Icon name="lucide:trash-2" class="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                        <Button variant="outline"
                            class="border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 h-9 px-4"
                            @click="startEditing(faq)">
                            <Icon name="lucide:edit" class="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </template>

                    <template v-else>
                        <Button variant="outline" class="border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-4"
                            @click="cancelEditing(faq)">
                            <Icon name="lucide:x-circle" class="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button class="bg-blue-500 hover:bg-blue-600 text-white h-9 px-4" @click="saveFAQ(faq)">
                            <Icon name="lucide:save" class="w-4 h-4 mr-2" />
                            Save
                        </Button>
                    </template>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <AlertDialog :open="!!faqToDelete" @update:open="faqToDelete = null">
            <AlertDialogContent class="max-w-[400px] p-6 rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle class="text-xl font-bold">Delete FAQ?</AlertDialogTitle>
                    <AlertDialogDescription class="text-gray-600 text-base py-2">
                        You are about to delete this FAQ (<span class="font-bold">#{{ faqToDelete?.question }}</span>).
                        This
                        action is permanent and cannot be undone
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter class="flex gap-3 sm:justify-center mt-4">
                    <AlertDialogCancel class="flex-1 h-12 text-base font-medium border-gray-300">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        class="flex-1 h-12 text-base font-medium bg-[#8B0000] hover:bg-[#660000] text-white"
                        @click="confirmDelete">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'vue-sonner'
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
import type { Faq } from '@/types/faq'

definePageMeta({
    layout: 'dashboard'
})

// Extend Faq type for local editing state
interface FaqWithEdit extends Faq {
    isEditing: boolean;
    editQuestion: string;
    editAnswer: string;
    loading?: boolean;
}

const api = useApi()
const faqs = ref<FaqWithEdit[]>([])
const loading = ref(false)
const faqToDelete = ref<FaqWithEdit | null>(null)

const fetchFaqs = async () => {
    loading.value = true
    try {
        const response = await api.fetchGet('/faqs')
        if (response) {
            const data = response as any
            faqs.value = data.data.map((faq: Faq) => ({
                ...faq,
                isEditing: false,
                editQuestion: '',
                editAnswer: ''
            }))
        }
    } catch (err) {
        console.error('Failed to fetch FAQs:', err)
    } finally {
        loading.value = false
    }
}

const startEditing = (faq: FaqWithEdit) => {
    faq.editQuestion = faq.question
    faq.editAnswer = faq.answer
    faq.isEditing = true
}

const cancelEditing = (faq: FaqWithEdit) => {
    faq.isEditing = false
}

const saveFAQ = async (faq: FaqWithEdit) => {
    if (!faq.editQuestion || !faq.editAnswer) return

    faq.loading = true
    try {
        // Using POST with _method=PUT as requested
        const response = await api.fetchPost(`/faqs/${faq.id}`, {
            question: faq.editQuestion,
            answer: faq.editAnswer,
            _method: 'PUT'
        })

        if (response) {
            faq.question = faq.editQuestion
            faq.answer = faq.editAnswer
            faq.isEditing = false
            toast.success('FAQ updated successfully')
        }
    } catch (err) {
        console.error('Failed to update FAQ:', err)
        toast.error('Failed to update FAQ')
    } finally {
        faq.loading = false
    }
}

const openDeleteDialog = (faq: FaqWithEdit) => {
    faqToDelete.value = faq
}

const confirmDelete = async () => {
    console.log('about to delete faq')
    if (!faqToDelete.value) return
    console.log('about to delete faq 2')

    loading.value = true
    try {
        const response = await api.fetchDelete(`/faqs/${faqToDelete.value.id}`)
        if (response) {
            faqs.value = faqs.value.filter(f => f.id !== faqToDelete.value!.id)
            faqToDelete.value = null
            toast.success('FAQ deleted successfully')
        }
    } catch (err) {
        console.error('Failed to delete FAQ:', err)
        toast.error('Failed to delete FAQ')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchFaqs()
})
</script>
