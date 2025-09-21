/**
 * Asset Gallery Component for Bear Adventures Travel
 * Displays a responsive gallery of optimized images
 */

import React, { useState, useMemo } from 'react';
import { useAssetsByCategory, useAssetSearch } from '../../hooks/useAssets';
import { AssetCategory, OptimizedAsset, GalleryConfig } from '../../types/assets';
import OptimizedImage from './OptimizedImage';

interface AssetGalleryProps {
  /** Asset category to display */
  category?: AssetCategory;
  /** Specific assets to display */
  assets?: OptimizedAsset[];
  /** Gallery configuration */
  config?: Partial<GalleryConfig>;
  /** Search query to filter assets */
  searchQuery?: string;
  /** Custom filter function */
  filter?: (asset: OptimizedAsset) => boolean;
  /** Custom sort function */
  sort?: (a: OptimizedAsset, b: OptimizedAsset) => number;
  /** Gallery title */
  title?: string;
  /** Show search bar */
  showSearch?: boolean;
  /** Show category filter */
  showCategoryFilter?: boolean;
  /** Custom className */
  className?: string;
  /** Callback when asset is clicked */
  onAssetClick?: (asset: OptimizedAsset, index: number) => void;
  /** Enable lightbox */
  enableLightbox?: boolean;
}

const defaultConfig: GalleryConfig = {
  columns: 3,
  gap: '1rem',
  aspectRatio: '1/1',
  lightbox: true,
  pagination: true,
  itemsPerPage: 12,
};

export const AssetGallery: React.FC<AssetGalleryProps> = ({
  category,
  assets: providedAssets,
  config = {},
  searchQuery = '',
  filter,
  sort,
  title,
  showSearch = false,
  showCategoryFilter = false,
  className = '',
  onAssetClick,
  enableLightbox = true,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>(category || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryConfig = { ...defaultConfig, ...config };

  // Load assets by category if not provided
  const [categoryAssets, categoryLoading] = useAssetsByCategory(
    selectedCategory !== 'all' ? selectedCategory : 'content'
  );

  // Search assets if search query is provided
  const [searchAssets, searchLoading] = useAssetSearch(localSearchQuery);

  // Determine which assets to use
  const sourceAssets = useMemo(() => {
    if (providedAssets) return providedAssets;
    if (localSearchQuery.trim()) return searchAssets || [];
    if (selectedCategory === 'all') return categoryAssets || [];
    return categoryAssets || [];
  }, [providedAssets, localSearchQuery, searchAssets, selectedCategory, categoryAssets]);

  // Apply filters and sorting
  const filteredAssets = useMemo(() => {
    let filtered = sourceAssets;

    // Apply custom filter
    if (filter) {
      filtered = filtered.filter(filter);
    }

    // Apply sorting
    if (sort) {
      filtered = [...filtered].sort(sort);
    } else {
      // Default sort by filename
      filtered = [...filtered].sort((a, b) => a.filename.localeCompare(b.filename));
    }

    return filtered;
  }, [sourceAssets, filter, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / galleryConfig.itemsPerPage);
  const startIndex = (currentPage - 1) * galleryConfig.itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + galleryConfig.itemsPerPage);

  const isLoading = categoryLoading.isLoading || searchLoading.isLoading;

  const handleAssetClick = (asset: OptimizedAsset, index: number) => {
    if (onAssetClick) {
      onAssetClick(asset, index);
    } else if (enableLightbox) {
      setLightboxIndex(startIndex + index);
    }
  };

  const handlePrevious = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredAssets.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const categories: (AssetCategory | 'all')[] = ['all', 'logos', 'content', 'ui', 'hero', 'gallery'];

  return (
    <div className={`asset-gallery ${className}`}>
      {/* Header */}
      {(title || showSearch || showCategoryFilter) && (
        <div className="gallery-header mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            )}

            {/* Category Filter */}
            {showCategoryFilter && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as AssetCategory | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {isLoading ? (
              'Loading...'
            ) : (
              `${filteredAssets.length} asset${filteredAssets.length !== 1 ? 's' : ''} found`
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4" style={{
          gridTemplateColumns: `repeat(${galleryConfig.columns}, 1fr)`,
        }}>
          {Array.from({ length: galleryConfig.itemsPerPage }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 rounded-lg"
              style={{
                aspectRatio: galleryConfig.aspectRatio,
              }}
            />
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {!isLoading && paginatedAssets.length > 0 && (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${galleryConfig.columns}, 1fr)`,
            gap: galleryConfig.gap,
          }}
        >
          {paginatedAssets.map((asset, index) => (
            <div
              key={asset.originalUrl}
              className="gallery-item group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
              onClick={() => handleAssetClick(asset, index)}
              style={{
                aspectRatio: galleryConfig.aspectRatio,
              }}
            >
              <OptimizedImage
                asset={asset}
                alt={asset.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                lazy={true}
                quality={75}
              />

              {/* Overlay with asset info */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-end">
                <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium truncate">{asset.filename}</p>
                  {asset.alt && (
                    <p className="text-xs opacity-75 truncate">{asset.alt}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                    <span className="capitalize">{asset.category}</span>
                    {asset.width && asset.height && (
                      <span>{asset.width}×{asset.height}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && paginatedAssets.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-500">
            {localSearchQuery
              ? 'Try adjusting your search terms.'
              : 'No assets available in this category.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {galleryConfig.pagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Lightbox */}
      {enableLightbox && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <OptimizedImage
              asset={filteredAssets[lightboxIndex]}
              className="max-w-full max-h-full object-contain"
              priority={true}
              quality={95}
            />

            {/* Navigation */}
            <button
              onClick={handlePrevious}
              disabled={lightboxIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              disabled={lightboxIndex === filteredAssets.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Asset info */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-lg font-medium">{filteredAssets[lightboxIndex].filename}</p>
              {filteredAssets[lightboxIndex].alt && (
                <p className="text-sm opacity-75">{filteredAssets[lightboxIndex].alt}</p>
              )}
              <p className="text-xs opacity-50 mt-1">
                {lightboxIndex + 1} of {filteredAssets.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetGallery;