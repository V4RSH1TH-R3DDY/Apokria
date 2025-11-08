import firebase_admin
from firebase_admin import credentials, firestore
import json

# Read the service account file
with open('firebase-service-account.json', 'r') as f:
    cred_info = json.load(f)

# Initialize Firebase
cred = credentials.Certificate(cred_info)
app = firebase_admin.initialize_app(cred)

# Try to access Firestore
db = firestore.client()
print("Successfully connected to Firebase!")

# Try a simple operation
docs = list(db.collection('events').limit(1).stream())
print(f"Found {len(docs)} events")