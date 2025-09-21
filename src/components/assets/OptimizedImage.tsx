/**
 * Optimized Image Component for Bear Adventures Travel
 * Handles responsive images, lazy loading, and optimization
 */

import React, { forwardRef, useState, useRef, useCallback } from 'react';
import { useAsset, useResponsiveImage, useAssetLazyLoading } from '../../hooks/useAssets';
import { ImageProps, OptimizedAsset } from '../../types/assets';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  /** Original WordPress URL or asset path */
  originalUrl?: string;
  /** Pre-loaded asset data */
  asset?: OptimizedAsset;
  /** Image quality (1-100) */
  quality?: number;
  /** Responsive sizes attribute */
  sizes?: string;
  /** Whether to prioritize loading */
  priority?: boolean;
  /** Placeholder while loading */
  placeholder?: 'blur' | 'empty' | string;
  /** Fallback image URL */
  fallback?: string;
  /** Callback when image loads */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  /** Callback when image fails to load */
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  /** Additional container class */
  containerClassName?: string;
  /** Enable lazy loading */
  lazy?: boolean;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      originalUrl,
      asset: providedAsset,
      quality = 85,
      sizes,
      priority = false,
      placeholder = 'empty',
      fallback,
      onLoad,
      onError,
      containerClassName,
      lazy = true,
      className,
      alt,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load asset if not provided
    const [loadedAsset, loadingState] = useAsset(originalUrl || '');
    const asset = providedAsset || loadedAsset;

    // Lazy loading
    const { shouldLoad } = useAssetLazyLoading(
      containerRef,
      0.1,
      '50px'
    );

    // Generate responsive image properties
    const imageProps = useResponsiveImage(asset, {
      quality,
      sizes,
      priority,
    });

    // Determine if we should render the image
    const shouldRender = !lazy || priority || shouldLoad;

    const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoaded(true);
      onLoad?.(event);
    }, [onLoad]);

    const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
      setHasError(true);
      onError?.(event);
    }, [onError]);

    // Show loading state
    if (originalUrl && loadingState.isLoading) {
      return (
        <div
          ref={containerRef}
          className={`relative ${containerClassName || ''}`}
          role="img"
          aria-label="Loading image"
        >
          <div className="animate-pulse bg-gray-200 w-full h-full min-h-[200px]" />
          {loadingState.progress > 0 && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="w-full bg-gray-300 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${loadingState.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    // Show error state
    if (loadingState.error || (!asset && originalUrl)) {
      return (
        <div
          ref={containerRef}
          className={`relative flex items-center justify-center bg-gray-100 text-gray-500 min-h-[200px] ${containerClassName || ''}`}
          role="img"
          aria-label="Failed to load image"
        >
          {fallback ? (
            <img
              src={fallback}
              alt={alt || 'Fallback image'}
              className={className}
              onLoad={handleLoad}
              {...props}
            />
          ) : (
            <div className="text-center p-4">
              <svg
                className="w-12 h-12 mx-auto mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">Image not available</p>
            </div>
          )}
        </div>
      );
    }

    // Don't render if we shouldn't load yet (lazy loading)
    if (!shouldRender) {
      return (
        <div
          ref={containerRef}
          className={`relative bg-gray-100 ${containerClassName || ''}`}
          style={{
            aspectRatio: asset?.width && asset?.height
              ? `${asset.width}/${asset.height}`
              : 'auto'
          }}
          role="img"
          aria-label="Loading image"
        >
          {placeholder === 'blur' && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          )}
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={`relative ${containerClassName || ''}`}
      >
        {/* Placeholder shown while loading */}
        {!isLoaded && placeholder !== 'empty' && (
          <div
            className="absolute inset-0 z-10"
            style={{
              aspectRatio: asset?.width && asset?.height
                ? `${asset.width}/${asset.height}`
                : 'auto'
            }}
          >
            {placeholder === 'blur' ? (
              <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            ) : typeof placeholder === 'string' && placeholder !== 'empty' ? (
              <img
                src={placeholder}
                alt=""
                className="w-full h-full object-cover opacity-50"
                aria-hidden="true"
              />
            ) : null}
          </div>
        )}

        {/* Main image */}
        <img
          ref={ref}
          src={hasError && fallback ? fallback : imageProps.src}
          srcSet={!hasError ? imageProps.srcSet : undefined}
          sizes={!hasError ? imageProps.sizes : undefined}
          alt={alt || imageProps.alt}
          width={imageProps.width}
          height={imageProps.height}
          loading={imageProps.loading}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className || ''}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />

        {/* Loading indicator for priority images */}
        {priority && !isLoaded && (
          <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;