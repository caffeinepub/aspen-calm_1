/**
 * Helper to resolve public asset URLs using the app base path
 * Ensures audio/image paths work reliably in built output and under non-root hosting
 */

export function getAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
