"""
Test script for FlowAgent API endpoints.
Tests the /generate_flow endpoint with different event types and parameters.
"""

import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8000"

def test_flow_generation_api():
    """Test the flow generation API with various scenarios"""
    
    print("🎭 Testing Apokria FlowAgent API\n")
    
    # Test scenarios
    test_cases = [
        {
            "name": "Academic Conference",
            "data": {
                "event_name": "AI & Machine Learning Conference 2025",
                "event_type": "academic_conference",
                "duration": 8.0,
                "audience_size": 150,
                "budget_range": "High",
                "venue_type": "University auditorium",
                "special_requirements": "Live streaming capability, poster session space"
            }
        },
        {
            "name": "Cultural Festival",
            "data": {
                "event_name": "International Cultural Night",
                "event_type": "cultural_festival", 
                "duration": 4.0,
                "audience_size": 300,
                "budget_range": "Medium",
                "venue_type": "Outdoor campus pavilion",
                "special_requirements": "Weather contingency, food vendors, performance stage"
            }
        },
        {
            "name": "Workshop",
            "data": {
                "event_name": "Python Programming Workshop",
                "event_type": "workshop",
                "duration": 3.0,
                "audience_size": 40,
                "budget_range": "Low",
                "venue_type": "Computer lab",
                "special_requirements": "Laptops for all participants, stable internet"
            }
        },
        {
            "name": "Student Orientation",
            "data": {
                "event_name": "Fall 2025 New Student Orientation",
                "event_type": "student_orientation",
                "duration": 6.0,
                "audience_size": 500,
                "budget_range": "High",
                "venue_type": "Multiple campus locations",
                "special_requirements": "Transportation between venues, welcome packets"
            }
        }
    ]
    
    print("=" * 60)
    print("  FLOW GENERATION API TESTS")
    print("=" * 60)
    print()
    
    # Test health endpoint first
    print("🏥 Testing FlowAgent Health...")
    try:
        health_response = requests.get(f"{BASE_URL}/api/flow/health")
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"✅ FlowAgent Health Check: {health_data['data']}")
        else:
            print(f"❌ Health check failed: HTTP {health_response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    print("\n" + "="*50 + "\n")
    
    # Test supported event types
    print("📋 Testing Event Types Endpoint...")
    try:
        types_response = requests.get(f"{BASE_URL}/api/flow/types")
        if types_response.status_code == 200:
            types_data = types_response.json()
            print(f"✅ Supported Event Types ({len(types_data['data']['event_types'])}):")
            for event_type, description in types_data['data']['event_types'].items():
                print(f"   • {event_type}: {description}")
        else:
            print(f"❌ Event types failed: HTTP {types_response.status_code}")
    except Exception as e:
        print(f"❌ Event types failed: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test flow generation for each scenario
    for i, test_case in enumerate(test_cases, 1):
        print(f"🧪 Test {i}: {test_case['name']}")
        print(f"Event: {test_case['data']['event_name']}")
        print(f"Type: {test_case['data']['event_type']}")
        print(f"Duration: {test_case['data']['duration']} hours")
        print(f"Audience: {test_case['data']['audience_size']} people")
        print()
        
        try:
            # Test POST endpoint
            response = requests.post(f"{BASE_URL}/api/flow", json=test_case['data'])
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                flow_data = result['data']
                
                print(f"✅ Flow generated successfully!")
                print(f"Generator: {flow_data['metadata']['generator']}")
                print(f"Created: {flow_data['created_at']}")
                print(f"Flow length: {len(flow_data['generated_flow'])} characters")
                
                # Show first few lines of the flow
                flow_lines = flow_data['generated_flow'].split('\n')
                print(f"Preview (first 5 lines):")
                for line in flow_lines[:5]:
                    print(f"  {line}")
                if len(flow_lines) > 5:
                    print(f"  ... ({len(flow_lines)-5} more lines)")
                
                # Save full flow to file for review
                filename = f"flow_test_{test_case['data']['event_type']}_{datetime.now().strftime('%H%M%S')}.md"
                try:
                    with open(filename, 'w', encoding='utf-8') as f:
                        f.write(flow_data['generated_flow'])
                    print(f"  💾 Full flow saved to: {filename}")
                except Exception as e:
                    print(f"  ⚠️  Could not save file: {e}")
                
            else:
                print(f"❌ Flow generation failed: HTTP {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Raw response: {response.text}")
                    
        except requests.exceptions.ConnectionError:
            print("❌ Cannot connect to API. Is the server running?")
            return False
        except Exception as e:
            print(f"❌ Test failed: {e}")
        
        print("\n" + "="*50 + "\n")
    
    # Test GET endpoint for browser testing
    print("🌐 Testing GET Endpoint for Browser...")
    try:
        get_params = {
            "event_name": "Quick Test Event",
            "event_type": "workshop", 
            "duration": 2.0,
            "audience_size": 25
        }
        
        get_response = requests.get(f"{BASE_URL}/generate_flow", params=get_params)
        print(f"GET Status: {get_response.status_code}")
        
        if get_response.status_code == 200:
            print("✅ GET endpoint working for browser testing")
            print("🔗 Test in browser: http://localhost:8000/generate_flow?event_name=Test%20Workshop&event_type=workshop&duration=2.0")
        else:
            print(f"❌ GET endpoint failed: HTTP {get_response.status_code}")
            
    except Exception as e:
        print(f"❌ GET test failed: {e}")
    
    print("\n" + "="*50 + "\n")
    print("🎯 Flow Generation Testing Complete!")
    return True

if __name__ == "__main__":
    print("=" * 70)
    print("  APOKRIA FLOWAGENT API TESTING")
    print("  Intelligent Event Itinerary Generation")
    print("=" * 70)
    print()
    
    success = test_flow_generation_api()
    
    if success:
        print("\n🚀 Next Steps:")
        print("1. Configure Google Gemini API key for AI-powered flows")
        print("2. Test with browser: http://localhost:8000/docs")
        print("3. Try flow generation: http://localhost:8000/generate_flow?event_name=Test&event_type=workshop&duration=2")
        print("4. Review generated .md files for flow quality")
    else:
        print("\n❌ Some tests failed. Please check server status and try again.")