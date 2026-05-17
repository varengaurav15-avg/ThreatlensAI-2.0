"""
File system watcher — runs in a daemon thread.
Scans watched folders every 5 s for new or modified suspicious files.
When something is found it posts to the local backend's /api/incidents/ingest.
"""
import os, time, threading, logging
import httpx

logger = logging.getLogger("file_watcher")

# Extensions considered suspicious
SUSPICIOUS = {
    ".exe", ".dll", ".bat", ".cmd", ".ps1", ".vbs",
    ".js", ".scr", ".pif", ".com", ".msi", ".reg",
    ".hta", ".jar", ".lnk",
}

# Risk labels per extension
RISK = {
    ".exe": ("HIGH",   8.0), ".dll": ("HIGH",   7.5),
    ".bat": ("HIGH",   7.0), ".cmd": ("HIGH",   7.0),
    ".ps1": ("HIGH",   7.5), ".vbs": ("MEDIUM", 6.5),
    ".js":  ("MEDIUM", 6.0), ".scr": ("CRITICAL", 9.0),
    ".pif": ("CRITICAL", 9.0), ".com": ("HIGH", 8.0),
    ".msi": ("MEDIUM", 6.0), ".reg": ("MEDIUM", 6.5),
    ".hta": ("HIGH",   7.5), ".jar": ("MEDIUM", 6.5),
    ".lnk": ("MEDIUM", 6.0),
}

_watch_folders: list[str] = []
_seen: dict[str, float] = {}   # filepath → mtime
_running = False


def _post_incident(name: str, path: str, ext: str):
    sev, cvss = RISK.get(ext, ("MEDIUM", 6.0))
    machine = os.environ.get("COMPUTERNAME", "localhost")
    payload = {
        "type":       "suspicious_file",
        "message":    f"Suspicious {ext.upper()} file detected: {name}",
        "path":       path,
        "extension":  ext,
        "machine":    machine,
        "cvss_score": cvss,
        "severity":   sev,
        "origin":     "ENDPOINT",
    }
    try:
        httpx.post(
            "http://127.0.0.1:8000/api/incidents/ingest",
            json=payload,
            timeout=5,
        )
        logger.info("Incident posted: %s (%s)", name, ext)
    except Exception as e:
        logger.debug("Could not post incident: %s", e)


def _scan():
    for folder in _watch_folders:
        if not os.path.isdir(folder):
            continue
        try:
            for entry in os.scandir(folder):
                if not entry.is_file():
                    continue
                mtime = entry.stat().st_mtime
                key   = entry.path
                ext   = os.path.splitext(entry.name)[1].lower()

                if key not in _seen:
                    # New file
                    _seen[key] = mtime
                    if ext in SUSPICIOUS:
                        logger.warning("Suspicious new file: %s", entry.path)
                        _post_incident(entry.name, entry.path, ext)
                elif _seen[key] != mtime:
                    # Modified file
                    _seen[key] = mtime
                    if ext in SUSPICIOUS:
                        logger.warning("Suspicious modified file: %s", entry.path)
                        _post_incident(entry.name, entry.path, ext)
        except PermissionError:
            pass
        except Exception as e:
            logger.debug("Scan error in %s: %s", folder, e)


def _watcher_loop():
    global _running
    logger.info("File watcher thread started — folders: %s", _watch_folders)
    while _running:
        _scan()
        time.sleep(5)
    logger.info("File watcher stopped")


def start_file_watcher(folders: list[str]):
    """
    Start the file watcher daemon thread.
    Creates any folders that don't exist yet.
    """
    global _watch_folders, _running

    _watch_folders = []
    for f in folders:
        if f:
            os.makedirs(f, exist_ok=True)
            _watch_folders.append(f)

    if not _watch_folders:
        logger.warning("No folders to watch — file watcher not started")
        return

    _running = True
    t = threading.Thread(target=_watcher_loop, daemon=True, name="file-watcher")
    t.start()
