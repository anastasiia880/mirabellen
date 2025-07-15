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
              <Multiselect
                v-model="selectedCategory"
                :options="[...categories.map((cat) => cat.slug)]"
                :custom-label="categoryLabel"
                placeholder="All Categories"
                class="min-w-[235px]"
                :show-labels="false"
              />
            </div>

            <div class="flex items-center gap-2">
              <label class="text-nowrap text-sm font-medium text-stone-600"
                >Tags:</label
              >
              <Multiselect
                v-model="selectedTags"
                :options="availableTags"
                placeholder="All Tags"
                multiple
              />
            </div>

            <div class="flex items-center gap-2">
              <label class="text-nowrap text-sm font-medium text-stone-600"
                >Sort by:</label
              >
              <Multiselect
                v-model="sortOption"
                :options="[
                  { label: 'Name (A-Z)', value: 'name-asc' },
                  { label: 'Name (Z-A)', value: 'name-desc' },
                ]"
                label="label"
                track-by="value"
                placeholder="Select sort"
                class="min-w-[235px]"
                :show-labels="false"
              />
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
      <div
        v-if="totalPages > 1 || products.length > 0"
        class="mt-12 flex flex-col items-center gap-6 rounded-lg bg-[#fcf9f7] p-6 md:flex-row md:justify-between"
      >
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-stone-600">Show:</label>
          <Multiselect
            v-model="itemsPerPage"
            :options="[
              { label: '5 items', value: '5' },
              { label: '10 items', value: '10' },
              { label: '20 items', value: '20' },
              { label: '30 items', value: '30' },
            ]"
            label="label"
            track-by="value"
            placeholder="Select sort"
            class="min-w-[235px]"
            :show-labels="false"
          />
          <span class="text-nowrap text-sm text-stone-500">per page</span>
        </div>

        <div v-if="totalPages > 1" class="flex items-center gap-4">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          >
            <img src="/icons/back.svg" alt="Previous" class="h-5 w-5" />
          </button>

          <div class="flex items-center gap-2">
            <template
              v-for="page in getVisiblePages(totalPages, currentPage)"
              :key="page"
            >
              <button
                v-if="page !== '...'"
                @click="currentPage = page"
                :class="[
                  'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'border-stone-600 bg-stone-600 text-white'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50',
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="flex h-10 w-10 items-center justify-center text-stone-400"
              >
                ...
              </span>
            </template>
          </div>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          >
            <img src="/icons/back.svg" alt="Next" class="h-5 w-5 rotate-180" />
          </button>
        </div>

        <div class="text-sm text-stone-500">
          Showing {{ (currentPage - 1) * Number(itemsPerPage.value) + 1 }}-{{
            Math.min(currentPage * Number(itemsPerPage.value), totalItems)
          }}
          of {{ totalItems }} results
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ProductsService } from '~/services/ProductsService'
import { CategoriesService } from '~/services/CategoriesService'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { refDebounced } from '@vueuse/core'
import { getVisiblePages } from '~/utils'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortOption = ref({ label: 'Name (A-Z)', value: 'name-asc' })
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = ref({ label: '5 items', value: '5' })
const totalItems = ref(0)
const selectedTags = ref([])
const availableTags = ref([])

onMounted(async () => {
  await loadCategories()
  await loadTags()
  await loadProducts()
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value
})

const loadProducts = async () => {
  try {
    loading.value = true

    const sortValue =
      typeof sortOption.value === 'object' && sortOption.value !== null
        ? sortOption.value.value
        : sortOption.value

    const [sort, order] = sortValue.split('-')
    const tags = selectedTags.value.length ? [...selectedTags.value] : []

    const filters = {
      search: searchQuery.value,
      category: selectedCategory.value,
      sort,
      order,
      page: currentPage.value,
      limit: itemsPerPage.value.value,
      tags,
    }

    const response = await ProductsService.getProductsByCategory(filters)
    products.value = response.items || []
    currentPage.value = response.page || 1
    totalPages.value = response.pages || 1
    totalItems.value = response.total || 0
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

const loadTags = async () => {
  try {
    const data = await ProductsService.getAvailableTags()
    availableTags.value = data || []
  } catch (error) {
    console.error('Error loading tags:', error)
    categories.value = []
  }
}

const applyFilters = async () => {
  currentPage.value = 1
  await loadProducts()
}

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
  sortOption.value = { label: 'Name (A-Z)', value: 'name-asc' }
  applyFilters()
}

const getCategoryName = (categorySlug) => {
  const category = categories.value.find((cat) => cat.slug === categorySlug)
  return category ? category.name : 'Unknown'
}

const categoryLabel = (slug) => {
  if (!slug) return 'All Categories'
  const match = categories.value.find((category) => category.slug === slug)
  return match?.name || slug
}

watch(
  sortOption,
  () => {
    applyFilters()
  },
  { deep: true },
)

watch(selectedCategory, () => {
  applyFilters()
})

watch(currentPage, () => {
  loadProducts()
})

const debouncedSearchQuery = refDebounced(searchQuery, 500)

watch(debouncedSearchQuery, () => {
  applyFilters()
})

watch(itemsPerPage, () => {
  currentPage.value = 1
  loadProducts()
})

watch(selectedTags, () => {
  applyFilters()
})
</script>
