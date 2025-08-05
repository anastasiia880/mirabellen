<template>
  <div class="min-h-screen bg-[#fcf9f7] p-4 md:p-8">
    <div class="mx-auto mt-[200px] max-w-4xl">
      <div class="bg-white p-8 text-center shadow-sm">
        <div class="mb-6">
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
          >
            <svg
              class="h-8 w-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 class="mb-2 text-2xl font-semibold text-stone-700">
            Payment Successful!
          </h1>
          <p class="text-stone-600">
            Thank you for your purchase. Your order has #678425 been confirmed.
          </p>
        </div>

        <div class="flex flex-col gap-4 md:flex-row md:justify-center">
          <nuxt-link
            to="/products"
            class="inline-block bg-black px-6 py-3 text-white transition-colors hover:bg-stone-800"
          >
            Continue Shopping
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
onMounted(async () => {
  const { checkAuth } = useAuth()
  await checkAuth()

  const { clearCart } = useCart()
  try {
    await clearCart()
  } catch (error) {
    console.error('Failed to clear cart after successful payment:', error)
  }
})
</script>
