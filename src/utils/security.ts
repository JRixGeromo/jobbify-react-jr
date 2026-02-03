/**
 * Security utilities for input validation and sanitization
 * Provides protection against XSS, file upload vulnerabilities, and rate limiting
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Only allows safe HTML tags and attributes
 * @param html Raw HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};

/**
 * Validates file type against allowed MIME types
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validates file size against maximum allowed size
 * @param file File to validate
 * @param maxSizeMB Maximum size in megabytes
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

/**
 * Encodes HTML special characters to prevent XSS
 * @param str String to encode
 */
export const encodeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates URLs to ensure they use http/https protocols
 * @param url URL to validate
 */
export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute window
const MAX_REQUESTS = 10; // Maximum requests per window
const rateLimits: { [key: string]: number[] } = {};

/**
 * Implements rate limiting for form submissions and API calls
 * Uses sliding window algorithm to track request frequency
 * @param actionKey Unique identifier for the rate-limited action
 * @returns boolean indicating if request should be allowed
 */
export const checkRateLimit = (actionKey: string): boolean => {
  const now = Date.now();
  const timestamps = rateLimits[actionKey] || [];

  // Remove timestamps outside current window
  const recentTimestamps = timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW
  );
  rateLimits[actionKey] = recentTimestamps;

  if (recentTimestamps.length >= MAX_REQUESTS) {
    return false;
  }

  rateLimits[actionKey] = [...recentTimestamps, now];
  return true;
};

/**
 * Generates a random nonce for Content Security Policy
 * Used to allow specific inline scripts/styles
 */
export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2);
};
