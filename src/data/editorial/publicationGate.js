/**
 * BARUMSPACE EDITORIAL PUBLICATION GATE
 * 
 * Single Source of Truth for Article Publication Status.
 * 
 * Strict publication rule:
 * An article is ONLY published when:
 *   article.isPublished === true AND article.contentStatus === 'approved'
 * 
 * Any draft, in_review, or non-approved article is blocked from:
 * - Public URL rendering
 * - Sitemap inclusion
 * - RSS inclusion
 * - Guide Hub listing
 * - Internal link generation
 */

import { PILOT_EDITORIAL_ARTICLES } from './editorialRegistry.js';

/**
 * Checks whether an article is officially approved and published.
 * @param {Object} article 
 * @returns {boolean}
 */
export function isArticlePublished(article) {
  if (!article) return false;
  return article.isPublished === true && article.contentStatus === 'approved';
}

/**
 * Checks whether an article is eligible for the RSS feed.
 * @param {Object} article 
 * @returns {boolean}
 */
export function isArticleRssEligible(article) {
  if (!isArticlePublished(article)) return false;
  return article.rssEnabled === true;
}

/**
 * Checks whether an article is eligible for the sitemap.
 * @param {Object} article 
 * @returns {boolean}
 */
export function isArticleSitemapEligible(article) {
  if (!isArticlePublished(article)) return false;
  return article.sitemapEnabled === true;
}

/**
 * Returns all articles in the registry (including drafts).
 * @returns {Array}
 */
export function getAllArticles() {
  return PILOT_EDITORIAL_ARTICLES;
}

/**
 * Returns only published articles.
 * @returns {Array}
 */
export function getPublishedArticles() {
  return PILOT_EDITORIAL_ARTICLES.filter(isArticlePublished);
}

/**
 * Returns only articles eligible for the RSS feed.
 * @returns {Array}
 */
export function getRssEligibleArticles() {
  return PILOT_EDITORIAL_ARTICLES.filter(isArticleRssEligible);
}

/**
 * Returns only articles eligible for the sitemap.
 * @returns {Array}
 */
export function getSitemapEligibleArticles() {
  return PILOT_EDITORIAL_ARTICLES.filter(isArticleSitemapEligible);
}

/**
 * Finds an article by its URL slug.
 * @param {string} slug 
 * @returns {Object|null}
 */
export function getArticleBySlug(slug) {
  if (!slug) return null;
  return PILOT_EDITORIAL_ARTICLES.find(a => a.slug === slug) || null;
}

/**
 * Finds an article by its unique editorial ID.
 * @param {string} id 
 * @returns {Object|null}
 */
export function getArticleByEditorialId(id) {
  if (!id) return null;
  return PILOT_EDITORIAL_ARTICLES.find(a => a.editorialId === id) || null;
}
