// src/renderer/core/request/index.ts

import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import logger from '@/core/logger'

/**
 * Represents a standardized error structure for API responses.
 */
export interface ApiResponseError {
  code: number | string
  message: string
  reason?: any
}

// Create a new axios instance
const service: AxiosInstance = axios.create({
  // The base URL will be injected by Vite's `define` feature in vite.config.ts
  // For now, we'll use a placeholder.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000, // 10s timeout
})

// Request interceptor
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logger.info(`[Request] ${config.method?.toUpperCase()} ${config.url}`)
    // Here you can add authorization tokens to headers, for example.
    // config.headers.Authorization = `Bearer ${getToken()}`;
    return config
  },
  (error: AxiosError) => {
    logger.error('[Request Error]', error)
    return Promise.reject(error)
  },
)

// Response interceptor
service.interceptors.response.use(
  (response) => {
    logger.info(`[Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    // If the response data has its own success/error code, you can handle it here.
    // For this project, we'll assume a 2xx status code is a success.
    return response.data
  },
  (error: AxiosError) => {
    let apiError: ApiResponseError

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger.error(`[Response Error] Status: ${error.response.status}`, error.response.data)
      apiError = {
        code: error.response.status,
        message: (error.response.data as any)?.message || error.message,
        reason: error.response.data,
      }
    }
    else if (error.request) {
      // The request was made but no response was received
      logger.error('[Response Error] No response received:', error.request)
      apiError = {
        code: 'NO_RESPONSE',
        message: 'The server did not respond in time.',
        reason: error.request,
      }
    }
    else {
      // Something happened in setting up the request that triggered an Error
      logger.error('[Response Error] Request setup failed:', error.message)
      apiError = {
        code: 'REQUEST_SETUP_ERROR',
        message: 'An error occurred while setting up the request.',
        reason: error.message,
      }
    }

    // Instead of rejecting, we could also pass the standardized error
    // to a global error handler. We'll implement that next.
    return Promise.reject(apiError)
  },
)

export default service
