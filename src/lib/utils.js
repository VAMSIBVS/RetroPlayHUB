// Utility function to get the correct base path for assets
export const getAssetPath = (path) => {
  const base = import.meta.env.BASE_URL || '/'
  return base + path.replace(/^\//, '')
}

// Get the base URL for the application
export const getBaseUrl = () => {
  return import.meta.env.BASE_URL || '/'
}