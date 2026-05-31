/**
 * Veri erişim katmanı.
 * Astro build sırasında çalışır — runtime fetch yok.
 *
 * Faz 1-5: tek müşteri (CUSTOMER_SLUG env değişkeni).
 * Faz 8+: çoklu müşteri için bu modül per-build farklı klasör okur.
 */

import type {
  CustomerConfig,
  Category,
  Product,
} from './schema';

import atelierConfig from '@data/musteriler/atelier-anatolia/config.json';
import atelierKategoriler from '@data/musteriler/atelier-anatolia/kategoriler.json';
import atelierUrunler from '@data/musteriler/atelier-anatolia/urunler.json';

const CUSTOMER_SLUG = (import.meta.env.CUSTOMER_SLUG as string) ?? 'atelier-anatolia';

const REGISTRY = {
  'atelier-anatolia': {
    config: atelierConfig as CustomerConfig,
    categories: atelierKategoriler as Category[],
    products: atelierUrunler as Product[],
  },
} as const;

type CustomerSlug = keyof typeof REGISTRY;

function getStore(slug: string = CUSTOMER_SLUG) {
  if (!(slug in REGISTRY)) {
    throw new Error(
      `[data] Bilinmeyen müşteri: "${slug}". Mevcutlar: ${Object.keys(REGISTRY).join(', ')}`
    );
  }
  return REGISTRY[slug as CustomerSlug];
}

export function getCurrentCustomerSlug(): string {
  return CUSTOMER_SLUG;
}

export function getCustomer(slug: string = CUSTOMER_SLUG): CustomerConfig {
  return getStore(slug).config;
}

export function getCategories(slug: string = CUSTOMER_SLUG): Category[] {
  return getStore(slug).categories;
}

export function getCategory(
  categorySlug: string,
  customerSlug: string = CUSTOMER_SLUG
): Category | undefined {
  return getCategories(customerSlug).find((c) => c.slug === categorySlug);
}

export function getProducts(slug: string = CUSTOMER_SLUG): Product[] {
  return getStore(slug).products;
}

export function getProduct(
  productSlug: string,
  customerSlug: string = CUSTOMER_SLUG
): Product | undefined {
  return getProducts(customerSlug).find((p) => p.slug === productSlug);
}

export function getProductsByCategory(
  categorySlug: string,
  customerSlug: string = CUSTOMER_SLUG
): Product[] {
  return getProducts(customerSlug).filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts(
  count: number = 4,
  customerSlug: string = CUSTOMER_SLUG
): Product[] {
  return getProducts(customerSlug)
    .filter((p) => p.isFeatured)
    .slice(0, count);
}

export function getSimilarProducts(
  product: Product,
  count: number = 3,
  customerSlug: string = CUSTOMER_SLUG
): Product[] {
  const all = getProducts(customerSlug);
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const out: Product[] = [];

  for (const slug of product.similarSlugs) {
    const p = bySlug.get(slug);
    if (p && p.slug !== product.slug) out.push(p);
    if (out.length >= count) return out;
  }
  // Eksik kalırsa aynı kategoriden tamamla
  if (out.length < count) {
    const fallback = all.filter(
      (p) =>
        p.category === product.category &&
        p.slug !== product.slug &&
        !out.some((x) => x.slug === p.slug)
    );
    out.push(...fallback.slice(0, count - out.length));
  }
  return out;
}

/**
 * WhatsApp deep-link üretici.
 * brand-guide "Deep-Link Pattern" — ürün + opsiyonel kumaş varyantını text olarak gönderir.
 */
export function buildWhatsAppLink(
  phone: string,
  product?: Pick<Product, 'name' | 'italicWord'>,
  fabricName?: string
): string {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  if (!product) {
    return `https://wa.me/${cleanPhone}`;
  }
  const fullName = product.italicWord ? `${product.name} ${product.italicWord}` : product.name;
  const variantPart = fabricName ? ` (${fabricName})` : '';
  const text = `${fullName} hakkında bilgi almak istiyorum${variantPart}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/** Astro getStaticPaths için yardımcılar */
export function getProductSlugs(customerSlug: string = CUSTOMER_SLUG): string[] {
  return getProducts(customerSlug).map((p) => p.slug);
}
export function getCategorySlugs(customerSlug: string = CUSTOMER_SLUG): string[] {
  return getCategories(customerSlug).map((c) => c.slug);
}

/** İstatistik özetleri — debug + footer için */
export function getDataSummary(customerSlug: string = CUSTOMER_SLUG) {
  const products = getProducts(customerSlug);
  const categories = getCategories(customerSlug);
  return {
    customerSlug,
    customerName: getCustomer(customerSlug).brand.name,
    totalProducts: products.length,
    totalCategories: categories.length,
    featuredCount: products.filter((p) => p.isFeatured).length,
    productsWithModel: products.filter((p) => p.modelUrl !== null).length,
    productsWithFabric: products.filter((p) => p.fabrics.length > 0).length,
    perCategory: categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      count: products.filter((p) => p.category === c.slug).length,
    })),
  };
}
