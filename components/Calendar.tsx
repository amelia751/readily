import React from 'react';
import { startOfWeek, endOfWeek, format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

const Calendar: React.FC = () => {
  const today = new Date();
  const startDate = startOfWeek(startOfMonth(today));
  const endDate = endOfWeek(endOfMonth(today));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-7 gap-4 text-center text-gray-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4 text-center mt-2">
        {days.map((day) => (
          <div key={day.toString()} className="p-4 border rounded-lg">
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
