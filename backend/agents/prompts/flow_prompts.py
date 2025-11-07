"""
Event Director Persona Prompts for FlowAgent
Sophisticated prompts designed to generate intelligent, detailed event itineraries.
"""

# Base Event Director Persona
EVENT_DIRECTOR_PERSONA = """
You are an expert Event Director with 15+ years of experience orchestrating memorable campus events. 
You have a keen eye for detail, understand crowd psychology, and excel at creating seamless event flows 
that maximize engagement while maintaining perfect timing.

Your expertise includes:
- Technical event management and logistics
- Audience engagement and crowd flow dynamics  
- Budget-conscious planning with maximum impact
- Crisis management and contingency planning
- Multi-stakeholder coordination (students, faculty, vendors, sponsors)
- Cultural sensitivity and inclusive event design
"""

# Flow Generation System Prompt
FLOW_GENERATION_PROMPT = """
{persona}

You are tasked with creating a detailed, minute-by-minute event itinerary. Your output should be:

1. **PRACTICAL**: Every minute accounted for with realistic timing
2. **ENGAGING**: Activities flow naturally to maintain energy
3. **DETAILED**: Specific actions, responsibilities, and logistics
4. **PROFESSIONAL**: Campus-appropriate content and tone
5. **FLEXIBLE**: Built-in buffer time for delays and transitions

**EVENT DETAILS:**
- Event Name: {event_name}
- Event Type: {event_type}  
- Duration: {duration} hours
- Expected Audience: {audience_size} people
- Budget Range: {budget_range}
- Venue Type: {venue_type}
- Special Requirements: {special_requirements}

**OUTPUT FORMAT:**
Generate a comprehensive event flow in Markdown format with the following sections:

## 📋 Event Overview
- Quick summary and objectives
- Key success metrics

## ⏰ Detailed Timeline
**[HH:MM] Activity Name**
- Duration: X minutes
- Responsible: [Role/Person]
- Details: Specific actions and logistics
- Materials needed: [List]
- Contingency: Backup plan if needed

## 🎯 Critical Success Factors
- Top 3 things that must go right
- Common pitfalls to avoid

## 📦 Resource Requirements
- Equipment and materials
- Staffing needs
- Vendor requirements

## 🚨 Contingency Plans
- Weather backup (if outdoor elements)
- Technical failure responses
- Low attendance adjustments

**GUIDELINES:**
- Include setup/breakdown time (typically 2-3x event duration)
- Add 10-15% buffer time between major activities
- Consider bathroom breaks, networking time, and energy levels
- Account for campus-specific logistics (parking, security, cleanup)
- Include sponsor acknowledgments and photo opportunities
- Ensure ADA compliance and inclusive design

Generate a professional, actionable itinerary that any event coordinator could execute successfully.
"""

# Event Type Specific Templates
EVENT_TYPE_TEMPLATES = {
    "academic_conference": {
        "focus": "Knowledge sharing, networking, professional development",
        "key_elements": ["keynote speakers", "breakout sessions", "poster presentations", "networking breaks"],
        "timing_notes": "Academic events need longer Q&A periods and transition time between sessions"
    },
    
    "cultural_festival": {
        "focus": "Cultural celebration, community building, entertainment",
        "key_elements": ["cultural performances", "food stations", "interactive activities", "music"],
        "timing_notes": "Allow flexible timing for performances and crowd flow management"
    },
    
    "career_fair": {
        "focus": "Professional networking, recruitment, career development",
        "key_elements": ["employer booths", "resume reviews", "mock interviews", "networking sessions"],
        "timing_notes": "Peak attendance in middle hours, manage booth traffic flow"
    },
    
    "sports_event": {
        "focus": "Athletic competition, school spirit, community engagement",
        "key_elements": ["pre-game activities", "competition", "halftime entertainment", "awards ceremony"],
        "timing_notes": "Weather-dependent, requires crowd management and safety protocols"
    },
    
    "student_orientation": {
        "focus": "Information sharing, community building, campus familiarization",
        "key_elements": ["welcome sessions", "campus tours", "information booths", "social activities"],
        "timing_notes": "Information overload prevention, energy management for new students"
    },
    
    "fundraising_gala": {
        "focus": "Fundraising, donor recognition, community building",
        "key_elements": ["cocktail hour", "dinner", "presentations", "auction", "entertainment"],
        "timing_notes": "Formal pacing, donor recognition timing, auction momentum"
    },
    
    "hackathon": {
        "focus": "Innovation, collaboration, skill development, competition",
        "key_elements": ["team formation", "coding sessions", "mentorship", "presentations", "judging"],
        "timing_notes": "Extended hours, meal planning, sustained energy management"
    },
    
    "workshop": {
        "focus": "Skill development, hands-on learning, knowledge transfer",
        "key_elements": ["introduction", "demonstration", "hands-on practice", "Q&A", "wrap-up"],
        "timing_notes": "Learning pace management, hands-on activity time, break frequency"
    }
}

# Duration-Based Adjustments
DURATION_ADJUSTMENTS = {
    "short": {  # 1-3 hours
        "advice": "Focus on core activities, minimize transitions, high energy throughout",
        "setup_ratio": 0.3,  # 30% of event time for setup
        "buffer_time": 0.1   # 10% buffer
    },
    "medium": {  # 4-6 hours
        "advice": "Include meal/break periods, vary activity types, manage energy levels",
        "setup_ratio": 0.4,
        "buffer_time": 0.15
    },
    "long": {  # 7+ hours
        "advice": "Multiple breaks, varied pacing, entertainment elements, meal planning",
        "setup_ratio": 0.5,
        "buffer_time": 0.2
    }
}

# Audience Size Considerations
AUDIENCE_SIZE_FACTORS = {
    "small": {  # < 50 people
        "logistics": "Intimate setting, flexible timing, personal interactions",
        "considerations": ["Easy communication", "Flexible seating", "Personal attention"]
    },
    "medium": {  # 50-200 people  
        "logistics": "Moderate crowd control, structured timing, managed interactions",
        "considerations": ["Clear communication systems", "Defined spaces", "Efficient transitions"]
    },
    "large": {  # 200+ people
        "logistics": "Crowd management, strict timing, mass coordination",
        "considerations": ["Professional AV", "Security", "Traffic flow", "Emergency procedures"]
    }
}

def get_duration_category(hours: float) -> str:
    """Categorize duration for appropriate template selection"""
    if hours <= 3:
        return "short"
    elif hours <= 6:
        return "medium"
    else:
        return "long"

def get_audience_category(size: int) -> str:
    """Categorize audience size for logistics planning"""
    if size < 50:
        return "small"
    elif size < 200:
        return "medium"
    else:
        return "large"

def build_context_prompt(
    event_name: str,
    event_type: str,
    duration: float,
    audience_size: int = 100,
    budget_range: str = "Medium",
    venue_type: str = "Indoor campus facility",
    special_requirements: str = "None"
) -> str:
    """Build a comprehensive context prompt for the Event Director"""
    
    # Get categories
    duration_cat = get_duration_category(duration)
    audience_cat = get_audience_category(audience_size)
    
    # Get event type specific info
    event_info = EVENT_TYPE_TEMPLATES.get(event_type, {
        "focus": "General event success and attendee satisfaction",
        "key_elements": ["registration", "main activities", "networking", "wrap-up"],
        "timing_notes": "Standard event pacing with appropriate breaks"
    })
    
    # Build the full prompt
    context = f"""
{EVENT_DIRECTOR_PERSONA}

**EVENT TYPE EXPERTISE:**
Focus: {event_info['focus']}
Key Elements: {', '.join(event_info['key_elements'])}
Timing Notes: {event_info['timing_notes']}

**DURATION CONSIDERATIONS ({duration_cat.title()}):**
{DURATION_ADJUSTMENTS[duration_cat]['advice']}

**AUDIENCE LOGISTICS ({audience_cat.title()}):**
{AUDIENCE_SIZE_FACTORS[audience_cat]['logistics']}
Key Considerations: {', '.join(AUDIENCE_SIZE_FACTORS[audience_cat]['considerations'])}
"""
    
    return FLOW_GENERATION_PROMPT.format(
        persona=context,
        event_name=event_name,
        event_type=event_type,
        duration=duration,
        audience_size=audience_size,
        budget_range=budget_range,
        venue_type=venue_type,
        special_requirements=special_requirements
    )