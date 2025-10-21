'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { LotteryGame } from '@/lib/types';

interface TicketInputProps {
  game: LotteryGame;
  ticketNumber: number;
  onRemove: () => void;
  canRemove: boolean;
  onTicketChange: (ticketData: TicketData) => void;
}

export interface TicketData {
  id: string;
  gameId: string;
  purchaseDate: Date | null;
  mainNumbers: number[];
  bonusNumbers: number[];
}

export default function TicketInput({
  game,
  ticketNumber,
  onRemove,
  canRemove,
  onTicketChange,
}: TicketInputProps) {
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);
  const [mainNumbers, setMainNumbers] = useState<string[]>(
    Array(game.mainNumberCount).fill('')
  );
  const [bonusNumbers, setBonusNumbers] = useState<string[]>(
    Array(game.bonusNumberCount).fill('')
  );

  // 티켓 데이터가 변경될 때마다 부모 컴포넌트에 전달
  React.useEffect(() => {
    const ticketData: TicketData = {
      id: `ticket-${ticketNumber}`,
      gameId: game.id,
      purchaseDate,
      mainNumbers: mainNumbers.map(n => parseInt(n) || 0).filter(n => n > 0),
      bonusNumbers: bonusNumbers.map(n => parseInt(n) || 0).filter(n => n > 0),
    };
    onTicketChange(ticketData);
  }, [purchaseDate, mainNumbers, bonusNumbers, game.id, ticketNumber, onTicketChange]);

  const handleMainNumberChange = (index: number, value: string) => {
    // 숫자만 입력 허용
    if (value === '' || /^\d+$/.test(value)) {
      const num = parseInt(value);
      // 범위 체크
      if (value === '' || (num >= 1 && num <= game.mainNumberMax)) {
        const newNumbers = [...mainNumbers];
        newNumbers[index] = value;
        setMainNumbers(newNumbers);
      }
    }
  };

  const handleBonusNumberChange = (index: number, value: string) => {
    // 숫자만 입력 허용
    if (value === '' || /^\d+$/.test(value)) {
      const num = parseInt(value);
      // 범위 체크
      if (value === '' || (num >= 1 && num <= game.bonusNumberMax)) {
        const newNumbers = [...bonusNumbers];
        newNumbers[index] = value;
        setBonusNumbers(newNumbers);
      }
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Ticket #{ticketNumber}
        </h3>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 font-medium text-sm"
          >
            ✕ Remove
          </button>
        )}
      </div>

      {/* Purchase Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Purchase Date <span className="text-red-500">*</span>
        </label>
        <DatePicker
          selected={purchaseDate}
          onChange={(date) => setPurchaseDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholderText="Select date"
          maxDate={new Date()}
        />
      </div>

      {/* Main Numbers Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Numbers (1-{game.mainNumberMax}) <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Please type your numbers below (one number per box)
        </p>
        <div className="grid grid-cols-5 gap-2">
          {mainNumbers.map((number, index) => (
            <input
              key={`main-${index}`}
              type="text"
              inputMode="numeric"
              value={number}
              onChange={(e) => handleMainNumberChange(index, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={(index + 1).toString()}
              maxLength={2}
            />
          ))}
        </div>
      </div>

      {/* Bonus Numbers Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {game.bonusNumberName} (1-{game.bonusNumberMax}){' '}
          <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Please type your {game.bonusNumberName} number
        </p>
        <div className="grid grid-cols-5 gap-2">
          {bonusNumbers.map((number, index) => (
            <input
              key={`bonus-${index}`}
              type="text"
              inputMode="numeric"
              value={number}
              onChange={(e) => handleBonusNumberChange(index, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-yellow-50"
              placeholder="⭐"
              maxLength={2}
            />
          ))}
        </div>
      </div>

      {/* Hint Text */}
      <p className="text-xs text-gray-500 mt-3">
        💡 Tip: {game.name} requires {game.mainNumberCount} main numbers and 1{' '}
        {game.bonusNumberName}.
      </p>
    </div>
  );
}
