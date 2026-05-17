"""
Collects local machine stats — CPU, memory, OS, IP, hostname.
Used by the /api/endpoints route to show real machine data.
"""
import os, socket, platform, logging
import psutil

logger = logging.getLogger("endpoint_stats")


def get_machine_name() -> str:
    return os.environ.get("COMPUTERNAME", socket.gethostname())


def get_local_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def get_os_name() -> str:
    try:
        release = platform.release()
        version = platform.version()
        # Windows 11 reports as release "10" with build >= 22000
        build = int(version.split(".")[2]) if version.count(".") >= 2 else 0
        if build >= 22000:
            return "Windows 11"
        return f"Windows {release}"
    except Exception:
        return f"Windows {platform.release()}"


def get_stats() -> dict:
    """Returns current CPU % and memory % for the local machine."""
    try:
        cpu = psutil.cpu_percent(interval=0.3)
        mem = psutil.virtual_memory().percent
        return {"cpu": round(cpu, 1), "mem": round(mem, 1)}
    except Exception as e:
        logger.warning("psutil error: %s", e)
        return {"cpu": 0.0, "mem": 0.0}
