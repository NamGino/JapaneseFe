const buildMode = import.meta.env.VITE_BUILD_MODE || import.meta.env.MODE
const configuredApiRoot = import.meta.env.VITE_API_ROOT

// Dev mặc định trỏ về backend local.
// Production ưu tiên biến môi trường, nếu không có thì dùng cùng domain với frontend.
const apiRoot =
  buildMode === 'development' || buildMode === 'dev'
    ? (configuredApiRoot || 'http://localhost:8017/api')
    : (configuredApiRoot || '/api')

export const API_ROOT = apiRoot.replace(/\/$/, '')
