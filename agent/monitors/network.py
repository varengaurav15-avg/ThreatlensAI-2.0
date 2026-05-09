import psutil, threading, time, requests, os

class NetworkMonitor(threading.Thread):
    def __init__(self, callback):
        super().__init__(daemon=True)
        self.callback     = callback
        self.malicious_ips = set()
        self.load_malicious_ips()

    def load_malicious_ips(self):
        try:
            resp = requests.get(
                "http://localhost:8000/api/sources/malicious-ips",
                timeout=5
            )
            self.malicious_ips = set(resp.json().get("ips",[]))
            print(f"Loaded {len(self.malicious_ips)} malicious IPs")
        except:
            print("Could not load malicious IP list — will retry")

    def run(self):
        while True:
            try:
                for conn in psutil.net_connections(kind='inet'):
                    if conn.raddr and conn.status == 'ESTABLISHED':
                        ip = conn.raddr.ip
                        if ip in self.malicious_ips:
                            self.callback({
                                "type":       "malicious_ip_connection",
                                "severity":   "CRITICAL",
                                "remote_ip":  ip,
                                "message":    f"Connection to malicious IP: {ip}",
                                "cvss_score": 9.5
                            })
            except Exception as e:
                pass
            time.sleep(5)