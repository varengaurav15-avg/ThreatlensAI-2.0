from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time, collections

ENCRYPTED_EXTENSIONS = {'.encrypted','.locked','.crypto','.crypt','.enc','.zzzzz'}

class RansomwareDetector(FileSystemEventHandler):
    def __init__(self, callback):
        self.callback = callback
        self.changes  = collections.deque(maxlen=200)

    def on_modified(self, event):
        if event.is_directory: return
        self.changes.append(time.time())
        recent = [t for t in self.changes if time.time()-t < 5]
        if len(recent) >= 20:
            self.callback({
                "type":     "ransomware_behaviour",
                "severity": "CRITICAL",
                "path":     event.src_path,
                "message":  f"Rapid file modification — {len(recent)} files in 5s",
                "cvss_score": 10.0
            })

    def on_created(self, event):
        if any(event.src_path.endswith(ext) for ext in ENCRYPTED_EXTENSIONS):
            self.callback({
                "type":     "encrypted_file_extension",
                "severity": "CRITICAL",
                "path":     event.src_path,
                "message":  f"Encrypted file extension detected: {event.src_path}",
                "cvss_score": 10.0
            })

class FileMonitor:
    def __init__(self, paths: list, callback):
        self.observer = Observer()
        handler = RansomwareDetector(callback)
        for path in paths:
            try:
                self.observer.schedule(handler, path, recursive=True)
            except Exception as e:
                print(f"Cannot watch {path}: {e}")

    def start(self):
        self.observer.start()