"""
Example API testing script for the conflict detection endpoint.
Run this to test the /check_conflict endpoint manually.
"""

import requests
import json
from datetime import datetime, timedelta, timezone

# API base URL
BASE_URL = "http://localhost:8000"

def test_conflict_endpoint():
    """Test the conflict detection endpoint"""
    
    print("🧪 Testing Apokria Conflict Detection API\n")
    
    # Test 1: Check if a time slot is clear (should be clear for new database)
    print("Test 1: Checking time slot availability...")
    
    start_time = datetime.now(timezone.utc) + timedelta(days=1)
    end_time = start_time + timedelta(hours=2)
    
    test_data = {
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "venue": "Main Auditorium"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/check_conflict", json=test_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result['data']['status'] == 'CLEAR':
                print("✅ Test 1 PASSED: Time slot is available")
            else:
                print("❌ Test 1 FAILED: Unexpected conflict detected")
        else:
            print(f"❌ Test 1 FAILED: HTTP {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Test 1 FAILED: Cannot connect to API. Is the server running?")
        return False
    except Exception as e:
        print(f"❌ Test 1 FAILED: {e}")
        return False
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Test GET endpoint for easy browser testing
    print("Test 2: Testing GET endpoint...")
    
    try:
        params = {
            "start_time": test_data["start_time"],
            "end_time": test_data["end_time"],
            "venue": test_data["venue"]
        }
        
        response = requests.get(f"{BASE_URL}/check_conflict", params=params)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Test 2 PASSED: GET endpoint working")
        else:
            print(f"❌ Test 2 FAILED: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"❌ Test 2 FAILED: {e}")
        return False
    
    print("\n" + "="*50 + "\n")
    
    # Test 3: Create an event and then check for conflict
    print("Test 3: Creating event and checking for conflict...")
    
    try:
        # First create an event
        event_data = {
            "title": "Test Event for Conflict Detection",
            "description": "This is a test event to verify conflict detection",
            "start_time": test_data["start_time"],
            "end_time": test_data["end_time"],
            "venue": test_data["venue"],
            "organizer": "API Test Script",
            "category": "test"
        }
        
        print("Creating event...")
        create_response = requests.post(f"{BASE_URL}/api/events", json=event_data)
        print(f"Create Event Status: {create_response.status_code}")
        
        if create_response.status_code == 200:
            print("✅ Event created successfully")
            
            # Now check for conflict with the same time slot
            print("Checking for conflict with same time slot...")
            conflict_response = requests.post(f"{BASE_URL}/check_conflict", json=test_data)
            
            if conflict_response.status_code == 200:
                result = conflict_response.json()
                print(f"Conflict Check Response: {json.dumps(result, indent=2)}")
                
                if result['data']['status'] == 'CLASH':
                    print("✅ Test 3 PASSED: Conflict correctly detected")
                else:
                    print("❌ Test 3 FAILED: Expected conflict not detected")
            else:
                print(f"❌ Test 3 FAILED: Conflict check failed with HTTP {conflict_response.status_code}")
        else:
            print(f"⚠️  Test 3 SKIPPED: Could not create event (HTTP {create_response.status_code})")
            print("This might be expected if Firebase is not configured")
            
    except Exception as e:
        print(f"⚠️  Test 3 SKIPPED: {e}")
        print("This might be expected if Firebase is not configured")
    
    print("\n" + "="*50 + "\n")
    print("🎯 API Testing Complete!")
    return True

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health endpoint is working")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            return True
        else:
            print(f"❌ Health endpoint failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health endpoint failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("  APOKRIA SUB-PHASE 2.1 API TESTING")
    print("  Conflict Detection & Scheduler Agent")
    print("=" * 60)
    print()
    
    # Test health first
    print("🏥 Testing API Health...")
    if not test_health_endpoint():
        print("\n❌ API is not healthy. Please check if the server is running.")
        exit(1)
    
    print("\n" + "="*50 + "\n")
    
    # Test conflict detection
    test_conflict_endpoint()
    
    print("\n🚀 Next Steps:")
    print("1. Configure Firebase credentials in .env file")
    print("2. Test with browser: http://localhost:8000/docs")
    print("3. Try the conflict check: http://localhost:8000/check_conflict?start_time=2025-11-09T10:00:00Z&end_time=2025-11-09T12:00:00Z&venue=Room A")