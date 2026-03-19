import React from 'react';
import { clsx } from 'clsx';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  className
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={clsx('flex items-center space-x-3', className)}>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <button
        type="button"
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          checked ? 'bg-blue-600' : 'bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={handleToggle}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
};
