/**
 * AI Agents API endpoints for Apokria frontend.
 * Interfaces with the multi-agent AI system for event orchestration.
 */

import { apiClient } from './client';
import type { Event } from './events';

// Scheduler Agent Types
export interface ScheduleRequest {
  event: Omit<Event, 'id'>;
  preferences?: {
    avoid_conflicts?: boolean;
    preferred_times?: string[];
    blackout_periods?: string[];
  };
}

export interface ScheduleResponse {
  suggested_times: Array<{
    start_time: string;
    end_time: string;
    confidence: number;
    conflicts: string[];
    reasoning: string;
  }>;
  calendar_status: 'available' | 'busy' | 'conflict';
  recommendations: string[];
}

// Flow Agent Types
export interface FlowRequest {
  event_type: string;
  duration_hours: number;
  budget?: number;
  audience_size?: number;
  objectives?: string[];
}

export interface FlowResponse {
  event_flow: Array<{
    activity: string;
    duration_minutes: number;
    required_resources: string[];
    order: number;
    description: string;
  }>;
  timeline: string;
  budget_breakdown: Record<string, number>;
  success_metrics: string[];
}

// Sponsor Agent Types
export interface SponsorRequest {
  event: Event;
  sponsorship_tiers?: string[];
  target_amount?: number;
  categories?: string[];
}

export interface SponsorResponse {
  recommended_sponsors: Array<{
    name: string;
    category: string;
    contact: {
      email: string;
      phone?: string;
      contact_person?: string;
    };
    match_score: number;
    suggested_tier: string;
    past_partnerships: boolean;
    reasoning: string;
  }>;
  outreach_templates: Record<string, string>;
  total_potential_funding: number;
}

// Content Agent Types
export interface ContentRequest {
  event: Event;
  content_types: ('email' | 'banner' | 'social_media' | 'flyer' | 'announcement')[];
  tone?: 'formal' | 'casual' | 'energetic' | 'professional';
  target_audience?: string;
}

export interface ContentResponse {
  generated_content: Record<string, {
    title: string;
    content: string;
    format: string;
    suggested_channels: string[];
  }>;
  branding_guidelines: string[];
  distribution_timeline: string[];
}

// Analytics Types
export interface AnalyticsResponse {
  event_metrics: {
    total_events: number;
    upcoming_events: number;
    completed_events: number;
    cancelled_events: number;
  };
  engagement_stats: {
    average_attendance: number;
    popular_categories: string[];
    peak_times: string[];
  };
  resource_utilization: {
    venue_usage: Record<string, number>;
    budget_efficiency: number;
    sponsor_conversion_rate: number;
  };
  trends: Array<{
    metric: string;
    trend: 'up' | 'down' | 'stable';
    percentage_change: number;
    period: string;
  }>;
}

// AI Agents API
export const agentsApi = {
  // Scheduler Agent - Create or check event schedule
  async scheduleEvent(request: ScheduleRequest): Promise<ScheduleResponse> {
    return apiClient.post<ScheduleResponse>('/api/schedule', request);
  },

  // Flow Agent - Generate event flow
  async generateFlow(request: FlowRequest): Promise<FlowResponse> {
    return apiClient.post<FlowResponse>('/api/flow', request);
  },

  // Sponsor Agent - Recommend sponsors
  async recommendSponsors(request: SponsorRequest): Promise<SponsorResponse> {
    return apiClient.post<SponsorResponse>('/api/sponsors', request);
  },

  // Content Agent - Generate emails, banners, etc.
  async generateContent(request: ContentRequest): Promise<ContentResponse> {
    return apiClient.post<ContentResponse>('/api/content', request);
  },

  // Analytics Agent - Get stats and dashboards
  async getAnalytics(params?: { 
    period?: 'week' | 'month' | 'quarter' | 'year';
    event_types?: string[];
  }): Promise<AnalyticsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    if (params?.event_types) {
      params.event_types.forEach(type => queryParams.append('event_types', type));
    }
    
    const query = queryParams.toString();
    const endpoint = query ? `/api/analytics?${query}` : '/api/analytics';
    
    return apiClient.get<AnalyticsResponse>(endpoint);
  },
};