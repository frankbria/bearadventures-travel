const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

class AssetDownloader {
  constructor() {
    this.assetsDir = './src/assets/images';
    this.downloadedCount = 0;
    this.errorCount = 0;
    this.skippedCount = 0;
  }

  async init() {
    await fs.mkdir(this.assetsDir, { recursive: true });
    console.log(`📁 Created assets directory: ${this.assetsDir}`);
  }

  async loadAssetInventory() {
    try {
      const data = await fs.readFile('./assets-inventory.json', 'utf8');
      const inventory = JSON.parse(data);
      console.log(`📊 Found ${inventory.images.length} images to download`);
      return inventory.images;
    } catch (error) {
      console.error('❌ Error loading assets inventory:', error.message);
      return [];
    }
  }

  sanitizeFilename(url) {
    // Extract filename from URL and sanitize it
    const urlObj = new URL(url);
    let filename = path.basename(urlObj.pathname);

    // Handle WordPress optimized URLs
    if (filename.includes('?')) {
      filename = filename.split('?')[0];
    }

    // Sanitize filename
    filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Ensure we have an extension
    if (!path.extname(filename)) {
      filename += '.jpg'; // Default extension
    }

    return filename;
  }

  async downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
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
          // Handle redirects
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

  async downloadAssets() {
    const images = await this.loadAssetInventory();

    if (images.length === 0) {
      console.log('❌ No images found to download');
      return;
    }

    console.log(`🚀 Starting download of ${images.length} assets...`);

    // Create subdirectories for organization
    await fs.mkdir(path.join(this.assetsDir, 'logos'), { recursive: true });
    await fs.mkdir(path.join(this.assetsDir, 'content'), { recursive: true });
    await fs.mkdir(path.join(this.assetsDir, 'ui'), { recursive: true });

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const filename = this.sanitizeFilename(image.src);

      // Organize files by type
      let subdir = 'content';
      if (filename.includes('logo') || filename.includes('Logo')) {
        subdir = 'logos';
      } else if (filename.includes('icon') || filename.includes('button')) {
        subdir = 'ui';
      }

      const filepath = path.join(this.assetsDir, subdir, filename);

      try {
        // Check if file already exists
        try {
          await fs.access(filepath);
          console.log(`⏭️  Skipping (exists): ${filename}`);
          this.skippedCount++;
          continue;
        } catch {
          // File doesn't exist, proceed with download
        }

        console.log(`📥 Downloading (${i + 1}/${images.length}): ${filename}`);
        await this.downloadFile(image.src, filepath);

        this.downloadedCount++;
        console.log(`✅ Downloaded: ${filename}`);

        // Add a small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Failed to download ${filename}: ${error.message}`);
        this.errorCount++;
      }
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 Download Summary:');
    console.log(`✅ Downloaded: ${this.downloadedCount} files`);
    console.log(`⏭️  Skipped: ${this.skippedCount} files`);
    console.log(`❌ Errors: ${this.errorCount} files`);
    console.log(`📁 Assets location: ${this.assetsDir}`);
  }

  async createAssetMap() {
    const images = await this.loadAssetInventory();
    const assetMap = {};

    for (const image of images) {
      const filename = this.sanitizeFilename(image.src);
      let subdir = 'content';

      if (filename.includes('logo') || filename.includes('Logo')) {
        subdir = 'logos';
      } else if (filename.includes('icon') || filename.includes('button')) {
        subdir = 'ui';
      }

      assetMap[image.src] = {
        localPath: `./src/assets/images/${subdir}/${filename}`,
        filename: filename,
        alt: image.alt,
        width: image.width,
        height: image.height,
        category: subdir
      };
    }

    await fs.writeFile('./asset-map.json', JSON.stringify(assetMap, null, 2));
    console.log('📋 Created asset-map.json for React imports');
  }

  async run() {
    try {
      await this.init();
      await this.downloadAssets();
      await this.createAssetMap();
      console.log('\n🎉 Asset download completed!');
    } catch (error) {
      console.error('💥 Download failed:', error.message);
    }
  }
}

// Usage example and CLI interface
if (require.main === module) {
  const downloader = new AssetDownloader();

  // Handle command line arguments
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
Bear Adventures Asset Downloader

Usage: node download-assets.cjs [options]

Options:
  --help          Show this help message
  --map-only      Only create asset map, don't download
  --force         Re-download existing files

Example:
  node download-assets.cjs        # Download all assets
  node download-assets.cjs --map-only  # Create mapping only
    `);
    process.exit(0);
  }

  if (args.includes('--map-only')) {
    downloader.init().then(() => downloader.createAssetMap());
  } else {
    downloader.run();
  }
}

module.exports = AssetDownloader;