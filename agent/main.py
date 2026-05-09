import json, time, os, sys
from pathlib import Path
from sender import send_event, flush_queue
from monitors.process import ProcessMonitor
from monitors.network import NetworkMonitor
from monitors.filesystem import FileMonitor

CONFIG_PATH = Path(__file__).parent.parent / "backend" / "agent_config.json"

def load_config():
    try:
        with open(CONFIG_PATH) as f:
            return json.load(f)
    except:
        # Defaults if config not set yet
        return {
            "process": True, "network": True,
            "filesystem": True, "logs": True,
            "folders": [str(Path.home()/"Documents"), str(Path.home()/"Downloads")],
            "responseMode": "conservative"
        }

if __name__ == "__main__":
    config = load_config()
    mode   = config.get("responseMode","conservative")
    print(f"ThreatLens Agent starting. Mode: {mode}")

    flush_queue()   # Retry any events that failed while backend was down

    monitors = []
    if config.get("process"):
        pm = ProcessMonitor(callback=send_event)
        pm.start()
        monitors.append(pm)
        print("Process monitor active")

    if config.get("network"):
        nm = NetworkMonitor(callback=send_event)
        nm.start()
        monitors.append(nm)
        print("Network monitor active")

    if config.get("filesystem"):
        folders = config.get("folders",[str(Path.home())])
        fm = FileMonitor(paths=folders, callback=send_event)
        fm.start()
        print(f"File monitor active — watching {len(folders)} folders")

    print("Agent running. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Agent stopped.")