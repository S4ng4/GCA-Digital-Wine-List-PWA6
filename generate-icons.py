#!/usr/bin/env python3
"""
PWA Icon Generator for Gran Caffè L'Aquila Wine List
Generates all required icon sizes from the logo
"""

from PIL import Image, ImageDraw
import os

# Configuration
BACKGROUND_COLOR = (10, 10, 10, 255)  # #0E0E0E (dark background)
OUTPUT_DIR = "image"
SOURCE_LOGO = "image/gcaLogo.png"

# Required PWA icon sizes
ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

def create_pwa_icons():
    # Load the original logo
    print(f"Loading logo from {SOURCE_LOGO}...")
    original = Image.open(SOURCE_LOGO).convert("RGBA")
    orig_width, orig_height = original.size
    print(f"Original size: {orig_width}x{orig_height}")
    
    # Crop to the central heart area (approximately center 40% of the image)
    # The heart is roughly in the center of the horizontal logo
    center_x = orig_width // 2
    center_y = orig_height // 2
    
    # Calculate crop box - focus on the central heart
    # The heart takes up roughly the middle third of the image
    crop_size = min(orig_height, orig_width * 0.4)  # Square crop around center
    half_crop = int(crop_size // 2)
    
    # Adjust crop to be more centered on the heart
    left = center_x - half_crop
    top = int(center_y - half_crop * 0.9)  # Slightly higher to center the heart
    right = center_x + half_crop
    bottom = int(center_y + half_crop * 1.1)
    
    # Make it square
    crop_width = right - left
    crop_height = bottom - top
    if crop_height > crop_width:
        diff = crop_height - crop_width
        left -= diff // 2
        right += diff // 2
    elif crop_width > crop_height:
        diff = crop_width - crop_height
        top -= diff // 2
        bottom += diff // 2
    
    # Ensure bounds are valid
    left = max(0, left)
    top = max(0, top)
    right = min(orig_width, right)
    bottom = min(orig_height, bottom)
    
    print(f"Cropping to: ({left}, {top}, {right}, {bottom})")
    cropped = original.crop((left, top, right, bottom))
    
    # Make it exactly square by adding padding if needed
    cropped_w, cropped_h = cropped.size
    max_dim = max(cropped_w, cropped_h)
    
    # Create a square image with the logo centered
    square = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
    paste_x = (max_dim - cropped_w) // 2
    paste_y = (max_dim - cropped_h) // 2
    square.paste(cropped, (paste_x, paste_y), cropped)
    
    # Generate each icon size
    for size in ICON_SIZES:
        print(f"Generating {size}x{size} icon...")
        
        # Create icon with dark background
        icon = Image.new("RGBA", (size, size), BACKGROUND_COLOR)
        
        # Add slight padding (10% on each side = 80% logo size)
        padding_percent = 0.10
        logo_size = int(size * (1 - padding_percent * 2))
        
        # Resize the square logo
        resized_logo = square.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Calculate position to center
        offset = (size - logo_size) // 2
        
        # Paste logo onto icon (with transparency)
        icon.paste(resized_logo, (offset, offset), resized_logo)
        
        # Convert to RGB for PNG (remove alpha for better compatibility)
        # But keep alpha for the icon itself
        icon_rgb = Image.new("RGB", (size, size), BACKGROUND_COLOR[:3])
        icon_rgb.paste(icon, (0, 0), icon)
        
        # Save
        output_path = os.path.join(OUTPUT_DIR, f"icon-{size}x{size}.png")
        icon_rgb.save(output_path, "PNG", optimize=True)
        print(f"  ✓ Saved: {output_path}")
    
    print("\n✅ All PWA icons generated successfully!")
    print(f"\nIcons created in '{OUTPUT_DIR}/' folder:")
    for size in ICON_SIZES:
        print(f"  • icon-{size}x{size}.png")

if __name__ == "__main__":
    create_pwa_icons()
