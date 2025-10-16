'use client';

import React from 'react';
import { CheckResult, DrawResult, LotteryGame } from '@/lib/types';
import { formatPrizeAmount, getPrizeTierName } from '@/lib/checkWinning';

interface ResultsDisplayProps {
  drawResult: DrawResult;
  results: CheckResult[];
  game: LotteryGame;
  onReset: () => void;
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
      {/* 당첨 번호 표시 */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          🎰 당첨 번호
        </h2>
        <div className="text-center">
          <p className="text-sm text-blue-700 mb-2">
            추첨일: {drawResult.drawDate}
          </p>
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {/* 메인 번호 */}
            {drawResult.mainNumbers.map((num, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
              >
                {num}
              </div>
            ))}
            {/* 보너스 번호 */}
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

      {/* 전체 요약 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">당첨 티켓</p>
            <p className="text-3xl font-bold text-purple-600">
              {winnersCount}/{results.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">총 당첨금 (평균)</p>
            <p className="text-3xl font-bold text-pink-600">
              {formatPrizeAmount(totalWinnings)}
            </p>
          </div>
        </div>
      </div>

      {/* 각 티켓별 결과 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">티켓별 결과</h3>
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
                티켓 #{index + 1}
              </h4>
              <span className="text-2xl">
                {result.isWinner ? '🎉' : '😢'}
              </span>
            </div>

            {/* 일치 번호 */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">일치한 번호:</p>
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
                  <span className="text-gray-400 text-sm">없음</span>
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

            {/* 당첨 결과 */}
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
                메인: {result.totalMainMatches}개 일치 | 보너스:{' '}
                {result.totalBonusMatches}개 일치
              </p>
              {result.prize && (
                <p className="text-xl font-bold text-green-700 mt-2">
                  예상 당첨금: {formatPrizeAmount(result.prize.amount)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 안내 문구 */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>중요:</strong> 표시된 당첨금은 평균 고정 금액입니다. 실제
          당첨금은 변동될 수 있으므로 정확한 금액은 아래 공식 웹사이트에서
          확인하세요.
        </p>
      </div>

      {/* 공식 사이트 링크 */}
      <div className="flex gap-3">
        <a
          href={game.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors"
        >
          🔗 공식 사이트에서 확인하기
        </a>
        <button
          onClick={onReset}
          className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          🔄 다시 확인하기
        </button>
      </div>

      {/* Buy Me a Coffee */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          이 서비스가 도움이 되셨나요?
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
