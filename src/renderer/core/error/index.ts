// src/renderer/core/error/index.ts

import type { App } from 'vue'
import logger from '@/core/logger'
import type { ApiResponseError } from '@/core/request'

/**
 * Checks if the error is a standardized API response error.
 * @param error The error to check.
 * @returns True if the error is an ApiResponseError, false otherwise.
 */
function isApiResponseError(error: any): error is ApiResponseError {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error
}

/**
 * Shows a toast notification to the user.
 * In a real application, this would be a UI component.
 * For now, we'll simulate it with a console warning.
 * @param message The message to display in the toast.
 */
function showToast(message: string) {
  logger.warn(`[Toast Notification] ${message}`)
  // In a real app, you would use a library like `vue-toastification`
  // or a custom component to show a non-blocking notification.
  // For example:
  // import { useToast } from 'vue-toastification';
  // const toast = useToast();
  // toast.error(message);
}

/**
 * Handles errors from anywhere in the application.
 * It logs the error, classifies it, and shows a user-friendly notification if needed.
 * @param error The error to handle. Can be of any type.
 */
export function handleError(error: any) {
  if (isApiResponseError(error)) {
    // This is a standardized error from our request client
    logger.error(`[API Error] Code: ${error.code}, Message: ${error.message}`, error.reason)

    switch (error.code) {
      case 'NO_RESPONSE':
      case 'REQUEST_SETUP_ERROR':
        showToast('Network error, please check your connection and try again.')
        break
      case 401:
        showToast('Authentication failed. Please log in again.')
        // Here you might redirect to the login page.
        break
      case 403:
        showToast('You do not have permission to perform this action.')
        break
      case 404:
        showToast('The requested resource was not found.')
        break
      case 500:
      case 502:
      case 503:
      case 504:
        showToast('The server is currently unavailable. Please try again later.')
        break
      default:
        // For other client or server errors, show a generic message.
        showToast(error.message || 'An unexpected error occurred.')
        break
    }
  }
  else if (error instanceof Error) {
    // This is a generic JavaScript error (e.g., TypeError, ReferenceError)
    logger.error('[Unhandled Error]', error)
    showToast('An unexpected application error occurred.')
  }
  else {
    // For other types of thrown values (e.g., strings, numbers)
    logger.error('[Unknown Error]', error)
    showToast('An unknown error occurred.')
  }
}

/**
 * Initializes the global error handlers for the Vue application.
 * This function should be called once when the application is mounted.
 * @param app The Vue application instance.
 */
export function initErrorHandler(app: App) {
  // Global handler for errors within Vue components
  app.config.errorHandler = (err, instance, info) => {
    logger.error(`[Vue Error] Info: ${info}`, {
      error: err,
      component: instance,
    })
    handleError(err)
  }

  // Global handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('[Unhandled Promise Rejection]', event.reason)
    handleError(event.reason)
  })

  logger.info('Error handler initialized.')
}
