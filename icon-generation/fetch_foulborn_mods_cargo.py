# Dead code, not currently used anywhere - superseded by fetch_foulborn_data.py,
# which pulls the same data from PoB's ModFoulbornMap.lua instead of scraping
# the wiki's Cargo table here, which never worked reliably. Left in case a
# Cargo-based approach becomes useful again in the future.
import json
import os

from fetch_wiki_data import request_data_from_wiki, save_file


def fetch_foulborn_mods_cargo():
    table = "foulborn_modifiers"
    fields = [
        "original_mod_id",
        "original_stat_text",
        "foulborn_mod_id",
        "foulborn_stat_text",
    ]
    data = request_data_from_wiki([table], fields)
    fixed = {
        item["foulborn_mod_id"]: {
            "original_mod_id": item["original_mod_id"],
            "original_stat_text": item["original_stat_text"],
            "foulborn_stat_text": item["foulborn_stat_text"],
        }
        for item in data
    }
    save_file("foulborn_modifiers", fixed)
    print(f"foulborn_modifiers: {len(fixed)} entries fetched from Cargo")
    return fixed


if __name__ == "__main__":
    fetch_foulborn_mods_cargo()
