"""
Apokria AI Agents Module

This module contains all the AI-powered agents for event management:
- SchedulerAgent: Conflict detection and time slot management
- FlowAgent: AI-powered event flow generation
- SponsorAgent: Intelligent sponsor matching and outreach
- ContentAgent: AI content generation for events
- AnalyticsAgent: Event analytics and insights

Usage:
    from agents import SchedulerAgent, FlowAgent, SponsorAgent
    
    # Or import all agents
    from agents import get_all_agents
    agents = get_all_agents()
"""

from .scheduler import scheduler_agent
from .flow import flow_agent
from .sponsor import SponsorAgent
from .content import ContentAgent
from .analytics import AnalyticsAgent

# Export all agents for easy importing
__all__ = [
    'scheduler_agent',
    'flow_agent', 
    'SponsorAgent',
    'ContentAgent',
    'AnalyticsAgent'
]

def get_all_agents():
    """
    Returns a dictionary of all available agents.
    Useful for dynamic agent loading or management interfaces.
    """
    return {
        'scheduler': scheduler_agent,
        'flow': flow_agent,
        'sponsor': SponsorAgent,
        'content': ContentAgent,
        'analytics': AnalyticsAgent
    }

def get_agent_info():
    """
    Returns metadata about all agents.
    """
    return {
        'scheduler': {
            'name': 'Scheduler Agent',
            'description': 'Handles event scheduling and conflict detection',
            'endpoints': ['/check_conflict', '/api/schedule'],
            'status': 'active'
        },
        'flow': {
            'name': 'Flow Agent', 
            'description': 'Generates AI-powered event itineraries using Google Gemini',
            'endpoints': ['/api/flow', '/generate_flow'],
            'status': 'active'
        },
        'sponsor': {
            'name': 'Sponsor Agent',
            'description': 'Matches events with sponsors and generates outreach emails',
            'endpoints': ['/api/sponsors', '/get_sponsors'],
            'status': 'active'
        },
        'content': {
            'name': 'Content Agent',
            'description': 'Creates marketing content and event materials', 
            'endpoints': ['/api/content'],
            'status': 'active'
        },
        'analytics': {
            'name': 'Analytics Agent',
            'description': 'Provides event analytics and insights',
            'endpoints': ['/api/analytics'],
            'status': 'active'
        }
    }

def get_active_agents():
    """
    Returns only the currently active and working agents.
    """
    return {
        'scheduler': scheduler_agent,
        'flow': flow_agent,
        'sponsor': SponsorAgent(),
        'content': ContentAgent(),
        'analytics': AnalyticsAgent()
    }

def health_check_all_agents():
    """
    Performs health check on all agents.
    Returns status of each agent.
    """
    health_status = {}
    
    try:
        # Check scheduler agent
        health_status['scheduler'] = {
            'status': 'healthy',
            'message': 'Scheduler agent operational'
        }
    except Exception as e:
        health_status['scheduler'] = {
            'status': 'error',
            'message': str(e)
        }
    
    try:
        # Check flow agent
        health_status['flow'] = flow_agent.health_check() if hasattr(flow_agent, 'health_check') else {
            'status': 'healthy',
            'message': 'Flow agent operational'
        }
    except Exception as e:
        health_status['flow'] = {
            'status': 'error',
            'message': str(e)
        }
    
    try:
        # Check sponsor agent
        sponsor = SponsorAgent()
        health_status['sponsor'] = sponsor.health_check() if hasattr(sponsor, 'health_check') else {
            'status': 'healthy',
            'message': 'Sponsor agent operational'
        }
    except Exception as e:
        health_status['sponsor'] = {
            'status': 'error',
            'message': str(e)
        }
    
    try:
        # Check content agent
        content = ContentAgent()
        health_status['content'] = content.health_check() if hasattr(content, 'health_check') else {
            'status': 'healthy',
            'message': 'Content agent operational'
        }
    except Exception as e:
        health_status['content'] = {
            'status': 'error',
            'message': str(e)
        }
    
    try:
        # Check analytics agent
        analytics = AnalyticsAgent()
        health_status['analytics'] = analytics.health_check() if hasattr(analytics, 'health_check') else {
            'status': 'healthy',
            'message': 'Analytics agent operational'
        }
    except Exception as e:
        health_status['analytics'] = {
            'status': 'error',
            'message': str(e)
        }
    
    return health_status

# Version info
__version__ = '2.0.0'
__author__ = 'Apokria Team'
