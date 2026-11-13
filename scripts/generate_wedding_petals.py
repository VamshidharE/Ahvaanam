import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def make_rose_petal():
    w, h = 400, 480
    canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    
    # Organic curved rose petal shape
    points = []
    for t in np.linspace(0, 2 * math.pi, 400):
        r = 175 * (1.0 - 0.28 * math.cos(t) + 0.12 * math.sin(2*t) - 0.08 * math.cos(3*t) + 0.05 * math.sin(5*t))
        x = 200 + r * math.sin(t) * 0.78
        y = 240 - r * math.cos(t) * 1.05
        points.append((x, y))
    
    draw.polygon(points, fill=(200, 35, 75, 255))
    arr = np.array(canvas, dtype=np.float32)
    mask = arr[:, :, 3] > 0
    
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    norm_y = np.clip((y_coords - 50) / 380.0, 0, 1)
    norm_x = (x_coords - 200) / 160.0
    dist = np.sqrt(norm_x**2 + (norm_y - 0.4)**2)
    
    # Rich velvet crimson to blush-pink petal tones
    r_chan = 140 * (1 - norm_y) + 225 * norm_y + 30 * (1 - dist)
    g_chan = 22 * (1 - norm_y) + 48 * norm_y + 30 * dist
    b_chan = 50 * (1 - norm_y) + 85 * norm_y + 40 * dist
    
    # Soft realistic petal ribbing
    angle = np.arctan2(x_coords - 200, y_coords - 430)
    veins = 1.0 + 0.06 * np.sin(angle * 28)
    # Edge highlight
    edge_highlight = np.clip((dist - 0.7) * 45, 0, 40)
    
    r_chan = np.clip(r_chan * veins + edge_highlight, 0, 255)
    g_chan = np.clip(g_chan * veins + edge_highlight * 0.7, 0, 255)
    b_chan = np.clip(b_chan * veins + edge_highlight * 0.8, 0, 255)
    
    arr[:, :, 0] = np.where(mask, r_chan, 0)
    arr[:, :, 1] = np.where(mask, g_chan, 0)
    arr[:, :, 2] = np.where(mask, b_chan, 0)
    
    img = Image.fromarray(arr.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    return img.resize((140, 168), Image.Resampling.LANCZOS)

def make_blush_petal():
    w, h = 360, 420
    canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    
    points = []
    for t in np.linspace(0, 2 * math.pi, 360):
        r = 150 * (1.0 - 0.22 * math.cos(t) + 0.15 * math.sin(2*t) - 0.05 * math.cos(4*t))
        x = 180 + r * math.sin(t) * 0.82
        y = 210 - r * math.cos(t) * 1.0
        points.append((x, y))
    
    draw.polygon(points, fill=(240, 160, 175, 255))
    arr = np.array(canvas, dtype=np.float32)
    mask = arr[:, :, 3] > 0
    
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    norm_y = np.clip((y_coords - 50) / 320.0, 0, 1)
    norm_x = (x_coords - 180) / 140.0
    dist = np.sqrt(norm_x**2 + (norm_y - 0.45)**2)
    
    # Soft pastel blush pink with peach highlights
    r_chan = 215 * (1 - norm_y) + 252 * norm_y
    g_chan = 110 * (1 - norm_y) + 195 * norm_y
    b_chan = 135 * (1 - norm_y) + 210 * norm_y
    
    angle = np.arctan2(x_coords - 180, y_coords - 380)
    veins = 1.0 + 0.04 * np.sin(angle * 24)
    
    r_chan = np.clip(r_chan * veins + 15 * (1 - dist), 0, 255)
    g_chan = np.clip(g_chan * veins + 15 * (1 - dist), 0, 255)
    b_chan = np.clip(b_chan * veins + 15 * (1 - dist), 0, 255)
    
    arr[:, :, 0] = np.where(mask, r_chan, 0)
    arr[:, :, 1] = np.where(mask, g_chan, 0)
    arr[:, :, 2] = np.where(mask, b_chan, 0)
    
    img = Image.fromarray(arr.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    return img.resize((126, 147), Image.Resampling.LANCZOS)

def make_jasmine_petal():
    # Mogra / Indian Jasmine slender teardrop bud
    w, h = 260, 480
    canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    
    points = []
    for t in np.linspace(0, 2 * math.pi, 360):
        # Elongated oval pointed at both ends
        r = 180 * (1.0 - 0.45 * math.cos(2*t) + 0.08 * math.sin(3*t))
        x = 130 + r * math.sin(t) * 0.45
        y = 240 - r * math.cos(t) * 1.15
        points.append((x, y))
    
    draw.polygon(points, fill=(255, 255, 250, 255))
    arr = np.array(canvas, dtype=np.float32)
    mask = arr[:, :, 3] > 0
    
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    norm_y = np.clip((y_coords - 30) / 420.0, 0, 1)
    
    # Creamy ivory white with soft green calyx at the very bottom
    # Bottom (y near 1.0) has pale sage green
    calyx = np.clip((norm_y - 0.78) * 4.5, 0, 1)
    
    r_chan = (255 * (1 - calyx) + 165 * calyx) - 15 * norm_y
    g_chan = (252 * (1 - calyx) + 195 * calyx) - 12 * norm_y
    b_chan = (240 * (1 - calyx) + 120 * calyx) - 25 * norm_y
    
    # Soft central 3D highlight ridge
    center_ridge = np.exp(-((x_coords - 130) / 25.0)**2) * 18
    r_chan = np.clip(r_chan + center_ridge, 0, 255)
    g_chan = np.clip(g_chan + center_ridge, 0, 255)
    b_chan = np.clip(b_chan + center_ridge, 0, 255)
    
    arr[:, :, 0] = np.where(mask, r_chan, 0)
    arr[:, :, 1] = np.where(mask, g_chan, 0)
    arr[:, :, 2] = np.where(mask, b_chan, 0)
    
    img = Image.fromarray(arr.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    return img.resize((90, 166), Image.Resampling.LANCZOS)

def make_marigold_petal():
    # Fluted golden South Indian marigold petal
    w, h = 300, 440
    canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    
    points = []
    for t in np.linspace(0, 2 * math.pi, 360):
        # Frilled top, narrow bottom
        frill = 0.08 * math.sin(7 * t) if math.cos(t) > 0.2 else 0.0
        r = 160 * (1.0 - 0.4 * math.cos(t) + frill)
        x = 150 + r * math.sin(t) * 0.58
        y = 220 - r * math.cos(t) * 1.15
        points.append((x, y))
    
    draw.polygon(points, fill=(255, 160, 0, 255))
    arr = np.array(canvas, dtype=np.float32)
    mask = arr[:, :, 3] > 0
    
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    norm_y = np.clip((y_coords - 40) / 360.0, 0, 1)
    
    # Deep orange base transitioning to brilliant saffron-yellow tip
    r_chan = 255 * np.ones_like(norm_y)
    g_chan = 110 * (1 - norm_y) + 215 * norm_y
    b_chan = 5 * (1 - norm_y) + 30 * norm_y
    
    # Longitudinal fluting lines
    flutes = 1.0 + 0.08 * np.sin((x_coords - 150) / 8.0)
    g_chan = np.clip(g_chan * flutes, 0, 255)
    
    arr[:, :, 0] = np.where(mask, r_chan, 0)
    arr[:, :, 1] = np.where(mask, g_chan, 0)
    arr[:, :, 2] = np.where(mask, b_chan, 0)
    
    img = Image.fromarray(arr.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    return img.resize((105, 154), Image.Resampling.LANCZOS)

if __name__ == '__main__':
    out_dir = 'public/templates/emerald-palace'
    make_rose_petal().save(f'{out_dir}/petal-rose.png')
    make_blush_petal().save(f'{out_dir}/petal-blush.png')
    make_jasmine_petal().save(f'{out_dir}/petal-jasmine.png')
    make_marigold_petal().save(f'{out_dir}/petal-marigold.png')
    print('All 4 wedding petal assets generated successfully!')
