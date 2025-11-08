// Extended JavaScript for Agent Testing
// This extends the main mock-frontend.js with specific agent functionality

// Add this to the ApokriaTestingDashboard class setupEventListeners method
function setupAgentEventListeners() {
    // Scheduler form handlers
    document.getElementById('conflict-form')?.addEventListener('submit', (e) => this.handleConflictForm(e));
    document.getElementById('event-form')?.addEventListener('submit', (e) => this.handleEventForm(e));
    
    // Flow form handlers
    document.getElementById('flow-form')?.addEventListener('submit', (e) => this.handleFlowForm(e));
    document.querySelectorAll('.flow-template').forEach(btn => {
        btn.addEventListener('click', (e) => this.applyFlowTemplate(e));
    });
    document.getElementById('flow-health')?.addEventListener('click', () => this.checkFlowHealth());
    
    // Sponsor form handlers
    document.getElementById('sponsor-form')?.addEventListener('submit', (e) => this.handleSponsorForm(e));
    document.getElementById('sponsor-health')?.addEventListener('click', () => this.checkSponsorHealth());
}

// Add these methods to the ApokriaTestingDashboard class

// Scheduler Agent Methods
async handleConflictForm(e) {
    e.preventDefault();
    
    const startTime = document.getElementById('conflict-start').value;
    const endTime = document.getElementById('conflict-end').value;
    const venue = document.getElementById('conflict-venue').value;
    
    if (!startTime || !endTime) {
        this.showNotification('Please select both start and end times', 'error');
        return;
    }
    
    try {
        const response = await axios.get(`${this.apiBase}/check_conflict`, {
            params: {
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString(),
                venue: venue
            }
        });
        
        this.displaySchedulerResults({
            type: 'conflict_check',
            data: response.data,
            query: { startTime, endTime, venue }
        });
        
    } catch (error) {
        this.showNotification('Conflict check failed', 'error');
        this.displaySchedulerResults({
            type: 'error',
            error: error.response?.data || error.message
        });
    }
}

async handleEventForm(e) {
    e.preventDefault();
    
    const eventData = {
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        category: document.getElementById('event-category').value,
        capacity: parseInt(document.getElementById('event-capacity').value) || 50,
        start_time: document.getElementById('conflict-start').value,
        end_time: document.getElementById('conflict-end').value,
        venue: document.getElementById('conflict-venue').value,
        organizer: 'Test User'
    };
    
    if (!eventData.title || !eventData.start_time || !eventData.end_time) {
        this.showNotification('Please fill in required fields', 'error');
        return;
    }
    
    try {
        const response = await axios.post(`${this.apiBase}/api/events`, {
            ...eventData,
            start_time: new Date(eventData.start_time).toISOString(),
            end_time: new Date(eventData.end_time).toISOString()
        });
        
        this.showNotification('Event created successfully!', 'success');
        this.displaySchedulerResults({
            type: 'event_created',
            data: response.data
        });
        
        // Clear form
        document.getElementById('event-form').reset();
        
    } catch (error) {
        this.showNotification('Event creation failed', 'error');
        this.displaySchedulerResults({
            type: 'error',
            error: error.response?.data || error.message
        });
    }
}

displaySchedulerResults(result) {
    const container = document.getElementById('scheduler-results');
    let html = '';
    
    switch(result.type) {
        case 'conflict_check':
            const status = result.data.data.status;
            const statusClass = status === 'CLEAR' ? 'text-green-600' : 'text-red-600';
            
            html = `
                <div class="border rounded-lg p-4">
                    <h4 class="font-semibold mb-2">Conflict Check Results</h4>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span>Status:</span>
                            <span class="font-semibold ${statusClass}">${status}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Time Slot:</span>
                            <span>${new Date(result.query.startTime).toLocaleString()} - ${new Date(result.query.endTime).toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Venue:</span>
                            <span>${result.query.venue}</span>
                        </div>
                        ${result.data.data.conflicting_event ? `
                            <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                <strong>Conflict with:</strong> ${result.data.data.conflicting_event}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            break;
            
        case 'event_created':
            html = `
                <div class="border rounded-lg p-4 bg-green-50">
                    <h4 class="font-semibold mb-2 text-green-800">Event Created Successfully</h4>
                    <pre class="text-sm text-green-700 whitespace-pre-wrap">${JSON.stringify(result.data, null, 2)}</pre>
                </div>
            `;
            break;
            
        case 'error':
            html = `
                <div class="border rounded-lg p-4 bg-red-50">
                    <h4 class="font-semibold mb-2 text-red-800">Error</h4>
                    <pre class="text-sm text-red-700">${JSON.stringify(result.error, null, 2)}</pre>
                </div>
            `;
            break;
    }
    
    container.innerHTML = html;
}

// Flow Agent Methods
async handleFlowForm(e) {
    e.preventDefault();
    
    const flowData = {
        event_name: document.getElementById('flow-event-name').value,
        event_type: document.getElementById('flow-event-type').value,
        duration: parseFloat(document.getElementById('flow-duration').value),
        audience_size: parseInt(document.getElementById('flow-audience-size').value) || 100,
        budget_range: document.getElementById('flow-budget-range').value,
        venue_type: document.getElementById('flow-venue-type').value,
        special_requirements: document.getElementById('flow-special-requirements').value || 'None'
    };
    
    if (!flowData.event_name || !flowData.duration) {
        this.showNotification('Please fill in required fields', 'error');
        return;
    }
    
    try {
        const response = await axios.get(`${this.apiBase}/generate_flow`, {
            params: flowData
        });
        
        this.showNotification('Event flow generated successfully!', 'success');
        this.displayFlowResults(response.data);
        
    } catch (error) {
        this.showNotification('Flow generation failed', 'error');
        this.displayFlowResults({ error: error.response?.data || error.message });
    }
}

applyFlowTemplate(e) {
    const template = e.target.closest('.flow-template').dataset.template;
    const templates = {
        'tech-conference': {
            event_name: 'Tech Innovation Conference 2025',
            event_type: 'academic_conference',
            duration: 4,
            audience_size: 200,
            budget_range: 'Medium',
            venue_type: 'Large auditorium',
            special_requirements: 'Keynote speakers, technical workshops, networking lunch'
        },
        'cultural-festival': {
            event_name: 'Annual Cultural Festival',
            event_type: 'cultural_festival',
            duration: 6,
            audience_size: 500,
            budget_range: 'High',
            venue_type: 'Outdoor campus area',
            special_requirements: 'Performance stage, food stalls, cultural exhibits'
        },
        'workshop': {
            event_name: 'Hands-on Technical Workshop',
            event_type: 'technical_workshop',
            duration: 2,
            audience_size: 50,
            budget_range: 'Low',
            venue_type: 'Small seminar room',
            special_requirements: 'Laptops, projector, hands-on activities'
        },
        'career-fair': {
            event_name: 'Annual Career Fair',
            event_type: 'career_fair',
            duration: 5,
            audience_size: 300,
            budget_range: 'Medium',
            venue_type: 'Large auditorium',
            special_requirements: 'Company booths, resume review stations, networking area'
        }
    };
    
    const data = templates[template];
    if (data) {
        document.getElementById('flow-event-name').value = data.event_name;
        document.getElementById('flow-event-type').value = data.event_type;
        document.getElementById('flow-duration').value = data.duration;
        document.getElementById('flow-audience-size').value = data.audience_size;
        document.getElementById('flow-budget-range').value = data.budget_range;
        document.getElementById('flow-venue-type').value = data.venue_type;
        document.getElementById('flow-special-requirements').value = data.special_requirements;
        
        this.showNotification(`Applied ${template.replace('-', ' ')} template`, 'success');
    }
}

async checkFlowHealth() {
    try {
        const response = await axios.get(`${this.apiBase}/api/flow/health`);
        this.showNotification('Flow Agent is healthy!', 'success');
        this.displayFlowResults({ health: response.data });
    } catch (error) {
        this.showNotification('Flow Agent health check failed', 'error');
    }
}

displayFlowResults(result) {
    const container = document.getElementById('flow-results');
    let html = '';
    
    if (result.error) {
        html = `
            <div class="border rounded-lg p-4 bg-red-50">
                <h4 class="font-semibold mb-2 text-red-800">Error</h4>
                <pre class="text-sm text-red-700">${JSON.stringify(result.error, null, 2)}</pre>
            </div>
        `;
    } else if (result.health) {
        html = `
            <div class="border rounded-lg p-4 bg-green-50">
                <h4 class="font-semibold mb-2 text-green-800">Flow Agent Health</h4>
                <pre class="text-sm text-green-700">${JSON.stringify(result.health, null, 2)}</pre>
            </div>
        `;
    } else {
        const data = result.data;
        html = `
            <div class="space-y-4">
                <div class="border rounded-lg p-4">
                    <h4 class="font-semibold mb-2">Event Information</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Event:</strong> ${data.event_name}</div>
                        <div><strong>Type:</strong> ${data.event_type}</div>
                        <div><strong>Duration:</strong> ${data.duration} hours</div>
                        <div><strong>Created:</strong> ${new Date(data.created_at).toLocaleString()}</div>
                    </div>
                </div>
                <div class="border rounded-lg p-4">
                    <h4 class="font-semibold mb-2">Generated Event Flow</h4>
                    <div class="bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm max-h-64 overflow-y-auto">${data.generated_flow}</div>
                </div>
                ${data.metadata ? `
                    <div class="border rounded-lg p-4">
                        <h4 class="font-semibold mb-2">Metadata</h4>
                        <pre class="text-sm bg-gray-50 p-2 rounded">${JSON.stringify(data.metadata, null, 2)}</pre>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Sponsor Agent Methods
async handleSponsorForm(e) {
    e.preventDefault();
    
    const sponsorData = {
        event_type: document.getElementById('sponsor-event-type').value,
        event_name: document.getElementById('sponsor-event-name').value,
        budget_range: document.getElementById('sponsor-budget-range').value,
        audience_size: parseInt(document.getElementById('sponsor-audience-size').value) || 100,
        target_demographics: document.getElementById('sponsor-demographics').value,
        additional_context: document.getElementById('sponsor-context').value
    };
    
    try {
        const response = await axios.get(`${this.apiBase}/get_sponsors`, {
            params: sponsorData
        });
        
        this.showNotification('Sponsor recommendations generated!', 'success');
        this.displaySponsorResults(response.data);
        
    } catch (error) {
        this.showNotification('Sponsor recommendation failed', 'error');
        this.displaySponsorResults({ error: error.response?.data || error.message });
    }
}

async checkSponsorHealth() {
    try {
        const response = await axios.get(`${this.apiBase}/api/sponsors/health`);
        this.showNotification('Sponsor Agent is healthy!', 'success');
        this.displaySponsorResults({ health: response.data });
    } catch (error) {
        this.showNotification('Sponsor Agent health check failed', 'error');
    }
}

displaySponsorResults(result) {
    const container = document.getElementById('sponsor-results');
    let html = '';
    
    if (result.error) {
        html = `
            <div class="border rounded-lg p-4 bg-red-50">
                <h4 class="font-semibold mb-2 text-red-800">Error</h4>
                <pre class="text-sm text-red-700">${JSON.stringify(result.error, null, 2)}</pre>
            </div>
        `;
    } else if (result.health) {
        html = `
            <div class="border rounded-lg p-4 bg-green-50">
                <h4 class="font-semibold mb-2 text-green-800">Sponsor Agent Health</h4>
                <pre class="text-sm text-green-700">${JSON.stringify(result.health, null, 2)}</pre>
            </div>
        `;
    } else {
        const data = result.data;
        html = `
            <div class="space-y-4">
                <div class="border rounded-lg p-4">
                    <h4 class="font-semibold mb-2">Sponsor Recommendations (${data.recommendations.length})</h4>
                    <div class="space-y-3">
                        ${data.recommendations.map(sponsor => `
                            <div class="bg-gray-50 p-3 rounded border">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="font-medium">${sponsor.name}</div>
                                        <div class="text-sm text-gray-600">${sponsor.category} • ${sponsor.budget_range} Budget</div>
                                        <div class="text-sm text-blue-600">${sponsor.contact_email}</div>
                                    </div>
                                    <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                        ${sponsor.score}% Match
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="border rounded-lg p-4">
                    <h4 class="font-semibold mb-2">Generated Outreach Email</h4>
                    <div class="bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm max-h-64 overflow-y-auto">${data.outreach_email}</div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Initialize date/time inputs with current date + 1 hour
function initializeDateInputs() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0, 0, 0);
    
    const startInput = document.getElementById('conflict-start');
    if (startInput) {
        startInput.value = now.toISOString().slice(0, 16);
    }
    
    const endTime = new Date(now);
    endTime.setHours(endTime.getHours() + 2);
    
    const endInput = document.getElementById('conflict-end');
    if (endInput) {
        endInput.value = endTime.toISOString().slice(0, 16);
    }
}

// Call this when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDateInputs();
});