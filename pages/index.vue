<template>
  <div
    class="w-100 flex h-[400px] items-center justify-center bg-[#fcf9f7] md:h-[80vh]"
  >
    <h2 class="font-serif text-[36px] text-stone-500 md:text-[40px]">
      Your favorite skincare
    </h2>
  </div>
  <div class="w-100 flex justify-center">
    <div
      class="no-scrollbar flex flex-col items-center gap-4 overflow-x-scroll p-6 sm:flex-row"
    >
      <div
        class="flex-[0_0_auto] cursor-pointer md:max-w-[400px]"
        v-for="(item, index) in 8"
      >
        <nuxt-link :to="`/products/${index + 1}`">
          <img src="/images/product-image.jpeg" alt="product-image" />
        </nuxt-link>
      </div>
    </div>
  </div>

  <div
    class="w-100 flex h-[150px] items-center justify-center bg-white text-[18px] text-stone-500 md:h-[200px] md:text-[20px]"
  >
    Vegan, Made in France
  </div>
</template>

<script setup lang="ts"></script>
