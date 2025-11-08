# Apokria Testing Guide

## Overview

This guide explains how to test all the implemented features of Apokria using the mock testing frontend while we await the final frontend delivery.

## Setup

### Backend Server
1. Make sure the backend server is running:
   ```bash
   cd backend
   python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Testing Interface
1. Start the HTTP server:
   ```bash
   cd frontend/mock-testing
   python -m http.server 8080
   ```

2. Open in browser: http://localhost:8080

## Testing Features

### 1. Authentication System

The authentication system includes user registration, login, and role-based access control.

#### User Registration
1. Click the **"Authentication"** tab
2. Fill out the registration form:
   - Username: 3-20 characters, unique
   - Email: Valid email address
   - Full Name: Your full name
   - Password: Minimum 8 characters
   - Role: Select from student/organizer/admin
3. Click **"Register"**

**Test Users to Create:**
- Student: `testuser` / `test@student.com` / `password123`
- Organizer: `organizer` / `test@organizer.com` / `password123`
- Admin: `admin` / `test@admin.com` / `password123`

#### User Login
1. After registration, fill out the login form
2. Enter username/email and password
3. Click **"Login"**
4. JWT token will be stored and displayed

#### API Access Testing
- Try accessing protected routes after login
- Test role-based access with different user types
- Check token expiration handling (30 minutes)

### 2. Scheduler Agent

The scheduler agent handles event scheduling and conflict detection.

#### Conflict Detection
1. Go to **"Scheduler"** tab
2. Fill out the conflict check form:
   - Start Time: Select date and time
   - End Time: Must be after start time
   - Venue: Choose from dropdown or enter custom
3. Click **"Check Conflicts"**

**Test Scenarios:**
- Schedule overlapping events in same venue
- Different venues at same time (should be CLEAR)
- Events with time gaps (should be CLEAR)

#### Event Creation
1. Fill out the event creation form:
   - Title: Event name
   - Description: Event details
   - Category: Select from predefined categories
   - Capacity: Number of attendees
   - Times and Venue: Same as conflict check
2. Click **"Create Event"**

**Test Events to Create:**
1. **Tech Workshop**
   - Category: Technical Workshop
   - Capacity: 50
   - Duration: 2 hours
   
2. **Cultural Festival**
   - Category: Cultural Event
   - Capacity: 500
   - Duration: 6 hours
   
3. **Academic Conference**
   - Category: Academic Conference
   - Capacity: 200
   - Duration: 4 hours

### 3. Flow Agent

The flow agent generates detailed event schedules and timelines.

#### Event Flow Generation
1. Go to **"Flow"** tab
2. Fill out the flow generation form:
   - Event Name: Descriptive name
   - Event Type: Select type from dropdown
   - Duration: In hours (1-12)
   - Audience Size: Expected attendees
   - Budget Range: Low/Medium/High
   - Venue Type: Type of venue needed
   - Special Requirements: Any special needs

#### Quick Templates
Use the template buttons to test different event types:
- **Tech Conference**: 4-hour academic event with keynotes
- **Cultural Festival**: 6-hour outdoor festival
- **Workshop**: 2-hour hands-on technical session
- **Career Fair**: 5-hour networking event

#### Testing Flow Quality
- Test different event types and durations
- Check how budget affects recommendations
- Verify special requirements are included
- Test edge cases (very short/long events)

### 4. Sponsor Agent

The sponsor agent recommends sponsors and generates outreach emails.

#### Sponsor Recommendations
1. Go to **"Sponsor"** tab
2. Fill out the sponsor form:
   - Event Type: Type of event
   - Event Name: Name for outreach
   - Budget Range: Expected sponsorship level
   - Audience Size: Number of attendees
   - Demographics: Target audience description
   - Additional Context: Special notes

**Test Scenarios:**
- **Tech Event**: Computer Science conference, 200 attendees
- **Cultural Event**: International festival, 500 attendees
- **Workshop**: Career development, 50 attendees
- **Sports Event**: Intramural competition, 100 attendees

#### Sponsor Matching
- Check relevance scores (higher = better match)
- Verify contact information is provided
- Review generated outreach emails
- Test different budget ranges

### 5. System Health Checks

#### API Status Monitoring
- Green indicators: Services are healthy
- Red indicators: Services need attention
- Connection status: Database and Firebase

#### Agent Health Checks
- Click health check buttons in each agent tab
- Verify all agents respond correctly
- Check error handling for failed services

## Testing Checklist

### Authentication ✓
- [ ] User registration works
- [ ] Login returns JWT token
- [ ] Token is used for API calls
- [ ] Role-based access control
- [ ] Token expiration handling

### Scheduler Agent ✓
- [ ] Conflict detection accurate
- [ ] Event creation successful
- [ ] Multiple venue support
- [ ] Time validation working
- [ ] Database integration

### Flow Agent ✓
- [ ] Flow generation works
- [ ] Different event types supported
- [ ] Duration affects output
- [ ] Budget considerations included
- [ ] Special requirements handled

### Sponsor Agent ✓
- [ ] Sponsor recommendations generated
- [ ] Relevance scoring works
- [ ] Contact information provided
- [ ] Outreach emails generated
- [ ] Different event types supported

### System Integration ✓
- [ ] All APIs accessible
- [ ] Database connections stable
- [ ] Error handling graceful
- [ ] UI responsive and functional

## Common Issues & Solutions

### Backend Connection Issues
- Ensure backend server is running on port 8000
- Check MongoDB Atlas connection
- Verify Firebase credentials

### Frontend Issues
- Refresh page if JavaScript errors occur
- Check browser console for detailed errors
- Ensure HTTP server is running on port 8080

### Authentication Issues
- Clear browser storage if tokens are corrupted
- Re-register users if needed
- Check role permissions for protected routes

### Agent Testing Issues
- Verify all required fields are filled
- Check API responses in browser dev tools
- Test one agent at a time for isolation

## Next Steps

1. **Content Agent**: When implemented, will generate event content and marketing materials
2. **Analytics Agent**: When implemented, will provide event analytics and insights
3. **Frontend Integration**: Replace mock frontend with final React application
4. **Production Deployment**: Configure for production environment

## Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Verify backend server logs
3. Test individual API endpoints
4. Review database connections
5. Check authentication token validity

---

**Happy Testing!** 🎉

This comprehensive testing interface validates all core Apokria functionality and demonstrates the system's capabilities while we await the final frontend delivery.