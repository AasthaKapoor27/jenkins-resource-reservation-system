import React from 'react';
import { Server } from 'lucide-react';

const AgentCard = ({ agent }) => {
  const isFree = agent.status === 'free';
  
  return (
    <div 
      className="agent-card group flex items-center gap-4 p-4 border border-neutral-200 bg-white hover:border-blue-500 transition-colors duration-200 rounded-sm"
    >
      {/* Status Indicator */}
      <div 
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          isFree ? 'bg-emerald-500' : 'bg-red-500'
        }`}
        aria-label={isFree ? 'Free' : 'Busy'}
      />
      
      {/* Agent Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-neutral-400" />
          <span className="font-mono text-sm font-medium text-neutral-950">{agent.name}</span>
        </div>
        <span className="text-xs text-neutral-500 mt-1 block">
          {isFree ? 'Available' : 'In Use'}
        </span>
      </div>
    </div>
  );
};

export default AgentCard;