/**
 * Event-related API endpoints for Apokria frontend.
 */

import { apiClient } from './client';

export interface Event {
  id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  venue: string;
  organizer?: string;
  category?: string;
  capacity?: number;
  budget?: number;
  status?: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface EventListResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}

export const eventApi = {
  // Get all events
  async getEvents(params?: { page?: number; limit?: number; category?: string }): Promise<EventListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    
    const query = queryParams.toString();
    const endpoint = query ? `/api/events?${query}` : '/api/events';
    
    return apiClient.get<EventListResponse>(endpoint);
  },

  // Create a new event
  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    return apiClient.post<Event>('/api/events', event);
  },

  // Get a specific event
  async getEvent(id: string): Promise<Event> {
    return apiClient.get<Event>(`/api/events/${id}`);
  },

  // Update an event
  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    return apiClient.put<Event>(`/api/events/${id}`, event);
  },

  // Delete an event
  async deleteEvent(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/events/${id}`);
  },
};