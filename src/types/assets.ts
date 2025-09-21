/**
 * Asset type definitions for Bear Adventures Travel
 * Generated from WordPress migration data
 */

// Core asset categories
export type AssetCategory = 'logos' | 'content' | 'ui' | 'hero' | 'gallery';

// Image formats
export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'svg';

// Asset metadata interface
export interface AssetMetadata {
  localPath: string;
  filename: string;
  alt: string;
  width: number | null;
  height: number | null;
  category: AssetCategory;
  context: string;
  title: string;
}

// Enhanced asset interface with optimization info
export interface OptimizedAsset extends AssetMetadata {
  originalUrl: string;
  optimizedPath?: string;
  fileSize?: number;
  format: ImageFormat;
  isOptimized: boolean;
  loading?: 'lazy' | 'eager';
}

// Asset map structure
export interface AssetMap {
  [originalUrl: string]: AssetMetadata;
}

// Categorized assets structure
export interface CategorizedAssets {
  [category in AssetCategory]: Array<AssetMetadata & { url: string }>;
}

// Asset inventory metadata
export interface AssetInventoryMetadata {
  generatedAt: string;
  totalAssets: number;
  categories: AssetCategory[];
  downloadStats: {
    downloaded: number;
    skipped: number;
    errors: number;
    dataUrls: number;
  };
}

// Complete asset inventory
export interface AssetInventory {
  metadata: AssetInventoryMetadata;
  assets: AssetMap;
  categorizedAssets: CategorizedAssets;
}

// Image component props
export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  sizes?: string;
  priority?: boolean;
}

// Responsive image breakpoints
export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  large: number;
}

// Image optimization options
export interface ImageOptimizationOptions {
  quality: number;
  format: ImageFormat[];
  responsive: boolean;
  breakpoints: ResponsiveBreakpoints;
  placeholder: 'blur' | 'empty';
}

// Asset loading state
export interface AssetLoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  progress: number;
}

// Asset cache entry
export interface AssetCacheEntry {
  asset: OptimizedAsset;
  lastAccessed: Date;
  accessCount: number;
}

// Asset manager configuration
export interface AssetManagerConfig {
  baseUrl: string;
  optimizedBaseUrl: string;
  defaultQuality: number;
  enableLazyLoading: boolean;
  preloadCritical: boolean;
  cacheSize: number;
}

// WordPress specific asset data
export interface WordPressAssetData {
  id: number;
  url: string;
  title: string;
  alt: string;
  caption: string;
  description: string;
  mediaType: 'image' | 'video' | 'document';
  mimeType: string;
  sizes: {
    [sizeName: string]: {
      url: string;
      width: number;
      height: number;
    };
  };
}

// Gallery configuration
export interface GalleryConfig {
  columns: number;
  gap: string;
  aspectRatio: string;
  lightbox: boolean;
  pagination: boolean;
  itemsPerPage: number;
}

// Hero image configuration
export interface HeroImageConfig {
  overlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
  textPosition: 'center' | 'left' | 'right';
  parallax: boolean;
}

// Logo configuration
export interface LogoConfig {
  variant: 'full' | 'icon' | 'text';
  theme: 'light' | 'dark' | 'auto';
  size: 'small' | 'medium' | 'large';
  clickable: boolean;
  linkTo: string;
}

// Asset validation schema
export interface AssetValidation {
  required: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  allowedFormats: ImageFormat[];
  maxFileSize: number; // in bytes
}

// Asset performance metrics
export interface AssetPerformanceMetrics {
  loadTime: number;
  cacheHitRate: number;
  compressionRatio: number;
  optimizationSavings: number; // percentage
  totalBandwidthSaved: number; // in bytes
}

// SEO-related asset metadata
export interface AssetSEOMetadata {
  alt: string;
  title: string;
  caption: string;
  description: string;
  structuredData?: object;
}

// Accessibility features
export interface AssetAccessibility {
  alt: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  focusable: boolean;
  highContrast?: boolean;
}

// Asset processing pipeline stage
export interface AssetProcessingStage {
  stage: 'download' | 'optimize' | 'cache' | 'serve';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

// Batch asset operation
export interface BatchAssetOperation {
  id: string;
  type: 'download' | 'optimize' | 'migrate';
  assets: string[];
  stages: AssetProcessingStage[];
  totalProgress: number;
  estimatedTimeRemaining: number;
}

// Asset deployment configuration
export interface AssetDeploymentConfig {
  cdn: {
    enabled: boolean;
    baseUrl: string;
    regions: string[];
  };
  compression: {
    enabled: boolean;
    level: number;
    formats: ImageFormat[];
  };
  caching: {
    maxAge: number;
    staleWhileRevalidate: number;
  };
}

// Type guards
export function isOptimizedAsset(asset: AssetMetadata | OptimizedAsset): asset is OptimizedAsset {
  return 'isOptimized' in asset;
}

export function isImageFormat(format: string): format is ImageFormat {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(format.toLowerCase());
}

export function isAssetCategory(category: string): category is AssetCategory {
  return ['logos', 'content', 'ui', 'hero', 'gallery'].includes(category);
}

// Constants
export const DEFAULT_IMAGE_QUALITY = 85;
export const DEFAULT_RESPONSIVE_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  large: 1920,
};

export const SUPPORTED_IMAGE_FORMATS: ImageFormat[] = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
export const ASSET_CATEGORIES: AssetCategory[] = ['logos', 'content', 'ui', 'hero', 'gallery'];

// Error types
export class AssetError extends Error {
  constructor(
    message: string,
    public code: string,
    public assetUrl?: string,
  ) {
    super(message);
    this.name = 'AssetError';
  }
}

export class AssetLoadError extends AssetError {
  constructor(assetUrl: string, originalError?: Error) {
    super(`Failed to load asset: ${assetUrl}`, 'ASSET_LOAD_ERROR', assetUrl);
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class AssetOptimizationError extends AssetError {
  constructor(assetUrl: string, stage: string, originalError?: Error) {
    super(`Failed to optimize asset at stage ${stage}: ${assetUrl}`, 'ASSET_OPTIMIZATION_ERROR', assetUrl);
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

// Utility types for React components
export type AssetComponentProps<T = {}> = ImageProps & T;
export type AssetHookReturn<T = OptimizedAsset> = [T | null, AssetLoadingState];
export type AssetCacheHookReturn = [AssetCacheEntry[], (entry: AssetCacheEntry) => void, () => void];