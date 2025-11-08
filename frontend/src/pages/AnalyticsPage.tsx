import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VscGraph, VscPieChart, VscArrowUp, VscCalendar, VscAccount, VscHeart } from 'react-icons/vsc';
import { useToast } from '../contexts/ToastContext';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactElement;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface EventAnalytics {
  eventName: string;
  date: string;
  attendees: number;
  satisfaction: number;
  engagement: number;
  revenue: number;
}

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [attendanceData, setAttendanceData] = useState<ChartData[]>([]);
  const [eventPerformance, setEventPerformance] = useState<EventAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  // Generate realistic analytics data
  const generateAnalytics = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock metrics based on period
      const multiplier = selectedPeriod === '7d' ? 0.2 : selectedPeriod === '30d' ? 1 : selectedPeriod === '90d' ? 3 : 12;
      
      const mockMetrics: MetricCard[] = [
        {
          title: 'Total Events',
          value: Math.floor(25 * multiplier).toString(),
          change: '+12%',
          trend: 'up',
          icon: <VscCalendar size={20} />
        },
        {
          title: 'Total Attendees',
          value: Math.floor(2847 * multiplier).toLocaleString(),
          change: '+18%',
          trend: 'up',
          icon: <VscAccount size={20} />
        },
        {
          title: 'Avg Satisfaction',
          value: '4.7/5.0',
          change: '+0.2',
          trend: 'up',
          icon: <VscHeart size={20} />
        },
        {
          title: 'Revenue Generated',
          value: `$${Math.floor(125000 * multiplier).toLocaleString()}`,
          change: '+23%',
          trend: 'up',
          icon: <VscArrowUp size={20} />
        }
      ];

      // Mock attendance distribution
      const mockAttendanceData: ChartData[] = [
        { name: 'Workshops', value: Math.floor(850 * multiplier), color: '#8B5CF6' },
        { name: 'Conferences', value: Math.floor(650 * multiplier), color: '#3B82F6' },
        { name: 'Seminars', value: Math.floor(420 * multiplier), color: '#10B981' },
        { name: 'Networking', value: Math.floor(380 * multiplier), color: '#F59E0B' },
        { name: 'Training', value: Math.floor(290 * multiplier), color: '#EF4444' }
      ];

      // Mock event performance data
      const mockEventPerformance: EventAnalytics[] = [
        {
          eventName: 'AI & ML Workshop',
          date: '2024-11-01',
          attendees: 127,
          satisfaction: 4.8,
          engagement: 92,
          revenue: 12500
        },
        {
          eventName: 'Tech Conference 2024',
          date: '2024-10-28',
          attendees: 450,
          satisfaction: 4.6,
          engagement: 87,
          revenue: 45000
        },
        {
          eventName: 'Data Science Bootcamp',
          date: '2024-10-25',
          attendees: 89,
          satisfaction: 4.9,
          engagement: 95,
          revenue: 8900
        },
        {
          eventName: 'Startup Networking',
          date: '2024-10-20',
          attendees: 234,
          satisfaction: 4.5,
          engagement: 78,
          revenue: 15600
        },
        {
          eventName: 'Digital Marketing Seminar',
          date: '2024-10-15',
          attendees: 156,
          satisfaction: 4.7,
          engagement: 83,
          revenue: 11200
        }
      ];

      setMetrics(mockMetrics);
      setAttendanceData(mockAttendanceData);
      setEventPerformance(mockEventPerformance);
      setIsLoading(false);

      showToast({
        type: 'success',
        title: 'Analytics Updated',
        message: `Data refreshed for ${periods.find(p => p.value === selectedPeriod)?.label}`
      });
    }, 1500);
  };

  useEffect(() => {
    generateAnalytics();
  }, [selectedPeriod]);

  const getEngagementColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSatisfactionStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <VscGraph className="text-purple-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Event Analytics</h1>
              <p className="text-slate-400">Comprehensive insights and performance metrics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateAnalytics}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg flex items-center gap-2"
            >
              <VscGraph size={16} />
              Refresh
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg text-purple-400">
                  {metric.icon}
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  metric.trend === 'up' 
                    ? 'text-green-400 bg-green-500/20'
                    : metric.trend === 'down'
                    ? 'text-red-400 bg-red-500/20'
                    : 'text-gray-400 bg-gray-500/20'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100 mb-1">{metric.value}</h3>
                <p className="text-slate-400 text-sm">{metric.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Attendance Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <VscPieChart className="text-purple-400" size={20} />
              <h3 className="text-lg font-bold text-slate-200">Event Type Distribution</h3>
            </div>
            
            <div className="space-y-4">
              {attendanceData.map((item, index) => {
                const total = attendanceData.reduce((sum, d) => sum + d.value, 0);
                const percentage = ((item.value / total) * 100).toFixed(1);
                
                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">{item.name}</span>
                      <span className="text-slate-400">{item.value} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Performance Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <VscArrowUp className="text-green-400" size={20} />
              <h3 className="text-lg font-bold text-slate-200">Trends & Insights</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <h4 className="font-medium text-green-300 mb-2">📈 Peak Performance</h4>
                <p className="text-green-200 text-sm">Workshop events show 23% higher engagement rates</p>
              </div>
              
              <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h4 className="font-medium text-blue-300 mb-2">⏰ Optimal Timing</h4>
                <p className="text-blue-200 text-sm">Tuesday 2-4 PM slots have highest attendance</p>
              </div>
              
              <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <h4 className="font-medium text-purple-300 mb-2">🎯 Audience Insight</h4>
                <p className="text-purple-200 text-sm">Tech professionals prefer hands-on workshops</p>
              </div>
              
              <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <h4 className="font-medium text-yellow-300 mb-2">💰 Revenue Driver</h4>
                <p className="text-yellow-200 text-sm">Premium events generate 3x revenue per attendee</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Events Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <VscCalendar className="text-blue-400" size={20} />
            <h3 className="text-lg font-bold text-slate-200">Recent Event Performance</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Event</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Date</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Attendees</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Satisfaction</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Engagement</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {eventPerformance.map((event, index) => (
                  <motion.tr
                    key={event.eventName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-200">{event.eventName}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-300">
                      {event.attendees}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-yellow-400 text-sm">
                          {getSatisfactionStars(event.satisfaction)}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {event.satisfaction}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`font-medium ${getEngagementColor(event.engagement)}`}>
                        {event.engagement}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-green-400 font-medium">
                      ${event.revenue.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <VscGraph className="text-purple-400" size={20} />
            <h3 className="text-lg font-bold text-purple-300">AI-Powered Recommendations</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-purple-200">Optimize for Higher Engagement</h4>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Add interactive Q&A sessions (+15% engagement)</li>
                <li>• Include hands-on workshops (+22% satisfaction)</li>
                <li>• Provide digital takeaways (+18% retention)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-blue-200">Revenue Growth Opportunities</h4>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Introduce tiered pricing (+31% revenue)</li>
                <li>• Add corporate packages (+45% B2B sales)</li>
                <li>• Create certification programs (+28% premium uptake)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;