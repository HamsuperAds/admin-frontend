<template>
    <div class="space-y-4">
        <div v-if="url" class="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <img :src="url" :alt="title" class="w-full h-auto max-h-[600px] object-contain cursor-pointer"
                @click="openLightbox" />
            <div class="absolute top-2 right-2 flex gap-2">
                <Button size="icon" variant="secondary" @click="downloadImage" title="Download">
                    <Icon name="lucide:download" class="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" @click="openLightbox" title="View Full Size">
                    <Icon name="lucide:maximize-2" class="w-4 h-4" />
                </Button>
            </div>
        </div>
        <div v-else class="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
            <Icon name="lucide:file-x" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">No document uploaded</p>
        </div>

        <!-- Lightbox Modal -->
        <Dialog v-model:open="showLightbox">
            <DialogContent class="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{{ title }}</DialogTitle>
                </DialogHeader>
                <div class="relative">
                    <img :src="url" :alt="title" class="w-full h-auto max-h-[80vh] object-contain" />
                    <div class="absolute top-2 right-2">
                        <Button size="icon" variant="secondary" @click="downloadImage">
                            <Icon name="lucide:download" class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
    url: string | null
    title: string
}

const props = defineProps<Props>()

const showLightbox = ref(false)

const openLightbox = () => {
    if (props.url) {
        showLightbox.value = true
    }
}

const downloadImage = () => {
    if (!props.url) return

    const link = document.createElement('a')
    link.href = props.url
    link.download = `${props.title}.jpg`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
</script>
