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
            class="flex justify-end text-[20px] font-semibold text-stone-500"
          >
            {{ getDisplayPrice() }} €
          </span>
        </div>
        <div class="flex flex-col gap-4 font-semibold text-stone-500">
          <div
            v-if="product?.modifications && product.modifications.length > 0"
            class="flex flex-col gap-2"
          >
            <label class="text-sm font-medium text-stone-600"
              >Select modification:</label
            >
            <Multiselect
              v-model="selectedModification"
              :options="product.modifications"
              label="name"
              track-by="name"
              placeholder="Select modification"
              class="min-w-full"
              :show-labels="false"
              :close-on-select="true"
              :searchable="false"
              :allow-empty="false"
              :disabled="product.modifications.length <= 1"
              :option-height="60"
              :custom-label="formatOptionLabel"
            >
              <template #option="{ option }">
                <div class="flex items-center justify-between py-2">
                  <span :class="{ 'text-gray-400': !option.in_stock }">
                    {{ option.name }}
                  </span>
                  <div class="flex flex-col items-end">
                    <span
                      class="font-semibold"
                      :class="{ 'text-gray-400': !option.in_stock }"
                    >
                      {{ option.price }}€
                    </span>
                    <span v-if="!option.in_stock" class="text-xs text-red-500">
                      Out of stock
                    </span>
                  </div>
                </div>
              </template>
              <template #singleLabel="{ option }">
                <div class="flex w-full items-center justify-between">
                  <span>{{ option.name }}</span>
                  <span class="font-semibold">{{ option.price }}€</span>
                </div>
              </template>
            </Multiselect>
          </div>
          <button
            @click="handleAddToCart"
            :disabled="
              isAddingToCart ||
              (product?.modifications &&
                product.modifications.length > 1 &&
                !selectedModification) ||
              !isSelectedModificationInStock()
            "
            class="my-4 w-full bg-black p-2 text-stone-50 disabled:cursor-not-allowed disabled:opacity-50 md:my-0"
          >
            {{
              isAddingToCart
                ? 'Adding...'
                : !isSelectedModificationInStock()
                  ? 'Out of stock'
                  : 'Add to cart'
            }}
          </button>

          <div
            v-if="addToCartMessage"
            class="text-sm"
            :class="addToCartError ? 'text-red-600' : 'text-green-600'"
          >
            {{ addToCartMessage }}
          </div>
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
  <div
    v-if="productSuggestions.length > 0"
    class="w-100 bg-white p-4 md:p-[120px]"
  >
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
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

const { id } = useRoute().params
const { addToCart } = useCart()

const product = ref(null)
const productSuggestions = ref([])
const loading = ref(false)
const currentImageIndex = ref(0)

const selectedModification = ref(null)
const isAddingToCart = ref(false)
const addToCartMessage = ref('')
const addToCartError = ref(false)

onMounted(async () => {
  await getProductData()
  await getProductSuggestions()
})

const getProductSuggestions = async () => {
  try {
    loading.value = true
    const data = await ProductsService.getProducts()
    productSuggestions.value = data.items.filter(
      (item) =>
        item.category.name === product.value.category.name &&
        item._id !== product.value._id,
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

watch(
  product,
  () => {
    currentImageIndex.value = 0
    if (
      product.value?.modifications &&
      product.value.modifications.length > 0
    ) {
      const firstAvailable = product.value.modifications.find(
        (mod) => mod.in_stock,
      )
      selectedModification.value = firstAvailable
        ? firstAvailable
        : product.value.modifications[0]
    } else {
      selectedModification.value = null
    }
  },
  { immediate: true },
)

const displayPrice = computed(() => {
  if (!product.value?.modifications) return 0

  if (
    selectedModification.value &&
    typeof selectedModification.value === 'object'
  ) {
    return selectedModification.value.price
  }

  return product.value.modifications[0]?.price || 0
})

const getDisplayPrice = () => {
  return displayPrice.value
}

const formatOptionLabel = (option) => {
  return `${option.name} - ${option.price}€${!option.in_stock ? ' (Out of stock)' : ''}`
}

const isSelectedModificationInStock = () => {
  if (!selectedModification.value || !product.value?.modifications) return true
  if (typeof selectedModification.value === 'object') {
    return selectedModification.value.in_stock
  }
  return true
}

const handleAddToCart = async () => {
  if (!product.value) return

  try {
    isAddingToCart.value = true
    addToCartMessage.value = ''
    addToCartError.value = false

    const productId = product.value._id

    let modificationToSend = null
    if (product.value.modifications && product.value.modifications.length > 0) {
      modificationToSend =
        typeof selectedModification.value === 'object'
          ? selectedModification.value.name
          : product.value.modifications[0].name
    }

    await addToCart(productId, modificationToSend)

    addToCartMessage.value = 'Product added to cart successfully!'
    addToCartError.value = false

    setTimeout(() => {
      addToCartMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to add to cart:', error)
    addToCartMessage.value = error.message || 'Failed to add product to cart'
    addToCartError.value = true

    setTimeout(() => {
      addToCartMessage.value = ''
      addToCartError.value = false
    }, 5000)
  } finally {
    isAddingToCart.value = false
  }
}
</script>

<style scoped>
:deep(.multiselect) {
  min-height: 48px;
  border: 1px solid #d6d3d1;
  border-radius: 0;
}

:deep(.multiselect__tags) {
  border: none;
  border-radius: 0;
  background: white;
  padding: 12px 40px 12px 12px;
  min-height: 48px;
}

:deep(.multiselect__single) {
  background: transparent;
  color: #78716c;
  font-weight: 600;
  margin-bottom: 0;
  padding: 0;
  line-height: 24px;
}

:deep(.multiselect__select) {
  width: 40px;
  height: 46px;
  background: transparent;
}

:deep(.multiselect__select:before) {
  border-color: #78716c transparent transparent;
  border-width: 6px 6px 0;
  margin-top: -3px;
}

:deep(.multiselect__content-wrapper) {
  border: 1px solid #d6d3d1;
  border-radius: 0;
  border-top: none;
}

:deep(.multiselect__content) {
  background: white;
}

:deep(.multiselect__option) {
  color: #78716c;
  background: white;
  padding: 8px 12px;
  font-weight: 500;
}

:deep(.multiselect__option--highlight) {
  background: #f5f5f4;
  color: #57534e;
}

:deep(.multiselect__option--selected) {
  background: #e7e5e4;
  color: #44403c;
  font-weight: 600;
}

:deep(.multiselect__placeholder) {
  color: #a8a29e;
  margin-bottom: 0;
  padding: 0;
}
</style>
