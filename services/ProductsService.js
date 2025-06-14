export const ProductsService = {
  async getProducts() {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }
      const response = await fetch(`${config.public.apiBaseUrl}/api/products`)
      return response.json()
    } catch (error) {
      console.error('Error in getUsers:', error)
    }
  },
}
