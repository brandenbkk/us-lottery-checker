// 로또 게임 타입 정의
export interface LotteryGame {
  id: string;
  name: string;
  state: string;
  mainNumberCount: number; // 메인 번호 개수 (예: 5개)
  mainNumberMax: number; // 메인 번호 최대값 (예: 69)
  bonusNumberCount: number; // 보너스 번호 개수 (예: 1개)
  bonusNumberMax: number; // 보너스 번호 최대값 (예: 26)
  bonusNumberName: string; // 보너스 번호 이름 (예: "Powerball", "Mega Ball")
  drawDays: string[]; // 추첨 요일 (예: ["Wednesday", "Saturday"])
  officialWebsite: string; // 공식 웹사이트 URL
}

// 티켓 입력 타입
export interface LotteryTicket {
  id: string;
  gameId: string;
  purchaseDate: string;
  mainNumbers: number[];
  bonusNumbers: number[];
}

// 당첨 번호 타입
export interface DrawResult {
  id: string;
  gameId: string;
  drawDate: string;
  mainNumbers: number[];
  bonusNumbers: number[];
  prizes: Prize[];
}

// 당첨 등급 및 금액
export interface Prize {
  tier: string; // 등급 (예: "Jackpot", "Match 5", "Match 4+1")
  matchMain: number; // 일치한 메인 번호 개수
  matchBonus: number; // 일치한 보너스 번호 개수
  amount: number; // 평균 당첨 금액 (고정값)
  description: string; // 설명
}

// 체크 결과 타입
export interface CheckResult {
  ticketId: string;
  matchedMainNumbers: number[];
  matchedBonusNumbers: number[];
  totalMainMatches: number;
  totalBonusMatches: number;
  prize?: Prize; // 당첨된 경우
  isWinner: boolean;
}
