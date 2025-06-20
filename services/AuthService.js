export const AuthService = {
  async login(credentials) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }
      
      const response = await fetch(`${config.public.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      return response.json()
    } catch (error) {
      console.error('Error in login:', error)
      throw error
    }
  },

  async register(userData) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }
      
      const response = await fetch(`${config.public.apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      return response.json()
    } catch (error) {
      console.error('Error in registration:', error)
      throw error
    }
  },
} 