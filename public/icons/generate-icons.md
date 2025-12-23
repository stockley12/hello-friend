# PWA Icon Generation Guide

To generate the PWA icons, you can use your logo and resize it to the following dimensions:

## Required Icon Sizes
- `icon-72.png` - 72x72 pixels
- `icon-96.png` - 96x96 pixels  
- `icon-128.png` - 128x128 pixels
- `icon-144.png` - 144x144 pixels
- `icon-152.png` - 152x152 pixels
- `icon-192.png` - 192x192 pixels
- `icon-384.png` - 384x384 pixels
- `icon-512.png` - 512x512 pixels

## Splash Screen Sizes (for iOS)
- `splash/splash-640x1136.png` - 640x1136 pixels (iPhone 5/SE)
- `splash/splash-750x1334.png` - 750x1334 pixels (iPhone 6/7/8)
- `splash/splash-1242x2208.png` - 1242x2208 pixels (iPhone 6/7/8 Plus)
- `splash/splash-1125x2436.png` - 1125x2436 pixels (iPhone X/XS)

## Online Tools for Generation
1. [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
2. [Real Favicon Generator](https://realfavicongenerator.net/)
3. [App Icon Generator](https://appicon.co/)

## Command Line (using ImageMagick)
If you have ImageMagick installed:

```bash
# From the public/icons directory
convert logo.png -resize 72x72 icon-72.png
convert logo.png -resize 96x96 icon-96.png
convert logo.png -resize 128x128 icon-128.png
convert logo.png -resize 144x144 icon-144.png
convert logo.png -resize 152x152 icon-152.png
convert logo.png -resize 192x192 icon-192.png
convert logo.png -resize 384x384 icon-384.png
convert logo.png -resize 512x512 icon-512.png
```

For splash screens, create images with your logo centered on a dark background (#0d0a07) with the golden accent color (#facc15).



