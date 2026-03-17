import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

const ReservationForm = ({ agents, onReservationCreated }) => {
  const [formData, setFormData] = useState({
    agent_name: '',
    start_time: '',
    end_time: '',
    user_name: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agent_name || !formData.start_time || !formData.end_time || !formData.user_name) {
      return;
    }

    setSubmitting(true);
    try {
      await onReservationCreated(formData);
      // Reset form
      setFormData({
        agent_name: '',
        start_time: '',
        end_time: '',
        user_name: ''
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-6 border border-neutral-200 bg-neutral-50/50 space-y-6 rounded-sm"
    >
      {/* Agent Selection */}
      <div className="space-y-2">
        <label htmlFor="agent-select" className="block text-sm font-medium text-neutral-700">
          Agent
        </label>
        <select
          id="agent-select"
          value={formData.agent_name}
          onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-neutral-300 focus:border-blue-600 focus:ring-0 rounded-sm text-sm transition-colors"
          required
        >
          <option value="">Select an agent...</option>
          {agents.map((agent) => (
            <option key={agent.name} value={agent.name}>
              {agent.name} ({agent.status})
            </option>
          ))}
        </select>
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="start-time" className="block text-sm font-medium text-neutral-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Start Time
          </label>
          <input
            id="start-time"
            type="datetime-local"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-neutral-300 focus:border-blue-600 focus:ring-0 rounded-sm text-sm transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="end-time" className="block text-sm font-medium text-neutral-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            End Time
          </label>
          <input
            id="end-time"
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-neutral-300 focus:border-blue-600 focus:ring-0 rounded-sm text-sm transition-colors"
            required
          />
        </div>
      </div>

      {/* User Name */}
      <div className="space-y-2">
        <label htmlFor="user-name" className="block text-sm font-medium text-neutral-700 flex items-center gap-2">
          <User className="w-4 h-4" />
          User Name
        </label>
        <input
          id="user-name"
          type="text"
          value={formData.user_name}
          onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
          placeholder="Enter your name..."
          className="w-full px-4 py-3 bg-white border border-neutral-300 focus:border-blue-600 focus:ring-0 rounded-sm text-sm transition-colors"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-neutral-950 text-white font-medium hover:bg-blue-700 transition-colors rounded-sm uppercase tracking-wide text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Creating...' : (
          <>
            Reserve Agent
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default ReservationForm;