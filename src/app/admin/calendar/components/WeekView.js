'use client'

import React from "react";

const categoryColorMap = {
  personal: 'bg-[#FF3D1C]/10 text-[#FF3D1C] border-[#FF3D1C]',
  business: 'bg-[#696CFF]/10 text-[#696CFF] border-[#696CFF]',
  family: 'bg-[#FFAB00]/10 text-[#FFAB00] border-[#FFAB00]',
  holiday: 'bg-[#71DD37]/10 text-[#71DD37] border-[#71DD37]',
  etc: 'bg-[#03C3EC]/10 text-[#03C3EC] border-[#03C3EC]',
};

const WeekView = ({ date, AddEvent, event_list }) => {
  const allDayEvents = event_list.filter(event => {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date || event.start_date);
    return (
      start.getHours() === 0 &&
      end.getHours() === 0 &&
      start.getDate() === end.getDate()
    );
  });

  const timedEvents = event_list.filter(event => !allDayEvents.includes(event));

  return (
    <div className="w-full h-[600px] overflow-y-auto border rounded mt-4">
      
      {/* Header Row */}
      <div className="grid grid-cols-[100px_repeat(7,minmax(0,1fr))] border-b bg-white sticky top-0 z-10">
        <div className="bg-gray-100 p-2 font-bold text-sm text-center border-r">Time</div>
        {Array.from({ length: 7 }).map((_, index) => {
          const currentDate = new Date(date);
          currentDate.setDate(date.getDate() - date.getDay() + index);
          const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });
          const dayMonth = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
          return (
            <div key={index} className="p-2 text-center font-semibold border-r">
              {dayName} {dayMonth}
            </div>
          );
        })}
      </div>

      {/* All-Day Events Row */}
      <div className="grid grid-cols-[100px_repeat(7,minmax(0,1fr))] border-b bg-gray-50">
        <div className="bg-gray-100 p-2 text-center border-r font-semibold">All-Day</div>
        {Array.from({ length: 7 }).map((_, index) => {
          const currentDate = new Date(date);
          currentDate.setDate(date.getDate() - date.getDay() + index);
          const dayKey = currentDate.toDateString();

          const events = allDayEvents.filter(event => {
            const eventDate = new Date(event.start_date).toDateString();
            return eventDate === dayKey;
          });

          return (
            <div key={index} className="relative border-r h-10 px-1">
              {events.map((event, i) => (
                <div
                  key={i}
                  onClick={() => AddEvent(event)}
                  className={`absolute left-1 top-1 right-1 px-2 py-0.5 text-xs truncate rounded border cursor-pointer ${categoryColorMap[event.category] || 'bg-green-100 text-green-700 border-green-300'}`}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      {Array.from({ length: 24 }).map((_, hour) => (
        <div key={hour} className="grid grid-cols-[100px_repeat(7,minmax(0,1fr))] border-b h-16 relative">
          <div className="text-sm text-gray-600 border-r bg-gray-50 p-2 text-right pr-3">
            {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
          </div>
          {Array.from({ length: 7 }).map((_, idx) => {
            const slotDate = new Date(date);
            slotDate.setDate(date.getDate() - date.getDay() + idx);
            slotDate.setHours(hour, 0, 0, 0);

            const eventsAtThisHour = timedEvents.filter(event => {
              const start = new Date(event.start_date);
              return (
                start.getFullYear() === slotDate.getFullYear() &&
                start.getMonth() === slotDate.getMonth() &&
                start.getDate() === slotDate.getDate() &&
                start.getHours() === hour
              );
            });

            return (
              <div
                key={idx}
                className="border-r relative hover:bg-gray-100 cursor-pointer"
                onClick={() => AddEvent(slotDate)}
              >
                {eventsAtThisHour.map((event, i) => {
                  const start = new Date(event.start_date);
                  const end = new Date(event.end_date || event.start_date);
                  const durationInMinutes = Math.max((end - start) / 60000, 30); // minimum height
                  const height = `${(durationInMinutes / 60) * 100}%`;

                  return (
                    <div
                      key={i}
                      title={event.title}
                      onClick={(e) => {
                        e.stopPropagation();
                        AddEvent(event);
                      }}
                      style={{ height }}
                      className={`absolute left-1 right-1 top-1 px-2 py-0.5 text-xs truncate rounded border shadow-sm ${categoryColorMap[event.category] || 'bg-blue-100 text-blue-800 border-blue-300'}`}
                    >
                      {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br />
                      {event.title}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeekView;
