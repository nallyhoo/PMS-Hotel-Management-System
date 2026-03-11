import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'select2';
import 'select2/dist/css/select2.min.css';

interface Select2Option {
  value: string | number;
  label: string;
}

interface Select2Props {
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[] | null) => void;
  options: Select2Option[];
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  style?: React.CSSProperties;
  closeOnSelect?: boolean;
}

export function Select2({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  multiple = false,
  disabled = false,
  allowClear = true,
  className = '',
  style,
  closeOnSelect = true,
}: Select2Props) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const $select = $(selectRef.current) as any;

    if (!isInitialized) {
      $select
        .select2({
          placeholder,
          allowClear,
          multiple,
          disabled,
          width: '100%',
          closeOnSelect,
          minimumResultsForSearch: 5,
        })
        .on('change.select2', (e: any) => {
          if (multiple) {
            const selected = $select.val();
            onChange?.(selected);
          } else {
            const selected = $select.val();
            onChange?.(selected || null);
          }
        });

      setIsInitialized(true);
    }

    return () => {
      if (isInitialized) {
        $select.select2('destroy');
        setIsInitialized(false);
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialized && selectRef.current) {
      const $select = $(selectRef.current) as any;
      
      if (multiple && Array.isArray(value)) {
        const currentVal = $select.val() as string[];
        const newVal = value.map(String);
        
        if (JSON.stringify(currentVal) !== JSON.stringify(newVal)) {
          $select.val(newVal).trigger('change');
        }
      } else if (!multiple && value !== undefined && value !== null) {
        const currentVal = $select.val();
        if (currentVal !== String(value)) {
          $select.val(String(value)).trigger('change');
        }
      } else if (value === null || value === undefined || value === '') {
        $select.val(null).trigger('change');
      }
    }
  }, [value, isInitialized, multiple]);

  useEffect(() => {
    if (isInitialized && selectRef.current) {
      const $select = $(selectRef.current) as any;
      $select.prop('disabled', disabled).select2({ disabled });
    }
  }, [disabled, isInitialized]);

  return (
    <select
      ref={selectRef}
      className={`select2-input ${className}`}
      style={style}
      multiple={multiple}
    >
      {!multiple && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface Select2AsyncProps {
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[] | null) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ajax?: {
    url: string;
    dataType?: string;
    delay?: number;
  };
  defaultOptions?: Select2Option[];
}

export function Select2Async({
  value,
  onChange,
  placeholder = 'Search...',
  multiple = false,
  disabled = false,
  allowClear = true,
  className = '',
  style,
  ajax,
  defaultOptions = [],
}: Select2AsyncProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const $select = $(selectRef.current) as any;

    if (!isInitialized) {
      const select2Options: any = {
        placeholder,
        allowClear,
        multiple,
        disabled,
        width: '100%',
        minimumResultsForSearch: 0,
        closeOnSelect: true,
      };

      if (ajax) {
        select2Options.ajax = {
          url: ajax.url,
          dataType: ajax.dataType || 'json',
          delay: ajax.delay || 250,
        };
      }

      if (defaultOptions.length > 0) {
        select2Options.data = defaultOptions.map((opt) => ({
          id: opt.value,
          text: opt.label,
        }));
      }

      $select
        .select2(select2Options)
        .on('change.select2', (e: any) => {
          if (multiple) {
            const selected = $select.val();
            onChange?.(selected);
          } else {
            const selected = $select.val();
            onChange?.(selected || null);
          }
        });

      setIsInitialized(true);
    }

    return () => {
      if (isInitialized) {
        $select.select2('destroy');
        setIsInitialized(false);
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialized && selectRef.current) {
      const $select = $(selectRef.current) as any;
      
      if (multiple && Array.isArray(value)) {
        const currentVal = $select.val() as string[];
        const newVal = value.map(String);
        
        if (JSON.stringify(currentVal) !== JSON.stringify(newVal)) {
          $select.val(newVal).trigger('change');
        }
      } else if (!multiple && value !== undefined && value !== null) {
        const currentVal = $select.val();
        if (currentVal !== String(value)) {
          $select.val(String(value)).trigger('change');
        }
      } else if (value === null || value === undefined || value === '') {
        $select.val(null).trigger('change');
      }
    }
  }, [value, isInitialized, multiple]);

  return (
    <select
      ref={selectRef}
      className={`select2-input ${className}`}
      style={style}
      multiple={multiple}
    />
  );
}
