// Apokria Mock Testing Frontend JavaScript
// Comprehensive testing interface for all agents and authentication

class ApokriaTestingDashboard {
    constructor() {
        this.apiBase = 'http://localhost:8000';
        this.token = localStorage.getItem('auth_token');
        this.totalRequests = 0;
        this.successfulRequests = 0;
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.setupTabNavigation();
        this.checkAuthStatus();
        this.loadSystemStatus();
        this.setupAxiosInterceptors();
    }

    setupAxiosInterceptors() {
        // Add auth token to requests
        axios.interceptors.request.use(config => {
            if (this.token) {
                config.headers.Authorization = `Bearer ${this.token}`;
            }
            this.totalRequests++;
            this.updateStats();
            return config;
        });

        // Handle responses
        axios.interceptors.response.use(
            response => {
                this.successfulRequests++;
                this.updateStats();
                this.addActivity(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - Success`);
                return response;
            },
            error => {
                this.updateStats();
                this.addActivity(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - Error: ${error.response?.status}`);
                return Promise.reject(error);
            }
        );
    }

    setupEventListeners() {
        // Auth buttons
        document.getElementById('login-btn')?.addEventListener('click', () => this.showTab('auth'));
        document.getElementById('register-btn')?.addEventListener('click', () => this.showTab('auth'));
        document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());

        // Auth forms
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form')?.addEventListener('submit', (e) => this.handleRegister(e));

        // Quick tests
        document.getElementById('test-conflict')?.addEventListener('click', () => this.testConflictDetection());
        document.getElementById('test-flow')?.addEventListener('click', () => this.testFlowGeneration());
        document.getElementById('test-sponsors')?.addEventListener('click', () => this.testSponsorRecommendations());

        // Auth testing
        document.getElementById('test-protected')?.addEventListener('click', () => this.testProtectedRoute());
        document.getElementById('test-admin')?.addEventListener('click', () => this.testAdminRoute());
        document.getElementById('auth-health')?.addEventListener('click', () => this.testAuthHealth());

        // Status refresh
        document.getElementById('refresh-status')?.addEventListener('click', () => this.loadSystemStatus());
        
        // Agent form handlers
        this.setupAgentEventListeners();
    }

    setupAgentEventListeners() {
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

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.closest('.tab-btn').dataset.tab;
                this.showTab(tabName);
            });
        });
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('text-gray-600');
        });

        // Show selected tab
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Activate selected button
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('border-blue-500', 'text-blue-600');
            selectedBtn.classList.remove('text-gray-600');
        }

        // Load tab-specific content
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        switch(tabName) {
            case 'scheduler':
                this.loadSchedulerTab();
                break;
            case 'flow':
                this.loadFlowTab();
                break;
            case 'sponsor':
                this.loadSponsorTab();
                break;
            case 'content':
                this.loadContentTab();
                break;
            case 'analytics':
                this.loadAnalyticsTab();
                break;
        }
    }

    // Authentication Methods
    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await axios.post(`${this.apiBase}/auth/login`, {
                username,
                password
            });

            if (response.data.success) {
                this.token = response.data.data.access_token;
                localStorage.setItem('auth_token', this.token);
                
                this.showNotification('Login successful!', 'success');
                this.checkAuthStatus();
                
                // Clear form
                document.getElementById('login-form').reset();
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification(
                error.response?.data?.detail || 'Login failed', 
                'error'
            );
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const full_name = document.getElementById('register-fullname').value;
        const role = document.getElementById('register-role').value;
        const password = document.getElementById('register-password').value;

        if (!username || !email || !full_name || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await axios.post(`${this.apiBase}/auth/register`, {
                username,
                email,
                full_name,
                role,
                password
            });

            if (response.data.success) {
                this.showNotification('Registration successful! Please login.', 'success');
                document.getElementById('register-form').reset();
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification(
                error.response?.data?.detail || 'Registration failed', 
                'error'
            );
        }
    }

    async checkAuthStatus() {
        const userInfo = document.getElementById('user-info');
        const authButtons = document.getElementById('auth-buttons');
        
        if (!this.token) {
            userInfo.classList.add('hidden');
            authButtons.classList.remove('hidden');
            return;
        }

        try {
            const response = await axios.get(`${this.apiBase}/auth/me`);
            
            if (response.data.success) {
                const user = response.data.data;
                
                document.getElementById('username').textContent = user.username;
                document.getElementById('user-role').textContent = `(${user.role})`;
                
                userInfo.classList.remove('hidden');
                authButtons.classList.add('hidden');
            }
        } catch (error) {
            console.error('Auth status error:', error);
            this.logout();
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
        this.checkAuthStatus();
        this.showNotification('Logged out successfully', 'success');
    }

    // Testing Methods
    async testConflictDetection() {
        const startTime = new Date();
        startTime.setHours(startTime.getHours() + 1);
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 2);

        try {
            const response = await axios.get(`${this.apiBase}/check_conflict`, {
                params: {
                    start_time: startTime.toISOString(),
                    end_time: endTime.toISOString(),
                    venue: 'Main Auditorium'
                }
            });

            this.showNotification(
                `Conflict check: ${response.data.data.status}`, 
                response.data.data.status === 'CLEAR' ? 'success' : 'warning'
            );
        } catch (error) {
            this.showNotification('Conflict detection failed', 'error');
        }
    }

    async testFlowGeneration() {
        try {
            const response = await axios.get(`${this.apiBase}/generate_flow`, {
                params: {
                    event_name: 'Tech Conference 2025',
                    event_type: 'academic_conference',
                    duration: 4,
                    audience_size: 150,
                    budget_range: 'Medium'
                }
            });

            this.showNotification('Flow generation successful!', 'success');
            console.log('Generated flow:', response.data);
        } catch (error) {
            this.showNotification('Flow generation failed', 'error');
        }
    }

    async testSponsorRecommendations() {
        try {
            const response = await axios.get(`${this.apiBase}/get_sponsors`, {
                params: {
                    event_type: 'academic_conference',
                    budget_range: 'Medium',
                    audience_size: 150
                }
            });

            const recommendations = response.data.data.recommendations;
            this.showNotification(`Found ${recommendations.length} sponsor recommendations!`, 'success');
        } catch (error) {
            this.showNotification('Sponsor recommendations failed', 'error');
        }
    }

    async testProtectedRoute() {
        try {
            const response = await axios.get(`${this.apiBase}/auth/protected`);
            this.showNotification('Protected route access granted!', 'success');
        } catch (error) {
            this.showNotification('Protected route access denied', 'error');
        }
    }

    async testAdminRoute() {
        try {
            const response = await axios.get(`${this.apiBase}/auth/admin-only`);
            this.showNotification('Admin route access granted!', 'success');
        } catch (error) {
            this.showNotification('Admin route access denied', 'error');
        }
    }

    async testAuthHealth() {
        try {
            const response = await axios.get(`${this.apiBase}/auth/health`);
            this.showNotification('Auth system is healthy!', 'success');
        } catch (error) {
            this.showNotification('Auth system health check failed', 'error');
        }
    }

    // System Status
    async loadSystemStatus() {
        // API Status
        try {
            const response = await axios.get(`${this.apiBase}/health`);
            document.getElementById('api-status').innerHTML = '<i class="fas fa-circle"></i> Online';
            document.getElementById('api-status').className = 'text-green-500';
        } catch (error) {
            document.getElementById('api-status').innerHTML = '<i class="fas fa-circle"></i> Offline';
            document.getElementById('api-status').className = 'text-red-500';
        }

        // Auth Status
        try {
            const response = await axios.get(`${this.apiBase}/auth/health`);
            document.getElementById('auth-system-status').innerHTML = '<i class="fas fa-circle"></i> Operational';
            document.getElementById('auth-system-status').className = 'text-green-500';
            
            // Update DB status from auth health
            if (response.data.data.database === 'connected') {
                document.getElementById('db-status').innerHTML = '<i class="fas fa-circle"></i> Connected';
                document.getElementById('db-status').className = 'text-green-500';
            } else {
                document.getElementById('db-status').innerHTML = '<i class="fas fa-circle"></i> Disconnected';
                document.getElementById('db-status').className = 'text-red-500';
            }
        } catch (error) {
            document.getElementById('auth-system-status').innerHTML = '<i class="fas fa-circle"></i> Error';
            document.getElementById('auth-system-status').className = 'text-red-500';
            
            document.getElementById('db-status').innerHTML = '<i class="fas fa-circle"></i> Unknown';
            document.getElementById('db-status').className = 'text-yellow-500';
        }
    }

    // Tab Content Loaders (Placeholder functions for now)
    loadSchedulerTab() {
        // Initialize date inputs when scheduler tab loads
        this.initializeDateInputs();
        console.log('Loading scheduler tab content...');
    }

    loadFlowTab() {
        // Will implement detailed flow testing interface
        console.log('Loading flow tab content...');
    }

    loadSponsorTab() {
        // Will implement detailed sponsor testing interface
        console.log('Loading sponsor tab content...');
    }

    loadContentTab() {
        // Will implement content agent testing interface
        console.log('Loading content tab content...');
    }

    loadAnalyticsTab() {
        // Will implement analytics testing interface  
        console.log('Loading analytics tab content...');
    }

    // Content Agent Methods
    async handleContentForm(e) {
        e.preventDefault();
        
        const contentData = {
            event_name: document.getElementById('content-event-name').value,
            event_type: document.getElementById('content-event-type').value,
            content_type: document.getElementById('content-type').value,
            tone: document.getElementById('content-tone').value,
            length: document.getElementById('content-length').value,
            target_audience: document.getElementById('content-audience').value,
            event_description: document.getElementById('content-description').value,
            key_points: document.getElementById('content-key-points').value.split('\n').filter(point => point.trim()),
            call_to_action: document.getElementById('content-cta').value
        };
        
        if (!contentData.event_name || !contentData.event_type) {
            this.showNotification('Please fill in required fields', 'error');
            return;
        }
        
        try {
            const response = await axios.post(`${this.apiBase}/api/content`, contentData);
            
            this.showNotification('Content generated successfully!', 'success');
            this.displayContentResults(response.data);
            
        } catch (error) {
            this.showNotification('Content generation failed', 'error');
            this.displayContentResults({ error: error.response?.data || error.message });
        }
    }

    async checkContentHealth() {
        try {
            const response = await axios.get(`${this.apiBase}/api/content/health`);
            this.showNotification('Content Agent is healthy!', 'success');
            this.displayContentResults({ health: response.data });
        } catch (error) {
            this.showNotification('Content Agent health check failed', 'error');
        }
    }

    displayContentResults(result) {
        const container = document.getElementById('content-results');
        if (!container) return;
        
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
                    <h4 class="font-semibold mb-2 text-green-800">Content Agent Health</h4>
                    <pre class="text-sm text-green-700">${JSON.stringify(result.health, null, 2)}</pre>
                </div>
            `;
        } else {
            const data = result.data;
            html = `
                <div class="space-y-4">
                    <div class="border rounded-lg p-4">
                        <h4 class="font-semibold mb-2">Content Information</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Event:</strong> ${data.event_name}</div>
                            <div><strong>Content Type:</strong> ${data.content_type}</div>
                            <div><strong>Created:</strong> ${new Date(data.created_at).toLocaleString()}</div>
                            <div><strong>Word Count:</strong> ${data.metadata.word_count}</div>
                        </div>
                    </div>
                    <div class="border rounded-lg p-4">
                        <h4 class="font-semibold mb-2">Generated Content</h4>
                        <div class="bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm max-h-64 overflow-y-auto">${data.generated_content}</div>
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

    // Analytics Agent Methods
    async handleAnalyticsForm(e) {
        e.preventDefault();
        
        const analyticsData = {
            event_name: document.getElementById('analytics-event-name').value,
            event_type: document.getElementById('analytics-event-type').value,
            analysis_type: document.getElementById('analytics-type').value,
            time_period: document.getElementById('analytics-period').value
        };
        
        if (!analyticsData.event_name || !analyticsData.event_type) {
            this.showNotification('Please fill in required fields', 'error');
            return;
        }
        
        try {
            const params = new URLSearchParams(analyticsData);
            const response = await axios.get(`${this.apiBase}/api/analytics?${params}`);
            
            this.showNotification('Analytics generated successfully!', 'success');
            this.displayAnalyticsResults(response.data);
            
        } catch (error) {
            this.showNotification('Analytics generation failed', 'error');
            this.displayAnalyticsResults({ error: error.response?.data || error.message });
        }
    }

    async checkAnalyticsHealth() {
        try {
            const response = await axios.get(`${this.apiBase}/api/analytics/health`);
            this.showNotification('Analytics Agent is healthy!', 'success');
            this.displayAnalyticsResults({ health: response.data });
        } catch (error) {
            this.showNotification('Analytics Agent health check failed', 'error');
        }
    }

    displayAnalyticsResults(result) {
        const container = document.getElementById('analytics-results');
        if (!container) return;
        
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
                    <h4 class="font-semibold mb-2 text-green-800">Analytics Agent Health</h4>
                    <pre class="text-sm text-green-700">${JSON.stringify(result.health, null, 2)}</pre>
                </div>
            `;
        } else {
            const data = result.data;
            html = `
                <div class="space-y-4">
                    <div class="border rounded-lg p-4">
                        <h4 class="font-semibold mb-2">Analytics Overview</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Event:</strong> ${data.event_name}</div>
                            <div><strong>Analysis Type:</strong> ${data.analysis_type}</div>
                            <div><strong>Generated:</strong> ${new Date(data.created_at).toLocaleString()}</div>
                            <div><strong>Insights:</strong> ${data.insights.length} key findings</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="border rounded-lg p-4">
                            <h4 class="font-semibold mb-2">Key Metrics</h4>
                            <div class="space-y-2 text-sm">
                                <div><strong>Attendance Rate:</strong> ${data.metrics.attendance.attendance_rate}%</div>
                                <div><strong>Overall Rating:</strong> ${data.metrics.satisfaction.overall_rating}/5</div>
                                <div><strong>Engagement Rate:</strong> ${(data.metrics.engagement.interaction_rate * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                        <div class="border rounded-lg p-4">
                            <h4 class="font-semibold mb-2">Demographics</h4>
                            <div class="space-y-1 text-sm">
                                <div>Students: ${data.metrics.demographics.students}%</div>
                                <div>Faculty: ${data.metrics.demographics.faculty}%</div>
                                <div>Staff: ${data.metrics.demographics.staff}%</div>
                                <div>External: ${data.metrics.demographics.external}%</div>
                            </div>
                        </div>
                    </div>
                    <div class="border rounded-lg p-4">
                        <h4 class="font-semibold mb-2">Key Insights</h4>
                        <ul class="list-disc list-inside space-y-1 text-sm">
                            ${data.insights.map(insight => `<li>${insight}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="border rounded-lg p-4">
                        <h4 class="font-semibold mb-2">Recommendations</h4>
                        <ul class="list-disc list-inside space-y-1 text-sm">
                            ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

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
        if (!container) return;
        
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
        if (!container) return;
        
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
        if (!container) return;
        
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
    initializeDateInputs() {
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

    // Utility Methods
    updateStats() {
        document.getElementById('total-requests').textContent = this.totalRequests;
        const successRate = this.totalRequests > 0 ? 
            Math.round((this.successfulRequests / this.totalRequests) * 100) : 100;
        document.getElementById('success-rate').textContent = `${successRate}%`;
        
        // Update color based on success rate
        const successElement = document.getElementById('success-rate');
        if (successRate >= 80) {
            successElement.className = 'font-semibold text-green-600';
        } else if (successRate >= 60) {
            successElement.className = 'font-semibold text-yellow-600';
        } else {
            successElement.className = 'font-semibold text-red-600';
        }
    }

    addActivity(message) {
        const activityContainer = document.getElementById('recent-activity');
        const timestamp = new Date().toLocaleTimeString();
        
        const activityItem = document.createElement('div');
        activityItem.className = 'flex justify-between text-sm py-1 border-b border-gray-100';
        activityItem.innerHTML = `
            <span>${message}</span>
            <span class="text-gray-500">${timestamp}</span>
        `;
        
        // Add to top of list
        if (activityContainer.children.length === 1 && 
            activityContainer.children[0].textContent === 'No recent activity') {
            activityContainer.innerHTML = '';
        }
        
        activityContainer.insertBefore(activityItem, activityContainer.firstChild);
        
        // Keep only last 10 activities
        while (activityContainer.children.length > 10) {
            activityContainer.removeChild(activityContainer.lastChild);
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const icon = document.getElementById('notification-icon');
        const messageEl = document.getElementById('notification-message');
        
        messageEl.textContent = message;
        
        // Set icon and color based on type
        notification.className = 'notification bg-white border-l-4 p-4 shadow-lg rounded';
        
        switch(type) {
            case 'success':
                notification.classList.add('border-green-500');
                icon.className = 'fas fa-check-circle text-green-500';
                break;
            case 'error':
                notification.classList.add('border-red-500');
                icon.className = 'fas fa-exclamation-circle text-red-500';
                break;
            case 'warning':
                notification.classList.add('border-yellow-500');
                icon.className = 'fas fa-exclamation-triangle text-yellow-500';
                break;
            default:
                notification.classList.add('border-blue-500');
                icon.className = 'fas fa-info-circle text-blue-500';
        }
        
        // Show notification
        notification.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Helper method for analytics templates
    fillAnalyticsTemplate(templateType) {
        const templates = {
            'conference': {
                event_name: 'Tech Innovation Summit 2025',
                event_type: 'academic_conference',
                analysis_type: 'overview',
                time_period: 'event'
            },
            'festival': {
                event_name: 'Annual Cultural Celebration',
                event_type: 'cultural_festival', 
                analysis_type: 'engagement',
                time_period: 'full'
            },
            'career': {
                event_name: 'Spring Career Fair 2025',
                event_type: 'career_fair',
                analysis_type: 'performance',
                time_period: 'event'
            }
        };
        
        const template = templates[templateType];
        if (template) {
            document.getElementById('analytics-event-name').value = template.event_name;
            document.getElementById('analytics-event-type').value = template.event_type;
            document.getElementById('analytics-type').value = template.analysis_type;
            document.getElementById('analytics-period').value = template.time_period;
            
            this.showNotification(`Applied ${templateType} analytics template`, 'success');
        }
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ApokriaTestingDashboard();
});