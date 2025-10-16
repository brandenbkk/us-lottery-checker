import axios from 'axios';
import * as cheerio from 'cheerio';
import { DrawResult } from './types';

/**
 * Powerball 당첨 번호 크롤링
 */
export async function scrapePowerball(): Promise<DrawResult | null> {
  try {
    // Powerball의 가장 최근 추첨 정보 가져오기
    const response = await axios.get('https://www.powerball.com/api/v1/numbers/powerball/recent', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    // API 응답이 있는 경우
    if (response.data && response.data.length > 0) {
      const latest = response.data[0];
      
      return {
        id: `powerball-${latest.field_draw_date}`,
        gameId: 'powerball',
        drawDate: latest.field_draw_date,
        mainNumbers: latest.field_winning_numbers?.split(' ').map(Number).slice(0, 5) || [],
        bonusNumbers: [parseInt(latest.field_power_ball) || 0],
        prizes: [], // 당첨 금액은 gameData.ts에서 가져옴
      };
    }

    return null;
  } catch (error) {
    console.error('Powerball 크롤링 에러:', error);
    
    // API 실패 시 HTML 파싱 시도
    try {
      return await scrapePowerballFromHTML();
    } catch (htmlError) {
      console.error('Powerball HTML 파싱 에러:', htmlError);
      return null;
    }
  }
}

/**
 * Powerball HTML 페이지에서 직접 파싱 (백업 방법)
 */
async function scrapePowerballFromHTML(): Promise<DrawResult | null> {
  const response = await axios.get('https://www.powerball.com/previous-results', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    timeout: 10000,
  });

  const $ = cheerio.load(response.data);
  
  // 가장 최근 결과 찾기 (HTML 구조에 따라 조정 필요)
  // 예시: 첫 번째 결과 카드에서 정보 추출
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
 * Mega Millions 당첨 번호 크롤링
 */
export async function scrapeMegaMillions(): Promise<DrawResult | null> {
  try {
    // Mega Millions API 시도
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
    console.error('Mega Millions 크롤링 에러:', error);
    
    // API 실패 시 HTML 파싱 시도
    try {
      return await scrapeMegaMillionsFromHTML();
    } catch (htmlError) {
      console.error('Mega Millions HTML 파싱 에러:', htmlError);
      return null;
    }
  }
}

/**
 * Mega Millions HTML 페이지에서 직접 파싱 (백업 방법)
 */
async function scrapeMegaMillionsFromHTML(): Promise<DrawResult | null> {
  const response = await axios.get('https://www.megamillions.com/winning-numbers.aspx', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    timeout: 10000,
  });

  const $ = cheerio.load(response.data);
  
  // HTML 구조에 따라 당첨 번호 추출
  const drawDateText = $('.draw-date').first().text().trim();
  const numberElements = $('.winning-numbers-item');
  
  const mainNumbers: number[] = [];
  const bonusNumbers: number[] = [];
  
  numberElements.each((i, elem) => {
    const num = parseInt($(elem).text().trim());
    if (!isNaN(num)) {
      if (i < 5) {
        mainNumbers.push(num);
      } else {
        bonusNumbers.push(num);
      }
    }
  });

  if (mainNumbers.length > 0) {
    return {
      id: `megamillions-${drawDateText}`,
      gameId: 'megamillions',
      drawDate: drawDateText,
      mainNumbers,
      bonusNumbers,
      prizes: [],
    };
  }

  return null;
}

/**
 * 게임 ID에 따라 적절한 크롤러 호출
 */
export async function scrapeDrawResults(gameId: string): Promise<DrawResult | null> {
  switch (gameId) {
    case 'powerball':
      return await scrapePowerball();
    case 'megamillions':
      return await scrapeMegaMillions();
    default:
      throw new Error(`지원하지 않는 게임: ${gameId}`);
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
