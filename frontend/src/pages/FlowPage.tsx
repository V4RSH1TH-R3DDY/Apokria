import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VscPlay, VscWatch, VscAccount, VscLocation, VscEdit, VscRefresh, VscCopy } from 'react-icons/vsc';
import { useToast } from '../contexts/ToastContext';

const FlowPage: React.FC = () => {
  const [formData, setFormData] = useState({
    event_name: '',
    event_type: 'workshop',
    duration: 3,
    audience_size: 50,
    budget_range: 'Medium',
    venue_type: 'Indoor campus facility'
  });
  
  const [generatedFlow, setGeneratedFlow] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const eventTypes = ['workshop', 'conference', 'seminar', 'networking', 'training', 'competition'];
  const budgetRanges = ['Low', 'Medium', 'High', 'Premium'];
  const venueTypes = ['Indoor campus facility', 'Outdoor campus area', 'Auditorium', 'Classroom', 'Laboratory'];

  const generateFlow = () => {
    if (!formData.event_name.trim()) {
      showToast({ 
        type: 'error', 
        title: 'Error', 
        message: 'Please enter an event name' 
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const mockFlow = `# ${formData.event_name} - Event Flow Plan

## 📋 Event Overview
- **Event Name**: ${formData.event_name}
- **Type**: ${formData.event_type.toUpperCase()}
- **Duration**: ${formData.duration} hours
- **Expected Attendees**: ${formData.audience_size}
- **Budget**: ${formData.budget_range}
- **Venue**: ${formData.venue_type}

## ⏰ Detailed Timeline

### Pre-Event Setup (T-120 minutes)
**09:00 - 11:00** | **Setup Phase**
- Venue preparation and equipment testing
- Registration desk setup with welcome materials
- Audio/visual equipment calibration
- Signage placement for optimal navigation
- Staff briefing and role assignments

### Event Execution

**11:00 - 11:30** | **Registration & Welcome**
- Attendee check-in and badge distribution
- Welcome coffee and networking session
- Distribution of event materials and swag
- Ice-breaker activities to encourage interaction

**11:30 - 12:00** | **Opening Session**
- Welcome remarks from event organizer
- Event agenda overview and logistics
- Speaker introductions and expectations
- Interactive poll: attendee goals and expectations

**12:00 - 13:30** | **Main Content Block 1**
- Primary presentation or workshop session
- Interactive Q&A segments every 20 minutes
- Hands-on activities and group discussions
- Real-time feedback collection via mobile app

**13:30 - 14:30** | **Networking Lunch**
- Catered meal with networking opportunities
- Informal discussions and knowledge sharing
- Photo opportunities with branded backdrop
- Social media campaign activation

**14:30 - 16:00** | **Main Content Block 2**
- Advanced topics and deep-dive sessions
- Breakout groups for specialized discussions
- Collaborative problem-solving activities
- Peer-to-peer learning and experience sharing

**16:00 - 16:15** | **Coffee Break**
- Refreshment service and informal networking
- Sponsor showcase and product demonstrations
- Additional photo opportunities

**16:15 - 17:00** | **Closing Session**
- Key takeaways and action item summary
- Resource sharing and contact exchange
- Feedback collection and event evaluation
- Thank you remarks and next steps announcement

### Post-Event Activities (T+60 minutes)
**17:00 - 18:00** | **Breakdown & Follow-up**
- Equipment removal and venue restoration
- Staff debriefing and feedback collection
- Social media content creation and posting
- Follow-up email preparation with event materials

## 🎯 Success Metrics & KPIs
- **Attendance Rate**: Target 85% of registered participants
- **Engagement Score**: Average 4.5/5 based on real-time feedback
- **Networking Effectiveness**: Minimum 8 new connections per attendee
- **Content Satisfaction**: 90% of attendees rating content as valuable
- **NPS Score**: Target Net Promoter Score of 70+

## 🛠️ Resource Requirements
**Technology**
- Microphone and sound system
- Projector and presentation screen
- High-speed Wi-Fi for all attendees
- Live streaming setup (if virtual component)
- Mobile app for real-time engagement

**Staffing**
- 1 Event coordinator
- 2 Registration assistants
- 1 Technical support person
- 1 Photography/social media manager
- Catering staff as needed

**Materials**
- Welcome bags and branded materials
- Name badges and lanyards
- Feedback forms (digital and paper backup)
- Directional signage and banners
- Emergency contact information sheets

## 🚨 Risk Management & Contingencies
**Technical Issues**
- Backup projector and laptop available on-site
- Mobile hotspot as internet backup
- Pre-recorded presentation backup
- Technical support contact on speed dial

**Low Attendance**
- Room reconfiguration for smaller groups
- Content adaptation for intimate setting
- Enhanced networking opportunities
- Personalized attention to each attendee

**Weather (Outdoor Elements)**
- Indoor backup venue confirmed
- Weather monitoring 48 hours prior
- Covered areas for registration
- Alternative transportation arrangements

## 📞 Emergency Contacts
- Venue Manager: [Contact Info]
- Technical Support: [Contact Info]
- Catering Coordinator: [Contact Info]
- Security/First Aid: [Contact Info]

---
*Event flow generated with professional event management best practices*
*Duration optimized for maximum engagement and learning retention*`;

      setGeneratedFlow(mockFlow);
      setIsLoading(false);
      showToast({ 
        type: 'success', 
        title: 'Success!', 
        message: 'Event flow generated successfully' 
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedFlow);
    showToast({ 
      type: 'success', 
      title: 'Copied!', 
      message: 'Flow copied to clipboard' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <VscPlay className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Event Flow Generator</h1>
            <p className="text-slate-400">Create detailed event timelines and logistics plans</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Panel - Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 space-y-6 overflow-y-auto"
        >
          <div className="bg-slate-800/60 rounded-xl p-6 space-y-5">
            <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
              <VscEdit size={20} />
              Event Details
            </h3>

            {/* Event Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Event Name *
              </label>
              <input
                type="text"
                value={formData.event_name}
                onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
                placeholder="e.g., Tech Innovation Summit 2024"
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Event Type
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <VscWatch size={16} />
                Duration (hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseFloat(e.target.value) || 1 }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Audience Size */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <VscAccount size={16} />
                Expected Attendees
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={formData.audience_size}
                onChange={(e) => setFormData(prev => ({ ...prev, audience_size: parseInt(e.target.value) || 50 }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Budget Range
              </label>
              <select
                value={formData.budget_range}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {budgetRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* Venue Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <VscLocation size={16} />
                Venue Type
              </label>
              <select
                value={formData.venue_type}
                onChange={(e) => setFormData(prev => ({ ...prev, venue_type: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {venueTypes.map(venue => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateFlow}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-600/50 disabled:to-blue-700/50 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
            >
              {isLoading ? (
                <>
                  <VscRefresh className="animate-spin" size={20} />
                  Generating Flow...
                </>
              ) : (
                <>
                  <VscPlay size={20} />
                  Generate Event Flow
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Right Panel - Generated Flow */}
        <div className="flex-1 overflow-hidden">
          {generatedFlow ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full bg-slate-800/60 rounded-xl flex flex-col"
            >
              {/* Flow Header */}
              <div className="flex-shrink-0 p-6 border-b border-slate-700/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-200">{formData.event_name}</h3>
                  <div className="flex items-center gap-6 text-sm text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <VscPlay size={14} />
                      {formData.event_type}
                    </span>
                    <span className="flex items-center gap-1">
                      <VscWatch size={14} />
                      {formData.duration}h
                    </span>
                    <span className="flex items-center gap-1">
                      <VscAccount size={14} />
                      {formData.audience_size} people
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all"
                >
                  <VscCopy size={16} />
                  Copy Flow
                </motion.button>
              </div>

              {/* Flow Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <pre 
                  className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-mono"
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
                >
                  {generatedFlow}
                </pre>
              </div>
            </motion.div>
          ) : (
            <div className="h-full bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center">
              <div className="text-center max-w-md">
                <VscPlay className="mx-auto text-slate-500 mb-6" size={64} />
                <h3 className="text-xl font-bold text-slate-400 mb-3">Ready to Generate Your Event Flow?</h3>
                <p className="text-slate-500 leading-relaxed">
                  Fill in your event details and click "Generate Event Flow" to create a comprehensive timeline, 
                  resource list, and logistics plan for your event.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowPage;