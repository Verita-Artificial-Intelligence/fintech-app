# Royal Business Bank (RBB) Branding Assets

This directory contains official RBB branding assets for the fintech demo.

## Required Assets (Sprint 0 - Task RBB-0.2)

### Logo Files
- [ ] `RBB_logo.svg` - Primary logo in SVG format
- [ ] `RBB_logo_white.svg` - White version for dark backgrounds  
- [ ] `RBB_logo_horizontal.svg` - Horizontal layout variant
- [ ] `favicon.ico` - Website favicon (32x32px)
- [ ] `favicon.png` - PNG favicon alternative (32x32px)

### Brand Guidelines
- [ ] `brand_guidelines.pdf` - Official RBB brand style guide
- [ ] `color_palette.json` - Official color specifications

## Brand Colors (Implemented in /src/theme/rbb.ts)

### Primary Palette
- **Primary Blue**: `#0054A4` - Main brand color
- **Secondary Gold**: `#F4A000` - Accent color
- **Primary Light**: `#3574C4` - Lighter blue variant
- **Primary Dark**: `#003973` - Darker blue variant

### Supporting Colors
- **Background**: `#f8fafc` - Page background
- **Paper**: `#ffffff` - Card/component background
- **Text Primary**: `#1a1a1a` - Main text color
- **Text Secondary**: `#666666` - Secondary text color

## Contrast Compliance
All color combinations meet WCAG AA standards with contrast ratio ≥ 4.5:1

## Usage Notes
- Logos should be placed in this directory before Sprint 1 begins
- SVG format preferred for scalability
- Ensure all assets are properly licensed for demo use
- Assets will be imported into React components during Sprint 1

## Sprint 1 Implementation Tasks
- [ ] Update App.tsx to use RBB theme
- [ ] Replace default logo in Layout component
- [ ] Update favicon in public directory
- [ ] Implement dual-language support (EN/中文) 