import { NextRequest, NextResponse } from 'next/server';
import { LotteryTicket } from '@/lib/types';
import { scrapeDrawResults } from '@/lib/scraper';
import { checkMultipleTickets } from '@/lib/checkWinning';

/**
 * POST /api/check
 * 티켓 당첨 확인
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tickets, gameId } = body;

    // 입력 검증
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json({
        success: false,
        error: '티켓 정보가 필요합니다.',
      }, { status: 400 });
    }

    if (!gameId) {
      return NextResponse.json({
        success: false,
        error: '게임 ID가 필요합니다.',
      }, { status: 400 });
    }

    // 당첨 번호 가져오기 (캐시 또는 크롤링)
    const drawResult = await scrapeDrawResults(gameId);

    if (!drawResult) {
      return NextResponse.json({
        success: false,
        error: '당첨 번호를 가져올 수 없습니다. 나중에 다시 시도해주세요.',
      }, { status: 503 });
    }

    // 티켓 확인
    const results = checkMultipleTickets(tickets as LotteryTicket[], drawResult);

    return NextResponse.json({
      success: true,
      data: {
        drawResult,
        results,
      },
    });

  } catch (error) {
    console.error('당첨 확인 API 에러:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    }, { status: 500 });
  }
}

/**
 * GET /api/check (테스트용)
 */
export async function GET() {
  return NextResponse.json({
    message: '당첨 확인 API입니다. POST 요청을 사용하세요.',
    usage: {
      method: 'POST',
      endpoint: '/api/check',
      body: {
        gameId: 'powerball 또는 megamillions',
        tickets: [
          {
            id: 'ticket-1',
            gameId: 'powerball',
            purchaseDate: '2025-10-13',
            mainNumbers: [13, 14, 32, 52, 64],
            bonusNumbers: [12],
          },
        ],
      },
    },
  });
}
