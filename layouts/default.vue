<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'Mirabellen',
  meta: [
    { name: 'description', content: 'Cosmetics shop' },
    { name: 'og:title', content: 'Mirabellen - cosmetics' },
  ],
})
</script>
