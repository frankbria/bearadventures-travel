# 21st Century MCP Configuration

This document outlines the configuration for using the 21st century MCP UI component server with the Bear Adventures Travel project.

## Project Context

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Target**: Travel/tourism website components
- **Migration**: From WordPress to React

## Component Requirements

### Design System
- Primary colors: Blue palette (#3b82f6, #2563eb, #1d4ed8)
- Secondary colors: Gray palette (#64748b, #475569, #334155)
- Font: Inter (already loaded via Google Fonts)
- Responsive design: Mobile-first approach

### Accessibility Standards
- WCAG 2.1 AA compliance
- Proper semantic HTML
- Focus management
- Screen reader support

### Travel Industry Components Needed
1. **Navigation Components**
   - Main navigation with travel-focused menu items
   - Breadcrumb navigation for destination pages
   - Mobile-responsive hamburger menu

2. **Content Display**
   - Travel package/tour cards with images, pricing, duration
   - Destination showcase grids
   - Blog post previews with travel imagery
   - Photo galleries with lightbox functionality

3. **Interactive Elements**
   - Search forms for destinations/packages
   - Booking inquiry forms
   - Newsletter signup
   - Contact forms with travel-specific fields

4. **WordPress Migration Components**
   - Content renderers for migrated WordPress posts
   - Gallery components for WordPress media
   - Legacy shortcode replacements

## Usage Examples

```bash
# Generate a travel package card
/ui create a travel package card with image, title, price, duration, and book now button

# Create a destination search form
/21 build a destination search form with location autocomplete and date picker

# Generate a photo gallery
/ui responsive photo gallery with thumbnail grid and lightbox modal
```

## File Locations
- All generated components should be placed in `src/components/`
- Use TypeScript (.tsx) for all components
- Include prop type definitions
- Export components from component files and update index files as needed