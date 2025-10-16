'use client';

import { useState } from 'react';
import TicketForm from '@/components/TicketForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { TicketData } from '@/components/TicketInput';
import { lotteryGames } from '@/lib/gameData';
import { LotteryGame, CheckResult, DrawResult } from '@/lib/types';

export default function Home() {
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<LotteryGame | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [checkResults, setCheckResults] = useState<CheckResult[]>([]);
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null);

  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId);
    if (gameId && lotteryGames[gameId]) {
      setSelectedGame(lotteryGames[gameId]);
    } else {
      setSelectedGame(null);
    }
    // 게임 변경 시 결과 초기화
    setShowResults(false);
  };

  const handleSubmit = async (tickets: TicketData[]) => {
    if (!selectedGame) return;

    setIsChecking(true);

    try {
      // API 호출
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: selectedGame.id,
          tickets: tickets,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDrawResult(data.data.drawResult);
        setCheckResults(data.data.results);
        setShowResults(true);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch (error) {
      console.error('당첨 확인 에러:', error);
      alert('당첨 확인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setCheckResults([]);
    setDrawResult(null);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            🎰 US Lottery Checker
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Check your lottery tickets instantly - No signup required!
          </p>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {!showResults ? (
            <div className="space-y-6">
              {/* Game Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  게임 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedGameId}
                  onChange={(e) => handleGameSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isChecking}
                >
                  <option value="">게임을 선택하세요...</option>
                  <optgroup label="전국 게임">
                    <option value="powerball">Powerball</option>
                    <option value="megamillions">Mega Millions</option>
                  </optgroup>
                  <optgroup label="주별 게임 (준비중)">
                    <option value="" disabled>
                      New Jersey (곧 추가)
                    </option>
                    <option value="" disabled>
                      New York (곧 추가)
                    </option>
                    <option value="" disabled>
                      California (곧 추가)
                    </option>
                  </optgroup>
                </select>
              </div>

              {/* Game Info */}
              {selectedGame && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {selectedGame.name}
                  </h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>
                      📊 {selectedGame.mainNumberCount}개 메인 번호 (1-
                      {selectedGame.mainNumberMax})
                    </p>
                    <p>
                      ⭐ {selectedGame.bonusNumberCount}개{' '}
                      {selectedGame.bonusNumberName} (1-
                      {selectedGame.bonusNumberMax})
                    </p>
                    <p>📅 추첨일: {selectedGame.drawDays.join(', ')}</p>
                    <a
                      href={selectedGame.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-block mt-1"
                    >
                      🔗 공식 웹사이트 →
                    </a>
                  </div>
                </div>
              )}

              {/* Ticket Form */}
              {selectedGame ? (
                isChecking ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-800 font-medium">
                      당첨 번호를 확인하고 있습니다...
                    </p>
                  </div>
                ) : (
                  <TicketForm game={selectedGame} onSubmit={handleSubmit} />
                )
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600">👆 먼저 게임을 선택해주세요</p>
                </div>
              )}
            </div>
          ) : (
            /* Results Display */
            selectedGame &&
            drawResult && (
              <ResultsDisplay
                drawResult={drawResult}
                results={checkResults}
                game={selectedGame}
                onReset={handleReset}
              />
            )
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 md:mt-12 text-gray-500 text-sm">
          <p>Made with ❤️ by Rick & Jenny</p>
          <p className="mt-2">
            ⚠️ This is an information tool only. Always verify your winnings
            with official lottery sources.
          </p>
        </footer>
      </div>
    </main>
  );
}
