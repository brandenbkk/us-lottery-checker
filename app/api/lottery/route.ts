import { NextRequest, NextResponse } from 'next/server';
import { scrapeDrawResults, scrapeAllGames } from '@/lib/scraper';
import { promises as fs } from 'fs';
import path from 'path';

// 데이터 캐시 디렉토리
const CACHE_DIR = path.join(process.cwd(), 'data', 'cache');
const CACHE_DURATION = 1000 * 60 * 60; // 1시간 (밀리초)

/**
 * 캐시 파일 경로 가져오기
 */
function getCacheFilePath(gameId: string): string {
  return path.join(CACHE_DIR, `${gameId}.json`);
}

/**
 * 캐시된 데이터 읽기
 */
async function readCache(gameId: string) {
  try {
    const filePath = getCacheFilePath(gameId);
    const data = await fs.readFile(filePath, 'utf-8');
    const cached = JSON.parse(data);

    // 캐시가 유효한지 확인 (1시간 이내)
    const now = Date.now();
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    return null;
  } catch (error) {
    // 캐시 파일이 없거나 읽기 실패
    return null;
  }
}

/**
 * 캐시에 데이터 쓰기
 */
async function writeCache(gameId: string, data: any) {
  try {
    // 캐시 디렉토리 생성
    await fs.mkdir(CACHE_DIR, { recursive: true });

    const filePath = getCacheFilePath(gameId);
    const cacheData = {
      timestamp: Date.now(),
      data: data,
    };

    await fs.writeFile(filePath, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error('캐시 쓰기 에러:', error);
  }
}

/**
 * GET /api/lottery?game=powerball
 * GET /api/lottery (모든 게임)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gameId = searchParams.get('game');

    // 특정 게임 조회
    if (gameId) {
      // 캐시 확인
      let cachedData = await readCache(gameId);
      
      if (cachedData) {
        return NextResponse.json({
          success: true,
          data: cachedData,
          source: 'cache',
        });
      }

      // 캐시가 없으면 크롤링
      const result = await scrapeDrawResults(gameId);

      if (result) {
        // 캐시에 저장
        await writeCache(gameId, result);

        return NextResponse.json({
          success: true,
          data: result,
          source: 'live',
        });
      } else {
        return NextResponse.json({
          success: false,
          error: '당첨 번호를 가져올 수 없습니다.',
        }, { status: 404 });
      }
    }

    // 모든 게임 조회
    const allGames = await scrapeAllGames();

    // 캐시에 저장
    for (const [gameId, result] of Object.entries(allGames)) {
      if (result) {
        await writeCache(gameId, result);
      }
    }

    return NextResponse.json({
      success: true,
      data: allGames,
      source: 'live',
    });

  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    }, { status: 500 });
  }
}
