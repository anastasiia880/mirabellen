export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAuth, isAuthenticated } = useAuth()
  await checkAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
