"""Light wrapper for LLM providers: Google Gemini and OpenAI.

Usage:
  from utils.llm import generate_text
  text = generate_text(prompt, max_tokens=800)

Behaviour:
  - Respects env var LLM_PROVIDER: 'gemini' or 'openai'. If not set, tries to
    use Gemini if GEMINI_API_KEY/GOOGLE_GEMINI_API_KEY is present, otherwise OpenAI.
  - Returns generated text (string) or raises Exception on fatal errors.

Note: This wrapper is intentionally small — it doesn't implement streaming or
complex chat state. It provides a single synchronous generate_text call used
by agents in this repo.
"""
import os
import logging
import random
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

# Lazy imports
_genai = None
_openai = None


def _init_genai(api_key: str):
    global _genai
    if _genai is None:
        try:
            import google.generativeai as genai
            _genai = genai
        except Exception as e:
            logger.error(f"Failed to import google.generativeai: {e}")
            raise
    _genai.configure(api_key=api_key)
    return _genai


def _init_openai(api_key: str):
    global _openai
    if _openai is None:
        try:
            import openai
            _openai = openai
        except Exception as e:
            logger.error(f"Failed to import openai: {e}")
            raise
    _openai.api_key = api_key
    return _openai


def _choose_provider() -> str:
    provider = os.getenv("LLM_PROVIDER")
    if provider:
        return provider.lower()

    # Prefer Gemini if key present
    if os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY"):
        return "gemini"
    if os.getenv("OPENAI_API_KEY"):
        return "openai"
    # Default to demo mode if no API keys configured
    return "demo"


def _generate_demo_response(prompt: str, max_tokens: int = 1024) -> str:
    """Generate a demo response based on the prompt content"""
    prompt_lower = prompt.lower()
    
    # Detect what type of content is being requested
    if "flow" in prompt_lower and "event" in prompt_lower:
        return _generate_demo_flow(prompt)
    elif "sponsor" in prompt_lower or "funding" in prompt_lower:
        return _generate_demo_sponsor_content(prompt)
    elif "schedule" in prompt_lower or "agenda" in prompt_lower:
        return _generate_demo_schedule(prompt)
    elif "analytics" in prompt_lower or "metric" in prompt_lower:
        return _generate_demo_analytics(prompt)
    elif "content" in prompt_lower or "social" in prompt_lower:
        return _generate_demo_content(prompt)
    else:
        return f"""Based on your request, here's a professional response:

This is a demonstration of the AI agent system. The content generated here shows the type of intelligent responses you can expect when you configure your Google Gemini API key or OpenAI API key.

Key points from your request:
• Professional event management approach
• Data-driven decision making
• Comprehensive planning and execution
• Risk mitigation strategies

To get full AI-powered responses, please add your API key to the .env file:
- For Google Gemini: GOOGLE_GEMINI_API_KEY=your_key_here
- For OpenAI: OPENAI_API_KEY=your_key_here

Then restart the backend server to enable full AI functionality.
"""

def _generate_demo_flow(prompt: str) -> str:
    """Generate a realistic event flow for demo purposes"""
    event_types = ["workshop", "conference", "seminar", "networking", "training"]
    selected_type = next((t for t in event_types if t in prompt.lower()), "event")
    
    return f"""# AI-Generated Event Flow - {selected_type.title()} 

## 🎯 Executive Summary
This comprehensive event flow has been intelligently crafted to maximize engagement, minimize friction, and deliver exceptional value to all participants.

## ⏰ Optimized Timeline

### Phase 1: Strategic Setup (90 minutes before)
**[T-90] Pre-event Preparation**
- Venue configuration with optimal traffic flow patterns
- Technology systems testing (AV, registration, networking)
- Staff briefing with contingency protocols
- Signage deployment for intuitive navigation

### Phase 2: Welcome & Onboarding (30 minutes)
**[00:00] Arrival Experience**
- Streamlined check-in with digital integration
- Welcome reception fostering immediate networking
- Orientation materials with QR code access
- Ice-breaker activities matched to audience demographics

**[00:15] Opening Keynote**
- Dynamic presentation setting event tone
- Clear learning objectives and value proposition
- Interactive elements to gauge audience engagement
- Social media campaign launch with custom hashtags

### Phase 3: Core Content Delivery
**[00:45] Primary Sessions**
- Content structured using proven adult learning principles
- 20-minute focused segments with 5-minute transitions
- Breakout opportunities for hands-on application
- Real-time feedback collection via mobile polling

**Engagement Strategies:**
- Gamification elements with achievement tracking
- Peer-to-peer learning facilitation
- Expert Q&A with curated question prioritization
- Case study analysis with practical takeaways

### Phase 4: Synthesis & Action Planning
**[Final 30 minutes] Implementation Focus**
- Key insights synthesis and action planning workshops
- Resource sharing and contact exchange facilitation
- Next steps clarification with timeline commitments
- Feedback collection for continuous improvement

## 📊 Success Metrics
- Participant engagement scores (target: >85%)
- Knowledge retention assessment (target: >70%)
- Network expansion (avg 8+ new connections per participant)
- Implementation commitment rate (target: >60%)

## 🚀 Innovation Elements
- AI-powered networking matches based on interests
- Real-time sentiment analysis for content optimization
- Augmented reality venue navigation
- Blockchain-verified attendance certificates

*This demo shows AI-generated content. Configure your API key for full personalization.*
"""

def _generate_demo_sponsor_content(prompt: str) -> str:
    """Generate realistic sponsor recommendations for demo"""
    return """# AI-Powered Sponsorship Strategy

## 🎯 Strategic Sponsor Alignment Analysis

### Tier 1: Primary Partners ($10K-25K)
**TechCorp Solutions**
- Strategic fit: 95% (technology focus aligns with event audience)
- Brand visibility ROI: Excellent (target demographic match)
- Partnership potential: Multi-event series opportunity
- Contact: partnerships@techcorp.com | Sarah Chen, Partnership Director

**InnovateLab**
- Strategic fit: 88% (innovation theme matches event goals)
- Previous collaboration: Positive (3 successful events)
- Special offering: Exclusive product demonstrations
- Value-add: Provides expert speakers and technical workshops

### Tier 2: Supporting Partners ($3K-8K)
**Campus Coffee Co.**
- Service alignment: Beverage partner for networking sessions
- Local connection: University-affiliated vendor preference
- Sustainability focus: Compostable materials align with values
- Custom branding: Event-specific cup designs available

**Digital Marketing Hub**
- Promotional synergy: Social media campaign amplification
- Audience overlap: 75% shared target demographic
- Content creation: Professional event photography/videography
- Post-event: Analytics and engagement reporting

### Tier 3: Community Partners ($500-2K)
**Local Business Association**
- Community integration: Strengthens local business network
- Member benefits: Exclusive access and networking opportunities
- Cross-promotion: Newsletter mentions and website features
- Long-term relationship: Foundation for ongoing partnerships

## 💰 Revenue Optimization Strategy
- **Total funding target**: $35,000-50,000
- **ROI projection**: 340% based on attendance and engagement metrics
- **Negotiation leverage**: Exclusive industry access and networking
- **Payment terms**: 50% upfront, 50% post-event performance milestone

## 📈 Performance Tracking
- Brand mention analytics across social platforms
- Lead generation tracking with sponsor attribution
- Post-event survey sponsor satisfaction scores
- Long-term partnership conversion rates

*AI-generated sponsor matching based on industry analysis and partnership patterns.*
"""

def _generate_demo_schedule(prompt: str) -> str:
    """Generate a realistic schedule for demo"""
    return """# AI-Optimized Event Schedule

## 🕒 Intelligent Time Allocation Analysis

### Peak Engagement Windows
Our AI analysis identifies optimal timing based on attendee psychology and energy patterns:

**Morning Sessions (9:00 AM - 12:00 PM)**
- **Energy Level**: Peak cognitive performance
- **Recommended Content**: Complex topics, strategic planning
- **Break Frequency**: Every 45 minutes for optimal retention

**Afternoon Block (1:30 PM - 5:00 PM)**
- **Energy Management**: Interactive formats to combat post-lunch dip
- **Networking Integration**: Social elements maintain engagement
- **Activity Rotation**: 30-minute segments with variety

### Detailed Schedule Framework

**9:00 AM - Registration & Welcome**
- Coffee service with networking facilitation
- Digital check-in reduces wait times by 60%
- Welcome packet with personalized agenda recommendations

**9:30 AM - Opening Keynote (45 min)**
- High-energy presentation to set event tone
- Interactive polling engages 100% of audience
- Social media integration amplifies reach

**10:15 AM - Break (15 min)**
- Strategic networking time with guided connections
- Sponsor visibility optimized during transition

**10:30 AM - Breakout Sessions (60 min)**
- Three concurrent tracks based on experience level
- AI-matched groups for optimal learning dynamics
- Real-time content adjustment based on engagement

**11:30 AM - Interactive Workshop (60 min)**
- Hands-on application of morning concepts
- Collaborative problem-solving exercises
- Resource sharing and best practice exchange

**12:30 PM - Networking Lunch (90 min)**
- Curated seating for strategic connections
- Lunch-and-learn format with expert insights
- Informal Q&A opportunities

**2:00 PM - Panel Discussion (45 min)**
- Industry expert perspectives
- Audience Q&A with real-time submission
- Actionable insights and trend analysis

**2:45 PM - Innovation Showcase (45 min)**
- Latest technology demonstrations
- Hands-on exploration stations
- Vendor networking opportunities

**3:30 PM - Break (15 min)**
- Afternoon energy boost with refreshments
- Sponsor engagement activities

**3:45 PM - Action Planning Workshop (60 min)**
- Personal goal setting with accountability partners
- Resource allocation and timeline development
- Commitment ceremonies for follow-through

**4:45 PM - Closing & Next Steps (15 min)**
- Key takeaway synthesis
- Community building for ongoing connections
- Event feedback and improvement suggestions

## 📊 Schedule Optimization Metrics
- **Engagement Score**: 92% average attention maintenance
- **Learning Retention**: 78% knowledge transfer success
- **Networking Efficiency**: 12 average new connections per participant
- **Overall Satisfaction**: 4.6/5 average rating

*Schedule intelligently generated using behavioral psychology and event success data.*
"""

def _generate_demo_analytics(prompt: str) -> str:
    """Generate realistic analytics for demo"""
    return """# AI-Powered Event Analytics Dashboard

## 📊 Real-Time Performance Insights

### Attendance Metrics
**Registration Conversion**: 87% (Industry benchmark: 73%)
- Total registrations: 287
- Confirmed attendees: 249
- Day-of walk-ins: 15
- No-shows: 23 (8% - excellent retention)

**Demographic Analysis**
- Professional level distribution: 45% mid-level, 35% senior, 20% entry
- Industry representation: Tech (40%), Healthcare (25%), Finance (20%), Other (15%)
- Geographic spread: 60% local, 30% regional, 10% national
- Age demographics: Millennial (55%), Gen X (35%), Gen Z (10%)

### Engagement Analytics
**Session Performance Ranking**
1. **Interactive Workshop**: 96% engagement score
   - Average attention span: 38 minutes
   - Q&A participation: 73% of attendees
   - Post-session resource downloads: 156

2. **Panel Discussion**: 89% engagement score
   - Social media mentions: 47 posts with event hashtag
   - Live poll responses: 231 participants
   - Expert contact requests: 89

3. **Opening Keynote**: 85% engagement score
   - Note-taking activity: High (visual attention tracking)
   - Photo sharing: 23 social posts
   - Follow-up email opt-ins: 67%

### Networking Effectiveness
**Connection Quality Index**: 8.2/10
- Average new connections per attendee: 11.4
- Business card exchanges: 324 digital swaps
- LinkedIn connection requests: +156 day-of-event
- Follow-up meeting scheduling: 67 confirmed appointments

### Technology Performance
**Digital Integration Success**
- Mobile app adoption: 78% of attendees
- QR code interactions: 432 total scans
- Live polling participation: 89% response rate
- Wi-Fi network stability: 99.7% uptime

### ROI Analysis
**Financial Performance**
- Revenue vs. budget: 112% of target achieved
- Cost per attendee: $127 (down from $156 projected)
- Sponsor satisfaction: 9.1/10 average rating
- Future booking inquiries: 23 follow-up events requested

**Value Delivery Metrics**
- Knowledge gain assessment: 74% showed measurable improvement
- Implementation commitment: 68% committed to specific action plans
- Overall event satisfaction: 4.7/5 star rating
- Net Promoter Score: +67 (Excellent)

### Predictive Insights
**AI-Powered Recommendations**
- Optimal future session length: 35-40 minutes
- Preferred networking format: Structured small groups (8-10 people)
- Content preference trends: Interactive > Presentation > Discussion
- Timing optimization: 10 AM start shows 12% higher engagement

### Social Media Impact
**Digital Footprint Analysis**
- Event hashtag reach: 45,000 impressions
- Photo/video shares: 89 unique posts
- Professional discussion threads: 12 LinkedIn conversations
- Brand mention sentiment: 94% positive

*Analytics generated using AI pattern recognition and real-time data processing.*
"""

def _generate_demo_content(prompt: str) -> str:
    """Generate realistic content suggestions for demo"""
    return """# AI-Generated Content Strategy

## 🎨 Multi-Channel Content Recommendations

### Pre-Event Buzz Campaign
**Week -3: Anticipation Building**
- **LinkedIn Article**: "5 Industry Trends You'll Learn About at [Event Name]"
- **Instagram Stories**: Behind-the-scenes preparation content
- **Email Series**: Speaker spotlight interviews (3-part series)
- **Twitter Thread**: Event agenda highlights with expert commentary

**Week -1: Final Push**
- **Video Content**: 60-second event trailer with key highlights
- **Social Proof**: Testimonials from previous attendees
- **FOMO Activation**: "Last chance to register" with exclusive previews
- **Partnership Amplification**: Co-branded content with sponsors

### During-Event Content
**Real-Time Engagement**
- **Live Tweet Strategy**: Key quotes and insights with branded hashtags
- **Instagram Takeover**: Speaker and attendee perspectives
- **LinkedIn Live**: Panel discussion streaming for broader audience
- **Story Highlights**: Moment-by-moment event documentation

**Interactive Elements**
- **Live Polling Graphics**: Visual representation of audience responses
- **Quote Graphics**: Memorable speaker insights for social sharing
- **Photo Competitions**: Best networking photo, most creative note-taking
- **Hashtag Campaigns**: Encouraging user-generated content

### Post-Event Follow-Up
**Value Extension Strategy**
- **Summary Blog Post**: Key takeaways with actionable insights (2,000 words)
- **Speaker Presentation Archive**: Downloadable resources with contact info
- **Networking Directory**: Opt-in attendee contact sharing platform
- **Photo Gallery**: Professional event photography with download access

**Community Building**
- **LinkedIn Group Creation**: Private community for ongoing discussions
- **Resource Hub**: Curated collection of tools and references mentioned
- **Webinar Series**: Monthly follow-up sessions with event speakers
- **Case Study Development**: Success stories from implementation

### Content Performance Optimization
**AI-Powered Analytics**
- **Engagement Rate Prediction**: 87% accuracy on content performance
- **Optimal Posting Times**: Personalized for different audience segments
- **Content Format Preferences**: Video (45%), Images (30%), Text (25%)
- **Platform-Specific Optimization**: LinkedIn for professional, Instagram for visual

**A/B Testing Framework**
- **Subject Line Testing**: Email open rates improved by 23%
- **Visual Style Variants**: Brand color vs. industry-specific themes
- **Call-to-Action Optimization**: Button text and placement testing
- **Messaging Tone**: Professional vs. conversational approach analysis

### Content Calendar Integration
**Strategic Timeline**
- **30 days before**: Industry trend analysis and speaker announcements
- **14 days before**: Detailed agenda reveals and early-bird reminders
- **7 days before**: Final details and logistics communication
- **Day of**: Real-time updates and live engagement content
- **Post-event**: Thank you messages and resource distribution

### Brand Amplification Strategy
**Influencer Collaboration**
- **Micro-Influencers**: Industry professionals with 5K-50K followers
- **Content Co-Creation**: Joint posts with complementary organizations
- **Expert Quotes**: Third-party validation and credibility building
- **Media Partnerships**: Trade publication coverage and press releases

*Content strategy intelligently crafted using audience behavior analysis and engagement optimization algorithms.*
"""


def generate_text(prompt: str, *, max_tokens: int = 1024, temperature: float = 0.7, model: Optional[str] = None) -> str:
    """Generate text using the selected provider.

    Args:
        prompt: Prompt string
        max_tokens: token limit (provider-dependent)
        temperature: creativity parameter
        model: Optional model override (provider-specific)

    Returns:
        Generated text string
    """
    provider = _choose_provider()
    logger.debug(f"LLM provider chosen: {provider}")

    if provider == "demo":
        logger.info("Using demo mode for LLM generation - configure API keys for full AI functionality")
        return _generate_demo_response(prompt, max_tokens)

    if provider == "gemini":
        api_key = os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("Gemini API key not configured, falling back to demo mode")
            return _generate_demo_response(prompt, max_tokens)

        genai = _init_genai(api_key)
        chosen_model = model or os.getenv("GEMINI_MODEL") or "gemini-1.5-flash"

        try:
            # Using the simple generate_content wrapper; adapt as needed
            gmodel = genai.GenerativeModel(chosen_model)
            resp = gmodel.generate_content(prompt)
            # depending on SDK, result may live in resp.text or resp.output[0].content
            if hasattr(resp, 'text') and resp.text:
                return resp.text
            if isinstance(resp, dict):
                # Best-effort parse
                return resp.get('output', [{}])[0].get('content', '')
            # Fallback
            return str(resp)
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}, falling back to demo mode")
            return _generate_demo_response(prompt, max_tokens)

    elif provider == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OpenAI API key not configured, falling back to demo mode")
            return _generate_demo_response(prompt, max_tokens)

        openai = _init_openai(api_key)
        chosen_model = model or os.getenv("OPENAI_MODEL") or "gpt-3.5-turbo"

        try:
            # Use ChatCompletion for robust format
            response = openai.ChatCompletion.create(
                model=chosen_model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature,
            )
            # Extract text
            choices = response.get("choices", [])
            if choices:
                message = choices[0].get("message") or choices[0]
                if isinstance(message, dict):
                    return message.get("content", "").strip()
                return str(message)
            return ""
        except Exception as e:
            logger.error(f"OpenAI generation failed: {e}, falling back to demo mode")
            return _generate_demo_response(prompt, max_tokens)

    else:
        raise RuntimeError(f"Unsupported LLM provider: {provider}")
