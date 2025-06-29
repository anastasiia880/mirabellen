<template>
  <div class="mx-auto my-24 max-w-[600px]">
    <h2 class="mb-8 text-center font-serif text-3xl text-stone-700">
      Create Product
    </h2>

    <div
      v-if="successMessage"
      class="mb-6 rounded-lg bg-green-100 p-4 text-green-700"
    >
      {{ successMessage }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="mb-2 block text-sm font-medium text-stone-600">
          Product Name *
        </label>
        <input
          id="name"
          v-model="form.name"
          :class="[
            'w-full rounded-lg border px-4 py-3 placeholder-stone-400 outline-none transition-all focus:border-transparent focus:ring-2',
            errors.name
              ? 'border-red-300 focus:ring-red-400'
              : 'border-stone-300 focus:ring-stone-400',
          ]"
          placeholder="Enter product name"
        />
        <div v-if="errors.name" class="mt-1 text-sm text-red-600">
          {{ errors.name }}
        </div>
      </div>
      <div>
        <label
          for="description"
          class="mb-2 block text-sm font-medium text-stone-600"
        >
          Description *
        </label>
        <textarea
          id="description"
          v-model="form.description"
          :class="[
            'resize-vertical min-h-[100px] w-full rounded-lg border px-4 py-3 placeholder-stone-400 outline-none transition-all focus:border-transparent focus:ring-2',
            errors.description
              ? 'border-red-300 focus:ring-red-400'
              : 'border-stone-300 focus:ring-stone-400',
          ]"
          placeholder="Enter product description"
        />
        <div v-if="errors.description" class="mt-1 text-sm text-red-600">
          {{ errors.description }}
        </div>
      </div>
      <div>
        <label
          for="price"
          class="mb-2 block text-sm font-medium text-stone-600"
        >
          Price (€) *
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          v-model.number="form.price"
          :class="[
            'w-full rounded-lg border px-4 py-3 placeholder-stone-400 outline-none transition-all focus:border-transparent focus:ring-2',
            errors.price
              ? 'border-red-300 focus:ring-red-400'
              : 'border-stone-300 focus:ring-stone-400',
          ]"
          placeholder="0.00"
        />
        <div v-if="errors.price" class="mt-1 text-sm text-red-600">
          {{ errors.price }}
        </div>
      </div>
      <div>
        <label
          for="category"
          class="mb-2 block text-sm font-medium text-stone-600"
        >
          Category *
        </label>
        <select
          id="category"
          placeholder="Select category"
          v-model="form.category"
          :class="[
            'w-full rounded-lg border px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2',
            errors.category
              ? 'border-red-300 focus:ring-red-400'
              : 'border-stone-300 focus:ring-stone-400',
          ]"
        >
          <option
            v-for="category in categories"
            :key="category.value"
            :value="category.value"
          >
            {{ category.label }}
          </option>
        </select>
        <div v-if="errors.category" class="mt-1 text-sm text-red-600">
          {{ errors.category }}
        </div>
      </div>

      <div>
        <label
          for="image"
          class="mb-2 block text-sm font-medium text-stone-600"
        >
          Product Image *
        </label>
        <input
          id="image"
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          :class="[
            'w-full rounded-lg border px-4 py-3 outline-none transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-700 hover:file:bg-stone-200 focus:border-transparent focus:ring-2',
            errors.image
              ? 'border-red-300 focus:ring-red-400'
              : 'border-stone-300 focus:ring-stone-400',
          ]"
        />
        <div v-if="imagePreview" class="mt-3">
          <img
            :src="imagePreview"
            alt="Image preview"
            class="h-32 w-32 rounded-lg border border-stone-200 object-cover"
          />
        </div>
        <div v-if="errors.image" class="mt-1 text-sm text-red-600">
          {{ errors.image }}
        </div>
      </div>

      <div>
        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            v-model="form.in_stock"
            class="h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-400"
          />
          <span class="text-sm font-medium text-stone-600">In Stock *</span>
        </label>
      </div>

      <div>
        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            v-model="form.popular"
            class="h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-400"
          />
          <span class="text-sm font-medium text-stone-600"
            >Popular Product</span
          >
        </label>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-lg bg-stone-700 px-4 py-3 font-medium text-white transition-all hover:bg-stone-800 focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isLoading ? 'Creating Product...' : 'Create Product' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ProductsService } from '~/services/ProductsService'

const categories = [
  { value: 'Face', label: 'Face' },
  { value: 'Body', label: 'Body' },
  { value: 'Hair', label: 'Haircare' },
  { value: 'Eyes', label: 'Eyes' },
  { value: 'Lips', label: 'Lips' },
]

const form = ref({
  name: '',
  description: '',
  price: 0,
  in_stock: true,
  category: categories[0].value,
  popular: false,
  image: null,
})

const errors = ref({
  name: null,
  description: null,
  price: null,
  category: null,
  image: null,
})

const isLoading = ref(false)
const successMessage = ref('')
const imagePreview = ref('')
const fileInput = ref(null)

const validateForm = () => {
  const newErrors = {
    name: null,
    description: null,
    price: null,
    category: null,
    image: null,
  }

  if (!form.value.name.trim()) {
    newErrors.name = 'Product name is required'
  }

  if (!form.value.description.trim()) {
    newErrors.description = 'Description is required'
  }

  if (!form.value.price || form.value.price <= 0) {
    newErrors.price = 'Price must be greater than 0'
  }

  if (!form.value.category) {
    newErrors.category = 'Category is required'
  }

  if (!form.value.image) {
    newErrors.image = 'Product image is required'
  }

  errors.value = newErrors
  return !Object.values(newErrors).some((error) => error !== null)
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.image = file

    imagePreview.value = URL.createObjectURL(file)

    clearError('image')
  }
}

const handleSubmit = async () => {
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const response = await ProductsService.addProduct(form.value)

    if (response) {
      successMessage.value = 'Product created successfully!'

      form.value = {
        name: '',
        description: '',
        price: 0,
        in_stock: true,
        category: categories[0].value,
        popular: false,
        image: null,
      }

      if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value)
      }
      imagePreview.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }

      errors.value = {
        name: null,
        description: null,
        price: null,
        category: null,
        image: null,
      }
    }
  } catch (error) {
    console.error('Error creating product:', error)
    if (error.message && error.message.includes('validation failed')) {
      errors.value.image = 'Failed to upload image. Please try again.'
    } else {
      successMessage.value = ''
      errors.value.image = 'Failed to create product. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = null
  }
}

watch(
  () => form.value.name,
  () => clearError('name'),
)
watch(
  () => form.value.description,
  () => clearError('description'),
)
watch(
  () => form.value.price,
  () => clearError('price'),
)
watch(
  () => form.value.category,
  () => clearError('category'),
)
watch(
  () => form.value.image,
  () => clearError('image'),
)

onUnmounted(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>
