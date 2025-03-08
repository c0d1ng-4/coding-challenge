import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - String input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;

  // Replace HTML special chars with their entity equivalents
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Get a descriptive error message based on error code
 * @param code Error code from API
 * @param defaultMessage Default message to show if code not found
 * @returns User-friendly error message
 */
export function getErrorMessage(code: string | number | undefined, defaultMessage: string = "An error occurred"): string {
  if (!code) return defaultMessage;

  const errorMessages: Record<string, string> = {
    '400': 'The request data is invalid. Please check your information.',
    '401': 'Please log in to continue.',
    '403': 'You do not have permission to perform this action.',
    '404': 'The requested resource was not found.',
    '422': 'Validation error. Please check your input data.',
    '500': 'Server error. Please try again later.',
    'FACILITY_NOT_FOUND': 'No matching facility was found for your criteria.',
    'INVALID_ZIP_CODE': 'The provided zip code is invalid.',
    'NETWORK_ERROR': 'Network error. Please check your connection and try again.',
  };

  return errorMessages[code.toString()] || defaultMessage;
}
