import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetPath(path: string) {
  const basePath = process.env.NODE_ENV === 'production' ? '/CardToo' : '';
  // Pastikan path tidak ganda jika sudah diawali basePath
  if (path.startsWith(basePath) && basePath !== '') return path;
  // Hapus slash di awal path jika ada untuk digabung dengan basePath
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}/${cleanPath}`;
}