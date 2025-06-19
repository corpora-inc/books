import sys
import requests
import webbrowser
from urllib.parse import quote
from pathlib import Path


def is_valid_image_response(resp: requests.Response) -> bool:
    return resp.status_code == 200 and "image" in resp.headers.get("Content-Type", "")


def fetch_openverse_results(prompt: str, license_filter: str = "commercial") -> list:
    query = quote(prompt)
    url = f"https://api.openverse.org/v1/images?q={query}&license_type={license_filter}"
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        return res.json().get("results", [])
    except Exception as e:
        print(f"[ERROR] Failed to fetch Openverse results: {e}")
        return []


def download_image(
    image_url: str, prompt: str, index: int, save_dir: str = "images"
) -> Path | None:
    try:
        img_resp = requests.get(image_url, stream=True, timeout=10)
        if not is_valid_image_response(img_resp):
            print(f"[SKIP] Not a valid image: {image_url}")
            return None

        content_type = img_resp.headers["Content-Type"]
        ext = content_type.split("/")[-1].split(";")[0]
        Path(save_dir).mkdir(parents=True, exist_ok=True)
        filename = f"{quote(prompt)[:40]}_{index}.{ext}"
        save_path = Path(save_dir) / filename

        with open(save_path, "wb") as f:
            for chunk in img_resp.iter_content(1024):
                f.write(chunk)

        print(f"[SUCCESS] Saved image to: {save_path}")
        return save_path

    except Exception as e:
        print(f"[ERROR] Failed to download {image_url}: {e}")
        return None


def prompt_user_selection(results: list, prompt: str) -> int | None:
    print("\n--- Openverse Search Results ---\n")

    for i, item in enumerate(results):
        print(f"[{i}] Title: {item.get('title')}")
        print(f"     Source: {item.get('foreign_landing_url')}")
        print(f"     Image URL: {item.get('url')}")
        print("-" * 60)

    while True:
        choice = (
            input(
                "Enter image # to download, 'vN' to open in browser, or 'q' to quit: "
            )
            .strip()
            .lower()
        )

        if choice == "q":
            return None
        elif choice.startswith("v"):
            try:
                index = int(choice[1:])
                webbrowser.open(results[index].get("url"))
            except (IndexError, ValueError):
                print("[ERROR] Invalid browser preview index.")
        else:
            try:
                index = int(choice)
                if 0 <= index < len(results):
                    return index
                else:
                    print("[ERROR] Index out of range.")
            except ValueError:
                print("[ERROR] Invalid input.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cc_image_urls.py '<search prompt>'")
        sys.exit(1)

    prompt = sys.argv[1]
    results = fetch_openverse_results(prompt)

    if not results:
        print("[INFO] No results found.")
        sys.exit(0)

    selected_index = prompt_user_selection(results, prompt)
    if selected_index is None:
        print("[INFO] Exiting without download.")
        sys.exit(0)

    selected_image_url = results[selected_index].get("url")
    download_image(selected_image_url, prompt, selected_index)
