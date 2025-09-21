# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bear Adventures Travel is a port of the existing WordPress site (https://bearadventures.travel) to a modern React/TypeScript architecture. The project involves migrating content and assets to a new ClawCloud server deployment.

**Repository**: https://github.com/frankbria/bearadventures-travel (private)

## Migration Phases

1. **Content Extraction** - Extract content from WordPress site
2. **Asset Management** - Download and organize media assets
3. **React Architecture Generation** - Build component structure using 21st century MCP
4. **Content Integration** - Import extracted content into React components
5. **Deployment** - Deploy to ClawCloud server

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Components**: 21st century MCP UI component server
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Deployment**: ClawCloud

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # React components (generated via 21st MCP)
├── pages/         # Page components
├── assets/        # Static assets from WordPress migration
├── content/       # Extracted WordPress content (JSON/MD)
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── styles/        # Global styles and Tailwind config
```

## 21st Century MCP Integration

This project leverages the Magic MCP server for UI component generation:
- Use `/ui` or `/21` commands for component creation
- Components follow modern React patterns with accessibility
- Tailwind CSS for consistent styling
- Responsive design by default

## WordPress Migration Notes

- Original site: https://bearadventures.travel
- Content will be extracted and stored in `/src/content/`
- Assets will be optimized and stored in `/src/assets/`
- Maintain SEO structure and URL patterns where possible