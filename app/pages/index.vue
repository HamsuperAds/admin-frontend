<template>
    <div class="login-page flex items-center justify-center h-full">
        <div class="login-container">
            <div class="login-card">
                <h1 class="login-title">Admin Login</h1>
                <p class="login-subtitle">Provide your admin credentials</p>

                <form @submit.prevent="handleLogin" class="login-form">
                    <!-- Error Message -->
                    <div v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" v-model="email" type="email" placeholder="Enter your email" required
                            :disabled="isLoading" />
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-input-wrapper">
                            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                                placeholder="Enter password" required :disabled="isLoading" />
                            <button type="button" class="toggle-password" @click="showPassword = !showPassword"
                                :disabled="isLoading">
                                <span v-if="showPassword">👁️</span>
                                <span v-else>👁️</span>
                            </button>
                        </div>
                    </div>

                    <button type="submit" class="sign-in-button" :disabled="isLoading">
                        {{ isLoading ? 'Signing in...' : 'Sign in' }}
                    </button>

                    <a href="#" class="forgot-password">Forgot password?</a>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '~/stores/userInfo'

useSeoMeta({
    title: 'Hamsuper Admin Panel Login',
    description: 'Login to the Hamsuper Admin Panel to manage users, ads, transactions, and more.'
})

definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: "/dashboard",
    },
});

const router = useRouter()
const { fetchPost } = useApi()
const email = ref(''); //admin@hamsuper.test
const password = ref(''); //admin123
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const userInfoStore = useUserInfoStore()

const handleLogin = async () => {
    try {
        isLoading.value = true
        errorMessage.value = ''

        const response = await fetchPost<{
            success: boolean
            message: string
            requires_2fa?: boolean
        }>('/auth/login', {
            email: email.value,
            password: password.value
        }, { requiresAuth: false })

        if (response.success && response.requires_2fa) {
            // Store email for verification page
            userInfoStore.adminEmail = email.value;
            // Navigate to verify page
            await router.push('/verify')
        } else if (!response.success) {
            errorMessage.value = response.message || 'Login failed. Please check your credentials and try again.'
        }
    } catch (error: any) {
        console.error('Login error:', error)
        errorMessage.value = error?.data?.message || 'An error occurred during login. Please try again.'
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.login-container {
    width: 100%;
    max-width: 400px;
}

.login-card {
    background: white;
    border: 1px solid #d1d1d1;
    border-radius: 8px;
    padding: 2.5rem 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.login-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin: 0 0 0.5rem 0;
}

.login-subtitle {
    font-size: 0.875rem;
    color: #666;
    text-align: center;
    margin: 0 0 2rem 0;
}

.login-form {
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

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    font-size: 0.875rem;
    color: #333;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d1d1;
    border-radius: 4px;
    font-size: 0.875rem;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #3b9dd8;
}

.form-group input::placeholder {
    color: #999;
}

.password-input-wrapper {
    position: relative;
}

.password-input-wrapper input {
    padding-right: 2.5rem;
}

.toggle-password {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1rem;
    color: #666;
}

.sign-in-button {
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

.sign-in-button:hover {
    background: #2e8bc7;
}

.forgot-password {
    text-align: left;
    font-size: 0.875rem;
    color: #333;
    text-decoration: none;
}

.forgot-password:hover {
    text-decoration: underline;
}
</style>
