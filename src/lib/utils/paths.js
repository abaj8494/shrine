import { base } from '$app/paths';

/**
 * Prepends the base path to a URL
 * @param {string} path - The path to prepend the base path to
 * @returns {string} The path with the base path prepended
 */
export function resolveBasePath(path) {
  // If the path already starts with the base path, return it as-is
  if (base && path.startsWith(base)) {
    return path;
  }
  
  // Otherwise, join the base path and the provided path
  return `${base}${path}`;
} 