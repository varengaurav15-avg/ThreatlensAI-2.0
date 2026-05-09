MITRE_MAP = {
    "Initial Access":        ["phishing","exploit","vpn","login","auth bypass","authentication"],
    "Execution":             ["cmd.exe","powershell","script","execute","run","spawn","process"],
    "Persistence":           ["registry","startup","service","scheduled task","autorun","boot"],
    "Privilege Escalation":  ["admin","root","privilege","escalat","sudo","uac"],
    "Defense Evasion":       ["obfuscat","encrypt","hidden","delete log","shadow","disable"],
    "Credential Access":     ["password","credential","hash","kerberos","mimikatz","token"],
    "Discovery":             ["scan","enumerate","whoami","netstat","ipconfig","recon"],
    "Lateral Movement":      ["smb","rdp","ssh","wmi","pass the hash","lateral"],
    "Command & Control":     ["c2","beacon","cobalt","reverse shell","callback","tunnel"],
    "Exfiltration":          ["upload","transfer","exfil","steal","data","send"],
    "Impact":                ["encrypt","ransom","destroy","wipe","corrupt","lock"],
}

def map_to_mitre(text: str) -> list:
    text_lower = text.lower()
    matched = []
    for tactic, keywords in MITRE_MAP.items():
        if any(k in text_lower for k in keywords):
            matched.append(tactic)
    return matched[:3] if matched else ["Unknown"]