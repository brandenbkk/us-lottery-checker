# US Lottery Checker 🎰

미국 로또 티켓 당첨 확인 웹 애플리케이션

## 프로젝트 개요

사용자가 구매한 미국 로또 티켓의 당첨 여부를 확인할 수 있는 웹 애플리케이션입니다.
- 계정 생성 없이 즉시 사용 가능
- 실시간 당첨 번호 자동 조회
- PC/Desktop 최적화

## 지원 게임

### Phase 1 (현재)
- ✅ Powerball (전국)
- ✅ Mega Millions (전국)

### Phase 2 (예정)
- 🔜 New Jersey Lottery
- 🔜 New York Lottery
- 🔜 California Lottery

## 기술 스택

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (무료)
- **Data Collection**: Web Scraping (Cheerio/Puppeteer)

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
us-lottery-checker/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # 메인 레이아웃
│   ├── page.tsx         # 홈페이지
│   └── globals.css      # 글로벌 스타일
├── components/          # React 컴포넌트
├── lib/                 # 유틸리티 및 타입
│   ├── types.ts        # TypeScript 타입 정의
│   └── gameData.ts     # 게임 데이터
├── data/               # 당첨 번호 데이터
└── public/             # 정적 파일
```

## 개발 일정

- **Week 1-2**: 기반 구축 및 UI 개발
- **Week 3-4**: 핵심 기능 구현
- **Week 5-6**: 확장 및 테스트

## 비용

- ✅ **완전 무료**: 모든 도구와 라이브러리가 무료
- ✅ **Vercel 무료 플랜**: 호스팅 비용 $0

## 라이선스

MIT

## 만든 사람

- Project Manager: Jenny
- Senior Developer: Rick

---

⚠️ **면책 조항**: 이 도구는 당첨 확인 보조 도구일 뿐입니다. 
정확한 당첨 확인은 공식 판매처에서 하시기 바랍니다.
