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
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div class="lg:col-span-5">
            <label class="mb-2 block text-sm font-medium text-stone-600"
              >Search Products</label
            >
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products by name..."
                class="max-h-[47px] w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
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
            <div class="mt-4 flex items-center">
              <label
                class="flex items-center gap-2 text-sm font-medium text-stone-600"
              >
                <input
                  v-model="inStockOnly"
                  type="checkbox"
                  class="h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                />
                In stock only
              </label>
            </div>
          </div>

          <div class="lg:col-span-7">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label class="mb-2 block text-sm font-medium text-stone-600"
                  >Sort by</label
                >
                <Multiselect
                  v-model="sortOption"
                  :options="[
                    { label: 'Name (A-Z)', value: 'name-asc' },
                    { label: 'Name (Z-A)', value: 'name-desc' },
                    { label: 'Price (Low to High)', value: 'price-asc' },
                    { label: 'Price (High to Low)', value: 'price-desc' },
                  ]"
                  label="label"
                  track-by="value"
                  :placeholder="sortPlaceholder"
                  class="min-w-full"
                  :show-labels="false"
                  :allow-empty="false"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-stone-600"
                  >Category</label
                >
                <Multiselect
                  v-model="selectedCategory"
                  :options="[...categories.map((cat) => cat.slug)]"
                  :custom-label="categoryLabel"
                  :placeholder="categoryPlaceholder"
                  class="min-w-full"
                  :show-labels="false"
                  :allow-empty="false"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-stone-600"
                  >Tags</label
                >
                <Multiselect
                  v-model="selectedTags"
                  :options="availableTags"
                  :placeholder="tagsPlaceholder"
                  multiple
                  class="min-w-full"
                  :show-labels="false"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  :preselect-first="false"
                  :max-height="200"
                  :allow-empty="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="hasActiveFilters"
          class="mt-6 flex flex-wrap items-center gap-3"
        >
          <span class="text-sm font-medium text-stone-600"
            >Active filters:</span
          >
          <span
            v-if="searchQuery"
            class="inline-flex items-center gap-2 rounded-full bg-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700"
          >
            <span>Search: "{{ searchQuery }}"</span>
            <button
              @click="clearSearch"
              class="ml-1 rounded-full p-0.5 transition-colors hover:bg-stone-300 hover:text-stone-900"
              title="Remove search filter"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </span>
          <span
            v-if="selectedCategory"
            class="inline-flex items-center gap-2 rounded-full bg-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700"
          >
            <span>Category: {{ getCategoryName(selectedCategory) }}</span>
            <button
              @click="clearCategory"
              class="ml-1 rounded-full p-0.5 transition-colors hover:bg-stone-300 hover:text-stone-900"
              title="Remove category filter"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </span>
          <span
            v-if="selectedTags.length > 0"
            class="inline-flex items-center gap-2 rounded-full bg-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700"
          >
            <span>Tags: {{ selectedTags.join(', ') }}</span>
            <button
              @click="selectedTags = []"
              class="ml-1 rounded-full p-0.5 transition-colors hover:bg-stone-300 hover:text-stone-900"
              title="Remove tags filter"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </span>
          <span
            v-if="inStockOnly"
            class="inline-flex items-center gap-2 rounded-full bg-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700"
          >
            <span>In Stock: Yes</span>
            <button
              @click="inStockOnly = false"
              class="ml-1 rounded-full p-0.5 transition-colors hover:bg-stone-300 hover:text-stone-900"
              title="Remove in stock filter"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </span>
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="text-xs text-stone-500 underline transition-colors hover:text-stone-700"
          >
            Clear all filters
          </button>
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
            :placeholder="itemsPerPagePlaceholder"
            class="min-w-[235px]"
            :show-labels="false"
            :allow-empty="false"
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
const inStockOnly = ref(false)

onMounted(async () => {
  await loadCategories()
  await loadTags()
  await loadProducts()
})

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    selectedCategory.value ||
    selectedTags.value.length > 0 ||
    inStockOnly.value
  )
})

const tagsPlaceholder = computed(() => {
  return selectedTags.value.length ? '' : 'All Tags'
})

const categoryPlaceholder = computed(() => {
  return selectedCategory.value ? '' : 'All Categories'
})

const sortPlaceholder = computed(() => {
  return sortOption.value ? '' : 'Select sort'
})

const itemsPerPagePlaceholder = computed(() => {
  return itemsPerPage.value ? '' : 'Select items per page'
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
      in_stock: inStockOnly.value,
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
  selectedTags.value = []
  sortOption.value = { label: 'Name (A-Z)', value: 'name-asc' }
  inStockOnly.value = false
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

const debouncedSearchQuery = refDebounced(searchQuery, 500)

watch(
  [
    sortOption,
    selectedCategory,
    debouncedSearchQuery,
    selectedTags,
    inStockOnly,
  ],
  () => {
    applyFilters()
  },
  { deep: true },
)

watch(currentPage, () => {
  loadProducts()
})

watch(itemsPerPage, () => {
  currentPage.value = 1
  loadProducts()
})
</script>

<style scoped>
:deep(.multiselect) {
  min-height: 44px;
  border-radius: 0.5rem;
  border: 1px solid #e7e5e4;
  background-color: white;
  transition: all 0.2s ease;
}

:deep(.multiselect:hover) {
  border-color: #a8a29e;
}

:deep(.multiselect.is-active) {
  border-color: #78716c;
  box-shadow: 0 0 0 2px rgba(120, 113, 108, 0.1);
}

:deep(.multiselect__tags) {
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  min-height: 44px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

:deep(.multiselect__placeholder) {
  color: #a8a29e;
  font-size: 0.8rem;
  margin-bottom: 0;
  padding-top: 0;
}

:deep(.multiselect__single) {
  color: #44403c;
  font-size: 0.8rem;
  margin-bottom: 0;
  padding-top: 0;
  background: transparent;
}

:deep(.multiselect__input) {
  color: #44403c;
  font-size: 0.8rem;
  background: transparent;
  margin: 0;
  padding: 0;
  min-width: 60px;
}

:deep(.multiselect__input::placeholder) {
  color: #a8a29e;
}

:deep(.multiselect__content-wrapper) {
  border: 1px solid #e7e5e4;
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-height: 200px;
  overflow-y: auto;
}

:deep(.multiselect__option) {
  padding: 0.75rem 1rem;
  color: #44403c;
  font-size: 0.8rem;
  transition: background-color 0.2s ease;
}

:deep(.multiselect__option--highlight) {
  background-color: #f5f5f4;
  color: #44403c;
}

:deep(.multiselect__option--selected) {
  background-color: #78716c;
  color: white;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  background-color: #57534e;
  color: white;
}

:deep(.multiselect__tag) {
  background-color: #e7e5e4;
  color: #44403c;
  border-radius: 0.5rem;
  padding: 0.5rem 0.9rem;
  margin-right: 0.2rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  word-break: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #d6d3d1;
}

:deep(.multiselect__tag-icon) {
  color: #78716c;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  transition: all 0.2s ease;
}

:deep(.multiselect__tag-icon:hover) {
  background-color: #d6d3d1;
  color: #44403c;
}

:deep(.multiselect__tag-icon:after) {
  color: inherit;
  font-size: 0.75rem;
  font-weight: bold;
}

:deep(.multiselect__select::before) {
  top: 75%;
}

:deep(.multiselect__spinner) {
  border-color: #78716c transparent transparent;
}

:deep(.multiselect__input:focus) {
  outline: none;
  box-shadow: none;
}

:deep(.multiselect__caret) {
  border-color: #78716c transparent transparent;
  border-width: 5px 5px 0;
  transition: transform 0.2s ease;
}

:deep(.multiselect.is-active .multiselect__caret) {
  transform: rotate(180deg);
}

@media (max-width: 640px) {
  :deep(.multiselect) {
    min-height: 48px;
  }

  :deep(.multiselect__tags) {
    padding: 0.8rem 1rem;
    min-height: 48px;
    gap: 0.6rem;
  }

  :deep(.multiselect__tag) {
    font-size: 0.8rem;
    margin-right: 0.4rem;
  }
}

:deep(.multiselect[data-multiple='true']) {
  min-height: auto;
}

:deep(.multiselect[data-multiple='true'] .multiselect__tags) {
  padding: 1rem 1.25rem;
  min-height: auto;
  align-items: flex-start;
  gap: 0.75rem;
}

:deep(.multiselect[data-multiple='true'] .multiselect__input) {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
</style>
