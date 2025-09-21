const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class EnhancedAssetDownloader {
  constructor() {
    this.baseAssetsDir = './src/assets';
    this.directories = {
      images: {
        logos: './src/assets/images/logos',
        content: './src/assets/images/content',
        ui: './src/assets/images/ui',
        hero: './src/assets/images/hero',
        gallery: './src/assets/images/gallery'
      },
      videos: './src/assets/videos',
      documents: './src/assets/documents',
      optimized: './src/assets/optimized'
    };
    this.downloadedCount = 0;
    this.errorCount = 0;
    this.skippedCount = 0;
    this.dataUrlCount = 0;
    this.assetMap = {};
    this.duplicates = new Map();
  }

  async init() {
    // Create all necessary directories
    await fs.mkdir(this.baseAssetsDir, { recursive: true });

    for (const [type, dirs] of Object.entries(this.directories)) {
      if (typeof dirs === 'string') {
        await fs.mkdir(dirs, { recursive: true });
      } else if (typeof dirs === 'object') {
        for (const dir of Object.values(dirs)) {
          await fs.mkdir(dir, { recursive: true });
        }
      }
    }

    console.log('📁 Created enhanced asset directory structure');
  }

  async loadAssetInventory() {
    try {
      const data = await fs.readFile('./assets-inventory.json', 'utf8');
      const inventory = JSON.parse(data);
      console.log(`📊 Found ${inventory.images.length} images in inventory`);
      return inventory.images;
    } catch (error) {
      console.error('❌ Error loading assets inventory:', error.message);
      return [];
    }
  }

  sanitizeFilename(url, originalFilename = '') {
    let filename;

    if (url.startsWith('data:')) {
      // Handle data URLs
      const mimeMatch = url.match(/data:([^;]+)/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const extension = mime.split('/')[1] || 'jpg';
      filename = originalFilename || `data-image-${Date.now()}.${extension}`;
    } else {
      const urlObj = new URL(url);
      filename = path.basename(urlObj.pathname);

      // Handle WordPress optimized URLs with parameters
      if (filename.includes('?')) {
        filename = filename.split('?')[0];
      }
    }

    // Sanitize filename
    filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Ensure we have an extension
    if (!path.extname(filename)) {
      filename += '.jpg';
    }

    return filename;
  }

  categorizeAsset(filename, context = '', alt = '') {
    const lowerFilename = filename.toLowerCase();
    const lowerContext = context.toLowerCase();
    const lowerAlt = alt.toLowerCase();

    // Logo detection
    if (lowerFilename.includes('logo') ||
        lowerContext.includes('logo') ||
        lowerAlt.includes('logo')) {
      return 'logos';
    }

    // UI elements
    if (lowerFilename.includes('icon') ||
        lowerFilename.includes('button') ||
        lowerFilename.includes('ui-') ||
        lowerContext.includes('navigation')) {
      return 'ui';
    }

    // Hero images
    if (lowerFilename.includes('hero') ||
        lowerFilename.includes('banner') ||
        lowerFilename.includes('carousel') ||
        lowerContext.includes('hero')) {
      return 'hero';
    }

    // Gallery images
    if (lowerContext.includes('gallery') ||
        lowerAlt.includes('gallery') ||
        filename.match(/\d{4}-\d{2}-\d{2}/)) {
      return 'gallery';
    }

    // Default to content
    return 'content';
  }

  async downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
      if (url.startsWith('data:')) {
        // Handle data URLs
        try {
          const base64Data = url.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          fs.writeFile(filepath, buffer).then(() => resolve(true)).catch(reject);
        } catch (error) {
          reject(new Error(`Invalid data URL: ${error.message}`));
        }
        return;
      }

      const protocol = url.startsWith('https:') ? https : http;

      protocol.get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = require('fs').createWriteStream(filepath);
          response.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close();
            resolve(true);
          });

          fileStream.on('error', (error) => {
            reject(error);
          });
        } else if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          this.downloadFile(redirectUrl, filepath).then(resolve).catch(reject);
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  generateUniqueFilename(filename, category) {
    const baseName = path.parse(filename).name;
    const extension = path.parse(filename).ext;

    if (!this.duplicates.has(baseName)) {
      this.duplicates.set(baseName, 1);
      return filename;
    }

    const count = this.duplicates.get(baseName);
    this.duplicates.set(baseName, count + 1);
    return `${baseName}-${count}${extension}`;
  }

  async downloadAssets() {
    const images = await this.loadAssetInventory();

    if (images.length === 0) {
      console.log('❌ No images found to download');
      return;
    }

    console.log(`🚀 Starting enhanced download of ${images.length} assets...`);

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const originalFilename = this.sanitizeFilename(image.src);
      const category = this.categorizeAsset(originalFilename, image.context, image.alt);
      const filename = this.generateUniqueFilename(originalFilename, category);
      const filepath = path.join(this.directories.images[category], filename);

      try {
        // Check if file already exists
        try {
          await fs.access(filepath);
          console.log(`⏭️  Skipping (exists): ${filename}`);
          this.skippedCount++;

          // Still add to asset map
          this.assetMap[image.src] = {
            localPath: path.relative('./src', filepath),
            filename: filename,
            alt: image.alt || '',
            width: image.width || null,
            height: image.height || null,
            category: category,
            context: image.context || '',
            title: image.title || ''
          };
          continue;
        } catch {
          // File doesn't exist, proceed with download
        }

        console.log(`📥 Downloading (${i + 1}/${images.length}): ${filename} [${category}]`);

        if (image.src.startsWith('data:')) {
          this.dataUrlCount++;
        }

        await this.downloadFile(image.src, filepath);

        // Add to asset map
        this.assetMap[image.src] = {
          localPath: path.relative('./src', filepath),
          filename: filename,
          alt: image.alt || '',
          width: image.width || null,
          height: image.height || null,
          category: category,
          context: image.context || '',
          title: image.title || ''
        };

        this.downloadedCount++;
        console.log(`✅ Downloaded: ${filename}`);

        // Respectful delay
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ Failed to download ${filename}: ${error.message}`);
        this.errorCount++;
      }
    }

    await this.saveAssetMap();
    this.printSummary();
  }

  async optimizeImages() {
    console.log('\n🎨 Starting image optimization...');

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const categories = Object.keys(this.directories.images);

    for (const category of categories) {
      const categoryDir = this.directories.images[category];

      try {
        const files = await fs.readdir(categoryDir);
        const imageFiles = files.filter(file =>
          imageExtensions.includes(path.extname(file).toLowerCase())
        );

        for (const file of imageFiles) {
          const inputPath = path.join(categoryDir, file);
          const optimizedDir = path.join(this.directories.optimized, category);
          await fs.mkdir(optimizedDir, { recursive: true });
          const outputPath = path.join(optimizedDir, file);

          try {
            // Check if ImageMagick is available
            await execAsync('convert -version');

            // Optimize image with ImageMagick
            await execAsync(`convert "${inputPath}" -quality 85 -resize '1920x1920>' "${outputPath}"`);
            console.log(`🎨 Optimized: ${file}`);

          } catch (error) {
            // ImageMagick not available, copy original
            await fs.copyFile(inputPath, outputPath);
            console.log(`📋 Copied (no optimization): ${file}`);
          }
        }

      } catch (error) {
        console.error(`❌ Error processing ${category}:`, error.message);
      }
    }
  }

  async saveAssetMap() {
    const enhancedAssetMap = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalAssets: Object.keys(this.assetMap).length,
        categories: Object.keys(this.directories.images),
        downloadStats: {
          downloaded: this.downloadedCount,
          skipped: this.skippedCount,
          errors: this.errorCount,
          dataUrls: this.dataUrlCount
        }
      },
      assets: this.assetMap,
      categorizedAssets: this.getCategorizedAssets()
    };

    await fs.writeFile('./enhanced-asset-map.json', JSON.stringify(enhancedAssetMap, null, 2));
    console.log('📋 Created enhanced-asset-map.json');
  }

  getCategorizedAssets() {
    const categorized = {};

    for (const [url, asset] of Object.entries(this.assetMap)) {
      if (!categorized[asset.category]) {
        categorized[asset.category] = [];
      }
      categorized[asset.category].push({
        url,
        ...asset
      });
    }

    return categorized;
  }

  printSummary() {
    console.log('\n📊 Enhanced Download Summary:');
    console.log(`✅ Downloaded: ${this.downloadedCount} files`);
    console.log(`⏭️  Skipped: ${this.skippedCount} files`);
    console.log(`❌ Errors: ${this.errorCount} files`);
    console.log(`🔗 Data URLs: ${this.dataUrlCount} files`);
    console.log(`📁 Assets organized in: ${this.baseAssetsDir}`);
    console.log(`📂 Categories: ${Object.keys(this.directories.images).join(', ')}`);
  }

  async run() {
    try {
      await this.init();
      await this.downloadAssets();
      await this.optimizeImages();
      console.log('\n🎉 Enhanced asset download and optimization completed!');
    } catch (error) {
      console.error('💥 Enhanced download failed:', error.message);
    }
  }
}

// CLI interface
if (require.main === module) {
  const downloader = new EnhancedAssetDownloader();

  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
Enhanced Bear Adventures Asset Downloader

Usage: node enhanced-asset-downloader.cjs [options]

Options:
  --help          Show this help message
  --optimize-only Only optimize existing images
  --download-only Only download, skip optimization

Features:
  - Handles data URLs properly
  - Categorizes assets (logos, content, ui, hero, gallery)
  - Optimizes images with ImageMagick (if available)
  - Creates comprehensive asset mapping
  - Generates TypeScript interfaces

Example:
  node enhanced-asset-downloader.cjs        # Full download and optimization
  node enhanced-asset-downloader.cjs --optimize-only  # Optimize existing only
    `);
    process.exit(0);
  }

  if (args.includes('--optimize-only')) {
    downloader.init().then(() => downloader.optimizeImages());
  } else if (args.includes('--download-only')) {
    downloader.init().then(() => downloader.downloadAssets());
  } else {
    downloader.run();
  }
}

module.exports = EnhancedAssetDownloader;