<template>
  <div class="w-100 grid md:grid-cols-2">
    <div class="mt-[100px] flex items-start justify-center p-6">
      <div v-if="loading">
        <div class="h-[775px] w-[500px] animate-pulse bg-stone-100" />
      </div>
      <img
        v-else
        class="max-h-[775px] object-cover md:max-w-[500px]"
        :src="product?.image"
        alt="product-image"
      />
    </div>
    <div class="bg-white md:relative md:h-[900px] md:bg-[#fcf9f7]">
      <div
        class="flex flex-col p-4 md:absolute md:bottom-20 md:left-20 md:max-w-[345px] md:gap-4"
      >
        <div class="flex flex-row justify-between md:flex-col">
          <div
            class="max-w-[178px] text-wrap font-serif text-2xl text-stone-500 md:text-[40px]"
          >
            {{ product?.name }}
          </div>
          <span
            class="flex justify-end text-[20px] font-semibold text-stone-500 md:pt-[150px]"
          >
            {{ product?.price }} €
          </span>
        </div>
        <div class="flex flex-col gap-4 font-semibold text-stone-500">
          <button class="my-4 bg-black p-2 text-stone-50 md:my-0 md:w-[345px]">
            Add to bag
          </button>
          <span>{{ product?.name }}</span>
          <p>
            {{ product?.description }}
          </p>
          <span> Vegan, Made in France </span>
          <img
            width="52"
            height="26"
            src="/icons/product.svg"
            alt="product-icon"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="w-100 bg-white p-4 md:p-[120px]">
    <span class="font-bold text-stone-500">More</span>
    <div class="no-scrollbar flex gap-4 overflow-x-scroll py-4">
      <div v-for="item in productSuggestions">
        <nuxt-link :to="`/products/${item?._id}`">
          <img
            class="h-[200px] w-[200px] object-cover"
            :src="item?.image"
            alt="product-image"
          />
          <div class="pt-2 text-xs font-semibold text-stone-500">
            {{ item?.name }}
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ProductsService } from '~/services/ProductsService'

const { id } = useRoute().params

const product = ref(null)
const productSuggestions = ref([])
const loading = ref(false)

onMounted(async () => {
  await getProductData()
  await getProductSuggestions()
})

const getProductSuggestions = async () => {
  try {
    loading.value = true
    const data = await ProductsService.getProducts()
    productSuggestions.value = data.filter(
      (item) => item.category === product.value.category,
    )
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const getProductData = async () => {
  try {
    loading.value = true
    const data = await ProductsService.getProductById(id)
    product.value = data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}
</script>
