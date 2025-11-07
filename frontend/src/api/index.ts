/**
 * Main API exports for Apokria frontend.
 * Centralized access to all API modules.
 */

export { apiClient, ApiError } from './client';
export type { ApiResponse } from './client';

export { eventApi } from './events';
export type { Event, EventListResponse } from './events';

export { agentsApi } from './agents';
export type {
  ScheduleRequest,
  ScheduleResponse,
  FlowRequest,
  FlowResponse,
  SponsorRequest,
  SponsorResponse,
  ContentRequest,
  ContentResponse,
  AnalyticsResponse,
} from './agents';

// Health check utility
export const healthApi = {
  async checkHealth() {
    return apiClient.get('/health');
  },
};

export default {
  events: eventApi,
  agents: agentsApi,
  health: healthApi,
  client: apiClient,
};