"""
ThreatLens AI — Threat Hunter Agent
Proactively searches for indicators of compromise on the local machine.
"""
import os
import glob as _glob


def hunt_iocs(ioc_list: list) -> dict:
    """
    Search common locations for given IoCs (file hashes, filenames, IPs).
    Returns a dict of ioc -> list of matching paths.
    """
    findings: dict[str, list] = {}
    search_dirs = [
        os.path.expanduser("~/Documents"),
        os.path.expanduser("~/Downloads"),
        os.path.expanduser("~/Desktop"),
    ]
    for ioc in ioc_list:
        matches = []
        for d in search_dirs:
            try:
                for path in _glob.glob(f"{d}/**/*{ioc}*", recursive=True):
                    matches.append(path)
            except Exception:
                continue
        if matches:
            findings[ioc] = matches
    return findings
