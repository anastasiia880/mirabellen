<template>
  <div class="min-h-screen bg-[#fcf9f7] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <nuxt-link to="/">
          <h1 class="text-[24px] text-stone-600 hover:text-stone-400 transition-colors">
            mirabellen cosmetics.
          </h1>
        </nuxt-link>
      </div>
      <div class="bg-transparent rounded-lg shadow-sm border border-stone-200 p-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Authentication - Mirabellen',
  meta: [
    { name: 'description', content: 'Login or register for Mirabellen cosmetics' },
    { name: 'og:title', content: 'Authentication - Mirabellen' },
  ],
})
</script>
