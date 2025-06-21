import { AuthService } from '~/services/AuthService.js'

const user = ref(null)
const isAuthenticated = ref(false)
const isLoading = ref(false)

export const useAuth = () => {
  const checkAuth = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
      const userData = await AuthService.getUser()
      user.value = userData
      isAuthenticated.value = true
    } catch (error) {
      user.value = null
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials)
      // await checkAuth()
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData)
      await checkAuth()
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
      user.value = null
      isAuthenticated.value = false
    } catch (error) {
      user.value = null
      isAuthenticated.value = false
      throw error
    }
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    checkAuth,
    login,
    register,
    logout,
  }
}
