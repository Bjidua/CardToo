"use client";

import React, { useEffect, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  normalizeProductCategory,
  normalizeProductCondition,
  productService,
} from "@/lib/services/product";

export default function EditProductClient({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [condition, setCondition] = useState("Mint");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "1",
    description: "",
  });

  const conditions = ["Mint", "Near Mint", "Excellent", "Good", "Played"];

  useEffect(() => {
    const loadProduct = async () => {
      const product = await productService.getProductById(id);

      if (!product) {
        setError("Produk tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      setFormData({
        name: product.title,
        category: product.category || "",
        price: String(product.price),
        stock: String(product.stock || 1),
        description: product.description || "",
      });
      setCondition(product.condition || "Mint");
      setIsLoading(false);
    };

    void loadProduct();
  }, [id]);

  const handleSave = async () => {
    const normalizedCondition = normalizeProductCondition(condition);
    const normalizedCategory = normalizeProductCategory(formData.category);

    if (!formData.name || !formData.price || !formData.category) {
      setError("Nama produk, kategori, dan harga wajib diisi.");
      return;
    }

    if (!normalizedCondition || !normalizedCategory) {
      setError("Kategori atau kondisi produk belum valid.");
      return;
    }

    if (!user) {
      setError("Sesi login kamu tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      setError("");
      setIsSaving(true);
      await productService.updateProduct(user.id, id, {
        title: formData.name,
        category: normalizedCategory,
        price: Number(formData.price),
        stock: Number(formData.stock || 1),
        condition: normalizedCondition,
        description: formData.description,
        coverFile: selectedImage,
      });
      setIsSaving(false);
      router.push("/seller/products");
    } catch (submitError) {
      setIsSaving(false);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Menyimpan produk gagal."
      );
    }
  };

  return (
    <ProtectedRoute requireSeller={true}>
      <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
        <StickyHeader
          title="Edit Produk"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="secondary" />}
        />

        <main className="flex flex-1 flex-col gap-6 px-6 pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label className="px-2 text-[14px] font-bold text-text-main">Foto Kartu</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-4/3 bg-surface-muted rounded-[24px] border-2 border-secondary/20 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden shadow-inner relative group"
                >
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-text-main/10 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-secondary">
                      <Icons.Plus size={24} />
                    </div>
                  </div>
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold uppercase tracking-tighter italic text-text-main/10">
                    {formData.name.split(" ")[0] || "TCG"}
                  </div>
                </div>
                <p className="mt-1 text-center text-[10px] font-medium italic text-text-sub">
                  {selectedImage ? selectedImage.name : "Klik gambar untuk mengganti foto"}
                </p>
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

              <div className="flex flex-col gap-4">
                <Input
                  label="Nama Kartu / Produk"
                  placeholder="Misal: Charizard VMAX"
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

              {error && (
                <p className="px-2 text-center text-[12px] font-medium text-danger">
                  {error}
                </p>
              )}
            </>
          )}
        </main>

        <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 bg-linear-to-t from-white via-white/90 to-transparent p-6 pointer-events-none">
          <div className="w-full pointer-events-auto">
            <Button
              className="h-[60px] w-full rounded-[30px] text-[16px] font-bold tracking-wide shadow-medium"
              onClick={() => void handleSave()}
              disabled={isSaving || isLoading}
              variant="secondary"
            >
              {isSaving ? (
                <div className="flex items-center gap-3">
                  <Icons.History size={20} className="animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
