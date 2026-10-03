import platform
import socket
from datetime import datetime

import psutil


def get_system_info():
    return {
        "system": platform.system(),
        "release": platform.release(),
        "version": platform.version(),
        "machine": platform.machine(),
        "processor": platform.processor(),
        "python_version": platform.python_version(),
        "timestamp": datetime.now().isoformat(),
    }


def get_cpu_info():
    freq = psutil.cpu_freq()
    return {
        "cpu_count": psutil.cpu_count(logical=False),
        "cpu_count_logical": psutil.cpu_count(logical=True),
        "cpu_percent": psutil.cpu_percent(interval=1),
        "cpu_freq": freq.current if freq else None,
    }


def get_memory_info():
    vm = psutil.virtual_memory()
    sm = psutil.swap_memory()
    return {
        "total_gb": round(vm.total / (1024 ** 3), 2),
        "available_gb": round(vm.available / (1024 ** 3), 2),
        "used_gb": round(vm.used / (1024 ** 3), 2),
        "percent": vm.percent,
        "swap_total_gb": round(sm.total / (1024 ** 3), 2),
        "swap_used_gb": round(sm.used / (1024 ** 3), 2),
        "swap_percent": sm.percent,
    }


def get_disk_info():
    disks = []
    for part in psutil.disk_partitions():
        try:
            usage = psutil.disk_usage(part.mountpoint)
            disks.append({
                "device": part.device,
                "mountpoint": part.mountpoint,
                "fstype": part.fstype,
                "total_gb": round(usage.total / (1024 ** 3), 2),
                "used_gb": round(usage.used / (1024 ** 3), 2),
                "free_gb": round(usage.free / (1024 ** 3), 2),
                "percent": usage.percent,
            })
        except (PermissionError, OSError):
            pass
    return disks


def get_network_info():
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
    except Exception:
        hostname = "unknown"
        local_ip = "unknown"

    io = psutil.net_io_counters()
    return {
        "hostname": hostname,
        "local_ip": local_ip,
        "bytes_sent_mb": round(io.bytes_sent / (1024 ** 2), 2),
        "bytes_recv_mb": round(io.bytes_recv / (1024 ** 2), 2),
        "packets_sent": io.packets_sent,
        "packets_recv": io.packets_recv,
        "errors_in": io.errin,
        "errors_out": io.errout,
        "dropped_in": io.dropin,
        "dropped_out": io.dropout,
    }


def get_top_processes():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            processes.append({
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "cpu_percent": proc.info['cpu_percent'],
                "memory_percent": proc.info['memory_percent'],
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass

    processes.sort(key=lambda x: x['memory_percent'], reverse=True)
    return processes[:10]


def get_temperature_info():
    try:
        temps = psutil.sensors_temperatures()
        if not temps:
            return {"status": "not_available"}

        result = {}
        for name, entries in temps.items():
            result[name] = [
                {
                    "label": e.label,
                    "current": e.current,
                    "high": e.high,
                    "critical": e.critical,
                }
                for e in entries
            ]
        return result
    except Exception:
        return {"status": "not_available"}


def get_network_connections():
    connections = []
    try:
        for conn in psutil.net_connections():
            if conn.laddr and conn.raddr:
                connections.append({
                    "local_addr": f"{conn.laddr.ip}:{conn.laddr.port}",
                    "remote_addr": f"{conn.raddr.ip}:{conn.raddr.port}",
                    "status": conn.status,
                })
    except (psutil.AccessDenied, AttributeError):
        pass
    return connections[:20]


def run_full_diagnostic():
    return {
        "system": get_system_info(),
        "cpu": get_cpu_info(),
        "memory": get_memory_info(),
        "disk": get_disk_info(),
        "network": get_network_info(),
        "top_processes": get_top_processes(),
        "temperature": get_temperature_info(),
        "connections": get_network_connections(),
    }


def analyze_diagnostic(data):
    issues = []

    memory = data.get("memory", {})
    if memory.get("percent", 0) > 80:
        issues.append({
            "severity": "high",
            "category": "memory",
            "message": f"Utilisation de la RAM élevée : {memory.get('percent')}%",
            "recommendation": "Fermez les applications inutiles ou redémarrez l'ordinateur.",
        })

    for disk in data.get("disk", []):
        if disk.get("percent", 0) > 90:
            issues.append({
                "severity": "critical",
                "category": "disk",
                "message": f"Espace disque critique sur {disk.get('device')} : {disk.get('percent')}%",
                "recommendation": "Libérez de l'espace disque en supprimant les fichiers inutiles.",
            })
        elif disk.get("percent", 0) > 80:
            issues.append({
                "severity": "high",
                "category": "disk",
                "message": f"Espace disque faible sur {disk.get('device')} : {disk.get('percent')}%",
                "recommendation": "Supprimez ou archivez des fichiers pour libérer de la place.",
            })

    cpu = data.get("cpu", {})
    if cpu.get("cpu_percent", 0) > 80:
        issues.append({
            "severity": "high",
            "category": "cpu",
            "message": f"Utilisation du processeur élevée : {cpu.get('cpu_percent')}%",
            "recommendation": "Vérifiez les processus en arrière-plan ou les applications lourdes.",
        })

    temp = data.get("temperature", {})
    if temp.get("status") != "not_available":
        for sensor_name, entries in temp.items():
            for entry in entries:
                if entry.get("critical") and entry.get("current", 0) > entry.get("critical", 100):
                    issues.append({
                        "severity": "critical",
                        "category": "temperature",
                        "message": f"Température critique détectée via {sensor_name} : {entry.get('current')}°C",
                        "recommendation": "Arrêtez l'ordinateur et nettoyez la ventilation.",
                    })
                elif entry.get("high") and entry.get("current", 0) > entry.get("high", 80):
                    issues.append({
                        "severity": "high",
                        "category": "temperature",
                        "message": f"Température élevée : {entry.get('current')}°C",
                        "recommendation": "Nettoyez les ventilateurs et vérifiez que l'air circule bien.",
                    })

    return issues
