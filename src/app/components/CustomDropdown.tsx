'use client';
import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  renderOption?: (option: T) => React.ReactNode;
  label?: string;
  getKey?: (option: T) => string | number;
}

export default function CustomDropdown<T>({ options, value, onChange, renderOption, getKey }: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className='relative' ref={ref}>
      <button
        type='button'
        className='w-full flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
        onClick={() => setOpen((v) => !v)}
        aria-haspopup='listbox'
        aria-expanded={open}
      >
        <span>{renderOption ? renderOption(value) : String(value)}</span>
        <span
          className={`ml-2 transition-transform duration-200 ${open ? 'rotate-x-180' : 'rotate-x-0'}`}
          style={{ display: 'inline-block', transform: open ? 'rotateX(180deg)' : 'rotateX(0deg)' }}
        >
          {/* Chevron SVG */}
          <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </span>
      </button>
      {open && (
        <div className='absolute left-0 w-full mt-1 bg-gray-100 rounded-lg shadow-lg z-10' style={{ marginTop: 4 }}>
          <ul className='py-1'>
            {options.map((option, idx) => (
              <li
                key={getKey ? getKey(option) : idx}
                className={`px-4 py-2 cursor-pointer rounded ${
                  option === value ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-300'
                }`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {renderOption ? renderOption(option) : String(option)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
