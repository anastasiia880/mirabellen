<template>
  <div
    class="absolute top-0 z-10 flex h-[100px] w-full items-center justify-between px-8"
    :class="route.path === '/' ? 'bg-[#fcf9f7]' : 'bg-[transparent]'"
  >
    <div v-if="route.path === '/'" class="flex items-center">
      <nuxt-link
        v-if="!isAuthenticated"
        to="/login"
        class="text-stone-600 hover:text-stone-400"
      >
        <img
          class="h-[20px] w-[20px] opacity-80 hover:opacity-50"
          src="/icons/login.svg"
          alt="login-icon"
        />
      </nuxt-link>
      <div
        v-else
        class="cursor-pointer text-stone-600 hover:text-stone-400"
        @click="handleLogout"
      >
        <img
          class="h-[20px] w-[20px] opacity-80 hover:opacity-50"
          src="/icons/logout.svg"
          alt="logout-icon"
        />
      </div>
    </div>
    <div v-if="route.path !== '/'">
      <nuxt-link to="/">
        <img class="hover:opacity-50" src="/icons/back.svg" alt="back-icon" />
      </nuxt-link>
    </div>

    <nuxt-link to="/">
      <h1 class="text-[18px] text-stone-600 hover:text-stone-400">
        mirabellen cosmetics.
      </h1>
    </nuxt-link>
    <button>
      <nuxt-link to="/checkout">
        <img class="hover:opacity-50" src="/icons/cart.svg" alt="cart-icon" />
      </nuxt-link>
    </button>
  </div>
</template>

<script setup>
const route = useRoute()
const { isAuthenticated, logout, checkAuth } = useAuth()

onMounted(async () => {
  await checkAuth()
})

const handleLogout = async () => {
  try {
    await logout()
    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
