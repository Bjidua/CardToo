"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { useRouter } from "next/navigation";
import {
  normalizeProductCategory,
  normalizeProductCondition,
  productService,
} from "@/lib/services/product";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

/**
 * Halaman Tambah Produk Baru Toko (AddProductPage)
 * Dibungkus dengan ProtectedRoute (requireSeller=true) agar hanya bisa diakses penjual.
 */
export default function AddProductPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <AddProductContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Form Tambah Produk (AddProductContent)
 * Menyediakan form pengisian data listing kartu baru:
 * - Unggah gambar cover kartu (JPG, PNG).
 * - Input teks nama kartu dan kategori/expansion.
 * - Tombol pilihan kondisi kartu (Mint, Near Mint, dll).
 * - Input angka nominal harga dan sisa stok.
 * - Input text-area penjelasan deskripsi kartu.
 */
function AddProductContent() {
  const router = useRouter();

  // Membaca info toko & id user aktif
  const { store, user } = useAuth();

  // State pilihan kondisi kartu (Default: Mint)
  const [condition, setCondition] = useState("Mint");

  // State loading status proses submit upload produk
  const [isUploading, setIsUploading] = useState(false);

  // State pesan kesalahan validasi/API
  const [error, setError] = useState("");

  // State file gambar cover yang dipilih dari file explorer
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Ref DOM input file type hidden
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // State isian formulir teks
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "1",
    description: "",
  });

  // Kategori kondisi kartu TCG standar industri
  const conditions = ["Mint", "Near Mint", "Excellent", "Good", "Played"];

  /**
   * Menangani pengunggahan produk baru ke database Appwrite.
   */
  const handleUpload = async () => {
    // Normalisasi string kondisi & kategori agar sesuai dengan format ENUM/Zod Schema
    const normalizedCondition = normalizeProductCondition(condition);
    const normalizedCategory = normalizeProductCategory(formData.category);

    if (!store?.id || !user?.id) {
      setError("Data toko belum siap. Coba buka ulang halaman ini.");
      return;
    }

    // Validasi input wajib diisi
    if (!formData.name || !formData.price || !formData.category) {
      setError("Nama produk, kategori, dan harga wajib diisi.");
      return;
    }

    if (!normalizedCondition || !normalizedCategory) {
      setError("Kategori atau kondisi produk belum valid.");
      return;
    }

    try {
      setError("");
      setIsUploading(true); // Kunci form & tombol

      // Panggil service createProduct untuk menyimpan ke database dan storage Appwrite
      await productService.createProduct(user.id, {
        storeId: store.id,
        title: formData.name,
        category: normalizedCategory,
        price: Number(formData.price),
        stock: Number(formData.stock || 1),
        condition: normalizedCondition,
        description: formData.description,
        coverFile: selectedImage,
      });

      setIsUploading(false);
      
      // Arahkan kembali ke etalase seller
      router.push("/seller/products");
    } catch (submitError) {
      setIsUploading(false);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Upload produk gagal."
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
      {/* Header Halaman atas */}
      <StickyHeader
        title="Tambah Produk"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="secondary" />}
      />

      <main className="flex flex-1 flex-col gap-6 px-6 pt-6">
        
        {/* Input Unggah Gambar Cover */}
        <div className="flex flex-col gap-2">
          <label className="px-2 text-[14px] font-bold text-text-main">Foto Kartu</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-4/3 bg-surface-muted rounded-[24px] border-2 border-dashed border-secondary/20 flex cursor-pointer flex-col items-center justify-center gap-3 shadow-inner transition-colors hover:bg-secondary/5"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Icons.Plus size={28} />
            </div>
            <div className="text-center">
              <span className="mb-1 block text-[13px] font-bold uppercase tracking-widest text-secondary">
                Unggah Gambar
              </span>
              <span className="block text-[10px] font-medium text-text-sub">
                {selectedImage ? selectedImage.name : "Format: JPG, PNG (Max 5MB)"}
              </span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setSelectedImage(file);
            }}
          />
        </div>

        {/* Input Form Nama Kartu & Kategori Ekspansi */}
        <div className="flex flex-col gap-4">
          <Input
            label="Nama Kartu / Produk"
            placeholder="Misal: Charizard VMAX"
            autoFocus
            value={formData.name}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <Input
            label="Kategori / Ekspansi"
            placeholder="Misal: Pokemon, One Piece, Digimon"
            value={formData.category}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, category: event.target.value }))
            }
          />
        </div>

        {/* Pilihan Kondisi Kartu TCG */}
        <div className="flex flex-col gap-2">
          <label className="px-2 text-[14px] font-bold text-text-main">Kondisi Kartu</label>
          <div className="flex flex-wrap gap-2 px-2">
            {conditions.map((item) => (
              <button
                key={item}
                onClick={() => setCondition(item)}
                className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-300 border ${
                  condition === item
                    ? "bg-secondary text-white border-secondary shadow-soft"
                    : "bg-white text-text-sub border-surface-hover hover:border-secondary/30"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Input Angka Harga & Stok */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Harga (Rp)"
            placeholder="0"
            type="number"
            value={formData.price}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, price: event.target.value }))
            }
          />
          <Input
            label="Stok"
            placeholder="1"
            type="number"
            value={formData.stock}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, stock: event.target.value }))
            }
          />
        </div>

        {/* Input Text Area Deskripsi Detail */}
        <div className="flex w-full flex-col gap-1.5">
          <label className="ml-4 text-[14px] font-bold text-text-main">
            Deskripsi (Opsional)
          </label>
          <textarea
            value={formData.description}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            className="min-h-[120px] w-full resize-none rounded-[24px] border-none bg-surface-muted p-6 text-base text-text-main shadow-inner outline-none placeholder:text-text-sub/60 focus:ring-2 focus:ring-secondary/30"
            placeholder="Jelaskan detail kartu, minus jika ada, dll..."
          />
        </div>

        {/* Info Kesalahan Validasi */}
        {error && (
          <p className="px-2 text-center text-[12px] font-medium text-danger">
            {error}
          </p>
        )}
      </main>

      {/* Tombol Aksi Upload Melayang di Bawah */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 bg-linear-to-t from-white via-white/90 to-transparent p-6 pointer-events-none">
        <div className="w-full pointer-events-auto">
          <Button
            className="h-[60px] w-full rounded-[30px] text-[16px] font-bold tracking-wide shadow-medium"
            onClick={() => void handleUpload()}
            disabled={isUploading}
            variant="secondary"
          >
            {isUploading ? (
              <div className="flex items-center gap-3">
                <Icons.History size={20} className="animate-spin" />
                Mengunggah...
              </div>
            ) : (
              "Upload Produk"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
