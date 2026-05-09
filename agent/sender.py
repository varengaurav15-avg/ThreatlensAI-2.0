import requests, socket, json, os, time

BACKEND      = "http://localhost:8000"
MACHINE_NAME = socket.gethostname()
QUEUE_FILE   = "event_queue.json"

def send_event(event: dict):
    event["machine"] = MACHINE_NAME
    try:
        resp = requests.post(
            f"{BACKEND}/api/incidents/ingest",
            json=event, timeout=5
        )
        print(f"Sent: {event['type']} → {resp.json().get('severity','?')}")
    except Exception as e:
        # Store locally — retry on next run
        with open(QUEUE_FILE, "a") as f:
            f.write(json.dumps(event) + "\n")
        print(f"Backend unreachable. Queued: {event['type']}")

def flush_queue():
    if not os.path.exists(QUEUE_FILE):
        return
    with open(QUEUE_FILE) as f:
        events = [json.loads(l) for l in f if l.strip()]
    if not events:
        return
    sent = 0
    for event in events:
        try:
            requests.post(f"{BACKEND}/api/incidents/ingest", json=event, timeout=5)
            sent += 1
        except:
            break
    if sent > 0:
        remaining = events[sent:]
        with open(QUEUE_FILE,"w") as f:
            for e in remaining:
                f.write(json.dumps(e)+"\n")
        print(f"Flushed {sent} queued events")