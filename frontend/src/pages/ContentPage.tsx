import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VscMegaphone, VscEdit, VscRefresh, VscCopy, VscTag } from 'react-icons/vsc';
import { useToast } from '../contexts/ToastContext';

const ContentPage: React.FC = () => {
  const [formData, setFormData] = useState({
    event_name: '',
    event_type: 'workshop',
    target_audience: 'students',
    social_platforms: ['instagram', 'linkedin'],
    content_goals: ['awareness', 'engagement'],
    brand_tone: 'professional'
  });
  
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const eventTypes = ['workshop', 'conference', 'seminar', 'networking', 'training', 'competition'];
  const audiences = ['students', 'faculty', 'professionals', 'researchers', 'general public', 'industry experts'];
  const platforms = ['instagram', 'linkedin', 'twitter', 'facebook', 'tiktok', 'youtube', 'email', 'website'];
  const contentGoals = ['awareness', 'engagement', 'registration', 'networking', 'education', 'brand building'];
  const tones = ['professional', 'casual', 'enthusiastic', 'academic', 'friendly', 'inspiring'];

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      social_platforms: prev.social_platforms.includes(platform)
        ? prev.social_platforms.filter(p => p !== platform)
        : [...prev.social_platforms, platform]
    }));
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      content_goals: prev.content_goals.includes(goal)
        ? prev.content_goals.filter(g => g !== goal)
        : [...prev.content_goals, goal]
    }));
  };

  const generateContent = () => {
    if (!formData.event_name.trim()) {
      showToast({ 
        type: 'error', 
        title: 'Error', 
        message: 'Please enter an event name' 
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const mockContent = `# ${formData.event_name} - Marketing Content Strategy

## 🎯 Campaign Overview
- **Event**: ${formData.event_name}
- **Type**: ${formData.event_type.toUpperCase()}
- **Target Audience**: ${formData.target_audience}
- **Brand Tone**: ${formData.brand_tone}
- **Platforms**: ${formData.social_platforms.join(', ')}
- **Goals**: ${formData.content_goals.join(', ')}

---

${formData.social_platforms.includes('instagram') ? `## 📸 Instagram Content

### Main Post
🚀 **Ready to level up your skills?** Join us for ${formData.event_name}!

This ${formData.event_type} is designed specifically for ${formData.target_audience} who want to:
✅ Gain cutting-edge knowledge
✅ Network with industry leaders  
✅ Get hands-on experience
✅ Advance their career

📅 **Save the date** and register now!
🔗 Link in bio for registration

**Hashtags:**
#${formData.event_name.replace(/\s+/g, '')} #${formData.event_type.replace(/\s+/g, '')} #Learning #Growth #Professional #Event #Skills #Network #${formData.target_audience.replace(/\s+/g, '')}

### Instagram Stories Series
**Story 1**: "Something big is coming... 👀"
**Story 2**: Event logo reveal with countdown timer
**Story 3**: "Meet our speakers" highlight reel
**Story 4**: Registration reminder with swipe-up link
**Story 5**: Behind-the-scenes preparation
**Story 6**: Day-of live updates

---

` : ''}${formData.social_platforms.includes('linkedin') ? `## 💼 LinkedIn Content

### Professional Post
I'm excited to share an upcoming professional development opportunity that could transform your career trajectory.

**${formData.event_name}** is a comprehensive ${formData.event_type} specifically designed for ${formData.target_audience} who are serious about advancing their expertise and expanding their professional network.

**Why you should attend:**
🎯 Industry-leading insights from expert practitioners
🤝 Networking opportunities with peers and mentors
💡 Practical skills you can implement immediately
📈 Career advancement strategies and guidance
🏆 Certificate of completion for your professional portfolio

**Key Takeaways:**
• Latest industry trends and best practices
• Hands-on workshops and interactive sessions
• Access to exclusive resources and materials
• Ongoing community support and mentorship

This event consistently receives 4.8/5 ratings from attendees, with 95% reporting immediate value in their work.

**Registration is now open** - early bird pricing available until [Date].

Comment below if you're planning to attend or tag a colleague who would benefit!

#ProfessionalDevelopment #${formData.event_type.replace(/\s+/g, '')} #CareerGrowth #Learning #${formData.target_audience.replace(/\s+/g, '')} #Skills #Leadership

---

` : ''}${formData.social_platforms.includes('twitter') ? `## 🐦 Twitter Content

### Tweet Thread (1/5)
🧵 Thread: Why ${formData.event_name} is the ${formData.event_type} you can't miss this year ⬇️

### Tweet 2/5
For ${formData.target_audience} looking to level up their skills, this event offers:
• Expert-led workshops
• Networking opportunities  
• Practical takeaways
• Industry insights

### Tweet 3/5
What sets this apart:
✅ Hands-on learning approach
✅ Small group interactions
✅ Real-world case studies
✅ Actionable strategies you can use immediately

### Tweet 4/5
Past attendees say:
"Best investment in my professional development"
"Incredible networking opportunities"
"Content was immediately applicable"
"Speakers were top-notch"

### Tweet 5/5
Ready to join us? Registration is open now!
🔗 [Registration Link]

Limited spots available - secure yours today!

#${formData.event_name.replace(/\s+/g, '')} #${formData.event_type.replace(/\s+/g, '')} #ProfessionalDevelopment

---

` : ''}${formData.social_platforms.includes('email') ? `## 📧 Email Marketing

### Subject Lines
1. "Your invitation to ${formData.event_name} is here"
2. "Transform your career at ${formData.event_name}"
3. "Last chance: Early bird pricing ends soon"
4. "You're in! Here's what to expect at ${formData.event_name}"

### Registration Announcement Email

**Subject**: Your invitation to ${formData.event_name} is here

Hi [Name],

I hope this email finds you well and thriving in your professional journey.

I'm writing to personally invite you to ${formData.event_name}, an exclusive ${formData.event_type} designed specifically for ${formData.target_audience} like yourself.

**Why this event matters:**
In today's rapidly evolving landscape, staying ahead requires continuous learning and strategic networking. This event brings together industry leaders, innovative thinkers, and ambitious professionals for an intensive learning experience.

**What you'll gain:**
• Cutting-edge strategies from industry experts
• Hands-on workshops with immediate applicability  
• Networking with 100+ like-minded professionals
• Access to exclusive resources and tools
• Certificate of completion for your portfolio

**Event Details:**
📅 Date: [Date]
📍 Location: [Venue]
⏰ Time: [Time]
💰 Investment: [Price] (Early bird: [Early Price])

**Special Early Bird Offer:**
Register before [Date] and save [Amount]. This offer ends in [Days] days.

**What past attendees say:**
"This event completely changed my approach to [relevant topic]" - Sarah M.
"The networking alone was worth the investment" - Michael R.
"Practical, actionable, and inspiring" - Jennifer L.

[**REGISTER NOW - EARLY BIRD PRICING**]

Have questions? Simply reply to this email or call [Phone].

Looking forward to seeing you there!

Best regards,
[Your Name]
[Title]

P.S. Space is limited to ensure quality interactions. Secure your spot today!

---

` : ''}## 🎨 Additional Creative Assets

### Quote Graphics
1. "The best investment you can make is in yourself" - Warren Buffett
2. "Learning never exhausts the mind" - Leonardo da Vinci  
3. "The expert in anything was once a beginner" - Helen Hayes

### Countdown Posts
- "7 days until ${formData.event_name}! Are you ready?"
- "3 days left! Final preparations underway"
- "Tomorrow is the day! See you there"
- "It's happening NOW! Live updates coming"

### Post-Event Content
- Thank you message with photo highlights
- Key takeaway infographics
- Speaker quote compilations
- "Save the date" for next event
- Survey request for feedback

## 📊 Content Calendar

**Week 1**: Save the date announcement
**Week 2**: Speaker spotlights and agenda reveal
**Week 3**: Early bird reminder and testimonials
**Week 4**: Final call and preparation tips
**Event Week**: Live updates and behind-the-scenes
**Post-Event**: Thank you and follow-up content

## 🎯 Call-to-Action Variations

1. "Register now and transform your career"
2. "Secure your spot - limited seats available"  
3. "Join the conversation that matters"
4. "Don't miss out - register today"
5. "Be part of something bigger"
6. "Your future self will thank you"

---

**Content Performance Tracking:**
- Engagement rates across platforms
- Click-through rates on registration links
- Email open and conversion rates
- Social media reach and impressions
- Registration attribution by channel

*This comprehensive content strategy is designed to maximize ${formData.content_goals.join(' and ')} while maintaining a ${formData.brand_tone} tone throughout all communications.*`;

      setGeneratedContent(mockContent);
      setIsLoading(false);
      showToast({ 
        type: 'success', 
        title: 'Success!', 
        message: 'Marketing content generated successfully' 
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    showToast({ 
      type: 'success', 
      title: 'Copied!', 
      message: 'Content copied to clipboard' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <VscMegaphone className="text-purple-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Content Generator</h1>
            <p className="text-slate-400">Create comprehensive marketing content and social media strategies</p>
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
              Content Strategy
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
                placeholder="e.g., Digital Marketing Masterclass"
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Target Audience
              </label>
              <select
                value={formData.target_audience}
                onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {audiences.map(audience => (
                  <option key={audience} value={audience}>
                    {audience.charAt(0).toUpperCase() + audience.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Social Platforms */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Social Platforms
              </label>
              <div className="grid grid-cols-3 gap-2">
                {platforms.map(platform => (
                  <motion.button
                    key={platform}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => togglePlatform(platform)}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all text-center font-medium ${
                      formData.social_platforms.includes(platform)
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {platform}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content Goals */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <VscTag size={16} />
                Content Goals
              </label>
              <div className="grid grid-cols-2 gap-2">
                {contentGoals.map(goal => (
                  <motion.button
                    key={goal}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleGoal(goal)}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all text-center font-medium ${
                      formData.content_goals.includes(goal)
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {goal}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Brand Tone */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Brand Tone
              </label>
              <select
                value={formData.brand_tone}
                onChange={(e) => setFormData(prev => ({ ...prev, brand_tone: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {tones.map(tone => (
                  <option key={tone} value={tone}>
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateContent}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-600/50 disabled:to-purple-700/50 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
            >
              {isLoading ? (
                <>
                  <VscRefresh className="animate-spin" size={20} />
                  Generating Content...
                </>
              ) : (
                <>
                  <VscMegaphone size={20} />
                  Generate Content
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Right Panel - Generated Content */}
        <div className="flex-1 overflow-hidden">
          {generatedContent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full bg-slate-800/60 rounded-xl flex flex-col"
            >
              {/* Content Header */}
              <div className="flex-shrink-0 p-6 border-b border-slate-700/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-200">{formData.event_name}</h3>
                  <div className="flex items-center gap-6 text-sm text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <VscMegaphone size={14} />
                      {formData.event_type}
                    </span>
                    <span>{formData.social_platforms.length} platforms</span>
                    <span>{formData.content_goals.length} goals</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all"
                >
                  <VscCopy size={16} />
                  Copy Content
                </motion.button>
              </div>

              {/* Content Display */}
              <div className="flex-1 p-6 overflow-y-auto">
                <pre 
                  className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-mono"
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
                >
                  {generatedContent}
                </pre>
              </div>
            </motion.div>
          ) : (
            <div className="h-full bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center">
              <div className="text-center max-w-md">
                <VscMegaphone className="mx-auto text-slate-500 mb-6" size={64} />
                <h3 className="text-xl font-bold text-slate-400 mb-3">Ready to Create Your Content Strategy?</h3>
                <p className="text-slate-500 leading-relaxed">
                  Configure your marketing goals, select platforms, and generate comprehensive 
                  content including social media posts, emails, and promotional materials.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;