'use client';

import React, { useState } from 'react';
import TicketInput, { TicketData } from './TicketInput';
import { LotteryGame } from '@/lib/types';

interface TicketFormProps {
  game: LotteryGame;
  onSubmit: (tickets: TicketData[]) => void;
}

export default function TicketForm({ game, onSubmit }: TicketFormProps) {
  const [tickets, setTickets] = useState<TicketData[]>([
    {
      id: 'ticket-1',
      gameId: game.id,
      purchaseDate: null,
      mainNumbers: [],
      bonusNumbers: [],
    },
  ]);

  const handleAddTicket = () => {
    if (tickets.length < 10) {
      setTickets([
        ...tickets,
        {
          id: `ticket-${tickets.length + 1}`,
          gameId: game.id,
          purchaseDate: null,
          mainNumbers: [],
          bonusNumbers: [],
        },
      ]);
    }
  };

  const handleRemoveTicket = (index: number) => {
    if (tickets.length > 1) {
      const newTickets = tickets.filter((_, i) => i !== index);
      setTickets(newTickets);
    }
  };

  const handleTicketChange = (index: number, ticketData: TicketData) => {
    const newTickets = [...tickets];
    newTickets[index] = ticketData;
    setTickets(newTickets);
  };

  const validateTickets = (): boolean => {
    for (const ticket of tickets) {
      // 날짜 체크
      if (!ticket.purchaseDate) {
        alert('모든 티켓의 구매 날짜를 입력해주세요.');
        return false;
      }

      // 메인 번호 개수 체크
      if (ticket.mainNumbers.length !== game.mainNumberCount) {
        alert(`메인 번호를 ${game.mainNumberCount}개 모두 입력해주세요.`);
        return false;
      }

      // 메인 번호 중복 체크
      const uniqueMainNumbers = new Set(ticket.mainNumbers);
      if (uniqueMainNumbers.size !== ticket.mainNumbers.length) {
        alert('메인 번호에 중복된 숫자가 있습니다.');
        return false;
      }

      // 보너스 번호 개수 체크
      if (ticket.bonusNumbers.length !== game.bonusNumberCount) {
        alert(`${game.bonusNumberName}을 입력해주세요.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateTickets()) {
      onSubmit(tickets);
    }
  };

  return (
    <div className="space-y-6">
      {/* 티켓 목록 */}
      {tickets.map((ticket, index) => (
        <TicketInput
          key={ticket.id}
          game={game}
          ticketNumber={index + 1}
          onRemove={() => handleRemoveTicket(index)}
          canRemove={tickets.length > 1}
          onTicketChange={(data) => handleTicketChange(index, data)}
        />
      ))}

      {/* 티켓 추가 버튼 */}
      {tickets.length < 10 && (
        <button
          onClick={handleAddTicket}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 font-medium transition-colors"
        >
          + 티켓 추가 ({tickets.length}/10)
        </button>
      )}

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
      >
        🎰 당첨 확인하기
      </button>

      {/* 안내 문구 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>알림:</strong> 이 도구는 당첨 확인 보조 도구입니다. 정확한
          당첨 확인은 공식 판매처에서 하시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
