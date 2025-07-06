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
      console.error('Error in getProducts:', error)
    }
  },

  async getProductsByCategory(filters = {}) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const queryParams = new URLSearchParams()

      if (filters.search) {
        queryParams.append('search', filters.search)
      }
      if (filters.category) {
        queryParams.append('category', filters.category)
      }
      if (filters.sort) {
        queryParams.append('sort', filters.sort)
      }
      if (filters.order) {
        queryParams.append('order', filters.order)
      }
      if (filters.page) {
        queryParams.append('page', filters.page)
      }
      if (filters.limit) {
        queryParams.append('limit', filters.limit)
      }

      const url = `${config.public.apiBaseUrl}/api/products/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await fetch(url)
      return response.json()
    } catch (error) {
      console.error('Error in getProductsByCategory:', error)
      return { items: [], total: 0, pages: 0, page: 1 }
    }
  },

  async getProductById(id) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }
      const response = await fetch(
        `${config.public.apiBaseUrl}/api/products/${id}`,
      )
      return response.json()
    } catch (error) {
      console.error('Error in getProductById:', error)
    }
  },

  async addProduct(productData) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }
      const formData = new FormData()

      Object.keys(productData).forEach((key) => {
        if (key === 'image' && productData[key] instanceof File) {
          formData.append('image', productData[key])
        } else {
          formData.append(key, productData[key])
        }
      })

      const response = await fetch(`${config.public.apiBaseUrl}/api/products`, {
        method: 'POST',
        body: formData,
      })
      return response.json()
    } catch (error) {
      console.error('Error in addProduct:', error)
    }
  },
}
