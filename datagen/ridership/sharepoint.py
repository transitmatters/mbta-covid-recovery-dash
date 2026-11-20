"""Anonymous downloads from the MBTA's public ridership SharePoint folders.

Ported from transitmatters/data-ingestion (ingestor/chalicelib/ridership/sharepoint.py).
"""

import json
from datetime import date
from re import Pattern
from typing import List, Optional, Tuple
from urllib.parse import quote

import requests

SHAREPOINT_TIMEOUT = 30  # seconds, per request

# SharePoint serves an "unsupported browser" page without g_listData to unknown user agents.
DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
BASE_URL = "https://mbta.sharepoint.com/sites/PublicData/Shared%20Documents/Forms/AllItems.aspx"
DOWNLOAD_HOST = "https://mbta.sharepoint.com"


class SharepointConnection:
    def __init__(self, user_agent: str = DEFAULT_USER_AGENT) -> None:
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": user_agent})

    def _get_listing(self, url: str) -> List[dict]:
        response = self.session.get(url, allow_redirects=True, timeout=SHAREPOINT_TIMEOUT)
        response.raise_for_status()
        return parse_g_list_data(response.text)

    def _list_folder(self, folder_path: str) -> List[dict]:
        return self._get_listing(f"{BASE_URL}?id={quote(folder_path)}&p=true&ga=1")

    def list_files(self, share_url: str) -> List[dict]:
        """List every file under a sharing link, descending into subfolders."""
        files = []
        pending = self._get_listing(share_url)
        while pending:
            item = pending.pop()
            if item["is_folder"]:
                pending.extend(self._list_folder(item["url"]))
            else:
                files.append(item)
        return files

    def download(self, file: dict, output_path: str) -> None:
        response = self.session.get(f"{DOWNLOAD_HOST}{file['url']}?download=1", timeout=SHAREPOINT_TIMEOUT)
        response.raise_for_status()
        with open(output_path, "wb") as f:
            f.write(response.content)


def parse_g_list_data(html: str) -> List[dict]:
    """Pull the file listing out of the g_listData variable embedded in a SharePoint folder page."""
    start_marker = "g_listData = "
    start_pos = html.find(start_marker)
    if start_pos == -1:
        raise ValueError("Could not find g_listData in SharePoint page")
    list_data, _ = json.JSONDecoder().raw_decode(html, start_pos + len(start_marker))
    rows = list_data.get("ListData", {}).get("Row")
    if rows is None:
        raise ValueError("Unexpected g_listData structure")
    return [
        {
            "name": row.get("FileLeafRef"),
            "url": row.get("FileRef"),
            "is_folder": row.get("FSObjType") == "1",
        }
        for row in rows
    ]


def find_newest_dated_file(files: List[dict], pattern: Pattern) -> Optional[Tuple[dict, date]]:
    """Return the file whose name matches `pattern` (year, month, day groups) with the latest date."""
    newest = None
    for file in files:
        match = pattern.match(file["name"])
        if match:
            file_date = date(int(match[1]), int(match[2]), int(match[3]))
            if newest is None or file_date > newest[1]:
                newest = (file, file_date)
    return newest


def find_file(files: List[dict], pattern: Pattern) -> Optional[dict]:
    return next((file for file in files if pattern.search(file["name"])), None)
