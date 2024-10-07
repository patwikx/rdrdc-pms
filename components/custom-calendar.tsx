
import { CalendarIcon } from 'lucide-react';
import { ChangeEvent } from 'react';

interface CustomCalendarInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function CustomCalendarInput({ value, onChange }: CustomCalendarInputProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Select date"
      />
      <CalendarIcon className="absolute top-1/2 transform -translate-y-1/2 right-3 text-purple-500 cursor-pointer" />
    </div>
  );
}

export default CustomCalendarInput;
