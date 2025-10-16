import { LotteryGame } from './types';

export const lotteryGames: Record<string, LotteryGame> = {
  powerball: {
    id: 'powerball',
    name: 'Powerball',
    state: 'National',
    mainNumberCount: 5,
    mainNumberMax: 69,
    bonusNumberCount: 1,
    bonusNumberMax: 26,
    bonusNumberName: 'Powerball',
    drawDays: ['Monday', 'Wednesday', 'Saturday'],
    officialWebsite: 'https://www.powerball.com',
  },
  megamillions: {
    id: 'megamillions',
    name: 'Mega Millions',
    state: 'National',
    mainNumberCount: 5,
    mainNumberMax: 70,
    bonusNumberCount: 1,
    bonusNumberMax: 25,
    bonusNumberName: 'Mega Ball',
    drawDays: ['Tuesday', 'Friday'],
    officialWebsite: 'https://www.megamillions.com',
  },
  // NJ, NY, CA 게임들은 나중에 추가
};

// Powerball 당첨 등급 (평균 금액 - 고정값)
export const powerballPrizes = [
  {
    tier: 'Jackpot',
    matchMain: 5,
    matchBonus: 1,
    amount: 100000000, // $100M (평균)
    description: '5 + Powerball',
  },
  {
    tier: 'Match 5',
    matchMain: 5,
    matchBonus: 0,
    amount: 1000000, // $1M
    description: '5 numbers',
  },
  {
    tier: 'Match 4 + Powerball',
    matchMain: 4,
    matchBonus: 1,
    amount: 50000, // $50K
    description: '4 + Powerball',
  },
  {
    tier: 'Match 4',
    matchMain: 4,
    matchBonus: 0,
    amount: 100, // $100
    description: '4 numbers',
  },
  {
    tier: 'Match 3 + Powerball',
    matchMain: 3,
    matchBonus: 1,
    amount: 100, // $100
    description: '3 + Powerball',
  },
  {
    tier: 'Match 3',
    matchMain: 3,
    matchBonus: 0,
    amount: 7, // $7
    description: '3 numbers',
  },
  {
    tier: 'Match 2 + Powerball',
    matchMain: 2,
    matchBonus: 1,
    amount: 7, // $7
    description: '2 + Powerball',
  },
  {
    tier: 'Match 1 + Powerball',
    matchMain: 1,
    matchBonus: 1,
    amount: 4, // $4
    description: '1 + Powerball',
  },
  {
    tier: 'Powerball Only',
    matchMain: 0,
    matchBonus: 1,
    amount: 4, // $4
    description: 'Powerball only',
  },
];

// Mega Millions 당첨 등급 (평균 금액 - 고정값)
export const megaMillionsPrizes = [
  {
    tier: 'Jackpot',
    matchMain: 5,
    matchBonus: 1,
    amount: 80000000, // $80M (평균)
    description: '5 + Mega Ball',
  },
  {
    tier: 'Match 5',
    matchMain: 5,
    matchBonus: 0,
    amount: 1000000, // $1M
    description: '5 numbers',
  },
  {
    tier: 'Match 4 + Mega Ball',
    matchMain: 4,
    matchBonus: 1,
    amount: 10000, // $10K
    description: '4 + Mega Ball',
  },
  {
    tier: 'Match 4',
    matchMain: 4,
    matchBonus: 0,
    amount: 500, // $500
    description: '4 numbers',
  },
  {
    tier: 'Match 3 + Mega Ball',
    matchMain: 3,
    matchBonus: 1,
    amount: 200, // $200
    description: '3 + Mega Ball',
  },
  {
    tier: 'Match 3',
    matchMain: 3,
    matchBonus: 0,
    amount: 10, // $10
    description: '3 numbers',
  },
  {
    tier: 'Match 2 + Mega Ball',
    matchMain: 2,
    matchBonus: 1,
    amount: 10, // $10
    description: '2 + Mega Ball',
  },
  {
    tier: 'Match 1 + Mega Ball',
    matchMain: 1,
    matchBonus: 1,
    amount: 4, // $4
    description: '1 + Mega Ball',
  },
  {
    tier: 'Mega Ball Only',
    matchMain: 0,
    matchBonus: 1,
    amount: 2, // $2
    description: 'Mega Ball only',
  },
];

// 게임별 당첨 등급 매핑
export const gamePrizes: Record<string, typeof powerballPrizes> = {
  powerball: powerballPrizes,
  megamillions: megaMillionsPrizes,
};
