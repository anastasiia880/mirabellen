export const AuthService = {
  async login(credentials) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(credentials),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()

        if (errorData.errors) {
          const error = new Error('Validation failed')
          error.validationErrors = errorData.errors
          throw error
        }
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },

  async register(userData) {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(userData),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()

        if (errorData.errors) {
          const error = new Error('Validation failed')
          error.validationErrors = errorData.errors
          throw error
        }
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },

  async logout() {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/api/auth/logout`,
        {
          method: 'GET',
          credentials: 'include',
        },
      )

      if (!response.ok) {
        throw new Error('Failed to logout')
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },

  async getUser() {
    try {
      const config = useRuntimeConfig()
      if (!config.public.apiBaseUrl) {
        throw new Error('API base URL is not defined in runtime config')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/api/auth/user`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )

      if (!response.ok) {
        throw new Error('Failed to get user')
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },
}
