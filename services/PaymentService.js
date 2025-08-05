export const PaymentService = {
  async createCheckoutSession(cart_items) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/api/payment/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ cart_items }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },
}
