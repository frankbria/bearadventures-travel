/**
 * Advanced Image Optimization Script for Bear Adventures Travel
 * Uses Sharp for high-quality image optimization and format conversion
 */

const fs = require('fs').promises;
const path = require('path');

class ImageOptimizer {
  constructor() {
    this.inputDir = './src/assets/images';
    this.outputDir = './src/assets/optimized';
    this.sharp = null;
    this.stats = {
      processed: 0,
      optimized: 0,
      errors: 0,
      totalSizeBefore: 0,
      totalSizeAfter: 0,
      formats: {
        webp: 0,
        avif: 0,
        jpeg: 0,
        png: 0,
      },
    };
  }

  async init() {
    try {
      this.sharp = require('sharp');
      console.log('✅ Sharp library loaded successfully');
    } catch (error) {
      console.log('⚠️  Sharp not installed, using fallback optimization');
      console.log('📦 Install Sharp for better optimization: npm install sharp');
      return false;
    }

    await fs.mkdir(this.outputDir, { recursive: true });
    return true;
  }

  async optimizeImages() {
    const sharpAvailable = await this.init();

    if (!sharpAvailable) {
      await this.fallbackOptimization();
      return;
    }

    console.log('🎨 Starting advanced image optimization with Sharp...');

    const categories = ['logos', 'content', 'ui', 'hero', 'gallery'];

    for (const category of categories) {
      await this.optimizeCategory(category);
    }

    this.printOptimizationStats();
  }

  async optimizeCategory(category) {
    const inputPath = path.join(this.inputDir, category);
    const outputPath = path.join(this.outputDir, category);

    try {
      await fs.mkdir(outputPath, { recursive: true });
      const files = await fs.readdir(inputPath);
      const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );

      console.log(`\n📂 Processing ${category}: ${imageFiles.length} images`);

      for (const file of imageFiles) {
        await this.optimizeImage(
          path.join(inputPath, file),
          outputPath,
          file,
          category
        );
      }
    } catch (error) {
      console.error(`❌ Error processing category ${category}:`, error.message);
    }
  }

  async optimizeImage(inputPath, outputDir, filename, category) {
    try {
      const originalStats = await fs.stat(inputPath);
      this.stats.totalSizeBefore += originalStats.size;
      this.stats.processed++;

      const basename = path.parse(filename).name;
      const originalExt = path.parse(filename).ext.toLowerCase();

      // Configuration based on category
      const config = this.getOptimizationConfig(category);

      // Generate multiple optimized formats
      const formats = ['webp', 'jpeg'];
      if (config.generateAvif) {
        formats.unshift('avif');
      }

      let bestFormat = null;
      let smallestSize = Infinity;

      for (const format of formats) {
        try {
          const outputPath = path.join(outputDir, `${basename}.${format}`);
          const optimizedSize = await this.processImageFormat(
            inputPath,
            outputPath,
            format,
            config
          );

          if (optimizedSize < smallestSize) {
            smallestSize = optimizedSize;
            bestFormat = format;
          }

          this.stats.formats[format]++;
          this.stats.totalSizeAfter += optimizedSize;
        } catch (formatError) {
          console.warn(`⚠️  Failed to create ${format} for ${filename}: ${formatError.message}`);
        }
      }

      // Also keep an optimized version of the original format if it's PNG
      if (originalExt === '.png' && !formats.includes('png')) {
        const outputPath = path.join(outputDir, filename);
        const optimizedSize = await this.processImageFormat(
          inputPath,
          outputPath,
          'png',
          config
        );
        this.stats.formats.png++;
        this.stats.totalSizeAfter += optimizedSize;
      }

      const compressionRatio = ((originalStats.size - smallestSize) / originalStats.size * 100);
      console.log(`✅ ${filename} → ${bestFormat} (${compressionRatio.toFixed(1)}% smaller)`);

      this.stats.optimized++;
    } catch (error) {
      console.error(`❌ Error optimizing ${filename}:`, error.message);
      this.stats.errors++;
    }
  }

  async processImageFormat(inputPath, outputPath, format, config) {
    let pipeline = this.sharp(inputPath);

    // Resize if needed
    if (config.maxWidth || config.maxHeight) {
      pipeline = pipeline.resize(config.maxWidth, config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Apply format-specific optimizations
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({
          quality: config.quality,
          effort: 6,
          lossless: config.lossless,
        });
        break;
      case 'avif':
        pipeline = pipeline.avif({
          quality: config.quality,
          effort: 9,
          lossless: config.lossless,
        });
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg({
          quality: config.quality,
          progressive: true,
          mozjpeg: true,
        });
        break;
      case 'png':
        pipeline = pipeline.png({
          quality: config.quality,
          compressionLevel: 9,
          progressive: true,
        });
        break;
    }

    await pipeline.toFile(outputPath);
    const stats = await fs.stat(outputPath);
    return stats.size;
  }

  getOptimizationConfig(category) {
    const configs = {
      logos: {
        quality: 90,
        maxWidth: 400,
        maxHeight: 400,
        lossless: false,
        generateAvif: true,
      },
      hero: {
        quality: 85,
        maxWidth: 1920,
        maxHeight: 1080,
        lossless: false,
        generateAvif: true,
      },
      content: {
        quality: 80,
        maxWidth: 1200,
        maxHeight: 1200,
        lossless: false,
        generateAvif: false,
      },
      ui: {
        quality: 90,
        maxWidth: 200,
        maxHeight: 200,
        lossless: false,
        generateAvif: false,
      },
      gallery: {
        quality: 85,
        maxWidth: 800,
        maxHeight: 800,
        lossless: false,
        generateAvif: true,
      },
    };

    return configs[category] || configs.content;
  }

  async fallbackOptimization() {
    console.log('📋 Using fallback optimization (copying files)...');

    const categories = ['logos', 'content', 'ui', 'hero', 'gallery'];

    for (const category of categories) {
      const inputPath = path.join(this.inputDir, category);
      const outputPath = path.join(this.outputDir, category);

      try {
        await fs.mkdir(outputPath, { recursive: true });
        const files = await fs.readdir(inputPath);

        for (const file of files) {
          const inputFile = path.join(inputPath, file);
          const outputFile = path.join(outputPath, file);

          await fs.copyFile(inputFile, outputFile);
          console.log(`📋 Copied: ${file}`);
          this.stats.processed++;
        }
      } catch (error) {
        console.error(`❌ Error copying ${category}:`, error.message);
      }
    }
  }

  printOptimizationStats() {
    const totalSavedBytes = this.stats.totalSizeBefore - this.stats.totalSizeAfter;
    const compressionRatio = this.stats.totalSizeBefore > 0
      ? (totalSavedBytes / this.stats.totalSizeBefore * 100)
      : 0;

    console.log('\n📊 Optimization Summary:');
    console.log(`✅ Processed: ${this.stats.processed} images`);
    console.log(`🎨 Optimized: ${this.stats.optimized} images`);
    console.log(`❌ Errors: ${this.stats.errors} images`);
    console.log(`💾 Size reduction: ${this.formatBytes(totalSavedBytes)} (${compressionRatio.toFixed(1)}%)`);
    console.log(`📁 Total size: ${this.formatBytes(this.stats.totalSizeBefore)} → ${this.formatBytes(this.stats.totalSizeAfter)}`);

    console.log('\n📈 Generated formats:');
    Object.entries(this.stats.formats).forEach(([format, count]) => {
      if (count > 0) {
        console.log(`  ${format.toUpperCase()}: ${count} files`);
      }
    });
  }

  formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  async generateResponsiveVariants() {
    if (!this.sharp) {
      console.log('⚠️  Sharp not available, skipping responsive variants');
      return;
    }

    console.log('\n📱 Generating responsive image variants...');

    const breakpoints = [400, 800, 1200, 1600];
    const categories = ['hero', 'gallery', 'content'];

    for (const category of categories) {
      const inputPath = path.join(this.outputDir, category);
      const responsiveDir = path.join(this.outputDir, 'responsive', category);

      try {
        await fs.mkdir(responsiveDir, { recursive: true });
        const files = await fs.readdir(inputPath);
        const imageFiles = files.filter(file => /\.(webp|avif|jpg|jpeg)$/i.test(file));

        for (const file of imageFiles) {
          for (const width of breakpoints) {
            await this.createResponsiveVariant(
              path.join(inputPath, file),
              responsiveDir,
              file,
              width
            );
          }
        }
      } catch (error) {
        console.error(`❌ Error creating responsive variants for ${category}:`, error.message);
      }
    }
  }

  async createResponsiveVariant(inputPath, outputDir, filename, width) {
    try {
      const parsed = path.parse(filename);
      const outputPath = path.join(outputDir, `${parsed.name}-${width}w${parsed.ext}`);

      await this.sharp(inputPath)
        .resize(width, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFile(outputPath);

      console.log(`📱 Created: ${path.basename(outputPath)}`);
    } catch (error) {
      console.warn(`⚠️  Failed to create ${width}w variant of ${filename}: ${error.message}`);
    }
  }

  async run() {
    try {
      await this.optimizeImages();
      await this.generateResponsiveVariants();
      console.log('\n🎉 Image optimization completed!');
    } catch (error) {
      console.error('💥 Optimization failed:', error.message);
    }
  }
}

// CLI interface
if (require.main === module) {
  const optimizer = new ImageOptimizer();
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
Advanced Image Optimizer for Bear Adventures Travel

Usage: node optimize-images.cjs [options]

Options:
  --help              Show this help message
  --responsive-only   Generate only responsive variants
  --install-sharp     Show instructions for installing Sharp

Features:
  - WebP and AVIF format conversion
  - Quality optimization by category
  - Responsive image generation
  - Comprehensive compression statistics

Examples:
  node optimize-images.cjs                    # Full optimization
  node optimize-images.cjs --responsive-only  # Only responsive variants
    `);
    process.exit(0);
  }

  if (args.includes('--install-sharp')) {
    console.log(`
📦 Installing Sharp for Better Image Optimization:

npm install sharp

Or for development only:
npm install --save-dev sharp

Sharp provides:
- Better compression (30-50% smaller files)
- WebP and AVIF format support
- Responsive image generation
- Faster processing
    `);
    process.exit(0);
  }

  if (args.includes('--responsive-only')) {
    optimizer.init().then(() => optimizer.generateResponsiveVariants());
  } else {
    optimizer.run();
  }
}

module.exports = ImageOptimizer;