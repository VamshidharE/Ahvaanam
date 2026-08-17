import os
from PIL import Image, ImageFilter, ImageChops, ImageEnhance

src_path = r"C:\Users\Admin\.gemini\antigravity\brain\b6b800a7-9691-4327-9825-f6cc2c2192b9\.user_uploaded\media__1786816606442.jpg"
out_dir = r"c:\Users\Admin\Ahvaanam\public\images\hero-theme"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path).convert("RGBA")
W, H = img.size
print(f"Loaded image {W}x{H}")

# Save full high-res original reference backdrop
img.convert("RGB").save(os.path.join(out_dir, "reference_hero.jpg"), "JPEG", quality=95)

# Pure PIL alpha mask creator: compares RGB to a background color
def make_transparent(crop_img, bg_rgb=(250, 240, 225), threshold=28, feather=1.5):
    # Convert image to RGB and subtract background
    bg_img = Image.new("RGB", crop_img.size, bg_rgb)
    crop_rgb = crop_img.convert("RGB")
    
    # Calculate difference image
    diff = ImageChops.difference(crop_rgb, bg_img)
    # Convert difference to grayscale
    gray_diff = diff.convert("L")
    
    # Map difference to alpha channel (0..255)
    # Anything below threshold starts becoming transparent
    def alpha_map(val):
        if val < 10:
            return 0
        val_scaled = int((val - 10) * 255 / max(1, threshold - 10))
        return min(255, max(0, val_scaled))
    
    alpha = gray_diff.point(alpha_map)
    if feather > 0:
        alpha = alpha.filter(ImageFilter.GaussianBlur(feather))
    
    result = crop_img.copy()
    result.putalpha(alpha)
    return result

# 1. Lord Ganesha (top center)
ganesha_crop = img.crop((215, 50, 360, 200))
ganesha_png = make_transparent(ganesha_crop, (250, 238, 218), threshold=30, feather=1)
ganesha_png.save(os.path.join(out_dir, "ganesha.png"))
print("Saved ganesha.png")

# 2. Left Elephant
ele_left_crop = img.crop((0, 260, 175, 460))
ele_left_png = make_transparent(ele_left_crop, (245, 232, 212), threshold=35, feather=1.5)
ele_left_png.save(os.path.join(out_dir, "elephant_left.png"))
print("Saved elephant_left.png")

# 3. Right Elephant
ele_right_crop = img.crop((400, 260, 576, 460))
ele_right_png = make_transparent(ele_right_crop, (245, 232, 212), threshold=35, feather=1.5)
ele_right_png.save(os.path.join(out_dir, "elephant_right.png"))
print("Saved elephant_right.png")

# 4. Left Banana Leaves
ban_left_crop = img.crop((0, 430, 180, 660))
ban_left_png = make_transparent(ban_left_crop, (245, 232, 212), threshold=28, feather=1)
ban_left_png.save(os.path.join(out_dir, "banana_leaves_left.png"))
print("Saved banana_leaves_left.png")

# 5. Right Banana Leaves
ban_right_crop = img.crop((395, 430, 576, 660))
ban_right_png = make_transparent(ban_right_crop, (245, 232, 212), threshold=28, feather=1)
ban_right_png.save(os.path.join(out_dir, "banana_leaves_right.png"))
print("Saved banana_leaves_right.png")

# 6. Top Arch & Overhanging Flowers
arch_crop = img.crop((0, 0, W, 250))
arch_png = make_transparent(arch_crop, (248, 236, 218), threshold=32, feather=1)
arch_png.save(os.path.join(out_dir, "top_arch_flowers.png"))
print("Saved top_arch_flowers.png")

# 7. Individual Hanging Brass Bells
bells_info = [
    ("bell_l1.png", (65, 55, 120, 155)),
    ("bell_l2.png", (115, 75, 175, 190)),
    ("bell_l3.png", (175, 60, 230, 160)),
    ("bell_r1.png", (345, 60, 400, 160)),
    ("bell_r2.png", (400, 75, 460, 190)),
    ("bell_r3.png", (455, 55, 510, 155)),
]
for fname, box in bells_info:
    b_crop = img.crop(box)
    b_png = make_transparent(b_crop, (248, 236, 218), threshold=28, feather=1)
    b_png.save(os.path.join(out_dir, fname))
    print(f"Saved {fname}")

# 8. Mandap & Couple Stage
mandap_crop = img.crop((0, 520, W, 920))
mandap_png = make_transparent(mandap_crop, (248, 236, 218), threshold=30, feather=1.5)
mandap_png.save(os.path.join(out_dir, "mandap_stage.png"))
print("Saved mandap_stage.png")

# 9. Foreground Lotus Flowers & Diyas
fore_crop = img.crop((0, 850, W, 1024))
fore_png = make_transparent(fore_crop, (248, 236, 218), threshold=25, feather=1)
fore_png.save(os.path.join(out_dir, "foreground_lotus_diyas.png"))
print("Saved foreground_lotus_diyas.png")

print("All layers extracted successfully!")
