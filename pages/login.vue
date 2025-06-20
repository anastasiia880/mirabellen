<template>
  <div>
    <h3 class="text-2xl font-medium text-stone-700 mb-6 text-center">
      Sign in
    </h3>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-stone-600 mb-2">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all placeholder-stone-400"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-stone-600 mb-2">
          Password
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          class="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all placeholder-stone-400"
          placeholder="Create a password"
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-stone-700 text-white py-3 px-4 rounded-lg hover:bg-stone-800 focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'loading...' : 'Submit' }}
      </button>
    </form>

    <div class="mt-6 text-center">
      <p class="text-stone-600 text-sm">
        Do not have an account?
        <nuxt-link 
          to="/register" 
          class="text-stone-700 hover:text-stone-900 font-medium transition-colors"
        >
          Sign up
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { AuthService } from '~/services/AuthService.js'

definePageMeta({
  layout: 'auth'
})

const form = ref({
  name: '',
  email: '',
  password: ''
})

const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    const response = await AuthService.login({
      email: form.email,
      password: form.password
    })
    
    console.log(response, 'response')
    await navigateTo('/')
    
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
