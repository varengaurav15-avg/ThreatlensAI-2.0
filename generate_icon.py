from PIL import Image, ImageDraw
import os

def create_icon():
    os.makedirs("electron/assets", exist_ok=True)
    
    # Create a single 256x256 image first, then derive smaller sizes from it
    size = 256
    img  = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Red circle background
    draw.ellipse([8, 8, 248, 248], fill=(239, 68, 68, 255))

    # White lightning bolt
    bolt = [
        (138, 20),
        (108, 130),
        (132, 130),
        (118, 236),
        (158, 126),
        (134, 126),
        (162, 20),
    ]
    draw.polygon(bolt, fill=(255, 255, 255, 255))

    # Build all required sizes from the 256 master
    sizes  = [16, 32, 48, 64, 128, 256]
    frames = [img.resize((s, s), Image.LANCZOS) for s in sizes]

    # Save — first frame is 256, rest appended
    frames[-1].save(
        "electron/assets/icon.ico",
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=frames[:-1]
    )
    print("Done — electron/assets/icon.ico created at 256x256")
def create_tray_icon():
    from PIL import Image, ImageDraw
    import os
    
    os.makedirs("electron/assets", exist_ok=True)
    
    size = 32  # tray icons are small
    img  = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Red circle
    draw.ellipse([1, 1, 31, 31], fill=(239, 68, 68, 255))

    # White bolt — simplified for small size
    bolt = [
        (18, 3), (12, 17), (16, 17),
        (14, 29), (20, 15), (16, 15), (20, 3)
    ]
    draw.polygon(bolt, fill=(255, 255, 255, 255))

    img.save("electron/assets/tray-icon.png", format="PNG")
    print("Done — electron/assets/tray-icon.png created")

create_icon()
create_tray_icon()
create_icon()