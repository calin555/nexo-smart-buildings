from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any

import pdfplumber


CODE_PATTERN = r"(?:C2E|CCT|LSS|MTN|NP|NUX|NU|R9M)[A-Z0-9_.-]+"
CODE_RE = re.compile(rf"\b{CODE_PATTERN}\b")

TITLE_FIXES = {
    "MTN617419": "Push-button, 4-gang plus",
    "MTN617425": "Push-button, 4-gang plus",
    "MTN617444": "Push-button, 4-gang plus",
    "MTN627814": "Push-button, 4-gang plus",
    "MTN627860": "Push-button, 4-gang plus",
    "MTN617519": "Push-button, 4-gang plus with IR receiver",
    "MTN627914": "Push-button, 4-gang plus with IR receiver",
    "MTN627960": "Push-button, 4-gang plus with IR receiver",
    "MTN619225": "Rockers for 2-gang push-button module",
    "MTN625214": "Rockers for 2-gang push-button module",
    "MTN625260": "Rockers for 2-gang push-button module",
    "MTN619519": "Rockers for 2-gang push-button module with 1/0 and up/down arrow imprint",
    "MTN619525": "Rockers for 2-gang push-button module with 1/0 and up/down arrow imprint",
    "MTN625299": "KNX push-button module, 2-gang",
    "MTN630719": "KNX ARGUS Presence Basic",
    "MTN630819": "KNX ARGUS Presence",
    "MTN639150": "Valve adapter VA50 for thermoelectric valve drive",
    "MTN639178": "Valve adapter VA78 for thermoelectric valve drive",
    "MTN639180": "Valve adapter VA80 for thermoelectric valve drive",
    "MTN6513-1202": "SpaceLogic KNX Power Supply 640 mA",
    "MTN6513-1203": "SpaceLogic KNX Power Supply 320 mA",
    "MTN663591": "Wind sensor with 0-10 V interface",
    "MTN663592": "Wind sensor with 0-10 V interface and heating",
    "MTN683890": "SpaceLogic KNX power supply REG-K/640 mA with emergency power input",
    "MTN684064": "SpaceLogic KNX power supply REG-K/640 mA",
    "MTN689701": "Bus connecting terminal",
    "MTN689702": "Branch terminal, yellow/white",
}

VARIANT_TRANSLATIONS = {
    "white": "alb",
    "white, glossy": "alb lucios",
    "polar white": "alb polar",
    "polar white, glossy": "alb polar lucios",
    "active white, glossy": "alb activ lucios",
    "painted white": "alb vopsit",
    "jet black": "negru intens",
    "matt black": "negru mat",
    "dark bronze": "bronz închis",
    "dark grey": "gri închis",
    "light grey": "gri deschis",
    "grey": "gri",
    "anthracite": "antracit",
    "aluminium": "aluminiu",
    "stainless steel": "oțel inoxidabil",
    "antique brass": "alamă antichizată",
    "silver": "argintiu",
    "black": "negru",
    "black/white": "negru/alb",
    "glass": "sticlă",
    "metal": "metal",
    "thermoplastic": "termoplastic",
    "universal": "universal",
}


def normalize_repeated_words(value: str) -> str:
    words = value.split()
    result: list[str] = []
    for word in words:
        if not result or result[-1].casefold() != word.casefold():
            result.append(word)
    return " ".join(result)


def translate_variant(value: str) -> str:
    translated = value.strip(" ,-_")
    translated = re.sub(
        r"^(\d+)-year subscription for (\d+) controllers?$",
        lambda match: f"abonament pe {match.group(1)} ani pentru {match.group(2)} "
        f"{'controler' if match.group(2) == '1' else 'controlere'}",
        translated,
        flags=re.IGNORECASE,
    )
    translated = re.sub(
        r"^Monthly subscription for (\d+) controllers?$",
        lambda match: f"abonament lunar pentru {match.group(1)} "
        f"{'controler' if match.group(1) == '1' else 'controlere'}",
        translated,
        flags=re.IGNORECASE,
    )
    for source, target in sorted(VARIANT_TRANSLATIONS.items(), key=lambda item: -len(item[0])):
        translated = re.sub(rf"\b{re.escape(source)}\b", target, translated, flags=re.IGNORECASE)
    replacements = [
        (r"\bchannels\b", "canale"),
        (r"\bchannel\b", "canal"),
        (r"\bcircuits\b", "circuite"),
        (r"\bcircuit\b", "circuit"),
        (r"\bsubscription for\b", "abonament pentru"),
        (r"\bcontroller\b", "controler"),
        (r"\byear\b", "an"),
        (r"\bmonthly\b", "lunar"),
        (r"\bmetallic\b", "metalic"),
        (r"\bmocca\b", "moca"),
        (r"\bglossy\b", "lucios"),
    ]
    for pattern, replacement in replacements:
        translated = re.sub(pattern, replacement, translated, flags=re.IGNORECASE)
    translated = re.sub(r"\balb lucios alb\b", "alb lucios", translated, flags=re.IGNORECASE)
    translated = re.sub(r"\balb polar lucios alb polar\b", "alb polar lucios", translated, flags=re.IGNORECASE)
    return normalize_repeated_words(translated).strip()


def translate_title(value: str) -> str:
    translated = value.replace("thermomstat", "thermostat").replace("transformerts", "transformers")
    dynamic_rocker = re.fullmatch(
        r"Rocker (\d+)-gang for KNX Push Button Dynamic Labeling", translated, flags=re.IGNORECASE
    )
    if dynamic_rocker:
        return f"Clapetă cu {dynamic_rocker.group(1)} elemente pentru butonul KNX cu etichetare dinamică"
    replacements = [
        ("Room Temperature Control Unit", "Unitate de control al temperaturii ambientale"),
        ("room temperature control unit", "unitate de control al temperaturii ambientale"),
        ("Blind/Switch Actuator", "Actuator pentru jaluzele și comutare"),
        ("Blind/Switch actuator", "Actuator pentru jaluzele și comutare"),
        ("Hybrid Switch Actuator", "Actuator hibrid de comutare"),
        ("Switch Actuator", "Actuator de comutare"),
        ("Switch actuator", "Actuator de comutare"),
        ("Blind actuator", "Actuator pentru jaluzele"),
        ("Dimming Actuator", "Actuator de dimare"),
        ("Dimming actuator", "Actuator de dimare"),
        ("Heating actuator", "Actuator de încălzire"),
        ("Fan coil actuator", "Actuator pentru ventiloconvector"),
        ("Push-Button Interface", "Interfață pentru butoane"),
        ("Push-button interface", "Interfață pentru butoane"),
        ("Push Button", "Buton"),
        ("Push-button", "Buton"),
        ("push-button", "buton"),
        ("Rockers", "Clapete"),
        ("Rocker", "Clapetă"),
        ("rockers", "clapete"),
        ("rocker", "clapetă"),
        ("Movement Detector", "Detector de mișcare"),
        ("movement detector", "detector de mișcare"),
        ("Presence Detector", "Detector de prezență"),
        ("presence detector", "detector de prezență"),
        ("Presence", "Prezență"),
        ("Wind sensor", "Senzor de vânt"),
        ("Weather station", "Stație meteo"),
        ("Weather Station", "Stație meteo"),
        ("Thermostat", "Termostat"),
        ("thermostat", "termostat"),
        ("Energy Meter", "Contor de energie"),
        ("Power Supply", "Sursă de alimentare"),
        ("power supply", "sursă de alimentare"),
        ("Bus connecting terminal", "Bornă de conectare magistrală"),
        ("Branch terminal", "Bornă de derivație"),
        ("Valve adapter", "Adaptor de vană"),
        ("valve drive", "servomotor de vană"),
        ("Touch Unit", "Unitate tactilă"),
        ("Touch IP", "Ecran tactil IP"),
        ("Logic Controller", "Controler logic"),
        ("Logic Module", "Modul logic"),
        ("System Coupler", "Cuplor de sistem"),
        ("Line Coupler", "Cuplor de linie"),
        ("IP Router", "Router IP"),
        ("Data Interface", "Interfață de date"),
        ("Year Time Switch", "Ceas programator anual"),
        ("Time Switch", "Ceas programator"),
        ("Wired", "cablat"),
        ("Channels", "canale"),
        ("Dynamic Labeling", "cu etichetare dinamică"),
        ("Binary input", "Intrare binară"),
        ("binary input", "intrare binară"),
        ("Dismantling protection", "Protecție anti-demontare"),
        ("current transformers", "transformatoare de curent"),
        ("current transformer", "transformator de curent"),
        ("SET of 6", "Set de 6"),
        ("Module Link", "Modul de legătură"),
        ("DIN Rail", "pentru șină DIN"),
        ("Control unit", "Unitate de control"),
        ("Remote control", "Telecomandă"),
        ("remote control", "telecomandă"),
        ("with manual mode", "cu comandă manuală"),
        ("with light control and IR receiver", "cu control al luminii și receptor IR"),
        ("with IR receiver", "cu receptor IR"),
        ("with room temperature control unit", "cu unitate de control al temperaturii"),
        ("for KNX", "pentru KNX"),
        (" for ", " pentru "),
        (" with ", " cu "),
        ("Flush Mounted", "încastrat"),
        ("flush-mounted", "încastrat"),
        ("Universal", "universal"),
        ("double", "dublu"),
    ]
    for source, target in replacements:
        translated = translated.replace(source, target)
    translated = re.sub(r"\b(2|4|5|6|8) key\b", r"\1 taste", translated)
    translated = re.sub(r"\b(1|2|3|4|6|8|12|16|24)-gang\b", r"\1 canale", translated)
    translated = re.sub(r"^(.*?) KNX buton,?", r"Buton KNX \1,", translated, flags=re.IGNORECASE)
    translated = re.sub(r"^KNX Buton\b", "Buton KNX", translated, flags=re.IGNORECASE)
    translated = re.sub(r"^(.*?) KNX termostat\b", r"Termostat KNX \1", translated, flags=re.IGNORECASE)
    translated = re.sub(
        r"^KNX Secure 4[ʺ\"] Unitate tactilă$",
        "Unitate tactilă KNX Secure 4″",
        translated,
    )
    translated = translated.replace("KNX ARGUS Prezență", "Detector de prezență KNX ARGUS")
    translated = re.sub(r"\bmodule\b", "modul", translated, flags=re.IGNORECASE)
    return normalize_repeated_words(translated).strip()


def product_category(section: str, title: str) -> str:
    combined = f"{section} {title}".casefold()
    if "dimming" in combined or "dali" in combined or "1-10 v" in combined:
        return "Iluminat inteligent"
    if "blind" in combined or "push-button" in combined or "rocker" in combined:
        return "Întrerupătoare & umbrire"
    if "switch actuator" in combined or "binary input" in combined:
        return "Prize / relee smart"
    if "temperature" in combined or "heating" in combined or "fan coil" in combined or "valve" in combined:
        return "Confortul casei"
    if "controller" in combined or "gateway" in combined or "system components" in combined or "software" in combined or "remote" in combined or "power suppl" in combined or "coupler" in combined or "router" in combined or "interface" in combined:
        return "Gateway-uri & telecomenzi"
    if "movement" in combined or "presence" in combined or "sensor" in combined or "energy" in combined or "accessories" in combined:
        return "Accesorii & senzori"
    return "Ecosisteme Smart Home"


def illustration_for(category: str, title: str) -> str:
    combined = f"{category} {title}".casefold()
    if "jaluzele" in combined or "blind" in combined:
        return "BLINDS"
    if "temperatur" in combined or "încălz" in combined or "ventiloconvector" in combined or "vană" in combined:
        return "CLIMATE"
    if "energie" in combined:
        return "ENERGY"
    return "CUSTOM"


def description_ro(title_en: str, title_ro: str, variant_ro: str, section: str, page: int) -> str:
    combined = f"{section} {title_en}".casefold()
    if "push-button" in combined or "rocker" in combined:
        text = "Element KNX pentru comanda iluminatului, jaluzelelor, scenelor și funcțiilor de cameră, configurabil în ETS."
    elif "blind" in combined:
        text = "Actuator KNX pentru controlul independent al jaluzelelor, rulourilor sau copertinelor, cu poziționare și funcții de siguranță."
    elif "dimming" in combined or "dali" in combined or "1-10 v" in combined:
        text = "Echipament KNX pentru controlul și reglarea iluminatului, cu scene și parametri configurabili în ETS."
    elif "switch actuator" in combined or "binary input" in combined:
        text = "Echipament KNX pentru comutarea sarcinilor sau preluarea contactelor binare, destinat montajului profesional și configurării ETS."
    elif "temperature" in combined or "heating" in combined or "fan coil" in combined or "valve" in combined:
        text = "Componentă KNX pentru controlul temperaturii și instalațiilor HVAC, utilizabilă în automatizarea zonală a încăperilor."
    elif "movement" in combined or "presence" in combined:
        text = "Senzor KNX pentru detectarea mișcării sau prezenței și automatizarea iluminatului, climatului și scenariilor de clădire."
    elif "energy" in combined:
        text = "Componentă pentru măsurarea și monitorizarea energiei, integrabilă în sisteme KNX și de management al clădirii."
    elif "power suppl" in combined:
        text = "Sursă de alimentare pentru infrastructura KNX, destinată montajului în tabloul electric și funcționării continue a magistralei."
    elif "gateway" in combined or "controller" in combined or "router" in combined or "coupler" in combined or "interface" in combined:
        text = "Componentă de sistem pentru conectarea, programarea sau integrarea instalației KNX cu rețele și servicii de automatizare."
    elif "sensor" in combined or "weather" in combined:
        text = "Senzor pentru colectarea datelor de mediu și transmiterea lor către automatizarea KNX sau intrările analogice compatibile."
    elif "remote" in combined or "software" in combined or "subscription" in combined:
        text = "Soluție Schneider Electric pentru configurarea, administrarea sau accesul la instalațiile SpaceLogic KNX."
    else:
        text = f"{title_ro} din gama Schneider Electric SpaceLogic KNX, pentru integrare în instalații rezidențiale și comerciale."
    if variant_ro:
        text += f" Varianta: {variant_ro}."
    text += f" Traducere și sinteză tehnică după catalogul Schneider Electric KNX 2025, pagina {page}."
    return text[:500]


def parse_catalog(source: Path) -> list[dict[str, Any]]:
    with pdfplumber.open(source) as pdf:
        index_text = "\n".join(
            (pdf.pages[index].extract_text(x_tolerance=2, y_tolerance=3) or "")
            for index in (121, 122)
        )
        codes = sorted(set(CODE_RE.findall(index_text)))
        page_map: dict[str, list[int]] = {}
        for code in codes:
            match = re.search(rf"\b{re.escape(code)}\b\s+([0-9][0-9, ]*)", index_text)
            page_map[code] = [int(value) for value in re.findall(r"\d+", match.group(1))] if match else []

        cache: dict[int, tuple[list[dict[str, Any]], list[dict[str, Any]]]] = {}

        def catalogue_page(catalogue_number: int) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
            cached = cache.get(catalogue_number)
            if cached:
                return cached
            pdf_number = catalogue_number // 2 + 1
            page = pdf.pages[pdf_number - 1]
            middle = page.width / 2
            crop = (
                page.crop((0, 0, middle, page.height))
                if catalogue_number % 2 == 0
                else page.crop((middle, 0, page.width, page.height))
            )
            words = crop.extract_words(extra_attrs=["fontname", "size"])
            grouped: defaultdict[float, list[dict[str, Any]]] = defaultdict(list)
            for word in words:
                grouped[round(float(word["top"]), 1)].append(word)
            lines: list[dict[str, Any]] = []
            for top, line_words in sorted(grouped.items()):
                ordered = sorted(line_words, key=lambda value: float(value["x0"]))
                lines.append(
                    {
                        "top": top,
                        "text": " ".join(str(word["text"]) for word in ordered),
                        "bold": all("Bold" in str(word["fontname"]) for word in ordered),
                        "maxsize": max(float(word["size"]) for word in ordered),
                    }
                )
            cache[catalogue_number] = (words, lines)
            return words, lines

        parsed: list[dict[str, Any]] = []
        for index, code in enumerate(codes):
            cited_pages = [page for page in page_map[code] if 48 <= page <= 241]
            detailed_pages = [page for page in cited_pages if page >= 68]
            preferred = (detailed_pages or cited_pages)[0]
            found: tuple[int, list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]] | None = None
            for page_number in [preferred, *[page for page in cited_pages if page != preferred]]:
                words, lines = catalogue_page(page_number)
                matches = [word for word in words if str(word["text"]).rstrip(".,") == code]
                if matches:
                    found = (page_number, words, lines, matches[0])
                    break
            if not found:
                raise ValueError(f"Referința {code} nu a fost găsită în paginile indicate de index.")

            page_number, words, lines, code_word = found
            code_top = float(code_word["top"])
            version_lines = [line for line in lines if line["text"] == "Version Art. no." and line["top"] < code_top]
            version_top = max(version_lines, key=lambda line: line["top"])["top"] if version_lines else 0
            headings = [
                line
                for line in lines
                if line["top"] < version_top
                and line["bold"]
                and 6.8 <= line["maxsize"] <= 7.2
                and not CODE_RE.search(line["text"])
                and not line["text"].endswith(":")
            ]
            title_en = TITLE_FIXES.get(code, headings[-1]["text"] if headings else "Componentă SpaceLogic KNX")
            same_row_codes = sorted(
                [
                    word
                    for word in words
                    if abs(float(word["top"]) - code_top) <= 2
                    and CODE_RE.fullmatch(str(word["text"]).rstrip(".,"))
                ],
                key=lambda word: float(word["x0"]),
            )
            code_position = next(
                position
                for position, word in enumerate(same_row_codes)
                if str(word["text"]).rstrip(".,") == code
            )
            left_boundary = (
                (float(same_row_codes[code_position - 1]["x1"]) + float(code_word["x0"])) / 2
                if code_position > 0
                else 0
            )
            right_boundary = (
                (float(code_word["x1"]) + float(same_row_codes[code_position + 1]["x0"])) / 2
                if code_position + 1 < len(same_row_codes)
                else float("inf")
            )
            row_words = [
                str(word["text"])
                for word in words
                if abs(float(word["top"]) - code_top) <= 2
                and left_boundary <= float(word["x0"]) <= right_boundary
                and str(word["text"]).rstrip(".,") != code
                and not CODE_RE.fullmatch(str(word["text"]).rstrip(".,"))
                and str(word["text"]) not in {"nn", "New", "Discontinued"}
            ]
            variant_ro = translate_variant(" ".join(row_words))
            title_ro = translate_title(title_en)
            name_base = f"{title_ro}"
            if variant_ro and variant_ro.casefold() not in name_base.casefold():
                name_base += f" - {variant_ro}"
            suffix = f" - {code}"
            name = f"{name_base[: max(20, 140 - len(suffix))].rstrip(' ,-')}{suffix}"
            section = next((line["text"] for line in lines if abs(line["top"] - 36.4) < 1), "KNX")
            category = product_category(section, title_en)
            parsed.append(
                {
                    "reference": code,
                    "sourcePage": page_number,
                    "name": name,
                    "description": description_ro(title_en, title_ro, variant_ro, section, page_number),
                    "category": category,
                    "illustration": illustration_for(category, title_en),
                    "sortOrder": 1000 + index,
                }
            )
        return parsed


def main() -> None:
    parser = argparse.ArgumentParser(description="Extrage catalogul Schneider Electric SpaceLogic KNX.")
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    products = parse_catalog(args.source)
    if len(products) != 342:
        raise ValueError(f"Catalog incomplet: au fost extrase {len(products)} produse în loc de 342.")
    references = [product["reference"] for product in products]
    if len(references) != len(set(references)):
        raise ValueError("Catalogul conține referințe duplicate.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(
            {
                "source": "Schneider Electric SpaceLogic KNX - Home and building automation solutions 2025-10",
                "catalogueCode": "LSB02779_EN",
                "productCount": len(products),
                "products": products,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Au fost extrase {len(products)} produse în {args.output}.")


if __name__ == "__main__":
    main()
