// Shared by the browser form and the server route.
export const PHOTO_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export const MAX_BYTES = 15 * 1024 * 1024; // keep in sync with the bucket limit in 002_guest_photos.sql
export const MAX_FILES = 10;
export const BUCKET = 'guest-photos';
