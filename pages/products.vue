<template>
  <div class="min-h-screen bg-white pt-[100px]">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="font-serif text-[32px] text-stone-600 md:text-[36px]">
          Product Catalog
        </h1>
        <p class="mt-2 text-stone-500">
          Discover our curated collection of skincare products
        </p>
      </div>

      <div class="mb-8 rounded-lg bg-[#fcf9f7] p-6">
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1 md:max-w-md">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products by name..."
                class="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 pr-10 text-stone-700 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
                @input="debouncedSearch"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  class="h-5 w-5 text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-stone-600"
                >Category:</label
              >
              <select
                v-model="selectedCategory"
                class="rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-700 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
                @change="applyFilters"
              >
                <option value="">All Categories</option>
                <option
                  v-for="category in categories"
                  :key="category._id"
                  :value="category.slug"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-stone-600">Sort by:</label>
              <select
                v-model="sortOption"
                class="rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-700 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
                @change="applyFilters"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
          <span class="text-sm text-stone-600">Active filters:</span>
          <span
            v-if="searchQuery"
            class="inline-flex items-center gap-1 rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700"
          >
            Search: "{{ searchQuery }}"
            <button @click="clearSearch" class="ml-1 hover:text-stone-900">
              ×
            </button>
          </span>
          <span
            v-if="selectedCategory"
            class="inline-flex items-center gap-1 rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700"
          >
            Category: {{ getCategoryName(selectedCategory) }}
            <button @click="clearCategory" class="ml-1 hover:text-stone-900">
              ×
            </button>
          </span>
        </div>
      </div>

      <div
        v-if="loading"
        class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <div v-for="item in 8" :key="item" class="flex flex-col items-center">
          <div class="h-[300px] w-full animate-pulse rounded-lg bg-stone-100" />
          <div class="mt-4 flex w-full justify-between">
            <div class="h-4 w-24 animate-pulse rounded bg-stone-100"></div>
            <div class="h-4 w-16 animate-pulse rounded bg-stone-100"></div>
          </div>
        </div>
      </div>

      <div v-else-if="!products.length && !loading" class="py-12 text-center">
        <h3 class="mb-2 text-xl font-medium text-stone-600">
          No products found
        </h3>
        <p class="mb-4 text-stone-500">
          Try adjusting your search or filter criteria
        </p>
        <button
          @click="clearAllFilters"
          class="rounded-lg bg-stone-600 px-6 py-2 text-white transition-colors hover:bg-stone-700"
        >
          Clear filters
        </button>
      </div>

      <div
        v-else
        class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="product in products"
          :key="product._id"
          class="group cursor-pointer transition-transform hover:scale-105"
        >
          <nuxt-link :to="`/products/${product._id}`">
            <div class="flex flex-col">
              <div class="relative overflow-hidden bg-stone-100">
                <img
                  :src="product.images?.[0] || '/images/no-image.jpg'"
                  :alt="product.name"
                  class="h-[300px] w-full object-cover transition-transform group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-10"
                />
              </div>
              <div class="mt-4 flex justify-between">
                <h3
                  class="text-sm font-medium text-stone-700 group-hover:text-stone-900"
                >
                  {{ product.name }}
                </h3>
                <span class="text-sm font-medium text-stone-600">
                  {{ product.price }} €
                </span>
              </div>
              <p
                v-if="product.description"
                class="mt-1 line-clamp-2 text-xs text-stone-500"
              >
                {{ product.description }}
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ProductsService } from '~/services/ProductsService'
import { CategoriesService } from '~/services/CategoriesService'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortOption = ref('name-asc')

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value
})

const loadProducts = async () => {
  try {
    loading.value = true
    const [sort, order] = sortOption.value.split('-')

    const filters = {
      search: searchQuery.value,
      category: selectedCategory.value,
      sort,
      order,
    }

    const response = await ProductsService.getProductsByCategory(filters)
    products.value = response.items || []
  } catch (error) {
    console.error('Error loading products:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const data = await CategoriesService.getCategories()
    categories.value = data || []
  } catch (error) {
    console.error('Error loading categories:', error)
    categories.value = []
  }
}

const applyFilters = () => {
  loadProducts()
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 500)

const clearSearch = () => {
  searchQuery.value = ''
  applyFilters()
}

const clearCategory = () => {
  selectedCategory.value = ''
  applyFilters()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortOption.value = 'name-asc'
  applyFilters()
}

const getCategoryName = (categorySlug) => {
  const category = categories.value.find((cat) => cat.slug === categorySlug)
  return category ? category.name : 'Unknown'
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
</script>
