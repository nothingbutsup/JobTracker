import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  name: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, name, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to parse string to Date object
  const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    
    // Check for dd/mm/yyyy format
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) return d;
      }
    }
    
    // Fallback for YYYY-MM-DD or standard Date string
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const [viewDate, setViewDate] = useState(() => parseDate(value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Update calendar view when value changes
    setViewDate(parseDate(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  };

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  const handleDaySelect = (day: number) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Format as dd/mm/yyyy
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    const dateStr = `${d}/${m}/${year}`;
    
    onChange(name, dateStr);
    setIsOpen(false);
  };

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="relative" ref={containerRef}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative mt-1">
        <input
          type="text"
          id={name}
          name={name}
          required={required}
          value={value}
          onChange={handleInputChange}
          placeholder="DD/MM/YYYY"
          className="block w-full pl-3 pr-10 py-2 bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={toggleCalendar}
          className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer text-slate-400 hover:text-primary-600 transition-colors focus:outline-none"
          title="Select date"
        >
          <CalendarIcon className="h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white rounded-xl shadow-xl border border-slate-100 w-72 left-0 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-slate-900 text-sm">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-xs font-medium text-slate-400 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) return <div key={`empty-${index}`} className="h-9 w-9" />;
              
              const currentYear = viewDate.getFullYear();
              const currentMonth = viewDate.getMonth();
              
              // Construct check date for highlighting logic
              // Note: We need to match the format of `value` to check selection
              const mStr = (currentMonth + 1).toString().padStart(2, '0');
              const dStr = day.toString().padStart(2, '0');
              const checkDateDDMMYYYY = `${dStr}/${mStr}/${currentYear}`;
              const checkDateYYYYMMDD = `${currentYear}-${mStr}-${dStr}`;
              
              const isSelected = value === checkDateDDMMYYYY || value === checkDateYYYYMMDD;
              
              const today = new Date();
              const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDaySelect(day)}
                  className={`
                    h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all duration-200
                    ${isSelected 
                      ? 'bg-primary-600 text-white font-medium shadow-md hover:bg-primary-700' 
                      : isToday 
                        ? 'text-primary-600 font-semibold border border-primary-100 hover:bg-primary-50'
                        : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;