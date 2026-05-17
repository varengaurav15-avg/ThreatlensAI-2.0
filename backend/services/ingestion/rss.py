import httpx
import hashlib
import xml.etree.ElementTree as ET

RSS_FEEDS = [
    "https://krebsonsecurity.com/feed/",
    "https://www.bleepingcomputer.com/feed/",
    "https://feeds.feedburner.com/TheHackersNews",
    "https://www.darkreading.com/rss.xml",
]


async def fetch_rss_threats() -> list:
    """Fetch security RSS feeds and return threat-compatible dicts."""
    results = []
    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        for feed_url in RSS_FEEDS:
            try:
                resp = await client.get(feed_url)
                if resp.status_code != 200:
                    continue
                root = ET.fromstring(resp.content)
                channel = root.find("channel")
                if channel is None:
                    # Atom feed fallback
                    channel = root
                items = channel.findall("item") or root.findall(
                    "{http://www.w3.org/2005/Atom}entry"
                )
                for item in items[:5]:
                    title = (
                        item.findtext("title") or
                        item.findtext("{http://www.w3.org/2005/Atom}title") or ""
                    ).strip()
                    desc = (
                        item.findtext("description") or
                        item.findtext("{http://www.w3.org/2005/Atom}summary") or ""
                    ).strip()
                    if not title:
                        continue
                    uid = hashlib.md5(title.encode()).hexdigest()[:16]
                    results.append({
                        "id":         f"rss-{uid}",
                        "cve":        None,
                        "title":      title[:150],
                        "source":     "RSS",
                        "origin":     "GLOBAL",
                        "cvss_score": 5.0,
                        "epss_score": 0.05,
                        "raw_data":   f"{title}\n\n{desc[:2000]}",
                    })
            except Exception:
                continue
    return results
