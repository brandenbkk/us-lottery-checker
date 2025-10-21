import axios from 'axios';
import * as cheerio from 'cheerio';
import { DrawResult } from './types';

/**
 * Powerball winning numbers scraping
 */
export async function scrapePowerball(): Promise<DrawResult | null> {
  try {
    // Get latest Powerball draw information
    const response = await axios.get('https://www.powerball.com/api/v1/numbers/powerball/recent', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    // If API response exists
    if (response.data && response.data.length > 0) {
      const latest = response.data[0];
      
      return {
        id: `powerball-${latest.field_draw_date}`,
        gameId: 'powerball',
        drawDate: latest.field_draw_date,
        mainNumbers: latest.field_winning_numbers?.split(' ').map(Number).slice(0, 5) || [],
        bonusNumbers: [parseInt(latest.field_power_ball) || 0],
        prizes: [], // Prize amounts from gameData.ts
      };
    }

    return null;
  } catch (error) {
    console.error('Powerball scraping error:', error);
    
    // Try HTML parsing if API fails
    try {
      return await scrapePowerballFromHTML();
    } catch (htmlError) {
      console.error('Powerball HTML parsing error:', htmlError);
      return null;
    }
  }
}

/**
 * Powerball HTML page parsing (backup method)
 */
async function scrapePowerballFromHTML(): Promise<DrawResult | null> {
  const response = await axios.get('https://www.powerball.com/previous-results', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    timeout: 10000,
  });

  const $ = cheerio.load(response.data);
  
  // Find latest result (adjust based on HTML structure)
  // Example: extract info from first result card
  const drawDateText = $('.item-date').first().text().trim();
  const numberElements = $('.item-powerball .numbers .ball').first().find('span');
  
  const mainNumbers: number[] = [];
  const bonusNumbers: number[] = [];
  
  numberElements.each((i, elem) => {
    const num = parseInt($(elem).text().trim());
    if (i < 5) {
      mainNumbers.push(num);
    } else {
      bonusNumbers.push(num);
    }
  });

  if (mainNumbers.length > 0) {
    return {
      id: `powerball-${drawDateText}`,
      gameId: 'powerball',
      drawDate: drawDateText,
      mainNumbers,
      bonusNumbers,
      prizes: [],
    };
  }

  return null;
}

/**
 * Mega Millions winning numbers scraping
 */
export async function scrapeMegaMillions(): Promise<DrawResult | null> {
  try {
    // Try HTML parsing first (more reliable)
    const response = await axios.get('https://www.megamillions.com/Winning-Numbers/Previous-Drawings.aspx', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    
    // Find the latest draw result
    // Try multiple selectors to find numbers
    let mainNumbers: number[] = [];
    let bonusNumbers: number[] = [];
    let drawDate = '';

    // Method 1: Look for balls in the first result row
    const firstRow = $('.pastResult').first();
    if (firstRow.length > 0) {
      drawDate = firstRow.find('.date').text().trim();
      
      firstRow.find('.ball').each((i, elem) => {
        const num = parseInt($(elem).text().trim());
        if (!isNaN(num)) {
          if (mainNumbers.length < 5) {
            mainNumbers.push(num);
          } else if (bonusNumbers.length < 1) {
            bonusNumbers.push(num);
          }
        }
      });
    }

    // Method 2: Alternative selector
    if (mainNumbers.length === 0) {
      $('.winning-numbers-item, .winningNumber').each((i, elem) => {
        const num = parseInt($(elem).text().trim());
        if (!isNaN(num)) {
          if (mainNumbers.length < 5) {
            mainNumbers.push(num);
          } else if (bonusNumbers.length < 1) {
            bonusNumbers.push(num);
          }
        }
      });
    }

    if (mainNumbers.length === 5 && bonusNumbers.length === 1) {
      return {
        id: `megamillions-${drawDate || new Date().toISOString().split('T')[0]}`,
        gameId: 'megamillions',
        drawDate: drawDate || new Date().toISOString().split('T')[0],
        mainNumbers,
        bonusNumbers,
        prizes: [],
      };
    }

    // If HTML parsing failed, try the API
    return await scrapeMegaMillionsFromAPI();
  } catch (error) {
    console.error('Mega Millions scraping error:', error);
    
    // Final fallback: try API
    try {
      return await scrapeMegaMillionsFromAPI();
    } catch (apiError) {
      console.error('Mega Millions API error:', apiError);
      return null;
    }
  }
}

/**
 * Mega Millions API fallback
 */
async function scrapeMegaMillionsFromAPI(): Promise<DrawResult | null> {
  try {
    const response = await axios.get('https://www.megamillions.com/cmspages/utilservice.asmx/GetLatestDrawData', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response.data) {
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      
      return {
        id: `megamillions-${data.DrawDate}`,
        gameId: 'megamillions',
        drawDate: data.DrawDate,
        mainNumbers: data.N1 ? [data.N1, data.N2, data.N3, data.N4, data.N5].map(Number) : [],
        bonusNumbers: [parseInt(data.MBall) || 0],
        prizes: [],
      };
    }

    return null;
  } catch (error) {
    console.error('Mega Millions API fallback failed:', error);
    return null;
  }
}

/**
 * Call appropriate scraper based on game ID
 */
export async function scrapeDrawResults(gameId: string): Promise<DrawResult | null> {
  switch (gameId) {
    case 'powerball':
      return await scrapePowerball();
    case 'megamillions':
      return await scrapeMegaMillions();
    default:
      throw new Error(`Unsupported game: ${gameId}`);
  }
}

/**
 * 여러 게임의 당첨 번호를 한 번에 가져오기
 */
export async function scrapeAllGames(): Promise<Record<string, DrawResult | null>> {
  const results = await Promise.all([
    scrapePowerball(),
    scrapeMegaMillions(),
  ]);

  return {
    powerball: results[0],
    megamillions: results[1],
  };
}
