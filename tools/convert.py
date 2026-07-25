#!/usr/bin/env python3
"""
Migue — подготовка фотографий.

Кладёт готовые .jpg в photos/micro и photos/big из исходных HEIC/JPG.

Использование:
    pip install pillow pillow-heif numpy
    python3 tools/convert.py "путь/к/Photos"

Ожидаемая структура источника:
    Photos/micro/<имя>.HEIC   — снимок с микроскопа
    Photos/big/<имя>.HEIC     — обычное фото того же предмета

Имена файлов внутри micro/ и big/ должны совпадать.
Русские имена автоматически переводятся в латиницу.
"""
import os, sys, re, json
import numpy as np
from PIL import Image, ImageOps, ImageFilter

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    print("подсказка: pip install pillow-heif — иначе HEIC не откроются")

MICRO_SIZE, BIG_SIZE, QUALITY = 1200, 800, 84

TRANSLIT = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i',
    'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
    'у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'',
    'э':'e','ю':'yu','я':'ya',' ':'-','_':'-'
}

def slugify(name):
    s = "".join(TRANSLIT.get(ch, ch) for ch in name.lower())
    s = re.sub(r"[^a-z0-9-]", "", s)
    return re.sub(r"-+", "-", s).strip("-")

def load(path):
    return ImageOps.exif_transpose(Image.open(path)).convert("RGB")

def crop_scope(im):
    """Обрезать чёрные поля вокруг круглого поля зрения микроскопа."""
    g = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(6)), dtype=np.float32)
    mask = g > max(30.0, g.max() * 0.22)
    if mask.sum() < g.size * 0.02:
        return im
    ys, xs = np.where(mask)
    cy, cx = (ys.min() + ys.max()) / 2, (xs.min() + xs.max()) / 2
    half = max(ys.max() - ys.min(), xs.max() - xs.min()) / 2 * 1.02
    half = min(half, cy, cx, im.height - cy, im.width - cx)
    return im.crop((int(cx - half), int(cy - half), int(cx + half), int(cy + half)))

def save(im, dst, size):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    ImageOps.fit(im, (size, size), Image.LANCZOS).save(
        dst, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return os.path.getsize(dst) // 1024

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "Photos"
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    micro_dir = os.path.join(src, "micro")
    names = {}
    for f in sorted(os.listdir(micro_dir)):
        if f.startswith(".") or not os.path.splitext(f)[1]:
            continue
        names[os.path.splitext(f)[0]] = f

    lines = []
    for base, fname in names.items():
        big = next((f for f in os.listdir(os.path.join(src, "big"))
                    if os.path.splitext(f)[0] == base), None)
        if not big:
            print(f"пропуск: нет большого фото для «{base}»")
            continue
        slug = slugify(base)
        a = save(crop_scope(load(os.path.join(micro_dir, fname))),
                 os.path.join(root, "photos/micro", slug + ".jpg"), MICRO_SIZE)
        b = save(load(os.path.join(src, "big", big)),
                 os.path.join(root, "photos/big", slug + ".jpg"), BIG_SIZE)
        print(f"{slug}: micro {a}KB, big {b}KB")
        lines.append(f'  {{ id: "{slug}",{" " * max(1, 14 - len(slug))}title: "{base.capitalize()}" }},')

    print("\n--- вставь это в data.js ---\nconst ITEMS = [")
    print("\n".join(lines))
    print("];")

if __name__ == "__main__":
    main()
