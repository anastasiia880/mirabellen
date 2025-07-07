export const getVisiblePages = (totalPages, currentPage) => {
  const range = 2

  if (totalPages <= 5) {
    const allPages = []
    for (let i = 1; i <= totalPages; i++) {
      allPages.push(i)
    }
    return allPages
  }

  const pages = []

  const showLeftEllipsis = currentPage - range > 2
  const showRightEllipsis = currentPage + range < totalPages - 1

  pages.push(1)

  if (showLeftEllipsis) {
    pages.push('...')
  }

  const startPage = Math.max(2, currentPage - range)
  const endPage = Math.min(totalPages - 1, currentPage + range)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (showRightEllipsis) {
    pages.push('...')
  }

  pages.push(totalPages)

  return pages
}
