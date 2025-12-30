<template>
    <div class="p-6">
        <div class="flex flex-col items-center mb-8">
            <h1 class="text-2xl font-semibold text-gray-800">Frequently Asked Questions (FAQs)</h1>
            <p class="text-sm text-gray-500 mt-2">Total FAQs: {{ faqs.length }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
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
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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

definePageMeta({
    layout: 'dashboard'
})

interface FAQ {
    id: number
    question: string
    answer: string
    isEditing: boolean
    editQuestion: string
    editAnswer: string
}

const faqs = ref<FAQ[]>([
    {
        id: 1,
        question: 'How many free ads can I create?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        isEditing: false,
        editQuestion: '',
        editAnswer: ''
    },
    {
        id: 2,
        question: 'How many free ads can I create?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        isEditing: false,
        editQuestion: '',
        editAnswer: ''
    },
    {
        id: 3,
        question: 'How many free ads can I create?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        isEditing: false,
        editQuestion: '',
        editAnswer: ''
    },
    {
        id: 4,
        question: 'How many free ads can I create?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        isEditing: false,
        editQuestion: '',
        editAnswer: ''
    },
    {
        id: 5,
        question: 'How many free ads can I create?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        isEditing: false,
        editQuestion: '',
        editAnswer: ''
    },
    {
        id: 6,
        question: 'How many free ads can I create?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        isEditing: false,
        editQuestion: '',
        editAnswer: ''
    },
    {
        id: 7,
        question: 'How many free ads can I create?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        isEditing: false,
        editQuestion: '',
        editAnswer: ''
    },
    {
        id: 8,
        question: 'How many free ads can I create?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        isEditing: false,
        editQuestion: '',
        editAnswer: ''
    }
])

const faqToDelete = ref<FAQ | null>(null)

const startEditing = (faq: FAQ) => {
    faq.editQuestion = faq.question
    faq.editAnswer = faq.answer
    faq.isEditing = true
}

const cancelEditing = (faq: FAQ) => {
    faq.isEditing = false
}

const saveFAQ = (faq: FAQ) => {
    faq.question = faq.editQuestion
    faq.answer = faq.editAnswer
    faq.isEditing = false
    // Here you would normally make an API call
}

const openDeleteDialog = (faq: FAQ) => {
    faqToDelete.value = faq
}

const confirmDelete = () => {
    if (faqToDelete.value) {
        faqs.value = faqs.value.filter(f => f.id !== faqToDelete.value!.id)
        faqToDelete.value = null
    }
}
</script>
