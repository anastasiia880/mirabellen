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
      <div v-if="loading" class="flex gap-8">
        <div
          v-for="item in 4"
          :key="item"
          class="flex-[0_0_auto] md:max-w-[400px]"
        >
          <div class="flex flex-col items-center gap-2">
            <div class="h-[400px] w-[400px] animate-pulse bg-stone-100" />
            <div class="flex w-full justify-between">
              <div class="h-4 w-24 animate-pulse bg-stone-100"></div>
              <div class="h-4 w-16 animate-pulse bg-stone-100"></div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-[0_0_auto] cursor-pointer md:max-w-[400px]"
        v-for="item in products"
      >
        <nuxt-link :to="`/products/${item._id}`">
          <div class="flex flex-col items-center gap-2">
            <img
              :src="item?.images[0]"
              alt="product-image"
              class="h-[400px] w-[400px] object-cover"
            />
            <div class="flex w-full justify-between">
              <span class="text-sm text-stone-500">{{ item?.name }}</span>
              <span class="text-sm text-stone-500">{{ item?.price }} €</span>
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
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    const data = await ProductsService.getProducts()
    products.value = data.filter((item) => item.popular)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})
</script>
