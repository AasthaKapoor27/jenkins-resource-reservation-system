import React from 'react';
import { format } from 'date-fns';

const ReservationTable = ({ reservations }) => {
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy-MM-dd HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="p-8 border border-neutral-200 bg-white text-center text-neutral-500 text-sm rounded-sm">
        No reservations yet. Create your first reservation above.
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 bg-white rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-950">
              <th className="font-mono text-xs uppercase tracking-wider text-neutral-500 py-3 px-4">ID</th>
              <th className="font-mono text-xs uppercase tracking-wider text-neutral-500 py-3 px-4">Agent</th>
              <th className="font-mono text-xs uppercase tracking-wider text-neutral-500 py-3 px-4">User</th>
              <th className="font-mono text-xs uppercase tracking-wider text-neutral-500 py-3 px-4">Start Time</th>
              <th className="font-mono text-xs uppercase tracking-wider text-neutral-500 py-3 px-4">End Time</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr 
                key={reservation.id} 
                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                <td className="py-3 px-4 font-mono text-xs text-neutral-600">{reservation.id}</td>
                <td className="py-3 px-4 font-mono font-medium text-neutral-950">{reservation.agent_name}</td>
                <td className="py-3 px-4 text-neutral-700">{reservation.user_name}</td>
                <td className="py-3 px-4 font-mono text-xs text-neutral-600">{formatDateTime(reservation.start_time)}</td>
                <td className="py-3 px-4 font-mono text-xs text-neutral-600">{formatDateTime(reservation.end_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;