<template>
  <div class="min-h-screen bg-[#fcf9f7] p-4 md:p-8">
    <div class="mx-auto mt-[100px] max-w-4xl">
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="text-lg text-stone-500">Loading cart...</div>
      </div>

      <div
        v-else-if="!cartItems || cartItems.length === 0"
        class="py-[100px] text-center"
      >
        <div class="mb-8 text-xl text-stone-500">Your cart is empty</div>
        <nuxt-link
          to="/products"
          class="inline-block bg-black px-6 py-3 text-white transition-colors hover:bg-stone-800"
        >
          Continue Shopping
        </nuxt-link>
      </div>

      <div v-else class="space-y-6">
        <div class="space-y-4">
          <div
            v-for="item in cartItems"
            :key="`${item.product._id}-${item.modification || 'default'}`"
            class="flex gap-4 bg-white p-6 shadow-sm"
          >
            <div
              class="mb-4 flex-shrink-0 cursor-pointer md:mb-0 md:mr-6"
              role="none"
              @click.prevent="goToProduct(item.product._id)"
            >
              <img
                :src="item.product.images?.[0] || '/images/no-image.jpg'"
                :alt="item.product.name"
                class="h-32 w-32 object-cover"
              />
            </div>

            <div class="flex flex-1 flex-col justify-between">
              <div>
                <h3 class="text-lg font-semibold text-stone-700">
                  {{ item.product.name }}
                </h3>
                <p v-if="item.modification" class="text-sm text-stone-500">
                  {{ item.modification }}
                </p>
                <p class="text-lg font-bold text-stone-700">
                  {{ item.price }}€ each
                </p>
              </div>

              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <label
                    class="hidden text-sm font-medium text-stone-600 md:flex"
                    >Quantity:</label
                  >
                  <div class="flex items-center gap-2">
                    <button
                      @click="
                        updateQuantity(
                          item.product._id,
                          item.quantity - 1,
                          item.modification,
                        )
                      "
                      :disabled="
                        item.quantity <= 1 ||
                        updatingItems.has(getItemKey(item))
                      "
                      class="flex h-8 w-8 items-center justify-center border border-stone-300 text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span class="w-12 text-center">{{ item.quantity }}</span>
                    <button
                      @click="
                        updateQuantity(
                          item.product._id,
                          item.quantity + 1,
                          item.modification,
                        )
                      "
                      :disabled="updatingItems.has(getItemKey(item))"
                      class="flex h-8 w-8 items-center justify-center border border-stone-300 text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  @click="removeItem(item.product._id, item.modification)"
                  :disabled="updatingItems.has(getItemKey(item))"
                >
                  <img src="/icons/trash.svg" alt="Remove" class="h-4 w-4" />
                </button>
              </div>

              <div class="mt-2 text-right">
                <span class="font-semibold text-stone-700">
                  Subtotal: {{ (item.price * item.quantity).toFixed(2) }}€
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 shadow-sm">
          <div class="flex flex-col space-y-4">
            <div class="flex justify-between text-lg">
              <span class="font-medium text-stone-600">Total Items:</span>
              <span class="font-semibold text-stone-700">{{ itemCount }}</span>
            </div>
            <div class="flex justify-between text-xl">
              <span class="font-semibold text-stone-700">Total Price:</span>
              <span class="font-bold text-stone-700"
                >{{ getTotalPrice().toFixed(2) }}€</span
              >
            </div>

            <div class="flex flex-col gap-4 pt-4 md:flex-row">
              <button
                @click="clearCartItems"
                :disabled="isLoading || isProcessingPayment"
                class="flex-1 border border-stone-300 py-3 text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-50"
              >
                Clear Cart
              </button>
              <button
                @click="handlePayment"
                :disabled="
                  isLoading ||
                  isProcessingPayment ||
                  !cartItems ||
                  cartItems.length === 0
                "
                class="flex-1 bg-black py-3 text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
              >
                {{ isProcessingPayment ? 'Processing...' : 'Pay' }}
              </button>
            </div>
          </div>
        </div>

        <div class="text-center">
          <nuxt-link
            to="/products"
            class="inline-block text-stone-600 underline hover:text-stone-800"
          >
            Continue Shopping
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PaymentService } from '~/services/PaymentService.js'

const {
  cartItems,
  itemCount,
  isLoading,
  loadCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getTotalPrice,
} = useCart()

definePageMeta({
  middleware: 'auth',
})

const updatingItems = ref(new Set())
const isError = ref(false)
const isProcessingPayment = ref(false)

onMounted(async () => {
  await loadCart()
})

const getItemKey = (item) => {
  return `${item.product._id}-${item.modification || 'default'}`
}

const updateQuantity = async (productId, newQuantity, modification = null) => {
  if (newQuantity < 1) return

  const itemKey = `${productId}-${modification || 'default'}`
  updatingItems.value.add(itemKey)

  try {
    await updateCartItem(productId, newQuantity, modification)
    isError.value = false
  } catch (error) {
    console.error('Failed to update cart:', error)
    isError.value = true
  } finally {
    updatingItems.value.delete(itemKey)
  }
}

const removeItem = async (productId, modification = null) => {
  const itemKey = `${productId}-${modification || 'default'}`
  updatingItems.value.add(itemKey)

  try {
    await removeFromCart(productId, modification)
    isError.value = false
  } catch (error) {
    console.error('Failed to remove item:', error)
    isError.value = true
  } finally {
    updatingItems.value.delete(itemKey)
  }
}

const clearCartItems = async () => {
  try {
    await clearCart()
    isError.value = false
  } catch (error) {
    console.error('Failed to clear cart:', error)
    isError.value = true
  }
}

const goToProduct = (productId) => {
  navigateTo(`/products/${productId}`)
}

const handlePayment = async () => {
  if (!cartItems.value || cartItems.value.length === 0) {
    return
  }

  isProcessingPayment.value = true

  try {
    const cart_items = cartItems.value.map((item) => ({
      name: item.modification
        ? `${item.product.name} (${item.modification})`
        : item.product.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const response = await PaymentService.createCheckoutSession(cart_items)

    if (response.url) {
      window.location.href = response.url
    } else {
      throw new Error('No checkout URL received')
    }
  } catch (error) {
    console.error('Payment processing failed:', error)
    isError.value = true
  } finally {
    isProcessingPayment.value = false
  }
}
</script>
