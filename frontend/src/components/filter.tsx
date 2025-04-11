
import React, { useState } from 'react';

interface FilterDetails {
  onChange: (value: string) => void;
  options: string[];
  defaultValue?: string;
  label: string;
}

function Filter({ onChange, options, defaultValue = 'all', label }: FilterDetails) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <select 
      value={selectedValue} 
      onChange={handleChange}
      className="filter-dropdown"
    >
      <option value="all">All {label}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

export default Filter;