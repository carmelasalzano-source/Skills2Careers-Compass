import json
import os
import sys

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILES = {
    "wages": os.path.join(BASE_DIR, "wages.json"),
    "resources": os.path.join(BASE_DIR, "digital_resources.json"),
    "skills": os.path.join(BASE_DIR, "v2_0", "top10_skills.json.txt"),
    "occupations": os.path.join(BASE_DIR, "v2_0", "top10_occ.json.txt")
}

EXPECTED_SECTORS = {"Agriculture", "Renewables", "Digital/AI"}
EXPECTED_COUNTRIES = {"Burundi", "DRC", "Kenya", "Rwanda", "Somalia", "South Sudan", "Tanzania", "Uganda"}

def load_json(path):
    if not os.path.exists(path):
        print(f"❌ File not found: {path}")
        return None
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ JSON Error in {path}: {e}")
        return None

def validate():
    print("🔍 Starting Data Validation...\n")
    errors = 0
    
    # Load Data
    wages = load_json(FILES["wages"])
    resources = load_json(FILES["resources"])
    skills = load_json(FILES["skills"])
    occupations = load_json(FILES["occupations"])

    if not all([wages, resources, skills, occupations]):
        print("\n🛑 Aborting: Could not load all required files.")
        return

    # --- 1. Validate Wages ---
    print(f"📋 Checking Wages ({len(wages)} records)...")
    wage_lookup = set() # (Occ_ID, Country)
    for i, entry in enumerate(wages):
        country = entry.get("Country")
        sector = entry.get("Sector")
        occ_id = entry.get("Occ_ID")

        if country not in EXPECTED_COUNTRIES:
            print(f"  ⚠️ Wages[{i}]: Invalid Country '{country}'")
            errors += 1
        if sector not in EXPECTED_SECTORS:
            print(f"  ⚠️ Wages[{i}]: Invalid Sector '{sector}'")
            errors += 1
        
        if occ_id and country:
            wage_lookup.add((occ_id, country))

    # --- 2. Validate Resources ---
    print(f"📋 Checking Digital Resources...")
    # Check Sector Keys
    resource_keys = set(resources.keys())
    ignored_keys = {"regional_multipliers", "skills_credentials", "global_resources", "evidence_providers"}
    sector_keys = resource_keys - ignored_keys
    
    for sector in sector_keys:
        if sector not in EXPECTED_SECTORS:
            print(f"  ⚠️ Resources: Invalid Top-Level Sector Key '{sector}'")
            errors += 1
        else:
            # Check Country Keys inside Sector
            country_map = resources[sector].get("country_resources", {})
            for country in country_map:
                if country not in EXPECTED_COUNTRIES:
                    print(f"  ⚠️ Resources[{sector}]: Invalid Country Key '{country}'")
                    errors += 1

    # Check Evidence Providers for consistent naming
    for i, provider in enumerate(resources.get("evidence_providers", [])):
        p_sector = provider.get("sector")
        p_country = provider.get("country")
        if p_sector not in EXPECTED_SECTORS and p_sector != "Multi":
             print(f"  ⚠️ Resources[Evidence][{i}]: Invalid Sector '{p_sector}'")
             errors += 1
        if p_country == "DR Congo":
             print(f"  ⚠️ Resources[Evidence][{i}]: Found 'DR Congo', expected 'DRC'")
             errors += 1

    # --- 3. Validate Occupations (Referential Integrity) ---
    print(f"📋 Checking Occupations ({len(occupations)} records)...")
    missing_wages = []
    for i, occ in enumerate(occupations):
        country = occ.get("Country")
        master_id = occ.get("Master_Occ_ID")
        
        if country not in EXPECTED_COUNTRIES:
            print(f"  ⚠️ Occupations[{i}]: Invalid Country '{country}'")
            errors += 1
        
        # Check if Wage Data exists for this occupation
        if master_id and country:
            if (master_id, country) not in wage_lookup:
                print(f"  ⚠️ Data Gap: Occupation '{master_id}' in '{country}' has no matching entry in wages.json")
                errors += 1
                missing_wages.append({
                    "Occ_ID": master_id,
                    "Occupation": occ.get("Occupation_Role", "Unknown"),
                    "Sector": occ.get("Sector", "Unknown"),
                    "Country": country,
                    "Avg_Monthly_Wage": "0",
                    "P25_Monthly_Wage": "0",
                    "P50_Monthly_Wage": "0",
                    "P75_Monthly_Wage": "0",
                    "OJA_Count": "N/A"
                })

    # --- Summary ---
    print("-" * 30)
    if errors == 0:
        print("✅ SUCCESS: Data is consistent.")
    else:
        print(f"❌ FAILED: Found {errors} inconsistencies.")
        
        if missing_wages:
            print("\n💡 To fix missing wage data, append the following JSON to wages.json:")
            print(json.dumps(missing_wages, indent=2))

if __name__ == "__main__":
    validate()