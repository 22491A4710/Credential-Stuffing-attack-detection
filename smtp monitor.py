import csv
from datetime import datetime

def check_smtp_logs(file_path):
    with open(file_path, "r") as f:
        reader = csv.DictReader(f)
        login_times = [row['timestamp'] for row in reader if row['event'] == 'login']

    recent_logins = [t for t in login_times if is_recent(t)]
    if len(recent_logins) >= 5:
        print("⚠️ Warning: Multiple SMTP logins detected")

def is_recent(time_str):
    t = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
    return (datetime.now() - t).seconds < 300

check_smtp_logs("smtp_logs.csv")
