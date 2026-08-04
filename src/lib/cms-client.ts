import {
  articles as rawArticles,
  categories as fallbackCategories,
  breakingHeadlines,
  alerts as rawAlerts,
  liveStories as rawLiveStories,
  type Article,
  type Category,
  type BreakingHeadline,
  type AlertItem,
  type LiveStory,
} from '@/data/dummy';
import { siteConfig } from '@/lib/site-config';
import { BRAZILIAN_STATES, getStateByUf, type BrazilianState } from '@/data/brazilian-states';

export type { Article, Category, BreakingHeadline, AlertItem, LiveStory, BrazilianState };

function sortByDate(items: Article[]): Article[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/** Site-specific editorial sections from assembler — not the generic dummy list. */
function editorialCategories(): Category[] {
  const nav = siteConfig.navCategories;
  if (nav?.length) {
    return nav.map((c) => ({
      id: `nav-${c.slug}`,
      name: c.name,
      slug: c.slug,
      description: `Cobertura de ${c.name} em ${siteConfig.siteName}`,
    }));
  }
  return fallbackCategories;
}

/**
 * Demo content ships with generic slugs (esportes, politica…).
 * Remap onto this site's navCategories so /categoria/{editorial-slug} works.
 */
function withSiteCategories(items: Article[]): Article[] {
  const nav = siteConfig.navCategories;
  if (!nav?.length) return items;

  return items.map((article, index) => {
    const cat = nav[index % nav.length];
    return {
      ...article,
      category: cat.name,
      categorySlug: cat.slug,
    };
  });
}

function articles(): Article[] {
  return withSiteCategories(rawArticles);
}

export async function getLatestArticles(limit = 10): Promise<Article[]> {
  return sortByDate(articles()).slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return articles().find((article) => article.slug === slug) ?? null;
}

export async function getByCategory(categorySlug: string, limit = 10): Promise<Article[]> {
  return sortByDate(
    articles().filter((article) => article.categorySlug === categorySlug)
  ).slice(0, limit);
}

export async function search(query: string, limit = 20): Promise<Article[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return sortByDate(
    articles().filter(
      (article) =>
        article.title.toLowerCase().includes(normalized) ||
        article.excerpt.toLowerCase().includes(normalized) ||
        article.category.toLowerCase().includes(normalized) ||
        article.author.toLowerCase().includes(normalized)
    )
  ).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return editorialCategories();
}

export async function getBreakingHeadlines(): Promise<BreakingHeadline[]> {
  return breakingHeadlines;
}

export async function getMostRead(limit = 5): Promise<Article[]> {
  return [...articles()]
    .sort((a, b) => (b.readCount ?? 0) - (a.readCount ?? 0))
    .slice(0, limit);
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const all = articles();
  const featured = all.filter((a) => a.featured);
  if (featured.length >= limit) {
    return sortByDate(featured).slice(0, limit);
  }
  return sortByDate(all).slice(0, limit);
}

export async function getAlerts(limit = 20): Promise<AlertItem[]> {
  return [...rawAlerts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getLiveStories(): Promise<LiveStory[]> {
  return rawLiveStories;
}

export async function getLiveStoryBySlug(slug: string): Promise<LiveStory | null> {
  return rawLiveStories.find((s) => s.slug === slug) ?? null;
}

export async function getBrazilianStates(): Promise<BrazilianState[]> {
  return BRAZILIAN_STATES;
}

export async function getBrazilianState(uf: string): Promise<BrazilianState | null> {
  return getStateByUf(uf) ?? null;
}
