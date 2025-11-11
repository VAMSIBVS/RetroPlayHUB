// Utility function to get the correct base path for assets
export const getAssetPath = (path) => {
  const base = import.meta.env.BASE_URL || '/'
  const cleanPath = path.replace(/^\//, '')
  const fullPath = base + cleanPath
  console.log('getAssetPath:', path, '→', fullPath) // Debug log
  return fullPath
}

// Get the base URL for the application
export const getBaseUrl = () => {
  return import.meta.env.BASE_URL || '/'
}