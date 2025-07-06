export const CategoriesService = {
  async getCategories() {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }
      const response = await fetch(`${config.public.apiBaseUrl}/api/categories`)
      return response.json()
    } catch (error) {
      console.error('Error in getCategories:', error)
    }
  },
}
