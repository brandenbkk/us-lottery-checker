import { NextRequest, NextResponse } from 'next/server';
import { scrapeDrawResults, scrapeAllGames } from '@/lib/scraper';
import { promises as fs } from 'fs';
import path from 'path';

// Data cache directory
const CACHE_DIR = path.join(process.cwd(), 'data', 'cache');
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour (milliseconds)

/**
 * Get cache file path
 */
function getCacheFilePath(gameId: string): string {
  return path.join(CACHE_DIR, `${gameId}.json`);
}

/**
 * Read cached data
 */
async function readCache(gameId: string) {
  try {
    const filePath = getCacheFilePath(gameId);
    const data = await fs.readFile(filePath, 'utf-8');
    const cached = JSON.parse(data);

    // Check if cache is valid (within 1 hour)
    const now = Date.now();
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    return null;
  } catch (error) {
    // Cache file not found or read failed
    return null;
  }
}

/**
 * Write data to cache
 */
async function writeCache(gameId: string, data: any) {
  try {
    // Create cache directory
    await fs.mkdir(CACHE_DIR, { recursive: true });

    const filePath = getCacheFilePath(gameId);
    const cacheData = {
      timestamp: Date.now(),
      data: data,
    };

    await fs.writeFile(filePath, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * GET /api/lottery?game=powerball
 * GET /api/lottery (all games)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gameId = searchParams.get('game');

    // Query specific game
    if (gameId) {
      // Check cache
      let cachedData = await readCache(gameId);
      
      if (cachedData) {
        return NextResponse.json({
          success: true,
          data: cachedData,
          source: 'cache',
        });
      }

      // Scrape if no cache
      const result = await scrapeDrawResults(gameId);

      if (result) {
        // Save to cache
        await writeCache(gameId, result);

        return NextResponse.json({
          success: true,
          data: result,
          source: 'live',
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Unable to fetch winning numbers.',
        }, { status: 404 });
      }
    }

    // Query all games
    const allGames = await scrapeAllGames();

    // Save to cache
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
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred.',
    }, { status: 500 });
  }
}
