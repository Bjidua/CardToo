import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan banyak nama kelas CSS (Tailwind) dengan aman,
 * mengatasi konflik kelas CSS menggunakan `twMerge` dan `clsx`.
 * 
 * @param inputs Kumpulan nilai kelas CSS yang dinamis (string, object, array, dll)
 * @returns String gabungan kelas CSS yang bersih
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Menghasilkan path aset statis yang benar tergantung lingkungan deployment.
 * Jika dalam lingkungan produksi Github Pages (`/CardToo`), ia akan menyisipkan prefix tersebut.
 * 
 * @param path Path file aset (misal: "/assets/logo.svg")
 * @returns Path aset yang disesuaikan dengan base path lingkungan deployment
 */
export function getAssetPath(path: string) {
  const basePath = process.env.NODE_ENV === 'production' ? '/CardToo' : '';
  // Pastikan path tidak ganda jika sudah diawali basePath
  if (path.startsWith(basePath) && basePath !== '') return path;
  // Hapus slash di awal path jika ada untuk digabung dengan basePath
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}/${cleanPath}`;
}