#!/usr/bin/env python3
"""
Generate PWA icons - Simple version without external dependencies
"""

import os
from PIL import Image, ImageDraw, ImageFont

# Icon sizes needed for PWA
ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

# Colors based on the brand
PRIMARY_COLOR = (102, 126, 234)  # #667eea
SECONDARY_COLOR = (118, 75, 162)  # #764ba2
BG_COLOR = (10, 10, 15)  # #0a0a0f

def create_gradient_icon(size):
    """Create a gradient icon with OpenLifeOS branding"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Create gradient background
    for y in range(size):
        # Gradient from PRIMARY_COLOR to SECONDARY_COLOR
        ratio = y / size
        r = int(PRIMARY_COLOR[0] + (SECONDARY_COLOR[0] - PRIMARY_COLOR[0]) * ratio)
        g = int(PRIMARY_COLOR[1] + (SECONDARY_COLOR[1] - PRIMARY_COLOR[1]) * ratio)
        b = int(PRIMARY_COLOR[2] + (SECONDARY_COLOR[2] - PRIMARY_COLOR[2]) * ratio)
        
        draw.rectangle([(0, y), (size, y+1)], fill=(r, g, b, 255))
    
    # Add rounded corners effect
    corner_radius = size // 8
    
    # Create mask for rounded corners
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rectangle([(0, 0), (size, size)], fill=255)
    
    # Manually draw corner masks
    mask_draw.ellipse([(0, 0), (corner_radius*2, corner_radius*2)], fill=0)
    mask_draw.ellipse([(size-corner_radius*2, 0), (size, corner_radius*2)], fill=0)
    mask_draw.ellipse([(0, size-corner_radius*2), (corner_radius*2, size)], fill=0)
    mask_draw.ellipse([(size-corner_radius*2, size-corner_radius*2), (size, size)], fill=0)
    
    mask_draw.rectangle([(corner_radius, 0), (size-corner_radius, size)], fill=255)
    mask_draw.rectangle([(0, corner_radius), (size, size-corner_radius)], fill=255)
    
    # Apply mask
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    
    # Add center symbol (simplified neural network design)
    draw = ImageDraw.Draw(output)
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
    line_width = max(1, size // 100)
    for i, pos1 in enumerate(node_positions):
        for pos2 in node_positions[i+1:]:
            draw.line([pos1, pos2], fill=(255, 255, 255, 100), width=line_width)
    
    # Draw nodes
    node_size = max(4, size // 20)
    for pos in node_positions:
        draw.ellipse(
            [pos[0] - node_size, pos[1] - node_size, 
             pos[0] + node_size, pos[1] + node_size],
            fill=(255, 255, 255, 255)
        )
    
    # Add center core
    core_size = max(6, size // 15)
    draw.ellipse(
        [center_x - core_size, center_y - core_size,
         center_x + core_size, center_y + core_size],
        fill=(255, 255, 255, 255)
    )
    
    return output

def create_text_icon(text, size, icon_type):
    """Create an icon with text"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background with gradient
    for y in range(size):
        ratio = y / size
        if icon_type == 'demo':
            # Green gradient for demo
            r = int(68 + (0) * ratio)
            g = int(255 - (119) * ratio)
            b = int(68 + (68) * ratio)
        else:  # docs
            # Blue gradient for docs
            r = int(68 + (68) * ratio)
            g = int(136)
            b = int(255)
        
        draw.rectangle([(0, y), (size, y+1)], fill=(r, g, b, 255))
    
    # Add rounded corners
    corner_radius = size // 8
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rectangle([(0, 0), (size, size)], fill=255)
    
    # Corner masks
    mask_draw.ellipse([(0, 0), (corner_radius*2, corner_radius*2)], fill=0)
    mask_draw.ellipse([(size-corner_radius*2, 0), (size, corner_radius*2)], fill=0)
    mask_draw.ellipse([(0, size-corner_radius*2), (corner_radius*2, size)], fill=0)
    mask_draw.ellipse([(size-corner_radius*2, size-corner_radius*2), (size, size)], fill=0)
    
    mask_draw.rectangle([(corner_radius, 0), (size-corner_radius, size)], fill=255)
    mask_draw.rectangle([(0, corner_radius), (size, size-corner_radius)], fill=255)
    
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    
    # Add text
    draw = ImageDraw.Draw(output)
    
    # Draw the letter centered
    font_size = size // 2
    # Simple approach: draw the letter manually
    if text == 'D':
        # Draw D shape
        x, y = size // 4, size // 4
        w, h = size // 2, size // 2
        draw.arc([(x, y), (x + w, y + h)], -90, 90, fill=(255, 255, 255), width=size//12)
        draw.rectangle([(x, y), (x + w//3, y + h)], fill=(255, 255, 255))
    else:
        # Draw generic circle for other letters
        margin = size // 3
        draw.ellipse(
            [margin, margin, size - margin, size - margin],
            outline=(255, 255, 255), width=size//12
        )
    
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
        print(f"✓ Created icon-{size}x{size}.png")
    
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
    img = Image.new('RGB', (1920, 1080), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Add gradient overlay
    for y in range(1080):
        ratio = y / 1080
        r = int(BG_COLOR[0] + (PRIMARY_COLOR[0] - BG_COLOR[0]) * ratio * 0.3)
        g = int(BG_COLOR[1] + (PRIMARY_COLOR[1] - BG_COLOR[1]) * ratio * 0.3)
        b = int(BG_COLOR[2] + (PRIMARY_COLOR[2] - BG_COLOR[2]) * ratio * 0.3)
        
        draw.rectangle([(0, y), (1920, y+1)], fill=(r, g, b))
    
    # Add branding text
    text_color = (255, 255, 255)
    subtitle_color = (200, 200, 200)
    
    # Draw centered text (simplified without font)
    # Title
    title = "OpenLifeOS"
    x = 960
    y = 400
    # Create large text effect by drawing multiple times
    for dx in range(-2, 3):
        for dy in range(-2, 3):
            draw.text((x + dx*2, y + dy*2), title, fill=text_color)
    
    # Subtitle
    subtitle = "The Linux of Personal AI"
    draw.text((x, y + 100), subtitle, fill=subtitle_color, anchor="mm")
    
    img.save(os.path.join(screenshots_dir, 'desktop-home.png'), 'PNG', optimize=True)
    print(f"✓ Created desktop-home.png")
    
    # Demo screenshot
    img_demo = img.copy()
    draw = ImageDraw.Draw(img_demo)
    draw.text((960, 650), "Ultimate AI Experience", fill=PRIMARY_COLOR, anchor="mm")
    img_demo.save(os.path.join(screenshots_dir, 'demo-ultimate.png'), 'PNG', optimize=True)
    print(f"✓ Created demo-ultimate.png")
    
    # Mobile screenshot (750x1334)
    img = Image.new('RGB', (750, 1334), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Add gradient
    for y in range(1334):
        ratio = y / 1334
        r = int(BG_COLOR[0] + (SECONDARY_COLOR[0] - BG_COLOR[0]) * ratio * 0.3)
        g = int(BG_COLOR[1] + (SECONDARY_COLOR[1] - BG_COLOR[1]) * ratio * 0.3)
        b = int(BG_COLOR[2] + (SECONDARY_COLOR[2] - BG_COLOR[2]) * ratio * 0.3)
        
        draw.rectangle([(0, y), (750, y+1)], fill=(r, g, b))
    
    # Mobile text
    draw.text((375, 500), "OpenLifeOS", fill=text_color, anchor="mm")
    draw.text((375, 580), "Mobile Experience", fill=subtitle_color, anchor="mm")
    
    img.save(os.path.join(screenshots_dir, 'mobile-home.png'), 'PNG', optimize=True)
    print(f"✓ Created mobile-home.png")
    
    print("\n✅ All screenshots generated successfully!")

if __name__ == '__main__':
    try:
        generate_icons()
        generate_screenshots()
        print("\n🎉 PWA assets generation complete!")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()