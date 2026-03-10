import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isAfter, isBefore, startOfToday } from 'date-fns';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ 
  value, 
  onChange, 
  minDate, 
  maxDate, 
  placeholder = 'Select date',
  disabled = false 
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const today = startOfToday();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    onChange?.(dateStr);
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && isBefore(date, new Date(minDate))) return true;
    if (maxDate && isAfter(date, new Date(maxDate))) return true;
    return false;
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPadding = monthStart.getDay();
  const paddedDays = [...Array(startPadding).fill(null), ...daysInMonth];

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value ? format(new Date(value), 'MMM dd, yyyy') : ''}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-4 py-2.5 pl-10 bg-white border rounded-xl text-sm cursor-pointer
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
            border-[#1a1a1a]/10 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/5`}
        />
        <CalendarIcon 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 pointer-events-none"
        />
        {value && !disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange?.('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-[280px] bg-white rounded-xl shadow-lg border border-[#1a1a1a]/10 p-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 hover:bg-[#f8f9fa] rounded-lg"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 hover:bg-[#f8f9fa] rounded-lg"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-[10px] font-medium text-[#1a1a1a]/40 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mt-1">
            {paddedDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="p-2" />;
              }

              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const isDisabled = isDateDisabled(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => !isDisabled && handleDateSelect(day)}
                  disabled={isDisabled}
                  className={`p-2 text-sm rounded-lg transition-colors
                    ${isSelected ? 'bg-[#1a1a1a] text-white' : ''}
                    ${!isSelected && isTodayDate ? 'bg-[#1a1a1a]/10 font-medium' : ''}
                    ${!isSelected && !isTodayDate && !isDisabled ? 'hover:bg-[#f8f9fa]' : ''}
                    ${isDisabled ? 'text-[#1a1a1a]/20 cursor-not-allowed' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-[#1a1a1a]/5">
            <button
              onClick={() => {
                const todayStr = format(today, 'yyyy-MM-dd');
                onChange?.(todayStr);
                setIsOpen(false);
              }}
              className="flex-1 py-1.5 text-xs font-medium text-[#1a1a1a]/60 hover:bg-[#f8f9fa] rounded-lg"
            >
              Today
            </button>
            <button
              onClick={() => {
                onChange?.('');
                setIsOpen(false);
              }}
              className="flex-1 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onChange?: (start: string, end: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date range',
  disabled = false,
}: DateRangePickerProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const displayValue = startDate && endDate
    ? `${format(new Date(startDate), 'MMM dd')} - ${format(new Date(endDate), 'MMM dd, yyyy')}`
    : startDate
    ? `${format(new Date(startDate), 'MMM dd')} - ...`
    : '';

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          onClick={() => !disabled && (setStartOpen(!startOpen), setEndOpen(false))}
          className={`w-full px-4 py-2.5 pl-10 bg-white border rounded-xl text-sm cursor-pointer
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
            border-[#1a1a1a]/10 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/5`}
        />
        <CalendarIcon 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 pointer-events-none"
        />
      </div>

      {startOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-xl shadow-lg border border-[#1a1a1a]/10 p-3">
          <p className="text-xs font-medium text-[#1a1a1a]/60 mb-2">Check-in</p>
          <DatePicker
            value={startDate}
            onChange={(date) => {
              onChange?.(date, endDate || '');
              setStartOpen(false);
              setEndOpen(true);
            }}
            minDate={minDate}
            maxDate={endDate || maxDate}
          />
          
          {startDate && (
            <>
              <p className="text-xs font-medium text-[#1a1a1a]/60 mb-2 mt-4">Check-out</p>
              <DatePicker
                value={endDate}
                onChange={(date) => {
                  onChange?.(startDate, date);
                  setStartOpen(false);
                  setEndOpen(false);
                }}
                minDate={startDate}
                maxDate={maxDate}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
