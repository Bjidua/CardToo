export const slugifyValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const buildSlugBase = (value: string, fallbackPrefix: string) =>
  slugifyValue(value) || `${fallbackPrefix}-cardtoo`;

export const withSlugSuffix = (baseSlug: string, suffix: number) =>
  suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;
