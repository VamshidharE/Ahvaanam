import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import shutil

def create_ivory_damask_texture():
    # Tile size 400x400 seamless pattern
    w, h = 400, 400
    # Warm ivory background #FFF7EB
    bg = Image.new('RGB', (w, h), (255, 247, 235))
    draw = ImageDraw.Draw(bg)
    
    # Subtle champagne gold #D6AD63 with 8-12% opacity
    gold_motif = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d_motif = ImageDraw.Draw(gold_motif)
    
    # Draw classical Indian paisley / damask floral motif in center and 4 corners
    def draw_motif(cx, cy, scale=1.0):
        # Central flower with 8 petals
        for i in range(8):
            ang = i * (math.pi / 4)
            px = cx + math.cos(ang) * 28 * scale
            py = cy + math.sin(ang) * 28 * scale
            d_motif.ellipse([px - 10*scale, py - 10*scale, px + 10*scale, py + 10*scale], fill=(214, 173, 99, 22))
        d_motif.ellipse([cx - 14*scale, cy - 14*scale, cx + 14*scale, cy + 14*scale], fill=(184, 138, 59, 28))
        d_motif.ellipse([cx - 6*scale, cy - 6*scale, cx + 6*scale, cy + 6*scale], fill=(255, 247, 235, 180))
        
        # Surrounding floral arabesques / paisleys
        for i in range(4):
            ang = i * (math.pi / 2) + math.pi/4
            # Vine leaf
            vx = cx + math.cos(ang) * 60 * scale
            vy = cy + math.sin(ang) * 60 * scale
            d_motif.arc([vx - 25*scale, vy - 25*scale, vx + 25*scale, vy + 25*scale], 0, 360, fill=(214, 173, 99, 24), width=int(2*scale))
            d_motif.ellipse([vx - 5*scale, vy - 5*scale, vx + 5*scale, vy + 5*scale], fill=(214, 173, 99, 20))
            
    # Center
    draw_motif(200, 200, 1.2)
    # Corners for seamless tiling
    draw_motif(0, 0, 1.2)
    draw_motif(400, 0, 1.2)
    draw_motif(0, 400, 1.2)
    draw_motif(400, 400, 1.2)
    # Interstitial smaller blossoms
    draw_motif(200, 0, 0.7)
    draw_motif(200, 400, 0.7)
    draw_motif(0, 200, 0.7)
    draw_motif(400, 200, 0.7)
    
    # Soften motif
    gold_motif = gold_motif.filter(ImageFilter.GaussianBlur(0.6))
    
    # Composite over ivory
    bg.paste(gold_motif, (0, 0), gold_motif)
    
    # Add very faint paper silk fiber grain
    arr = np.array(bg, dtype=np.float32)
    noise = np.random.normal(0, 1.8, arr.shape)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def create_burgundy_brocade_texture():
    # Tile size 400x400 seamless pattern
    w, h = 400, 400
    # Rich wine maroon / deep burgundy #65182F
    bg = Image.new('RGB', (w, h), (101, 24, 47))
    draw = ImageDraw.Draw(bg)
    
    # Subtle weave lines (jacquard silk effect)
    arr = np.array(bg, dtype=np.float32)
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    weave = 2.5 * np.sin((x_coords + y_coords) * 1.2) + 2.0 * np.sin((x_coords - y_coords) * 1.2)
    arr += weave[:, :, np.newaxis]
    bg = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    
    # Subtle golden zari thread floral damask motif (10-15% opacity)
    zari = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d_zari = ImageDraw.Draw(zari)
    
    def draw_zari_motif(cx, cy, scale=1.0):
        # Sacred floral crest
        for i in range(12):
            ang = i * (math.pi / 6)
            px = cx + math.cos(ang) * 32 * scale
            py = cy + math.sin(ang) * 32 * scale
            d_zari.ellipse([px - 8*scale, py - 8*scale, px + 8*scale, py + 8*scale], fill=(223, 183, 89, 28))
        d_zari.ellipse([cx - 16*scale, cy - 16*scale, cx + 16*scale, cy + 16*scale], fill=(245, 215, 130, 32))
        d_zari.ellipse([cx - 7*scale, cy - 7*scale, cx + 7*scale, cy + 7*scale], fill=(101, 24, 47, 200))
        
        # Floral vine diamonds
        for i in range(4):
            ang = i * (math.pi / 2)
            vx = cx + math.cos(ang) * 65 * scale
            vy = cy + math.sin(ang) * 65 * scale
            d_zari.polygon([
                (vx, vy - 12*scale),
                (vx + 10*scale, vy),
                (vx, vy + 12*scale),
                (vx - 10*scale, vy)
            ], fill=(223, 183, 89, 22))

    draw_zari_motif(200, 200, 1.1)
    draw_zari_motif(0, 0, 1.1)
    draw_zari_motif(400, 0, 1.1)
    draw_zari_motif(0, 400, 1.1)
    draw_zari_motif(400, 400, 1.1)
    draw_zari_motif(200, 0, 0.65)
    draw_zari_motif(200, 400, 0.65)
    draw_zari_motif(0, 200, 0.65)
    draw_zari_motif(400, 200, 0.65)
    
    zari = zari.filter(ImageFilter.GaussianBlur(0.7))
    bg.paste(zari, (0, 0), zari)
    return bg

if __name__ == '__main__':
    out_dir = 'public/templates/emerald-palace'
    ivory_damask = create_ivory_damask_texture()
    ivory_damask.save(f'{out_dir}/ivory-damask-bg.jpg', quality=92)
    
    burgundy_brocade = create_burgundy_brocade_texture()
    burgundy_brocade.save(f'{out_dir}/burgundy-brocade-bg.jpg', quality=92)
    
    # Stage mandala
    shutil.copyfile('public/templates/pelli-pandiri/decoration/Lotus-Mandala.png', f'{out_dir}/ornamental-mandala-gold.png')
    
    # Stage garland corner
    shutil.copyfile('public/templates/pelli-pandiri/events/garland-corner.png', f'{out_dir}/garland-corner.png')
    
    print('Luxury textures and decorative assets generated and staged successfully!')
