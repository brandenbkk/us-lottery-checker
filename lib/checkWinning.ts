import { DrawResult, LotteryTicket, CheckResult, Prize } from './types';
import { gamePrizes } from './gameData';

/**
 * 티켓과 당첨 번호를 비교하여 결과 계산
 */
export function checkTicket(
  ticket: LotteryTicket,
  drawResult: DrawResult
): CheckResult {
  // 일치하는 메인 번호 찾기
  const matchedMainNumbers = ticket.mainNumbers.filter((num) =>
    drawResult.mainNumbers.includes(num)
  );

  // 일치하는 보너스 번호 찾기
  const matchedBonusNumbers = ticket.bonusNumbers.filter((num) =>
    drawResult.bonusNumbers.includes(num)
  );

  const totalMainMatches = matchedMainNumbers.length;
  const totalBonusMatches = matchedBonusNumbers.length;

  // 당첨 등급 판정
  const prize = determinePrize(
    ticket.gameId,
    totalMainMatches,
    totalBonusMatches
  );

  return {
    ticketId: ticket.id,
    matchedMainNumbers,
    matchedBonusNumbers,
    totalMainMatches,
    totalBonusMatches,
    prize,
    isWinner: prize !== undefined,
  };
}

/**
 * 일치 개수에 따라 당첨 등급 결정
 */
function determinePrize(
  gameId: string,
  mainMatches: number,
  bonusMatches: number
): Prize | undefined {
  const prizes = gamePrizes[gameId];

  if (!prizes) {
    return undefined;
  }

  // 일치하는 등급 찾기
  const matchedPrize = prizes.find(
    (prize) =>
      prize.matchMain === mainMatches && prize.matchBonus === bonusMatches
  );

  return matchedPrize;
}

/**
 * 여러 티켓을 한 번에 확인
 */
export function checkMultipleTickets(
  tickets: LotteryTicket[],
  drawResult: DrawResult
): CheckResult[] {
  return tickets.map((ticket) => checkTicket(ticket, drawResult));
}

/**
 * 금액을 포맷팅 (예: 1000000 -> "$1,000,000")
 */
export function formatPrizeAmount(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `$${amount}`;
  }
}

/**
 * Get prize tier name
 */
export function getPrizeTierName(
  mainMatches: number,
  bonusMatches: number,
  gameId: string
): string {
  if (mainMatches === 5 && bonusMatches === 1) {
    return 'JACKPOT! 🎉🎉🎉';
  } else if (mainMatches === 5 && bonusMatches === 0) {
    return '2nd Prize! 🎉🎉';
  } else if (mainMatches === 4 && bonusMatches === 1) {
    return '3rd Prize! 🎉';
  } else if (mainMatches >= 3) {
    return `Winner! 🎊`;
  } else if (mainMatches > 0 || bonusMatches > 0) {
    return 'Small Prize 💵';
  } else {
    return 'No Match 😢';
  }
}
