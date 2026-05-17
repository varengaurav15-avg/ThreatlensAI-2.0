import os, smtplib, logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger("email_service")

SMTP_EMAIL    = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
APP_URL       = os.getenv("APP_URL", "http://localhost:8000")


def send_verification_email(to_email: str, name: str, token: str) -> bool:
    """
    Sends a verification email. Returns True on success.
    If SMTP is not configured, logs the verify URL and returns True
    so the app still works in dev / demo mode.
    """
    verify_url = f"{APP_URL}/auth/verify/{token}"

    if not SMTP_EMAIL or not SMTP_PASSWORD:
        logger.info("SMTP not configured — auto-verify URL: %s", verify_url)
        return True   # dev fallback: treat as sent

    html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body {{ background:#0f1419; color:#dee3ea; font-family:'Segoe UI',Arial,sans-serif; margin:0; padding:32px; }}
    .card {{ max-width:520px; margin:0 auto; background:#1b2025; border:1px solid #3b494b; border-radius:12px; overflow:hidden; }}
    .header {{ background:#0f1419; padding:28px 32px; border-bottom:1px solid #3b494b; }}
    .logo {{ font-size:20px; font-weight:700; color:#00dbe9; letter-spacing:-0.02em; }}
    .body {{ padding:32px; }}
    h2 {{ margin:0 0 12px; font-size:22px; font-weight:700; color:#dee3ea; }}
    p {{ margin:0 0 24px; color:#b9cacb; line-height:1.6; font-size:15px; }}
    .btn {{ display:inline-block; background:#00dbe9; color:#002022; font-weight:700; font-size:13px;
            letter-spacing:0.08em; text-transform:uppercase; padding:14px 32px; border-radius:6px;
            text-decoration:none; }}
    .footer {{ padding:20px 32px; border-top:1px solid #3b494b; color:#849495; font-size:12px; }}
    .url {{ word-break:break-all; color:#849495; font-size:11px; margin-top:16px; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header"><span class="logo">ThreatLens AI</span></div>
    <div class="body">
      <h2>Verify your email</h2>
      <p>Hey {name},<br/><br/>
         Click the button below to verify your email and activate your ThreatLens AI account.
         This link expires in 24 hours.
      </p>
      <a class="btn" href="{verify_url}">Verify Email</a>
      <p class="url">Or paste this link in your browser:<br/>{verify_url}</p>
    </div>
    <div class="footer">If you didn't create a ThreatLens AI account, you can safely ignore this email.</div>
  </div>
</body>
</html>"""

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Verify your ThreatLens AI account"
        msg["From"]    = f"ThreatLens AI <{SMTP_EMAIL}>"
        msg["To"]      = to_email
        msg.attach(MIMEText(f"Verify your account: {verify_url}", "plain"))
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())

        logger.info("Verification email sent to %s", to_email)
        return True
    except Exception as e:
        logger.error("Failed to send verification email to %s: %s", to_email, e)
        return False
