/**
 * React Hooks for Asset Management
 * Custom hooks for loading and managing assets in Bear Adventures Travel
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  OptimizedAsset,
  AssetCategory,
  AssetLoadingState,
  AssetCacheEntry,
  AssetHookReturn,
  AssetCacheHookReturn,
  AssetInventory,
} from '../types/assets';
import { assetManager } from '../utils/assetManager';

/**
 * Hook to load a single asset by URL
 */
export function useAsset(originalUrl: string): AssetHookReturn<OptimizedAsset> {
  const [asset, setAsset] = useState<OptimizedAsset | null>(null);
  const [loading, setLoading] = useState<AssetLoadingState>({
    isLoading: false,
    isLoaded: false,
    error: null,
    progress: 0,
  });

  useEffect(() => {
    if (!originalUrl) return;

    const loadAsset = async () => {
      setLoading(prev => ({ ...prev, isLoading: true, error: null, progress: 10 }));

      try {
        // Check cache first
        const cached = assetManager.getCachedAsset(originalUrl);
        if (cached) {
          setAsset(cached.asset);
          setLoading({
            isLoading: false,
            isLoaded: true,
            error: null,
            progress: 100,
          });
          return;
        }

        setLoading(prev => ({ ...prev, progress: 30 }));

        const loadedAsset = await assetManager.getAsset(originalUrl);
        setLoading(prev => ({ ...prev, progress: 70 }));

        if (loadedAsset) {
          // Cache the asset
          assetManager.cacheAsset(originalUrl, loadedAsset);
          setAsset(loadedAsset);
          setLoading({
            isLoading: false,
            isLoaded: true,
            error: null,
            progress: 100,
          });
        } else {
          throw new Error(`Asset not found: ${originalUrl}`);
        }
      } catch (error) {
        setLoading({
          isLoading: false,
          isLoaded: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          progress: 0,
        });
        setAsset(null);
      }
    };

    loadAsset();
  }, [originalUrl]);

  return [asset, loading];
}

/**
 * Hook to load multiple assets by URLs
 */
export function useAssets(originalUrls: string[]): AssetHookReturn<OptimizedAsset[]> {
  const [assets, setAssets] = useState<OptimizedAsset[]>([]);
  const [loading, setLoading] = useState<AssetLoadingState>({
    isLoading: false,
    isLoaded: false,
    error: null,
    progress: 0,
  });

  useEffect(() => {
    if (!originalUrls.length) return;

    const loadAssets = async () => {
      setLoading(prev => ({ ...prev, isLoading: true, error: null, progress: 0 }));

      try {
        const loadedAssets: OptimizedAsset[] = [];
        const total = originalUrls.length;

        for (let i = 0; i < originalUrls.length; i++) {
          const url = originalUrls[i];
          const progress = ((i + 1) / total) * 100;

          // Check cache first
          const cached = assetManager.getCachedAsset(url);
          if (cached) {
            loadedAssets.push(cached.asset);
          } else {
            const asset = await assetManager.getAsset(url);
            if (asset) {
              assetManager.cacheAsset(url, asset);
              loadedAssets.push(asset);
            }
          }

          setLoading(prev => ({ ...prev, progress }));
        }

        setAssets(loadedAssets);
        setLoading({
          isLoading: false,
          isLoaded: true,
          error: null,
          progress: 100,
        });
      } catch (error) {
        setLoading({
          isLoading: false,
          isLoaded: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          progress: 0,
        });
        setAssets([]);
      }
    };

    loadAssets();
  }, [originalUrls.join(',')]);

  return [assets, loading];
}

/**
 * Hook to load assets by category
 */
export function useAssetsByCategory(category: AssetCategory): AssetHookReturn<OptimizedAsset[]> {
  const [assets, setAssets] = useState<OptimizedAsset[]>([]);
  const [loading, setLoading] = useState<AssetLoadingState>({
    isLoading: false,
    isLoaded: false,
    error: null,
    progress: 0,
  });

  useEffect(() => {
    const loadAssetsByCategory = async () => {
      setLoading(prev => ({ ...prev, isLoading: true, error: null, progress: 10 }));

      try {
        setLoading(prev => ({ ...prev, progress: 50 }));
        const categoryAssets = await assetManager.getAssetsByCategory(category);

        setAssets(categoryAssets);
        setLoading({
          isLoading: false,
          isLoaded: true,
          error: null,
          progress: 100,
        });
      } catch (error) {
        setLoading({
          isLoading: false,
          isLoaded: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          progress: 0,
        });
        setAssets([]);
      }
    };

    loadAssetsByCategory();
  }, [category]);

  return [assets, loading];
}

/**
 * Hook to search assets
 */
export function useAssetSearch(query: string, debounceMs = 300): AssetHookReturn<OptimizedAsset[]> {
  const [assets, setAssets] = useState<OptimizedAsset[]>([]);
  const [loading, setLoading] = useState<AssetLoadingState>({
    isLoading: false,
    isLoaded: false,
    error: null,
    progress: 0,
  });

  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setAssets([]);
      setLoading({
        isLoading: false,
        isLoaded: true,
        error: null,
        progress: 100,
      });
      return;
    }

    const searchAssets = async () => {
      setLoading(prev => ({ ...prev, isLoading: true, error: null, progress: 10 }));

      try {
        setLoading(prev => ({ ...prev, progress: 50 }));
        const searchResults = await assetManager.searchAssets(debouncedQuery);

        setAssets(searchResults);
        setLoading({
          isLoading: false,
          isLoaded: true,
          error: null,
          progress: 100,
        });
      } catch (error) {
        setLoading({
          isLoading: false,
          isLoaded: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          progress: 0,
        });
        setAssets([]);
      }
    };

    searchAssets();
  }, [debouncedQuery]);

  return [assets, loading];
}

/**
 * Hook to manage asset cache
 */
export function useAssetCache(): AssetCacheHookReturn {
  const [cacheEntries, setCacheEntries] = useState<AssetCacheEntry[]>([]);

  const updateCache = useCallback(() => {
    const stats = assetManager.getCacheStats();
    setCacheEntries(stats.entries.map(entry => ({
      asset: assetManager.getCachedAsset(entry.url)?.asset!,
      lastAccessed: entry.lastAccessed,
      accessCount: entry.accessCount,
    })));
  }, []);

  const addToCache = useCallback((entry: AssetCacheEntry) => {
    assetManager.cacheAsset(entry.asset.originalUrl, entry.asset);
    updateCache();
  }, [updateCache]);

  const clearCache = useCallback(() => {
    assetManager.clearCache();
    setCacheEntries([]);
  }, []);

  useEffect(() => {
    updateCache();
  }, [updateCache]);

  return [cacheEntries, addToCache, clearCache];
}

/**
 * Hook to load asset inventory
 */
export function useAssetInventory(): AssetHookReturn<AssetInventory> {
  const [inventory, setInventory] = useState<AssetInventory | null>(null);
  const [loading, setLoading] = useState<AssetLoadingState>({
    isLoading: false,
    isLoaded: false,
    error: null,
    progress: 0,
  });

  useEffect(() => {
    const loadInventory = async () => {
      setLoading(prev => ({ ...prev, isLoading: true, error: null, progress: 10 }));

      try {
        setLoading(prev => ({ ...prev, progress: 50 }));
        const assetInventory = await assetManager.loadAssetInventory();

        setInventory(assetInventory);
        setLoading({
          isLoading: false,
          isLoaded: true,
          error: null,
          progress: 100,
        });
      } catch (error) {
        setLoading({
          isLoading: false,
          isLoaded: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          progress: 0,
        });
        setInventory(null);
      }
    };

    loadInventory();
  }, []);

  return [inventory, loading];
}

/**
 * Hook for responsive image properties
 */
export function useResponsiveImage(asset: OptimizedAsset | null, options: {
  quality?: number;
  sizes?: string;
  priority?: boolean;
} = {}) {
  return useMemo(() => {
    if (!asset) {
      return {
        src: '',
        srcSet: '',
        sizes: '',
        alt: '',
        width: undefined,
        height: undefined,
      };
    }

    const { quality = 85, sizes, priority = false } = options;

    const src = assetManager.getOptimizedUrl(asset, { quality });
    const srcSet = assetManager.generateSrcSet(asset, { quality });
    const responsiveSizes = sizes || assetManager.generateSizes();

    return {
      src,
      srcSet,
      sizes: responsiveSizes,
      alt: asset.alt,
      width: asset.width || undefined,
      height: asset.height || undefined,
      loading: priority ? 'eager' as const : asset.loading,
    };
  }, [asset, options.quality, options.sizes, options.priority]);
}

/**
 * Hook for preloading critical assets
 */
export function useAssetPreloader(urls: string[], enabled = true) {
  const [preloaded, setPreloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !urls.length) return;

    const preloadAssets = async () => {
      try {
        await assetManager.preloadCriticalAssets(urls);
        setPreloaded(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Preload failed');
        setPreloaded(false);
      }
    };

    preloadAssets();
  }, [urls.join(','), enabled]);

  return { preloaded, error };
}

/**
 * Hook for asset lazy loading with Intersection Observer
 */
export function useAssetLazyLoading(
  ref: React.RefObject<HTMLElement>,
  threshold = 0.1,
  rootMargin = '50px'
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, threshold, rootMargin, hasIntersected]);

  return { isIntersecting, hasIntersected, shouldLoad: hasIntersected };
}

/**
 * Debounce hook utility
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}