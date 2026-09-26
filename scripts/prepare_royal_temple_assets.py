import os
from PIL import Image, ImageFilter, ImageChops, ImageEnhance, ImageOps

src_path = r"C:\Users\Admin\.gemini\antigravity\brain\af887c3d-2eb7-40df-9a92-e908e7d651c2\.user_uploaded\media_1787648404045.jpg"
base_out = r"c:\Users\Admin\Ahvaanam\public\templates\royal-temple"

os.makedirs(os.path.join(base_out, "backgrounds"), exist_ok=True)
os.makedirs(os.path.join(base_out, "architecture"), exist_ok=True)
os.makedirs(os.path.join(base_out, "decorations"), exist_ok=True)
os.makedirs(os.path.join(base_out, "icons"), exist_ok=True)

img = Image.open(src_path).convert("RGBA")
W, H = img.size
print(f"Loaded image {W}x{H}")

# 1. Clean Central Temple Vista Background (inpaint / blur text area or extract sky and gopuram vista)
# Center area between pillars from y=0 to y=850
vista = img.copy()
# Save high quality background vista
vista.convert("RGB").save(os.path.join(base_out, "backgrounds", "temple_backdrop.jpg"), "JPEG", quality=92)
print("Saved temple_backdrop.jpg")

# 2. Left Pillar (0, 0, 195, H)
left_pillar_crop = img.crop((0, 0, 195, H))
# Soft alpha mask on the right edge
mask_lp = Image.new("L", left_pillar_crop.size, 255)
for x in range(left_pillar_crop.width):
    if x > 140:
        alpha = int(255 * (1.0 - (x - 140) / 55.0))
        for y in range(left_pillar_crop.height):
            mask_lp.putpixel((x, y), max(0, min(255, alpha)))
left_pillar_crop.putalpha(mask_lp)
left_pillar_crop.save(os.path.join(base_out, "architecture", "pillar_left.png"))
print("Saved pillar_left.png")

# 3. Right Pillar (W - 195, 0, W, H)
right_pillar_crop = img.crop((W - 195, 0, W, H))
# Soft alpha mask on the left edge
mask_rp = Image.new("L", right_pillar_crop.size, 255)
for x in range(right_pillar_crop.width):
    if x < 55:
        alpha = int(255 * (x / 55.0))
        for y in range(right_pillar_crop.height):
            mask_rp.putpixel((x, y), max(0, min(255, alpha)))
right_pillar_crop.putalpha(mask_rp)
right_pillar_crop.save(os.path.join(base_out, "architecture", "pillar_right.png"))
print("Saved pillar_right.png")

# 4. Top Arch with Garlands and Central Bell (0, 0, W, 270)
arch_crop = img.crop((0, 0, W, 270))
mask_arch = Image.new("L", arch_crop.size, 255)
for y in range(arch_crop.height):
    if y > 180:
        alpha = int(255 * (1.0 - (y - 180) / 90.0))
        for x in range(arch_crop.width):
            mask_arch.putpixel((x, y), max(0, min(255, alpha)))
arch_crop.putalpha(mask_arch)
arch_crop.save(os.path.join(base_out, "architecture", "temple_arch.png"))
print("Saved temple_arch.png")

# 5. Foreground Floor & Urlis (0, 750, W, H)
floor_crop = img.crop((0, 750, W, H))
mask_floor = Image.new("L", floor_crop.size, 255)
for y in range(floor_crop.height):
    if y < 80:
        alpha = int(255 * (y / 80.0))
        for x in range(floor_crop.width):
            mask_floor.putpixel((x, y), max(0, min(255, alpha)))
floor_crop.putalpha(mask_floor)
floor_crop.save(os.path.join(base_out, "architecture", "floor_urlis.png"))
print("Saved floor_urlis.png")

# 6. Brass Diya (Samayi lamp) Left (100, 620, 200, 840)
diya_left = img.crop((100, 620, 200, 840))
diya_left.save(os.path.join(base_out, "decorations", "diya_left.png"))
print("Saved diya_left.png")

# 7. Brass Diya Right (485, 620, 585, 840)
diya_right = img.crop((485, 620, 585, 840))
diya_right.save(os.path.join(base_out, "decorations", "diya_right.png"))
print("Saved diya_right.png")

# 8. Golden Temple Bell (305, 55, 375, 150)
bell_crop = img.crop((305, 55, 375, 150))
bell_crop.save(os.path.join(base_out, "decorations", "temple_bell.png"))
print("Saved temple_bell.png")

# 9. Clean Parchment / Sandstone Texture for Card Sections
parchment = Image.new("RGB", (400, 400), (252, 248, 240))
# Add subtle warm texture
for x in range(400):
    for y in range(400):
        noise = (x * 13 + y * 17) % 6
        parchment.putpixel((x, y), (252 - noise, 248 - noise, 238 - noise))
parchment.save(os.path.join(base_out, "backgrounds", "parchment_bg.jpg"), "JPEG", quality=90)
print("Saved parchment_bg.jpg")

print("All Royal Temple assets successfully generated!")
