/**
 * Asset Management Utilities for Bear Adventures Travel
 * Handles asset loading, optimization, and caching
 */

import {
  AssetMetadata,
  OptimizedAsset,
  AssetMap,
  CategorizedAssets,
  AssetInventory,
  AssetCategory,
  ImageFormat,
  AssetManagerConfig,
  AssetCacheEntry,
  AssetLoadError,
  AssetOptimizationError,
  DEFAULT_IMAGE_QUALITY,
  DEFAULT_RESPONSIVE_BREAKPOINTS,
  isImageFormat,
  isAssetCategory,
} from '../types/assets';

class AssetManager {
  private static instance: AssetManager;
  private assetInventory: AssetInventory | null = null;
  private cache = new Map<string, AssetCacheEntry>();
  private config: AssetManagerConfig;

  private constructor(config?: Partial<AssetManagerConfig>) {
    this.config = {
      baseUrl: '/src/assets',
      optimizedBaseUrl: '/src/assets/optimized',
      defaultQuality: DEFAULT_IMAGE_QUALITY,
      enableLazyLoading: true,
      preloadCritical: true,
      cacheSize: 100,
      ...config,
    };
  }

  static getInstance(config?: Partial<AssetManagerConfig>): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager(config);
    }
    return AssetManager.instance;
  }

  /**
   * Load asset inventory from the generated JSON file
   */
  async loadAssetInventory(): Promise<AssetInventory> {
    if (this.assetInventory) {
      return this.assetInventory;
    }

    try {
      const response = await fetch('/enhanced-asset-map.json');
      if (!response.ok) {
        throw new Error(`Failed to load asset inventory: ${response.statusText}`);
      }

      this.assetInventory = await response.json();
      return this.assetInventory;
    } catch (error) {
      throw new AssetLoadError('/enhanced-asset-map.json', error as Error);
    }
  }

  /**
   * Get asset by original URL
   */
  async getAsset(originalUrl: string): Promise<OptimizedAsset | null> {
    const inventory = await this.loadAssetInventory();
    const assetMetadata = inventory.assets[originalUrl];

    if (!assetMetadata) {
      return null;
    }

    return this.enhanceAssetMetadata(originalUrl, assetMetadata);
  }

  /**
   * Get assets by category
   */
  async getAssetsByCategory(category: AssetCategory): Promise<OptimizedAsset[]> {
    const inventory = await this.loadAssetInventory();
    const categorizedAssets = inventory.categorizedAssets[category] || [];

    return Promise.all(
      categorizedAssets.map(asset =>
        this.enhanceAssetMetadata(asset.url, asset)
      )
    );
  }

  /**
   * Search assets by filename, alt text, or context
   */
  async searchAssets(query: string): Promise<OptimizedAsset[]> {
    const inventory = await this.loadAssetInventory();
    const matchingAssets: OptimizedAsset[] = [];

    for (const [url, asset] of Object.entries(inventory.assets)) {
      const searchableText = `${asset.filename} ${asset.alt} ${asset.context} ${asset.title}`.toLowerCase();
      if (searchableText.includes(query.toLowerCase())) {
        matchingAssets.push(await this.enhanceAssetMetadata(url, asset));
      }
    }

    return matchingAssets;
  }

  /**
   * Get optimized image URL with quality and format options
   */
  getOptimizedUrl(
    asset: AssetMetadata,
    options: {
      quality?: number;
      format?: ImageFormat;
      width?: number;
      height?: number;
    } = {}
  ): string {
    const { quality = this.config.defaultQuality, format, width, height } = options;

    // Check if optimized version exists
    const optimizedPath = asset.localPath.replace('/assets/', '/assets/optimized/');

    // For now, return the local path - in production this would handle CDN URLs
    let url = `${this.config.baseUrl}/${asset.localPath.replace('assets/', '')}`;

    // Add query parameters for dynamic optimization (if using a service like Cloudinary)
    const params = new URLSearchParams();
    if (quality !== DEFAULT_IMAGE_QUALITY) params.set('q', quality.toString());
    if (format && format !== this.getImageFormat(asset.filename)) params.set('f', format);
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return url;
  }

  /**
   * Generate responsive image srcset
   */
  generateSrcSet(
    asset: AssetMetadata,
    options: {
      quality?: number;
      format?: ImageFormat;
    } = {}
  ): string {
    const breakpoints = [400, 800, 1200, 1600, 2000];

    return breakpoints
      .map(width => {
        const url = this.getOptimizedUrl(asset, { ...options, width });
        return `${url} ${width}w`;
      })
      .join(', ');
  }

  /**
   * Generate responsive sizes attribute
   */
  generateSizes(breakpoints = DEFAULT_RESPONSIVE_BREAKPOINTS): string {
    return [
      `(max-width: ${breakpoints.mobile}px) 100vw`,
      `(max-width: ${breakpoints.tablet}px) 50vw`,
      `(max-width: ${breakpoints.desktop}px) 33vw`,
      '25vw'
    ].join(', ');
  }

  /**
   * Preload critical images
   */
  async preloadCriticalAssets(urls: string[]): Promise<void> {
    if (!this.config.preloadCritical) return;

    const preloadPromises = urls.map(url => this.preloadAsset(url));
    await Promise.allSettled(preloadPromises);
  }

  /**
   * Preload a single asset
   */
  private async preloadAsset(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new AssetLoadError(url));
      img.src = url;
    });
  }

  /**
   * Get cached asset or create cache entry
   */
  getCachedAsset(url: string): AssetCacheEntry | null {
    const entry = this.cache.get(url);
    if (entry) {
      entry.lastAccessed = new Date();
      entry.accessCount++;
      return entry;
    }
    return null;
  }

  /**
   * Cache an asset
   */
  cacheAsset(url: string, asset: OptimizedAsset): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.cacheSize) {
      const oldest = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.lastAccessed.getTime() - b.lastAccessed.getTime())[0];
      this.cache.delete(oldest[0]);
    }

    this.cache.set(url, {
      asset,
      lastAccessed: new Date(),
      accessCount: 1,
    });
  }

  /**
   * Clear asset cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{ url: string; accessCount: number; lastAccessed: Date }>;
  } {
    const entries = Array.from(this.cache.entries()).map(([url, entry]) => ({
      url,
      accessCount: entry.accessCount,
      lastAccessed: entry.lastAccessed,
    }));

    const totalAccesses = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const cacheHits = entries.filter(entry => entry.accessCount > 1).length;

    return {
      size: this.cache.size,
      maxSize: this.config.cacheSize,
      hitRate: totalAccesses > 0 ? (cacheHits / totalAccesses) * 100 : 0,
      entries: entries.sort((a, b) => b.accessCount - a.accessCount),
    };
  }

  /**
   * Enhance asset metadata with optimization info
   */
  private async enhanceAssetMetadata(originalUrl: string, metadata: AssetMetadata): Promise<OptimizedAsset> {
    const format = this.getImageFormat(metadata.filename);
    const optimizedPath = metadata.localPath.replace('/assets/', '/assets/optimized/');

    return {
      ...metadata,
      originalUrl,
      optimizedPath,
      format,
      isOptimized: await this.checkOptimizedExists(optimizedPath),
      loading: this.shouldLazyLoad(metadata.category),
    };
  }

  /**
   * Extract image format from filename
   */
  private getImageFormat(filename: string): ImageFormat {
    const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
    return isImageFormat(extension) ? extension : 'jpg';
  }

  /**
   * Check if optimized version exists
   */
  private async checkOptimizedExists(path: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.optimizedBaseUrl}/${path}`, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Determine if asset should be lazy loaded
   */
  private shouldLazyLoad(category: AssetCategory): 'lazy' | 'eager' {
    if (!this.config.enableLazyLoading) return 'eager';
    return ['logos', 'hero'].includes(category) ? 'eager' : 'lazy';
  }

  /**
   * Validate asset metadata
   */
  static validateAssetMetadata(metadata: AssetMetadata): boolean {
    return !!(
      metadata.localPath &&
      metadata.filename &&
      metadata.category &&
      isAssetCategory(metadata.category)
    );
  }

  /**
   * Generate asset URL from path
   */
  static getAssetUrl(localPath: string, baseUrl = '/src/assets'): string {
    return `${baseUrl}/${localPath.replace('assets/', '')}`;
  }

  /**
   * Extract filename from URL
   */
  static extractFilename(url: string): string {
    return url.split('/').pop()?.split('?')[0] || '';
  }

  /**
   * Calculate aspect ratio
   */
  static calculateAspectRatio(width: number, height: number): string {
    if (!width || !height) return 'auto';
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}/${height / divisor}`;
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}

// Export singleton instance
export const assetManager = AssetManager.getInstance();

// Export utility functions
export {
  AssetManager,
};

// Helper functions for React components
export const getAssetUrl = AssetManager.getAssetUrl;
export const extractFilename = AssetManager.extractFilename;
export const calculateAspectRatio = AssetManager.calculateAspectRatio;
export const formatFileSize = AssetManager.formatFileSize;