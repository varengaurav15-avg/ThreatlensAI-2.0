from .kill import kill_process
from .quarantine import quarantine_file

def auto_respond(event: dict, mode: str = "conservative") -> list:
    if mode == "conservative":
        return ["Alert sent — awaiting analyst approval"]

    actions  = []
    severity = event.get("severity","MEDIUM")

    if severity in ["CRITICAL","HIGH"]:
        if pid := event.get("pid"):
            result = kill_process(pid)
            actions.append(result["action"])
        if path := event.get("path"):
            result = quarantine_file(path)
            actions.append(result["action"])

    return actions if actions else ["No automated action taken"]