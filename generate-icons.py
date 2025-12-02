#!/usr/bin/env python3
"""
Quick icon generator for MSBA Chrome Extension
Creates simple PNG icons with UCLA Anderson colors
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("PIL not available. Install with: pip install Pillow")

def create_icon(size, filename):
    """Create a simple icon with UCLA colors"""
    if not HAS_PIL:
        print(f"⚠️  Cannot create {filename} - PIL not installed")
        return False
    
    # Create image
    img = Image.new('RGB', (size, size), '#003DA5')  # UCLA Blue
    draw = ImageDraw.Draw(img)
    
    # Draw yellow circle
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin], fill='#FFD100')  # UCLA Yellow
    
    # Add 'M' text
    try:
        font_size = int(size * 0.5)
        # Try to use a system font
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            font = ImageFont.load_default()
        
        draw.text((size//2, size//2), 'M', fill='#003DA5', font=font, anchor='mm')
    except Exception as e:
        print(f"Could not add text: {e}")
    
    # Save
    img.save(filename)
    print(f"✅ Created {filename}")
    return True

if __name__ == '__main__':
    if HAS_PIL:
        create_icon(16, 'icon16.png')
        create_icon(48, 'icon48.png')
        create_icon(128, 'icon128.png')
        print("\n🎉 All icons created successfully!")
    else:
        print("\n📝 Alternative: Open create-icons.html in your browser to generate icons")

