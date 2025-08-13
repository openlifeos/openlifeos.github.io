#!/usr/bin/env python3
"""
Generate PWA icons from SVG logo
"""

import os
from PIL import Image, ImageDraw, ImageFont
import cairosvg
from io import BytesIO

# Icon sizes needed for PWA
ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
SHORTCUT_ICONS = ['demo-icon', 'docs-icon']

# Colors based on the brand
PRIMARY_COLOR = '#667eea'
SECONDARY_COLOR = '#764ba2'
BG_COLOR = '#0a0a0f'

def create_gradient_icon(size):
    """Create a gradient icon with OpenLifeOS branding"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Create gradient background
    for i in range(size):
        # Gradient from PRIMARY_COLOR to SECONDARY_COLOR
        ratio = i / size
        r1, g1, b1 = int(PRIMARY_COLOR[1:3], 16), int(PRIMARY_COLOR[3:5], 16), int(PRIMARY_COLOR[5:7], 16)
        r2, g2, b2 = int(SECONDARY_COLOR[1:3], 16), int(SECONDARY_COLOR[3:5], 16), int(SECONDARY_COLOR[5:7], 16)
        
        r = int(r1 + (r2 - r1) * ratio)
        g = int(g1 + (g2 - g1) * ratio)
        b = int(b1 + (b2 - b1) * ratio)
        
        draw.rectangle([(0, i), (size, i+1)], fill=(r, g, b, 255))
    
    # Add rounded corners
    corner_radius = size // 8
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], corner_radius, fill=255)
    
    # Apply mask for rounded corners
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)
    
    # Add center symbol (simplified neural network design)
    center_x, center_y = size // 2, size // 2
    symbol_size = size // 3
    
    # Draw interconnected nodes
    node_positions = [
        (center_x, center_y - symbol_size // 2),
        (center_x - symbol_size // 2, center_y),
        (center_x + symbol_size // 2, center_y),
        (center_x, center_y + symbol_size // 2)
    ]
    
    # Draw connections
    for i, pos1 in enumerate(node_positions):
        for pos2 in node_positions[i+1:]:
            draw.line([pos1, pos2], fill=(255, 255, 255, 100), width=max(1, size // 100))
    
    # Draw nodes
    node_size = max(4, size // 20)
    for pos in node_positions:
        draw.ellipse(
            [pos[0] - node_size, pos[1] - node_size, 
             pos[0] + node_size, pos[1] + node_size],
            fill=(255, 255, 255, 255),
            outline=(255, 255, 255, 255)
        )
    
    # Add center core
    core_size = max(6, size // 15)
    draw.ellipse(
        [center_x - core_size, center_y - core_size,
         center_x + core_size, center_y + core_size],
        fill=(255, 255, 255, 255),
        outline=(255, 255, 255, 255)
    )
    
    return output

def create_text_icon(text, size, bg_color):
    """Create an icon with text"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background with gradient
    for i in range(size):
        ratio = i / size
        if bg_color == 'demo':
            # Green gradient for demo
            r = int(68 + (0 - 68) * ratio)
            g = int(255 - (255 - 136) * ratio)
            b = int(68 + (136 - 68) * ratio)
        else:  # docs
            # Blue gradient for docs
            r = int(68 + (136 - 68) * ratio)
            g = int(136 + (68 - 136) * ratio)
            b = int(255 - (255 - 255) * ratio)
        
        draw.rectangle([(0, i), (size, i+1)], fill=(r, g, b, 255))
    
    # Add rounded corners
    corner_radius = size // 8
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], corner_radius, fill=255)
    
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)
    
    # Add text
    try:
        # Try to use a nice font if available
        font_size = size // 3
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', font_size)
    except:
        font = ImageFont.load_default()
    
    # Get text size
    text = text.upper()[:1]  # First letter only
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center the text
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    
    return output

def generate_icons():
    """Generate all required PWA icons"""
    icons_dir = '/Users/robert/workspace/11-smart-wearable/openlifeos-repos/openlifeos.github.io/assets/icons'
    
    print("Generating PWA icons...")
    
    # Generate main app icons
    for size in ICON_SIZES:
        icon = create_gradient_icon(size)
        icon_path = os.path.join(icons_dir, f'icon-{size}x{size}.png')
        icon.save(icon_path, 'PNG', optimize=True)
        print(f"✓ Created {icon_path}")
    
    # Generate shortcut icons
    icon = create_text_icon('D', 96, 'demo')
    icon.save(os.path.join(icons_dir, 'demo-icon.png'), 'PNG', optimize=True)
    print(f"✓ Created demo-icon.png")
    
    icon = create_text_icon('D', 96, 'docs')
    icon.save(os.path.join(icons_dir, 'docs-icon.png'), 'PNG', optimize=True)
    print(f"✓ Created docs-icon.png")
    
    print("\n✅ All PWA icons generated successfully!")

def generate_screenshots():
    """Generate placeholder screenshots"""
    screenshots_dir = '/Users/robert/workspace/11-smart-wearable/openlifeos-repos/openlifeos.github.io/assets/screenshots'
    
    print("\nGenerating placeholder screenshots...")
    
    # Desktop screenshot (1920x1080)
    img = Image.new('RGBA', (1920, 1080), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Add gradient overlay
    for i in range(1080):
        ratio = i / 1080
        r1, g1, b1 = int(BG_COLOR[1:3], 16), int(BG_COLOR[3:5], 16), int(BG_COLOR[5:7], 16)
        r2, g2, b2 = int(PRIMARY_COLOR[1:3], 16), int(PRIMARY_COLOR[3:5], 16), int(PRIMARY_COLOR[5:7], 16)
        
        r = int(r1 + (r2 - r1) * ratio * 0.3)
        g = int(g1 + (g2 - g1) * ratio * 0.3)
        b = int(b1 + (b2 - b1) * ratio * 0.3)
        
        draw.rectangle([(0, i), (1920, i+1)], fill=(r, g, b, 255))
    
    # Add text
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 72)
        font_small = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 36)
    except:
        font = ImageFont.load_default()
        font_small = font
    
    draw.text((960, 400), "OpenLifeOS", fill=(255, 255, 255, 255), font=font, anchor="mm")
    draw.text((960, 500), "The Linux of Personal AI", fill=(200, 200, 200, 255), font=font_small, anchor="mm")
    
    img.save(os.path.join(screenshots_dir, 'desktop-home.png'), 'PNG', optimize=True)
    print(f"✓ Created desktop-home.png")
    
    # Demo screenshot
    img_demo = img.copy()
    draw = ImageDraw.Draw(img_demo)
    draw.text((960, 650), "Ultimate AI Experience", fill=(102, 126, 234, 255), font=font_small, anchor="mm")
    img_demo.save(os.path.join(screenshots_dir, 'demo-ultimate.png'), 'PNG', optimize=True)
    print(f"✓ Created demo-ultimate.png")
    
    # Mobile screenshot (750x1334)
    img = Image.new('RGBA', (750, 1334), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Add gradient
    for i in range(1334):
        ratio = i / 1334
        r1, g1, b1 = int(BG_COLOR[1:3], 16), int(BG_COLOR[3:5], 16), int(BG_COLOR[5:7], 16)
        r2, g2, b2 = int(SECONDARY_COLOR[1:3], 16), int(SECONDARY_COLOR[3:5], 16), int(SECONDARY_COLOR[5:7], 16)
        
        r = int(r1 + (r2 - r1) * ratio * 0.3)
        g = int(g1 + (g2 - g1) * ratio * 0.3)
        b = int(b1 + (b2 - b1) * ratio * 0.3)
        
        draw.rectangle([(0, i), (750, i+1)], fill=(r, g, b, 255))
    
    try:
        font_mobile = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 48)
        font_mobile_small = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 24)
    except:
        font_mobile = ImageFont.load_default()
        font_mobile_small = font_mobile
    
    draw.text((375, 500), "OpenLifeOS", fill=(255, 255, 255, 255), font=font_mobile, anchor="mm")
    draw.text((375, 580), "Mobile Experience", fill=(200, 200, 200, 255), font=font_mobile_small, anchor="mm")
    
    img.save(os.path.join(screenshots_dir, 'mobile-home.png'), 'PNG', optimize=True)
    print(f"✓ Created mobile-home.png")
    
    print("\n✅ All screenshots generated successfully!")

if __name__ == '__main__':
    try:
        generate_icons()
        generate_screenshots()
        print("\n🎉 PWA assets generation complete!")
    except ImportError as e:
        print(f"Missing required library: {e}")
        print("\nInstalling required libraries...")
        os.system("pip install Pillow cairosvg")
        print("\nPlease run the script again after installation.")
    except Exception as e:
        print(f"Error: {e}")