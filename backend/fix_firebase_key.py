import os
import json

# Read the current service account file
with open('firebase-service-account.json', 'r') as f:
    creds = json.load(f)

# Fix the private key by replacing escaped newlines with actual newlines
private_key = creds['private_key']
if private_key.startswith('"'):
    private_key = private_key[1:-1]  # Remove surrounding quotes if present
private_key = private_key.replace('\\n', '\n')
creds['private_key'] = private_key

# Write back the fixed credentials
with open('firebase-service-account.json', 'w') as f:
    json.dump(creds, f, indent=2)