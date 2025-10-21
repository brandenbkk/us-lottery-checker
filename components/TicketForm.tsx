'use client';

import React, { useState } from 'react';
import TicketInput, { TicketData } from './TicketInput';
import { LotteryGame } from '@/lib/types';

interface TicketFormProps {
  game: LotteryGame;
  onSubmit: (tickets: TicketData[]) => void;
  initialTickets?: TicketData[];
}

export default function TicketForm({ game, onSubmit, initialTickets }: TicketFormProps) {
  const [tickets, setTickets] = useState<TicketData[]>(() => {
    // Use initialTickets if provided and valid, otherwise create new ticket
    if (initialTickets && initialTickets.length > 0) {
      return initialTickets;
    }
    return [
      {
        id: 'ticket-1',
        gameId: game.id,
        purchaseDate: null,
        mainNumbers: [],
        bonusNumbers: [],
      },
    ];
  });

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
      // Date check
      if (!ticket.purchaseDate) {
        alert('Please enter purchase date for all tickets.');
        return false;
      }

      // Main numbers count check
      if (ticket.mainNumbers.length !== game.mainNumberCount) {
        alert(`Please enter all ${game.mainNumberCount} main numbers.`);
        return false;
      }

      // Main numbers duplicate check
      const uniqueMainNumbers = new Set(ticket.mainNumbers);
      if (uniqueMainNumbers.size !== ticket.mainNumbers.length) {
        alert('Duplicate numbers found in main numbers.');
        return false;
      }

      // Bonus numbers count check
      if (ticket.bonusNumbers.length !== game.bonusNumberCount) {
        alert(`Please enter the ${game.bonusNumberName}.`);
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
      {/* Ticket List */}
      {tickets.map((ticket, index) => (
        <TicketInput
          key={ticket.id}
          game={game}
          ticketNumber={index + 1}
          onRemove={() => handleRemoveTicket(index)}
          canRemove={tickets.length > 1}
          onTicketChange={(data) => handleTicketChange(index, data)}
          initialData={ticket}
        />
      ))}

      {/* Add Ticket Button */}
      {tickets.length < 10 && (
        <button
          onClick={handleAddTicket}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 font-medium transition-colors"
        >
          + Add Ticket ({tickets.length}/10)
        </button>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
      >
        🎰 Check My Numbers
      </button>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Notice:</strong> This is an informational tool. Always verify
          your winnings with official lottery sources.
        </p>
      </div>
    </div>
  );
}
