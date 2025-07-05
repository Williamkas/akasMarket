import React from 'react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ value, onChange, min = 1, max }) => {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };
  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };
  return (
    <div className='flex items-center border border-blue-200 rounded-lg px-2 py-1 bg-white gap-2 select-none w-fit'>
      <button
        type='button'
        className='text-white bg-[#0052cc] hover:bg-blue-700 text-lg font-bold px-2 py-0.5 rounded disabled:opacity-40 transition-colors'
        onClick={handleDecrease}
        disabled={value <= min}
        aria-label='Disminuir cantidad'
      >
        -
      </button>
      <span className='text-lg font-bold text-[#0052cc] w-6 text-center'>{value}</span>
      <button
        type='button'
        className='text-white bg-[#0052cc] hover:bg-blue-700 text-lg font-bold px-2 py-0.5 rounded disabled:opacity-40 transition-colors'
        onClick={handleIncrease}
        disabled={value >= max}
        aria-label='Aumentar cantidad'
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
