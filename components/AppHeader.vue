<template>
  <div
    class="absolute top-0 z-10 flex h-[100px] w-full items-center justify-between"
    :class="route.path === '/' ? 'bg-[#fcf9f7]' : 'bg-[transparent]'"
  >
    <div v-if="route.path !== '/'">
      <nuxt-link to="/">
        <img class="hover:opacity-50" src="/icons/back.svg" alt="back-icon" />
      </nuxt-link>
    </div>
    <div v-else class="w-[44px]"></div>

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

<script setup lang="ts">
const route = useRoute()
</script>
