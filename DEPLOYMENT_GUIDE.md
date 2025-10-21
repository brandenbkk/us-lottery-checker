# 🚀 US Lottery Checker - 배포 가이드

**작성일:** 2025년 10월 15일  
**대상:** Branden  
**목표:** GitHub & Vercel 배포

---

## 📦 1단계: GitHub에 코드 올리기

### A) GitHub 웹에서 하기 (가장 쉬움!) ⭐

1. **GitHub 웹사이트 접속**
   - https://github.com 로그인

2. **New Repository 만들기**
   - 오른쪽 상단 `+` 버튼 클릭
   - `New repository` 선택
   
3. **Repository 설정**
   - **Repository name**: `us-lottery-checker`
   - **Description**: `Check your US lottery tickets instantly`
   - **Public** 선택 (무료로 배포하려면)
   - ✅ **Add a README file** 체크 안 함 (우리가 이미 가지고 있음)
   - `Create repository` 클릭

4. **코드 업로드**
   - 새로 만든 repo 페이지에서
   - `uploading an existing file` 링크 클릭
   - 또는 `Add file` → `Upload files` 클릭
   
5. **파일 드래그**
   - 프로젝트 폴더의 **모든 파일과 폴더**를 드래그해서 업로드
   - ⚠️ **node_modules 폴더는 제외** (너무 커서)
   - ⚠️ **.next 폴더도 제외**
   
6. **Commit**
   - 하단에 "Initial commit" 입력
   - `Commit changes` 클릭

**완료! 🎉**

---

### B) 터미널/명령 프롬프트로 하기 (고급)

Windows에서:
```bash
cd [프로젝트 폴더 경로]

git init
git add .
git commit -m "Initial commit - Phase 2 complete"

git remote add origin https://github.com/[YOUR_USERNAME]/us-lottery-checker.git
git branch -M main
git push -u origin main
```

Mac/Linux에서:
```bash
cd /path/to/project

git init
git add .
git commit -m "Initial commit - Phase 2 complete"

git remote add origin https://github.com/[YOUR_USERNAME]/us-lottery-checker.git
git branch -M main
git push -u origin main
```

---

## 🚀 2단계: Vercel에 배포하기

### 1. **Vercel 로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인 (이미 했음)

### 2. **새 프로젝트 만들기**
   - Dashboard에서 `Add New...` 클릭
   - `Project` 선택

### 3. **GitHub Repo 연결**
   - `Import Git Repository` 섹션에서
   - `us-lottery-checker` repo 찾기
   - `Import` 클릭

### 4. **프로젝트 설정**
   - **Project Name**: `us-lottery-checker` (또는 원하는 이름)
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동 설정됨)
   - **Output Directory**: `.next` (자동 설정됨)
   - **Install Command**: `npm install` (자동 설정됨)
   
   **Environment Variables**: 없음 (지금은 필요없어)

### 5. **배포!**
   - `Deploy` 버튼 클릭
   - ⏳ 기다리기 (1-3분)
   - 🎉 완료!

### 6. **사이트 URL 받기**
   - 배포 완료되면 URL 표시됨
   - 예: `https://us-lottery-checker.vercel.app`
   - 또는 `https://us-lottery-checker-[random].vercel.app`

---

## ✅ 3단계: 테스트하기

### 1. **사이트 접속**
   - Vercel이 제공한 URL 클릭

### 2. **기능 테스트**
   - Powerball 선택
   - 날짜 선택 (아무 날짜)
   - 번호 입력:
     - 메인: 13, 14, 32, 52, 64
     - Powerball: 12
   - "당첨 확인하기" 클릭

### 3. **결과 확인**
   - 당첨 번호가 표시되는지
   - 일치한 번호가 하이라이트되는지
   - 당첨 등급이 표시되는지

---

## ⚠️ 알려진 이슈 & 해결법

### 문제 1: 캐싱이 안 될 수 있음
**증상:** 매번 크롤링하느라 느림  
**해결:** 정상 작동하지만 느릴 수 있음. 추후 Redis 추가 가능

### 문제 2: 크롤링 타임아웃
**증상:** 10초 후 에러  
**해결:** vercel.json에서 maxDuration 설정 완료

### 문제 3: 빌드 에러
**증상:** 배포 중 에러  
**해결:** 
1. GitHub에 node_modules가 안 올라갔는지 확인
2. package.json 확인
3. 다시 배포 시도

---

## 🎯 배포 후 체크리스트

- [ ] 사이트 URL 받음
- [ ] 메인 페이지 로드됨
- [ ] Powerball 선택 가능
- [ ] 번호 입력 가능
- [ ] 당첨 확인 작동
- [ ] 결과 페이지 표시
- [ ] Buy Me a Coffee 버튼 작동

---

## 🔧 추가 설정 (선택사항)

### 커스텀 도메인 연결
1. Vercel Dashboard → Project Settings
2. Domains 탭
3. 도메인 추가 (본인 도메인 있을 경우)

### 환경 변수 (나중에 필요시)
1. Vercel Dashboard → Project Settings
2. Environment Variables 탭
3. 변수 추가

---

## 💡 팁

### 빠른 업데이트 방법
GitHub에 코드 푸시하면 **자동으로 Vercel에 재배포됨!**

```bash
git add .
git commit -m "업데이트 내용"
git push
```

1분 후 자동 배포 완료! 🚀

---

## 📞 문제가 생기면?

1. **Vercel 로그 확인**: Dashboard → Deployments → 해당 배포 클릭
2. **빌드 로그 보기**: 에러 메시지 확인
3. **다시 배포**: Redeploy 버튼 클릭

---

## 🎉 축하합니다!

**배포 완료되면 실제 작동하는 서비스를 가진 거예요!**

사이트 URL을 공유하고 사람들에게 보여주세요! 💪

---

**다음 단계는?**
- 친구들에게 테스트 요청
- 피드백 수집
- Phase 3 개선 작업 고려

**화이팅! 🚀**

*- Rick*
