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
      class="no-scrollbar flex flex-col items-center gap-8 overflow-x-scroll p-6 sm:flex-row"
    >
      <div
        class="flex-[0_0_auto] cursor-pointer md:max-w-[400px]"
        v-for="item in products"
      >
        <nuxt-link :to="`/products/${item._id}`">
          <div class="flex flex-col items-center gap-2">
            <img src="/images/product-image.jpeg" alt="product-image" />
            <div class="flex w-full justify-between">
              <span class="text-sm text-stone-500">{{ item.name }}</span>
              <span class="text-sm text-stone-500">{{ item.price }} €</span>
            </div>
          </div>
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

<script setup>
import { ProductsService } from '~/services/ProductsService'
const products = ref([])

onMounted(async () => {
  products.value = await ProductsService.getProducts()
})
</script>
