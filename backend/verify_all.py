import urllib.request
import json

def test_endpoints():
    base = "http://localhost:8000"
    endpoints = [
        ("GET", f"{base}/api/health", None),
        ("GET", f"{base}/api/crops/disease-diagnosis/Tomato?symptom=concentric%20rings", None),
        ("POST", f"{base}/api/crops/recommend", {"soil_type": "Red Sandy Loam", "water_availability": "Borewell", "budget_inr": 80000}),
        ("GET", f"{base}/api/market/overview", None),
        ("GET", f"{base}/api/market/forecast/Tomato", None),
        ("POST", f"{base}/api/market/sell-advisor", {"commodity": "Tomato", "quantity_qtl": 80, "holding_period_days": 15}),
        ("GET", f"{base}/api/market/compare-mandis?commodity=Tomato&district=Mandya", None),
        ("GET", f"{base}/api/nutrition/profile/Ragi", None),
        ("POST", f"{base}/api/economics/calculate", {"crop_name": "Ragi (Finger Millet)", "area_hectares": 2.0}),
    ]

    print("========================================")
    print("AGRITWIN AI 3.0 API INTEGRATION AUDIT")
    print("========================================")
    all_passed = True
    for method, url, payload in endpoints:
        try:
            data = json.dumps(payload).encode() if payload else None
            req = urllib.request.Request(url, data=data, method=method)
            if payload:
                req.add_header("Content-Type", "application/json")
            with urllib.request.urlopen(req, timeout=5) as response:
                status = response.status
                body = json.loads(response.read().decode())
                preview = list(body.keys()) if isinstance(body, dict) else f"Count={len(body)}"
                print(f"[PASS] {method:<5} {url.split('?')[0].replace(base, ''):<32} -> HTTP {status} (Keys: {preview})")
        except Exception as e:
            print(f"[FAIL] {method:<5} {url}: {e}")
            all_passed = False

    print("========================================")
    print(f"OVERALL STATUS: {'ALL ENDPOINTS VERIFIED & FUNCTIONAL' if all_passed else 'SOME ENDPOINTS FAILED'}")
    print("========================================")

if __name__ == "__main__":
    test_endpoints()

