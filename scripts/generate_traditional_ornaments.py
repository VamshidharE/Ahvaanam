import math
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('public/templates/emerald-palace/ornaments', exist_ok=True)

BURGUNDY = (120, 29, 54, 235)      # #781D36
BURGUNDY_DARK = (101, 24, 47, 255) # #65182F
DUSTY_ROSE = (217, 143, 155, 200)  # #D98F9B
ANTIQUE_GOLD = (214, 173, 99, 220) # #D6AD63
TRANSPARENT = (0, 0, 0, 0)

def create_parchment_texture():
    # 600x600 seamless warm handmade parchment paper
    w, h = 600, 600
    base = np.full((h, w, 3), [255, 248, 238], dtype=np.float32)
    noise = np.random.normal(0, 2.0, (h, w, 3))
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    fibers = 1.2 * np.sin(x_coords * 0.08 + y_coords * 0.03) + 0.8 * np.sin(y_coords * 0.12)
    base += noise + fibers[:, :, np.newaxis]
    cx, cy = w / 2, h / 2
    dist = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2) / (w * 0.7)
    base -= dist[:, :, np.newaxis] * 3.5
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    img.save('public/templates/emerald-palace/parchment-bg.jpg', quality=94)
    print('Parchment texture generated!')

# 1. Hanging Lotus with Delicate Stems & Buds
def make_hanging_lotus():
    w, h = 600, 1000
    canvas = Image.new('RGBA', (w, h), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    
    # Main stem hanging from top (300, 0) down to (300, 520)
    for y in range(0, 520, 4):
        x = 300 + 4 * math.sin(y * 0.02)
        draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=BURGUNDY)
        if y % 45 == 0:
            draw.ellipse([x - 5, y - 5, x + 5, y + 5], fill=ANTIQUE_GOLD, outline=BURGUNDY_DARK, width=1)
            
    # Small hanging bud left
    draw.arc([220, 250, 300, 350], 90, 220, fill=BURGUNDY, width=2)
    bx, by = 230, 350
    draw.polygon([(bx, by), (bx-12, by+24), (bx, by+36), (bx+12, by+24)], outline=BURGUNDY, fill=DUSTY_ROSE)
    draw.line([(bx, by+4), (bx, by+32)], fill=BURGUNDY, width=1)

    # Secondary bud right
    draw.arc([300, 340, 380, 440], -40, 90, fill=BURGUNDY, width=2)
    bx2, by2 = 370, 440
    draw.polygon([(bx2, by2), (bx2-10, by2+20), (bx2, by2+30), (bx2+10, by2+20)], outline=BURGUNDY, fill=DUSTY_ROSE)

    # Main Lotus Bloom hanging at bottom (300, 680)
    cx, cy = 300, 680
    draw.polygon([(cx-25, cy-40), (cx+25, cy-40), (cx+15, cy-15), (cx-15, cy-15)], outline=BURGUNDY_DARK, fill=ANTIQUE_GOLD)
    
    # Outer petals
    for sign in [-1, 1]:
        pts_outer = []
        for t in np.linspace(0, 1, 60):
            px = cx + sign * (20 + 130 * math.sin(t * math.pi) + 20 * t)
            py = cy + 200 * t - 30 * math.sin(t * math.pi)
            pts_outer.append((px, py))
        draw.line(pts_outer, fill=BURGUNDY, width=3)
        draw.polygon([(cx, cy), pts_outer[30], pts_outer[50]], fill=(217, 143, 155, 45))
        
        pts_mid = []
        for t in np.linspace(0, 1, 60):
            px = cx + sign * (15 + 85 * math.sin(t * math.pi))
            py = cy + 210 * t
            pts_mid.append((px, py))
        draw.line(pts_mid, fill=BURGUNDY, width=3)

    # Center central petal
    pts_center = []
    for t in np.linspace(-1, 1, 80):
        px = cx + 38 * (1 - t**2) * math.sin(t * 3)
        py = cy + 110 + 110 * t
        pts_center.append((px, py))
    draw.polygon(pts_center, outline=BURGUNDY_DARK, fill=(217, 143, 155, 75))
    draw.line([(cx, cy), (cx, cy + 220)], fill=BURGUNDY, width=2)
    
    # Delicate bell drops underneath lotus
    for offset, drop_len in [(-45, 90), (0, 140), (45, 90)]:
        dx, dy = cx + offset, cy + 220
        for y_d in range(0, drop_len, 6):
            draw.ellipse([dx - 1, dy + y_d - 1, dx + 1, dy + y_d + 1], fill=BURGUNDY)
        draw.ellipse([dx - 4, dy + drop_len - 6, dx + 4, dy + drop_len + 6], fill=ANTIQUE_GOLD, outline=BURGUNDY, width=1)

    res = canvas.resize((300, 500), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/hanging-lotus.png')
    print('1. Hanging lotus generated!')

# 2. Jasmine Creeper with Tendrils & Star Blossoms
def make_jasmine_creeper():
    w, h = 600, 800
    canvas = Image.new('RGBA', (w, h), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    
    pts_vine = []
    for t in np.linspace(0, math.pi * 1.5, 200):
        x = 300 + 160 * math.sin(t)
        y = 80 + 400 * (t / (math.pi * 1.5))
        pts_vine.append((x, y))
    draw.line(pts_vine, fill=BURGUNDY_DARK, width=3)
    
    for i in range(15, 185, 18):
        vx, vy = pts_vine[i]
        dx = pts_vine[i+1][0] - pts_vine[i-1][0]
        dy = pts_vine[i+1][1] - pts_vine[i-1][1]
        norm = math.sqrt(dx*dx + dy*dy) + 1e-5
        nx, ny = -dy / norm, dx / norm
        
        side = 1 if (i // 18) % 2 == 0 else -1
        lx = vx + side * nx * 45
        ly = vy + side * ny * 45
        
        draw.arc([min(vx, lx)-15, min(vy, ly)-15, max(vx, lx)+15, max(vy, ly)+15], 0, 360, fill=BURGUNDY, width=2)
        draw.line([(vx, vy), (lx, ly)], fill=BURGUNDY, width=2)
        
        if (i // 18) % 3 == 0:
            jx, jy = lx + side * nx * 20, ly + side * ny * 20
            draw.line([(lx, ly), (jx, jy)], fill=BURGUNDY, width=2)
            for a in range(5):
                ang = a * (2 * math.pi / 5)
                pet_x = jx + 14 * math.cos(ang)
                pet_y = jy + 14 * math.sin(ang)
                draw.ellipse([pet_x-4, pet_y-4, pet_x+4, pet_y+4], fill=(255, 250, 240, 230), outline=BURGUNDY, width=1)
            draw.ellipse([jx-3, jy-3, jx+3, jy+3], fill=ANTIQUE_GOLD)

    res = canvas.resize((300, 400), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/jasmine-creeper.png')
    print('2. Jasmine creeper generated!')

# 3. Traditional Sikku Kolam (Brahma Mudi Interlaced Knotwork)
def make_sikku_kolam():
    size = 700
    canvas = Image.new('RGBA', (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    cx, cy = size / 2, size / 2
    
    for fold in range(8):
        rot = fold * (2 * math.pi / 8)
        cos_r, sin_r = math.cos(rot), math.sin(rot)
        
        pts_knot = []
        for t in np.linspace(-math.pi/2, math.pi/2, 60):
            u = t
            x_raw = 110 * math.sin(u) * math.cos(u)
            y_raw = 80 + 140 * math.cos(u)
            rx = cx + (x_raw * cos_r - y_raw * sin_r)
            ry = cy + (x_raw * sin_r + y_raw * cos_r)
            pts_knot.append((rx, ry))
            
        draw.line(pts_knot, fill=BURGUNDY, width=3)
        tip_x = cx + (0 * cos_r - 260 * sin_r)
        tip_y = cy + (0 * sin_r + 260 * cos_r)
        draw.ellipse([tip_x - 6, tip_y - 6, tip_x + 6, tip_y + 6], fill=ANTIQUE_GOLD, outline=BURGUNDY, width=2)
        
    draw.ellipse([cx - 45, cy - 45, cx + 45, cy + 45], outline=BURGUNDY_DARK, fill=(217, 143, 155, 60), width=3)
    draw.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], fill=ANTIQUE_GOLD, outline=BURGUNDY, width=2)
    draw.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=BURGUNDY_DARK)

    for fold in range(8):
        rot = fold * (2 * math.pi / 8)
        px = cx + 80 * math.cos(rot)
        py = cy + 80 * math.sin(rot)
        draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=BURGUNDY_DARK)

    res = canvas.resize((350, 350), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/sikku-kolam.png')
    print('3. Sikku kolam generated!')

# 4. Geometric Pulli Kolam (Dot-and-Line Sacred Geometry)
def make_pulli_kolam():
    size = 640
    canvas = Image.new('RGBA', (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    cx, cy = size / 2, size / 2
    
    # 5x5 Pulli grid (spacing 60px)
    grid_coords = []
    for r in range(-3, 4):
        for c in range(-3, 4):
            if abs(r) + abs(c) <= 4:
                gx = cx + c * 60
                gy = cy + r * 60
                grid_coords.append((gx, gy))
                # Pulli dot
                draw.ellipse([gx - 3.5, gy - 3.5, gx + 3.5, gy + 3.5], fill=BURGUNDY_DARK)
                
    # Sacred diamond and petal loops circulating around the dots
    for fold in range(4):
        rot = fold * (math.pi / 2)
        cos_r, sin_r = math.cos(rot), math.sin(rot)
        pts_star = []
        for t in np.linspace(0, 1, 40):
            x_raw = 60 * t
            y_raw = 180 * (1 - t) + 40 * math.sin(t * math.pi)
            rx = cx + (x_raw * cos_r - y_raw * sin_r)
            ry = cy + (x_raw * sin_r + y_raw * cos_r)
            pts_star.append((rx, ry))
        draw.line(pts_star, fill=BURGUNDY, width=2)
        
        # Outer looped crown
        ox = cx + (0 * cos_r - 230 * sin_r)
        oy = cy + (0 * sin_r + 230 * cos_r)
        draw.polygon([(ox, oy), (ox-15*cos_r, oy-15*sin_r), (ox, oy+20), (ox+15*cos_r, oy+15*sin_r)], outline=BURGUNDY, fill=ANTIQUE_GOLD)

    # Concentric inner geometric square
    draw.polygon([(cx, cy-120), (cx+120, cy), (cx, cy+120), (cx-120, cy)], outline=BURGUNDY, width=2)
    draw.polygon([(cx-85, cy-85), (cx+85, cy-85), (cx+85, cy+85), (cx-85, cy+85)], outline=BURGUNDY, width=2)
    draw.ellipse([cx-12, cy-12, cx+12, cy+12], fill=BURGUNDY_DARK)

    res = canvas.resize((320, 320), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/pulli-kolam.png')
    print('4. Pulli kolam generated!')

# 5. Traditional Paisley / Mango (Manga) Motif with Botanical Infill
def make_paisley_mango():
    w, h = 600, 750
    canvas = Image.new('RGBA', (w, h), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    
    # Parametric paisley curve
    pts_paisley = []
    for t in np.linspace(0, 2 * math.pi, 240):
        # Classical kalka / paisley formula
        r = 180 * (1.0 - 0.45 * math.cos(t) + 0.25 * math.sin(2*t) - 0.15 * math.cos(3*t))
        x = 300 + r * math.sin(t) * 0.95
        # Curved curling tip
        tip_curl = 65 * math.sin(t)**3 if t > math.pi else 0
        y = 380 - r * math.cos(t) * 1.05 + tip_curl
        pts_paisley.append((x, y))
        
    draw.polygon(pts_paisley, outline=BURGUNDY_DARK, fill=(217, 143, 155, 30))
    draw.line(pts_paisley, fill=BURGUNDY_DARK, width=3)
    
    # Internal concentric echo outline
    pts_inner = []
    for x, y in pts_paisley[::2]:
        ix = 300 + (x - 300) * 0.78
        iy = 380 + (y - 380) * 0.78
        pts_inner.append((ix, iy))
    draw.line(pts_inner + [pts_inner[0]], fill=BURGUNDY, width=2)
    
    # Inner floral tree-of-life hatching
    for y_bar in range(250, 480, 24):
        draw.arc([230, y_bar, 370, y_bar + 35], 0, 180, fill=BURGUNDY, width=1)
        draw.ellipse([296, y_bar + 16, 304, y_bar + 24], fill=ANTIQUE_GOLD)
        
    # Central miniature lotus at the paisley base
    draw.polygon([(285, 490), (315, 490), (325, 470), (300, 455), (275, 470)], outline=BURGUNDY, fill=ANTIQUE_GOLD)

    res = canvas.resize((300, 375), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/paisley-mango.png')
    print('5. Paisley mango generated!')

# 6. Small Traditional Floral Cluster (Lotus & Buds)
def make_floral_cluster():
    size = 600
    canvas = Image.new('RGBA', (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    cx, cy = size / 2, size / 2
    
    # Center 8-petal blooming lotus
    for i in range(8):
        ang = i * (2 * math.pi / 8)
        px = cx + 70 * math.cos(ang)
        py = cy + 70 * math.sin(ang)
        pts = [(cx, cy), (px - 22 * math.sin(ang), py + 22 * math.cos(ang)), (px, py), (px + 22 * math.sin(ang), py - 22 * math.cos(ang))]
        draw.polygon(pts, outline=BURGUNDY, fill=DUSTY_ROSE)
        draw.line([(cx, cy), (px, py)], fill=BURGUNDY, width=1)
        
    # Outer radiating curved buds
    for i in range(4):
        ang = i * (math.pi / 2) + math.pi/4
        bx = cx + 160 * math.cos(ang)
        by = cy + 160 * math.sin(ang)
        draw.arc([min(cx, bx)-30, min(cy, by)-30, max(cx, bx)+30, max(cy, by)+30], 0, 360, fill=BURGUNDY, width=2)
        draw.ellipse([bx-12, by-12, bx+12, by+12], fill=ANTIQUE_GOLD, outline=BURGUNDY, width=2)
        
    draw.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], fill=ANTIQUE_GOLD, outline=BURGUNDY_DARK, width=2)
    draw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=BURGUNDY_DARK)

    res = canvas.resize((300, 300), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/floral-cluster.png')
    print('6. Floral cluster generated!')

# 7. Decorative Hanging Mango Leaves & Festive Thoranam
def make_hanging_leaves():
    w, h = 800, 400
    canvas = Image.new('RGBA', (w, h), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    
    # Upper sacred rope festoon curve
    pts_rope = []
    for t in np.linspace(0, 1, 150):
        rx = 40 + 720 * t
        ry = 60 + 65 * math.sin(t * math.pi)
        pts_rope.append((rx, ry))
    draw.line(pts_rope, fill=BURGUNDY_DARK, width=3)
    
    # Hanging mango leaves (5 leaves)
    for idx, t_leaf in enumerate([0.15, 0.32, 0.5, 0.68, 0.85]):
        lx = 40 + 720 * t_leaf
        ly = 60 + 65 * math.sin(t_leaf * math.pi)
        
        # Pointed mango leaf shape
        leaf_len = 160 + (30 if idx == 2 else 0)
        pts_leaf = [
            (lx, ly),
            (lx - 25, ly + leaf_len * 0.45),
            (lx, ly + leaf_len),
            (lx + 25, ly + leaf_len * 0.45)
        ]
        draw.polygon(pts_leaf, outline=BURGUNDY, fill=(217, 143, 155, 35))
        draw.line([(lx, ly), (lx, ly + leaf_len)], fill=BURGUNDY, width=2)
        
        # Side leaf veins
        for vy in range(30, int(leaf_len * 0.75), 25):
            draw.line([(lx, ly + vy), (lx - 16, ly + vy - 10)], fill=BURGUNDY, width=1)
            draw.line([(lx, ly + vy), (lx + 16, ly + vy - 10)], fill=BURGUNDY, width=1)
            
        # Marigold ball accent above leaf
        draw.ellipse([lx - 10, ly - 10, lx + 10, ly + 10], fill=ANTIQUE_GOLD, outline=BURGUNDY, width=1)

    res = canvas.resize((400, 200), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/hanging-leaves.png')
    print('7. Hanging leaves generated!')

# 8. Traditional Ornamental Corner Kolam (L-Shaped Filigree)
def make_corner_kolam():
    size = 600
    canvas = Image.new('RGBA', (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    
    # Corner origin at (40, 40)
    # Horizontal arm to (480, 40), Vertical arm to (40, 480)
    draw.line([(40, 40), (480, 40)], fill=BURGUNDY, width=3)
    draw.line([(40, 40), (40, 480)], fill=BURGUNDY, width=3)
    draw.line([(48, 48), (460, 48)], fill=BURGUNDY, width=1)
    draw.line([(48, 48), (48, 460)], fill=BURGUNDY, width=1)
    
    # Corner lotus blossom in apex
    cx, cy = 90, 90
    draw.ellipse([cx - 35, cy - 35, cx + 35, cy + 35], outline=BURGUNDY, fill=ANTIQUE_GOLD, width=2)
    draw.ellipse([cx - 15, cy - 15, cx + 15, cy + 15], fill=BURGUNDY_DARK)
    
    # Interlocking Sikku loops spreading outward
    for step in range(120, 460, 60):
        # Along horizontal arm
        draw.arc([step - 25, 20, step + 25, 70], 0, 180, fill=BURGUNDY, width=2)
        draw.ellipse([step - 4, 45 - 4, step + 4, 45 + 4], fill=ANTIQUE_GOLD)
        # Along vertical arm
        draw.arc([20, step - 25, 70, step + 25], 270, 90, fill=BURGUNDY, width=2)
        draw.ellipse([45 - 4, step - 4, 45 + 4, step + 4], fill=ANTIQUE_GOLD)
        
    # Diagonal decorative tendril
    draw.arc([40, 40, 360, 360], 0, 90, fill=BURGUNDY, width=2)
    draw.polygon([(260, 260), (285, 240), (295, 265), (270, 285)], outline=BURGUNDY, fill=DUSTY_ROSE)

    res = canvas.resize((300, 300), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/corner-kolam.png')
    print('8. Corner kolam generated!')

# 9. Delicate Curved Botanical Vine
def make_botanical_vine():
    w, h = 500, 800
    canvas = Image.new('RGBA', (w, h), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    
    pts_stem = []
    for t in np.linspace(0, 1, 160):
        x = 250 + 130 * math.sin(t * 2.5 * math.pi) * (1 - 0.3 * t)
        y = 50 + 700 * t
        pts_stem.append((x, y))
    draw.line(pts_stem, fill=BURGUNDY_DARK, width=2)
    
    for i in range(12, 150, 15):
        vx, vy = pts_stem[i]
        side = 1 if (i // 15) % 2 == 0 else -1
        # Curling tendril
        tx = vx + side * 55
        ty = vy - 15
        draw.arc([min(vx, tx), min(vy, ty), max(vx, tx)+20, max(vy, ty)+20], 0, 360, fill=BURGUNDY, width=1)
        # Teardrop leaf
        draw.polygon([(vx, vy), (tx, ty), (tx + side * 15, ty - 10)], outline=BURGUNDY, fill=(217, 143, 155, 60))
        # Gold bud
        draw.ellipse([tx - 3, ty - 3, tx + 3, ty + 3], fill=ANTIQUE_GOLD)

    res = canvas.resize((250, 400), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/botanical-vine.png')
    print('9. Botanical vine generated!')

# 10. Small Traditional Auspicious Deepam / Kalash Motif
def make_auspicious_motif():
    size = 600
    canvas = Image.new('RGBA', (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    cx, cy = size / 2, size / 2
    
    # 1. Sacred Kalash (Brass Pot) Base
    # Pot belly
    draw.ellipse([cx - 90, cy + 10, cx + 90, cy + 170], outline=BURGUNDY_DARK, fill=(214, 173, 99, 120), width=3)
    # Pot neck & rim
    draw.rectangle([cx - 45, cy - 20, cx + 45, cy + 15], outline=BURGUNDY, fill=ANTIQUE_GOLD, width=2)
    draw.ellipse([cx - 55, cy - 28, cx + 55, cy - 12], outline=BURGUNDY_DARK, fill=BURGUNDY, width=2)
    
    # 2. Mango leaves emerging from neck
    for sign in [-1.4, -0.7, 0, 0.7, 1.4]:
        ang = sign * 0.4
        lx = cx + 85 * math.sin(ang)
        ly = cy - 20 - 75 * math.cos(ang)
        draw.polygon([(cx, cy - 20), (lx - 15, ly + 25), (lx, ly), (lx + 15, ly + 25)], outline=BURGUNDY, fill=DUSTY_ROSE)
        draw.line([(cx, cy - 20), (lx, ly)], fill=BURGUNDY, width=1)
        
    # 3. Sacred Coconut with Kuduma tip
    draw.ellipse([cx - 40, cy - 105, cx + 40, cy - 35], outline=BURGUNDY_DARK, fill=(101, 24, 47, 60), width=2)
    draw.polygon([(cx, cy - 130), (cx - 15, cy - 95), (cx + 15, cy - 95)], outline=BURGUNDY, fill=ANTIQUE_GOLD)
    
    # 4. Swastika / Auspicious seal on Kalash belly
    draw.line([(cx - 28, cy + 90), (cx + 28, cy + 90)], fill=BURGUNDY, width=2)
    draw.line([(cx, cy + 62), (cx, cy + 118)], fill=BURGUNDY, width=2)
    draw.line([(cx - 28, cy + 90), (cx - 28, cy + 74)], fill=BURGUNDY, width=2)
    draw.line([(cx + 28, cy + 90), (cx + 28, cy + 106)], fill=BURGUNDY, width=2)
    draw.line([(cx, cy + 62), (cx + 16, cy + 62)], fill=BURGUNDY, width=2)
    draw.line([(cx, cy + 118), (cx - 16, cy + 118)], fill=BURGUNDY, width=2)

    res = canvas.resize((300, 300), Image.Resampling.LANCZOS)
    res.save('public/templates/emerald-palace/ornaments/auspicious-motif.png')
    print('10. Auspicious motif generated!')

if __name__ == '__main__':
    create_parchment_texture()
    make_hanging_lotus()
    make_jasmine_creeper()
    make_sikku_kolam()
    make_pulli_kolam()
    make_paisley_mango()
    make_floral_cluster()
    make_hanging_leaves()
    make_corner_kolam()
    make_botanical_vine()
    make_auspicious_motif()
    print('All 10 traditional South Indian hand-drawn ornaments generated successfully!')
