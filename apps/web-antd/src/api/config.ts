// 导出一个 host 的变量，取自 .env.development 中的 VITE_API_URL
export const host = import.meta.env.VITE_API_URL;

// 导出一个 api_prefix 的变量
export const apiPrefix = `${host}/api/v1`;
