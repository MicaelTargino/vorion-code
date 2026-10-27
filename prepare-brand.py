"""Prepare web-sized copies of the supplied official brand artwork."""
from pathlib import Path
from zipfile import ZipFile
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).parent
source = root.parent / "VorionCode"
dest = root / "public" / "brand"
dest.mkdir(parents=True, exist_ok=True)
for original, name, width in [
    ("Logo flat/Roxa.png", "mark-purple.png", 512),
    ("Logo flat/Branca.png", "mark-white.png", 512),
    ("Tipografia/Variação V2/Branca.png", "wordmark-white.png", 560),
    ("Tipografia/Tipografia V2.png", "wordmark-brand.png", 560),
    ("Logo.png", "mark-dimensional.png", 900),
]:
    with Image.open(source / original) as image:
        image = image.convert("RGBA")
        image.thumbnail((width, width))
        image.save(dest / name, optimize=True)

fonts = root / "src" / "app" / "fonts"
fonts.mkdir(exist_ok=True)
with ZipFile(source / "Poppins.zip") as archive:
    for name in ["Poppins-Regular.ttf", "Poppins-Medium.ttf", "Poppins-SemiBold.ttf", "Poppins-Bold.ttf", "OFL.txt"]:
        (fonts / name).write_bytes(archive.read(name))

with Image.open(dest / "mark-dimensional.png") as mark:
    icon = Image.new("RGBA", (128, 128), "#131119")
    mark.thumbnail((112, 96))
    icon.alpha_composite(mark, ((128 - mark.width) // 2, (128 - mark.height) // 2))
    icon.save(root / "src" / "app" / "icon.png")

og = Image.new("RGBA", (1200, 630), "#131119")
draw = ImageDraw.Draw(og)
draw.ellipse((690, -120, 1320, 700), outline="#3c2c54", width=2)
draw.ellipse((760, -80, 1250, 660), outline="#65508b", width=2)
with Image.open(dest / "mark-dimensional.png") as mark:
    mark.thumbnail((460, 400))
    og.alpha_composite(mark, (715, 130))
with Image.open(dest / "wordmark-white.png") as wordmark:
    wordmark.thumbnail((300, 180))
    og.alpha_composite(wordmark, (80, 76))
font = ImageFont.truetype(str(fonts / "Poppins-Medium.ttf"), 38)
draw.text((80, 355), "Ideias em órbita.", font=font, fill="#fffdf4")
draw.text((80, 410), "Soluções em escala.", font=font, fill="#926cd8")
og.convert("RGB").save(root / "public" / "og.png", optimize=True)
