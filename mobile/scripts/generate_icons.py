"""Render the mobile app icons from HealthyLife's yellow mascot.

Requires Pillow and PyMuPDF. Run from any directory with:
    python mobile/scripts/generate_icons.py
"""

from pathlib import Path

import pymupdf
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "mobile" / "assets"
MASCOT = ROOT / "web" / "src" / "assets" / "images" / "makot.svg"
PURPLE = "#7500B4"


def render_mascot(size):
    document = pymupdf.open(MASCOT)
    try:
        pixmap = document[0].get_pixmap(
            matrix=pymupdf.Matrix(size / 100, size / 100), alpha=True
        )
        return Image.frombytes("RGBA", (pixmap.width, pixmap.height), pixmap.samples)
    finally:
        document.close()


def centered(canvas, mascot):
    canvas.alpha_composite(
        mascot, ((canvas.width - mascot.width) // 2, (canvas.height - mascot.height) // 2)
    )
    return canvas


def save(canvas, name):
    canvas.save(ASSETS / name, optimize=True)


def main():
    save(centered(Image.new("RGBA", (1024, 1024), PURPLE), render_mascot(708)), "icon.png")
    save(
        centered(Image.new("RGBA", (512, 512)), render_mascot(320)),
        "android-icon-foreground.png",
    )
    save(Image.new("RGBA", (512, 512), PURPLE), "android-icon-background.png")

    # Android uses alpha, not color, for its themed icon. Cut the facial features
    # out of the circle so they remain visible when the system applies a tint.
    mascot = render_mascot(270)
    pixels = mascot.load()
    for y in range(mascot.height):
        for x in range(mascot.width):
            red, _, _, alpha = pixels[x, y]
            opacity = round(alpha * max(0, min(1, (red - 27) / 228)))
            pixels[x, y] = (255, 255, 255, opacity)
    save(centered(Image.new("RGBA", (432, 432)), mascot), "android-icon-monochrome.png")

    save(centered(Image.new("RGBA", (48, 48), PURPLE), render_mascot(36)), "favicon.png")
    save(centered(Image.new("RGBA", (1024, 1024)), render_mascot(540)), "splash-icon.png")


if __name__ == "__main__":
    main()
