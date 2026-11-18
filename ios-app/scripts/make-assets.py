# Ökoplan iOS — the source images for `npx capacitor-assets generate --ios` (run from ios-app/, before it):
#   assets/icon-only.png  1024×1024, no transparency (Apple) — the clean Ökoplan icon of 17 Nov 2026 (brand/icon-1024.png)
#   assets/splash.png / splash-dark.png  2732×2732 — the full Ökoplan logo on white / on the night background
import os
from PIL import Image
os.makedirs('assets', exist_ok=True)
Image.open('brand/icon-1024.png').convert('RGB').resize((1024, 1024), Image.LANCZOS).save('assets/icon-only.png')
def splash(logo, bg, out):
    c = Image.new('RGB', (2732, 2732), bg); lg = Image.open(logo).convert('RGBA'); w = 1100; h = round(lg.height * w / lg.width)
    lg = lg.resize((w, h), Image.LANCZOS); c.paste(lg, ((2732 - w) // 2, (2732 - h) // 2), lg); c.save(out)
splash('brand/logo-full.png', (255, 255, 255), 'assets/splash.png')
splash('brand/logo-full-dark.png', (8, 22, 32), 'assets/splash-dark.png')
print('assets ok')
