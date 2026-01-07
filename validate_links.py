import json
import os
import urllib.request
import urllib.error
import ssl
import socket

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESOURCE_FILE = os.path.join(BASE_DIR, "digital_resources.json")

# Context for SSL (ignore verify for broader compatibility with some govt sites)
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

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

def check_url(url):
    if not url or url in ["N/A", "#", "TBD", ""]:
        return "SKIP", "Placeholder"
    
    # Basic cleanup
    target_url = url.strip()
    if not target_url.startswith("http"):
        target_url = "https://" + target_url

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        req = urllib.request.Request(target_url, headers=headers)
        # Timeout set to 5 seconds to keep it snappy
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=5) as response:
            code = response.getcode()
            if 200 <= code < 400:
                return "OK", code
            else:
                return "WARN", code
    except urllib.error.HTTPError as e:
        return "FAIL", e.code
    except urllib.error.URLError as e:
        return "FAIL", f"Connection Error: {e.reason}"
    except socket.timeout:
        return "FAIL", "Timeout"
    except Exception as e:
        return "FAIL", str(e)

def extract_links(data, path=""):
    links = []
    if isinstance(data, dict):
        for k, v in data.items():
            current_path = f"{path}.{k}" if path else k
            if k in ["link", "url"] and isinstance(v, str):
                links.append({"path": current_path, "url": v})
            else:
                links.extend(extract_links(v, current_path))
    elif isinstance(data, list):
        for i, item in enumerate(data):
            current_path = f"{path}[{i}]"
            links.extend(extract_links(item, current_path))
    return links

def validate_links():
    print(f"🔍 Loading {RESOURCE_FILE}...")
    data = load_json(RESOURCE_FILE)
    if not data:
        return

    print("📋 Extracting links...")
    all_links = extract_links(data)
    print(f"   Found {len(all_links)} links to check.\n")

    broken_links = []
    skipped_links = []
    
    print(f"{'STATUS':<6} | {'CODE':<15} | {'URL'}")
    print("-" * 80)

    for item in all_links:
        status, code = check_url(item['url'])
        
        if status == "FAIL":
            print(f"❌ {status:<4} | {str(code):<15} | {item['url']}")
            broken_links.append({**item, "error": code})
        elif status == "WARN":
            print(f"⚠️ {status:<4} | {str(code):<15} | {item['url']}")
            broken_links.append({**item, "error": code})
        elif status == "SKIP":
            skipped_links.append(item)
        else:
            print(f"✅ {status:<4} | {str(code):<15} | {item['url']}")

    print("-" * 80)
    print(f"\n🏁 Summary:")
    print(f"   Total Links: {len(all_links)}")
    print(f"   Valid:       {len(all_links) - len(broken_links) - len(skipped_links)}")
    print(f"   Skipped:     {len(skipped_links)} (N/A or placeholders)")
    print(f"   Broken/Warn: {len(broken_links)}")

    if broken_links:
        print("\n⚠️  Broken Links Details:")
        for l in broken_links:
            print(f"   - {l['path']}: {l['url']} ({l['error']})")

if __name__ == "__main__":
    validate_links()