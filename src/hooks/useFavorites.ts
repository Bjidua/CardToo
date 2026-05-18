"use client";

import React from "react";
import { favoriteService } from "@/lib/services/favorite";

export const useFavorites = (userId?: string | null) => {
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!userId) return;

    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const ids = await favoriteService.listFavoriteProductIds(userId);
        setFavoriteIds(ids);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFavorites();
  }, [userId]);

  const toggleFavorite = async (productId: string) => {
    if (!userId) return false;

    const isNowFavorite = await favoriteService.toggleFavorite(userId, productId);
    setFavoriteIds((prev) =>
      isNowFavorite ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
    return isNowFavorite;
  };

  return {
    favoriteIds: userId ? favoriteIds : [],
    isLoading,
    isFavorite: (productId: string) =>
      (userId ? favoriteIds : []).includes(productId),
    toggleFavorite,
  };
};
