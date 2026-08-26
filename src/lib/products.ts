import productsData from "@/data/products.json";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  images: string[];
  description: string;
  inStock: boolean;
  featured: boolean;
  tags: string[];
  createdAt: string;
}

// Helper to fix image paths for GitHub Pages
export function getImagePath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (process.env.NODE_ENV === "production") {
    // If the path already has the base path, don't duplicate it
    if (path.startsWith("/creative-nest-website")) return path;
    return `/creative-nest-website${path}`;
  }
  return path;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
}

export function getAllProducts(): Product[] {
  return productsData.products as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getAllProducts().filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getInStockProducts(): Product[] {
  return getAllProducts().filter((p) => p.inStock);
}

export function getAllCategories(): Category[] {
  return productsData.categories as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getAllCategories().find((c) => c.slug === slug);
}

export function getProductCountByCategory(categorySlug: string): number {
  return getProductsByCategory(categorySlug).length;
}

export type SortOption = "newest" | "price-low" | "price-high" | "name";

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}
