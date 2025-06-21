<template>
  <div>
    <h3 class="mb-6 text-center text-2xl font-medium text-stone-700">
      Sign in
    </h3>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label
          for="email"
          class="mb-2 block text-sm font-medium text-stone-600"
        >
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          :class="[
            'w-full rounded-lg border px-4 py-3 placeholder-stone-400 outline-none transition-all focus:border-transparent focus:ring-2',
            errors.email
              ? 'border-red-300 focus:ring-red-400'
              : 'border-stone-300 focus:ring-stone-400',
          ]"
          placeholder="Enter your email"
        />
        <div v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </div>
      </div>
      <div>
        <label
          for="password"
          class="mb-2 block text-sm font-medium text-stone-600"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          v-model="form.password"
          :class="[
            'w-full rounded-lg border px-4 py-3 placeholder-stone-400 outline-none transition-all focus:border-transparent focus:ring-2',
            errors.password
              ? 'border-red-300 focus:ring-red-400'
              : 'border-stone-300 focus:ring-stone-400',
          ]"
          placeholder="Enter your password"
        />
        <div v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password }}
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full rounded-lg bg-stone-700 px-4 py-3 font-medium text-white transition-all hover:bg-stone-800 focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ isLoading ? 'loading...' : 'Submit' }}
      </button>
    </form>

    <div class="mt-6 text-center">
      <p class="text-sm text-stone-600">
        Do not have an account?
        <nuxt-link
          to="/register"
          class="font-medium text-stone-700 transition-colors hover:text-stone-900"
        >
          Sign up
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
})

const auth = useAuth()

const form = ref({
  email: 'name@name.com',
  password: 'password',
})

const errors = ref({
  email: null,
  password: null,
})

const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true

  errors.value = {
    email: null,
    password: null,
  }

  try {
    await auth.login({
      email: form.value.email,
      password: form.value.password,
    })

    await navigateTo('/')
  } catch (error) {
    console.error('Login error:', error)
    if (error.validationErrors) {
      errors.value = { ...errors.value, ...error.validationErrors }
    }
  } finally {
    isLoading.value = false
  }
}

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = null
  }
}

watch(
  () => form.value.email,
  () => clearError('email'),
)
watch(
  () => form.value.password,
  () => clearError('password'),
)
</script>
