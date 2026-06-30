/**
 * Client-safe Cloudinary URL helpers (no Node / cloudinary SDK imports).
 */

export function buildVideoThumbnailUrl(cloudName: string, publicId: string): string {
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_10p,w_800,h_450,c_fill,q_auto,f_jpg/${publicId}.jpg`;
}

export function buildImageUrl(
  cloudName: string,
  publicId: string,
  transforms = "q_auto:good,f_auto"
): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
}
