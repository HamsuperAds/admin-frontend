<template>
    <div class="verify-page flex items-center justify-center h-full">
        <div class="verify-container">
            <div class="verify-card">
                <h1 class="verify-title">Verify Admin Token</h1>
                <p class="verify-subtitle">Provide your admin credentials</p>

                <p class="verify-instruction">
                    Enter the verification code that was sent to your email ({{ userInfoStore.adminEmail ||
                        'xyz@example.com' }})
                </p>

                <form @submit.prevent="handleVerify" class="verify-form">
                    <!-- Error Message -->
                    <div v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </div>

                    <div class="code-inputs">
                        <InputOTP v-model="otpCode" :maxlength="5" :disabled="isLoading" :pattern="REGEXP_ONLY_DIGITS"
                            @complete="handleVerify">
                            <InputOTPGroup class="space-x-2">
                                <InputOTPSlot v-for="(_, index) in 5" :key="index" :index="index" class="w-10 h-10" />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <button type="submit" class="verify-button" :disabled="otpCode.length < 5 || isLoading">
                        {{ isLoading ? 'Verifying...' : 'Verify' }}
                    </button>

                    <p class="resend-text">
                        Didn't get the verification code? It may take a while.
                    </p>

                    <button type="button" class="resend-button" :disabled="resendTimer > 0 || isLoading"
                        @click="handleResend">
                        Resend Code
                    </button>

                    <p v-if="resendTimer > 0" class="resend-timer">
                        Can resend code after <strong>{{ resendTimer }}</strong> seconds.
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '~/stores/userInfo'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'vue-input-otp'

useSeoMeta({
  title: 'Verify Login - Hamsuper',
  description: 'Verify your identity to access the Hamsuper Admin Panel.'
})

definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: "/dashboard",
    },
});

const router = useRouter()
const { getSession } = useAuth();
const { setToken } = useAuthState();
const { fetchPost } = useApi()
const userInfoStore = useUserInfoStore()

const otpCode = ref('')
const resendTimer = ref(30)
const isLoading = ref(false)
const errorMessage = ref('')
let timerInterval: ReturnType<typeof setInterval> | null = null

// Check if email exists, if not redirect to login
onMounted(() => {
    if (!userInfoStore.adminEmail) {
        router.push('/')
        return
    }
    startTimer()
})

const startTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval)
    }

    timerInterval = setInterval(() => {
        resendTimer.value--
        if (resendTimer.value <= 0 && timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
        }
    }, 1000)
}

const handleVerify = async () => {
    if (otpCode.value.length < 5) return

    try {
        isLoading.value = true
        errorMessage.value = ''

        const code = otpCode.value

        const response = await fetchPost<{
            success: boolean
            message: string
            data?: {
                admin: any
                token: string
            }
        }>('/auth/verify-otp', {
            email: userInfoStore.adminEmail,
            otp: code,
            action: '2fa'
        }, { requiresAuth: false })

        if (response.success && response.data?.token) {
            // Set the token
            setToken(response.data.token)

            // Get session
            await getSession()

            // Navigate to dashboard
            await router.push('/dashboard')
        } else if (!response.success) {
            errorMessage.value = response.message || 'Invalid or expired OTP code'
            // Clear the code input
            otpCode.value = ''
        }
    } catch (error: any) {
        console.error('Verification error:', error)
        errorMessage.value = error?.data?.message || 'An error occurred during verification. Please try again.'
        // Clear the code input
        otpCode.value = ''
    } finally {
        isLoading.value = false
    }
}

const handleResend = () => {
    console.log('Resending code...')
    resendTimer.value = 30
    startTimer()
}

onUnmounted(() => {
    if (timerInterval) {
        clearInterval(timerInterval)
    }
})
</script>

<style scoped>
/* .verify-page {
    min-height: 100vh;
    background-color: #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
} */

.verify-container {
    width: 100%;
    max-width: 400px;
}

.verify-card {
    background: white;
    border: 1px solid #d1d1d1;
    border-radius: 8px;
    padding: 2.5rem 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.verify-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin: 0 0 0.5rem 0;
}

.verify-subtitle {
    font-size: 0.875rem;
    color: #666;
    text-align: center;
    margin: 0 0 1.5rem 0;
}

.verify-instruction {
    font-size: 0.8125rem;
    color: #666;
    text-align: center;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
}

.verify-form {
    display: flex;
    flex-direction: column;
}

.error-message {
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
    margin-bottom: 1rem;
}

.code-inputs {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.verify-button {
    width: 100%;
    padding: 0.75rem;
    background: #3b9dd8;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    margin-bottom: 1rem;
}

.verify-button:hover:not(:disabled) {
    background: #2e8bc7;
}

.verify-button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.resend-text {
    font-size: 0.8125rem;
    color: #666;
    text-align: center;
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
}

.resend-button {
    background: none;
    border: none;
    color: #3b9dd8;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0;
    text-align: center;
    margin-bottom: 0.5rem;
}

.resend-button:hover:not(:disabled) {
    text-decoration: underline;
}

.resend-button:disabled {
    color: #ccc;
    cursor: not-allowed;
}

.resend-timer {
    font-size: 0.8125rem;
    color: #666;
    text-align: center;
    margin: 0;
}

.resend-timer strong {
    color: #333;
}
</style>
