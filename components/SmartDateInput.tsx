import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface SmartDateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string; // Expected format: YYYY-MM-DD
  onChange: (value: string) => void;
}

export function SmartDateInput({ value, onChange, className, required, ...rest }: SmartDateInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Sync internal display value when props change
  useEffect(() => {
    if (value && typeof value === 'string' && value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3) {
        // YYYY-MM-DD to DD/MM/YYYY
        setDisplayValue(`${parts[2]}/${parts[1]}/${parts[0]}`);
      } else {
        setDisplayValue(value);
      }
    } else {
      setDisplayValue(value || '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9/]/g, ''); // only allow digits and slashes
    setDisplayValue(raw);

    // Auto-format 8 continuous digits (e.g. 01022026 -> 01/02/2026)
    if (/^\d{8}$/.test(raw)) {
      const dd = raw.substring(0, 2);
      const mm = raw.substring(2, 4);
      const yyyy = raw.substring(4, 8);
      const formatted = `${dd}/${mm}/${yyyy}`;
      setDisplayValue(formatted);
      onChange(`${yyyy}-${mm}-${dd}`);
      return;
    }

    // Attempt to parse mid-flight if user typed valid DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
      const [dd, mm, yyyy] = raw.split('/');
      onChange(`${yyyy}-${mm}-${dd}`);
      return;
    }

    // Default: if it's incomplete, we just let them type, 
    // but we can pass an empty string back if it's invalid so state isn't polluted with bad dates
    if (raw === '') {
      onChange('');
    }
  };

  const handleBlur = () => {
    // Attempt strict validation on blur
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(displayValue)) {
      const [dd, mm, yyyy] = displayValue.split('/');
      onChange(`${yyyy}-${mm}-${dd}`);
    } else if (/^\d{8}$/.test(displayValue)) {
      const dd = displayValue.substring(0, 2);
      const mm = displayValue.substring(2, 4);
      const yyyy = displayValue.substring(4, 8);
      setDisplayValue(`${dd}/${mm}/${yyyy}`);
      onChange(`${yyyy}-${mm}-${dd}`);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="DD/MM/YYYY"
        className={className}
        required={required}
        {...rest}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
        <Calendar className="h-4 w-4 opacity-50" />
      </div>
    </div>
  );
}

export default SmartDateInput;
