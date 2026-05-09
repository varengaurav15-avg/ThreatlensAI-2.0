import psutil

def kill_process(pid: int) -> dict:
    try:
        proc = psutil.Process(pid)
        name = proc.name()
        proc.kill()
        return {"success": True, "action": f"Killed {name} (PID {pid})"}
    except psutil.NoSuchProcess:
        return {"success": False, "action": f"PID {pid} already gone"}
    except psutil.AccessDenied:
        return {"success": False, "action": f"Access denied for PID {pid}"}