export const CartService = {
  async getCart() {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(`${config.public.apiBaseUrl}/api/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors?.message || 'Failed to get cart')
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },

  async addToCart(productId, modification) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }
      const payload = {
        productId,
      }

      if (modification && modification !== null && modification !== undefined) {
        payload.modification = modification
      }

      const response = await fetch(`${config.public.apiBaseUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.errors?.message || 'Failed to add item to cart',
        )
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },

  async updateCartItem(productId, quantity, modification) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/api/cart/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productId,
            quantity,
            modification,
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.errors?.message || 'Failed to update cart item',
        )
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },

  async removeFromCart(productId, modification) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/api/cart/remove`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productId,
            modification,
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.errors?.message || 'Failed to remove item from cart',
        )
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },

  async clearCart() {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/api/cart/clear`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors?.message || 'Failed to clear cart')
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },

  async getCartItemCount() {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/api/cart/count`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors?.message || 'Failed to get cart count')
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },
}
