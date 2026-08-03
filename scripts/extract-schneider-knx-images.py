from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

import pdfplumber
from PIL import Image


REFERENCE_RE = re.compile(r"[^A-Z0-9_.-]")
RENDER_DPI = 216
CANVAS_SIZE = (560, 360)


@dataclass(frozen=True)
class ImageBox:
    x0: float
    top: float
    x1: float
    bottom: float

    @property
    def center_y(self) -> float:
        return (self.top + self.bottom) / 2


def product_image_boxes(page: pdfplumber.page.Page, source_page: int) -> list[ImageBox]:
    midpoint = page.width / 2
    boxes: list[ImageBox] = []
    for image in page.images:
        x0 = float(image.get("x0", 0))
        x1 = float(image.get("x1", x0 + float(image.get("width", 0))))
        top = float(image.get("top", 0))
        bottom = float(image.get("bottom", top + float(image.get("height", 0))))
        width = x1 - x0
        height = bottom - top
        center_x = (x0 + x1) / 2
        belongs_to_half = center_x < midpoint if source_page % 2 == 0 else center_x >= midpoint
        if (
            belongs_to_half
            and width * height >= 2500
            and min(width, height) >= 35
            and width < midpoint * 0.85
            and height < 260
            and top < 720
        ):
            boxes.append(ImageBox(x0=x0, top=top, x1=x1, bottom=bottom))
    return boxes


def group_into_bands(boxes: list[ImageBox]) -> list[list[ImageBox]]:
    bands: list[list[ImageBox]] = []
    for box in sorted(boxes, key=lambda item: (item.top, item.x0)):
        matching_band = next(
            (
                band
                for band in bands
                if abs(sum(item.center_y for item in band) / len(band) - box.center_y) <= 42
            ),
            None,
        )
        if matching_band is None:
            bands.append([box])
        else:
            matching_band.append(box)
    return bands


def reference_top(page: pdfplumber.page.Page, source_page: int, reference: str) -> float:
    midpoint = page.width / 2
    matches: list[float] = []
    for word in page.extract_words(x_tolerance=1, y_tolerance=2):
        token = REFERENCE_RE.sub("", str(word["text"]).upper())
        belongs_to_half = float(word["x0"]) < midpoint if source_page % 2 == 0 else float(word["x0"]) >= midpoint
        if token == reference.upper() and belongs_to_half:
            matches.append(float(word["top"]))
    if not matches:
        raise RuntimeError(f"Referința {reference} nu a fost găsită pe pagina {source_page}.")
    return min(matches)


def closest_band(bands: list[list[ImageBox]], word_top: float) -> int:
    return min(
        range(len(bands)),
        key=lambda index: abs(
            word_top - sum(box.center_y for box in bands[index]) / len(bands[index])
        ),
    )


def render_pdf_page(pdftoppm: str, pdf_path: Path, pdf_page: int, output_dir: Path) -> Path:
    prefix = output_dir / f"page-{pdf_page}"
    subprocess.run(
        [
            pdftoppm,
            "-f",
            str(pdf_page),
            "-l",
            str(pdf_page),
            "-png",
            "-r",
            str(RENDER_DPI),
            str(pdf_path),
            str(prefix),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
    )
    matches = list(output_dir.glob(f"{prefix.name}-*.png"))
    if len(matches) != 1:
        raise RuntimeError(f"Randarea paginii PDF {pdf_page} nu a produs exact o imagine.")
    return matches[0]


def save_product_image(rendered_page: Path, band: list[ImageBox], output_path: Path) -> None:
    scale = RENDER_DPI / 72
    padding = 5
    left = max(0, int((min(box.x0 for box in band) - padding) * scale))
    top = max(0, int((min(box.top for box in band) - padding) * scale))
    right = int((max(box.x1 for box in band) + padding) * scale)
    bottom = int((max(box.bottom for box in band) + padding) * scale)

    with Image.open(rendered_page) as page_image:
        crop = page_image.convert("RGB").crop((left, top, right, bottom))
        crop.thumbnail((470, 300), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", CANVAS_SIZE, "white")
        canvas.paste(
            crop,
            ((CANVAS_SIZE[0] - crop.width) // 2, (CANVAS_SIZE[1] - crop.height) // 2),
        )
        output_path.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(output_path, "WEBP", quality=90, method=6)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extrage fotografiile produselor Schneider KNX din catalogul PDF."
    )
    parser.add_argument("pdf", type=Path)
    parser.add_argument(
        "catalogue",
        nargs="?",
        type=Path,
        default=Path("data/schneider-knx-products.json"),
    )
    parser.add_argument(
        "output",
        nargs="?",
        type=Path,
        default=Path("public/images/products/schneider-knx"),
    )
    parser.add_argument("--pdftoppm", default=shutil.which("pdftoppm"))
    args = parser.parse_args()
    if not args.pdftoppm:
        raise RuntimeError("pdftoppm nu este disponibil. Configurează --pdftoppm cu calea completă.")

    catalogue = json.loads(args.catalogue.read_text(encoding="utf-8"))
    products = catalogue["products"]
    page_data: dict[int, tuple[int, list[list[ImageBox]]]] = {}
    product_band: dict[str, tuple[int, int]] = {}

    with pdfplumber.open(args.pdf) as pdf:
        for product in products:
            source_page = int(product["sourcePage"])
            pdf_page = source_page // 2 + 1
            page = pdf.pages[pdf_page - 1]
            if source_page not in page_data:
                bands = group_into_bands(product_image_boxes(page, source_page))
                if not bands:
                    raise RuntimeError(f"Pagina {source_page} nu conține o fotografie de produs.")
                page_data[source_page] = (pdf_page, bands)
            _, bands = page_data[source_page]
            band_index = closest_band(
                bands,
                reference_top(page, source_page, str(product["reference"])),
            )
            product_band[str(product["reference"])] = (source_page, band_index)

    args.output.mkdir(parents=True, exist_ok=True)
    expected_files: set[Path] = set()
    with tempfile.TemporaryDirectory(prefix="schneider-knx-") as temporary_dir:
        temp_path = Path(temporary_dir)
        rendered_pages: dict[int, Path] = {}
        for source_page, (pdf_page, bands) in sorted(page_data.items()):
            if pdf_page not in rendered_pages:
                rendered_pages[pdf_page] = render_pdf_page(
                    str(args.pdftoppm), args.pdf, pdf_page, temp_path
                )
            for band_index, band in enumerate(bands):
                output_path = args.output / f"catalogue-{source_page}-{band_index + 1}.webp"
                save_product_image(rendered_pages[pdf_page], band, output_path)
                expected_files.add(output_path.resolve())

    for existing in args.output.glob("catalogue-*.webp"):
        if existing.resolve() not in expected_files:
            existing.unlink()

    for product in products:
        source_page, band_index = product_band[str(product["reference"])]
        product["imagePath"] = (
            f"/images/products/schneider-knx/catalogue-{source_page}-{band_index + 1}.webp"
        )
    catalogue["imageCount"] = len(expected_files)
    args.catalogue.write_text(
        json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Au fost mapate {len(products)} de produse la {len(expected_files)} fotografii reale."
    )


if __name__ == "__main__":
    main()
