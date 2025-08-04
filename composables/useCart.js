import { CartService } from '~/services/CartService.js'

const cart = ref(null)
const cartItems = ref([])
const itemCount = ref(0)
const isLoading = ref(false)

export const useCart = () => {
  const loadCart = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
      const response = await CartService.getCart()
      cart.value = response.cart
      cartItems.value = response.cart?.items || []
      itemCount.value = cartItems.value.reduce(
        (total, item) => total + item.quantity,
        0,
      )
    } catch (error) {
      console.error('Error loading cart:', error)
      cart.value = null
      cartItems.value = []
      itemCount.value = 0
    } finally {
      isLoading.value = false
    }
  }

  const addToCart = async (productId, modification) => {
    try {
      isLoading.value = true
      const response = await CartService.addToCart(productId, modification)
      cart.value = response.cart
      cartItems.value = response.cart?.items || []
      itemCount.value = cartItems.value.reduce(
        (total, item) => total + item.quantity,
        0,
      )
      return response
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateCartItem = async (productId, quantity, modification) => {
    try {
      isLoading.value = true
      const response = await CartService.updateCartItem(
        productId,
        quantity,
        modification,
      )
      cart.value = response.cart
      cartItems.value = response.cart?.items || []
      itemCount.value = cartItems.value.reduce(
        (total, item) => total + item.quantity,
        0,
      )
      return response
    } catch (error) {
      console.error('Error updating cart item:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const removeFromCart = async (productId, modification) => {
    try {
      isLoading.value = true
      const response = await CartService.removeFromCart(productId, modification)
      cart.value = response.cart
      cartItems.value = response.cart?.items || []
      itemCount.value = cartItems.value.reduce(
        (total, item) => total + item.quantity,
        0,
      )
      return response
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearCart = async () => {
    try {
      isLoading.value = true
      await CartService.clearCart()
      cart.value = null
      cartItems.value = []
      itemCount.value = 0
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getTotalPrice = () => {
    if (!cartItems.value || cartItems.value.length === 0) return 0
    return cartItems.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  const getItemQuantity = (productId, modification = null) => {
    if (!cartItems.value) return 0
    const item = cartItems.value.find(
      (item) =>
        item.product._id === productId && item.modification === modification,
    )
    return item ? item.quantity : 0
  }

  return {
    cart: readonly(cart),
    cartItems: readonly(cartItems),
    itemCount: readonly(itemCount),
    isLoading: readonly(isLoading),
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getItemQuantity,
  }
}
