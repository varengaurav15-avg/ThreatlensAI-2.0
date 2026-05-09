import psutil, threading, time

SUSPICIOUS_CHAINS = [
    ("winword.exe",  "cmd.exe"),
    ("winword.exe",  "powershell.exe"),
    ("excel.exe",    "cmd.exe"),
    ("excel.exe",    "powershell.exe"),
    ("chrome.exe",   "cmd.exe"),
    ("acrord32.exe", "cmd.exe"),
]

class ProcessMonitor(threading.Thread):
    def __init__(self, callback):
        super().__init__(daemon=True)
        self.callback  = callback
        self.seen_pids = {}

    def run(self):
        while True:
            for proc in psutil.process_iter(['pid','name','ppid']):
                try:
                    pid  = proc.info['pid']
                    name = proc.info['name'].lower()
                    ppid = proc.info['ppid']
                    if pid in self.seen_pids:
                        continue
                    self.seen_pids[pid] = name
                    if ppid in self.seen_pids:
                        parent = self.seen_pids[ppid]
                        for p, c in SUSPICIOUS_CHAINS:
                            if parent == p and name == c:
                                self.callback({
                                    "type":     "suspicious_process_chain",
                                    "severity": "HIGH",
                                    "pid":      pid,
                                    "message":  f"{parent} spawned {name} — suspicious",
                                    "cvss_score": 8.5
                                })
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
            time.sleep(2)