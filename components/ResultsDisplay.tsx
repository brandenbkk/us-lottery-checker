'use client';

import React from 'react';
import { CheckResult, DrawResult, LotteryGame } from '@/lib/types';
import { formatPrizeAmount, getPrizeTierName } from '@/lib/checkWinning';

interface ResultsDisplayProps {
  drawResult: DrawResult;
  results: CheckResult[];
  game: LotteryGame;
  onReset: (fullReset: boolean) => void;
}

export default function ResultsDisplay({
  drawResult,
  results,
  game,
  onReset,
}: ResultsDisplayProps) {
  const totalWinnings = results
    .filter((r) => r.prize)
    .reduce((sum, r) => sum + (r.prize?.amount || 0), 0);

  const winnersCount = results.filter((r) => r.isWinner).length;

  return (
    <div className="space-y-6">
      {/* Winning Numbers Display */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          🎰 Winning Numbers
        </h2>
        <div className="text-center">
          <p className="text-sm text-blue-700 mb-2">
            Draw Date: {drawResult.drawDate}
          </p>
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {/* Main Numbers */}
            {drawResult.mainNumbers.map((num, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
              >
                {num}
              </div>
            ))}
            {/* Bonus Numbers */}
            {drawResult.bonusNumbers.map((num, i) => (
              <div
                key={`bonus-${i}`}
                className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-yellow-600"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Winning Tickets</p>
            <p className="text-3xl font-bold text-purple-600">
              {winnersCount}/{results.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Winnings (Est.)</p>
            <p className="text-3xl font-bold text-pink-600">
              {formatPrizeAmount(totalWinnings)}
            </p>
          </div>
        </div>
      </div>

      {/* Individual Ticket Results */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Results by Ticket</h3>
        {results.map((result, index) => (
          <div
            key={result.ticketId}
            className={`border-2 rounded-lg p-5 ${
              result.isWinner
                ? 'bg-green-50 border-green-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-lg">
                Ticket #{index + 1}
              </h4>
              <span className="text-2xl">
                {result.isWinner ? '🎉' : '😢'}
              </span>
            </div>

            {/* Matched Numbers */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Matched Numbers:</p>
              <div className="flex gap-2 flex-wrap">
                {result.matchedMainNumbers.length > 0 ? (
                  result.matchedMainNumbers.map((num, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium"
                    >
                      {num}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">None</span>
                )}
                {result.matchedBonusNumbers.length > 0 &&
                  result.matchedBonusNumbers.map((num, i) => (
                    <span
                      key={`bonus-${i}`}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium border border-yellow-600"
                    >
                      ⭐ {num}
                    </span>
                  ))}
              </div>
            </div>

            {/* Prize Result */}
            <div
              className={`p-3 rounded-lg ${
                result.isWinner ? 'bg-green-100' : 'bg-gray-100'
              }`}
            >
              <p className="font-bold text-lg mb-1">
                {getPrizeTierName(
                  result.totalMainMatches,
                  result.totalBonusMatches,
                  game.id
                )}
              </p>
              <p className="text-sm text-gray-600">
                Main: {result.totalMainMatches} match | Bonus:{' '}
                {result.totalBonusMatches} match
              </p>
              {result.prize && (
                <p className="text-xl font-bold text-green-700 mt-2">
                  Est. Prize: {formatPrizeAmount(result.prize.amount)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Important:</strong> Prize amounts shown are estimated averages. 
          Actual prizes may vary. Please verify exact amounts on the official website below.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Official Website Button */}
        <a
          href={game.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors"
        >
          🔗 Verify on Official Site
        </a>
        
        {/* Edit Numbers Button */}
        <button
          onClick={() => onReset(false)}
          className="py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          ✏️ Edit Numbers
        </button>
        
        {/* Start Over Button */}
        <button
          onClick={() => onReset(true)}
          className="py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          🔄 Start Over
        </button>
      </div>

      {/* Buy Me a Coffee */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          Did this tool help you?
        </p>
        <a
          href="https://www.buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
        >
          ☕ Buy Me a Coffee
        </a>
      </div>
    </div>
  );
}
