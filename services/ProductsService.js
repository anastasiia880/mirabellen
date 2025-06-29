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
