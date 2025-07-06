<template>
  <div class="w-100 grid md:grid-cols-2">
    <div class="mt-[100px] flex items-start justify-center p-6">
      <div v-if="loading">
        <div class="h-[775px] w-[500px] animate-pulse bg-stone-100" />
      </div>

      <div v-else class="relative max-w-[500px]">
        <div class="relative overflow-hidden">
          <img
            class="h-[775px] w-[500px] object-cover transition-transform duration-300 ease-in-out"
            :src="product?.images[currentImageIndex]"
            alt="product-image"
          />

          <div
            v-if="product?.images?.length > 1"
            class="absolute inset-0 flex items-center justify-between p-2"
          >
            <button
              @click="previousImage"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              :disabled="currentImageIndex === 0"
              :class="{
                'opacity-50': currentImageIndex === 0,
              }"
            >
              <img src="/icons/back.svg" alt="previous" class="h-5 w-5" />
            </button>

            <button
              @click="nextImage"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              :disabled="currentImageIndex === product.images.length - 1"
              :class="{
                'opacity-50': currentImageIndex === product.images.length - 1,
              }"
            >
              <img
                src="/icons/back.svg"
                alt="next"
                class="h-5 w-5 rotate-180"
              />
            </button>
          </div>
        </div>

        <div
          v-if="product?.images?.length > 1"
          class="mt-4 flex justify-center space-x-2"
        >
          <button
            v-for="(image, index) in product.images"
            :key="index"
            @click="currentImageIndex = index"
            class="h-2 w-2 rounded-full transition-all duration-200"
            :class="
              index === currentImageIndex
                ? 'bg-stone-500'
                : 'bg-stone-300 hover:bg-stone-400'
            "
          />
        </div>
      </div>
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
            :src="item?.images[0]"
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
const currentImageIndex = ref(0)

onMounted(async () => {
  await getProductData()
  await getProductSuggestions()
})

const getProductSuggestions = async () => {
  try {
    loading.value = true
    const data = await ProductsService.getProducts()
    productSuggestions.value = data.items.filter(
      (item) => item.category.name === product.value.category.name,
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

const nextImage = () => {
  if (currentImageIndex.value < product.value.images.length - 1) {
    currentImageIndex.value++
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

watch(product, () => {
  currentImageIndex.value = 0
})
</script>
