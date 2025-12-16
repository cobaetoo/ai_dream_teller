# Product Requirements Document (PRD)

## 1. 프로젝트 개요 (Project Overview)
- **프로젝트명**: AI Dream Teller (AI 꿈 해몽 서비스)
- **목표**: 사용자가 입력한 꿈 내용을 AI가 분석하여 심층적인 해몽과 조언을 제공하는 수익형 웹 서비스.
- **핵심 가치 1**: 신비롭고 직관적인 UI 경험과 정확도 높은 AI 분석을 통해 사용자에게 인사이트와 재미 제공.
- **핵심 가치 2**: 프로이트, 칼 융, 신경과학, 게슈탈트 등 해몽을 맡기고 싶은 전문 분야 선택하여 해몽 요청 가능.

## 2. 타겟 유저 (Target Audience)
- 꿈의 의미를 검색해보는 습관이 있는 20~40대 남녀.
- 모바일 환경에서 간편하게 결과를 확인하고 공유하고 싶어하는 유저.

## 3. 기술 스택 (Tech Stack)
- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Backend & DB**: Next.js API Routes, Supabase
- **Payment**: Toss Payments
- **AI**: Gemini 3 with gemini sdk

## 4. 디자인 가이드 (Design Guidelines)
- **Theme**: Mystical, Vibrant, Fluid.
- **Colors**: Deep Purple, Neon Blue, Soft Pink (Aurora Gradients).
- **Interactions**: 부드러운 스크롤, 호버 시 빛나는 효과, 로딩 시 몽환적인 애니메이션.

## 5. UX Flow & Layout (User Side)

### 5.1. Global Layout (Common Structure)
1. **상단 네비게이션 바**
   - **(공통)**: 홈 로고.
   - **(비회원)**: `로그인`, `비회원 주문 조회`.
   - **(회원)**: `마이페이지`.
2. **Body**: 각 페이지 별 주요 내용 렌더링.
3. **Footer**: 사업자 정보, `이용약관` 링크, `개인정보처리 방침` 링크, `문의하기`.
4. **Head & Meta**: SEO, Open Graph, GA4 등 Analytics 설정.

### 5.2. Page Details (페이지별 상세 구성)
1. **메인 랜딩페이지 (`/`)**
   - 서비스 한 줄 소개 (Hero), CTA (꿈 풀이 시작), Feature 소개, 피드 예시(Social Proof).
2. **프로덕트 상세 페이지 (`/dream-teller`)**
   - 사용법 안내, 전문가(프로이트 등) 선택, 꿈 입력, 풀이 요청, 구매 옵션(기본/이미지).
   - 주의사항: 생성 시간(3분), 의학적 진단 대체 불가 안내.
3. **결제 페이지 (`/payments`)**
   - 영수증 디자인, 토스페이먼츠 위젯, 성공/실패 처리 로직.
4. **해석 확인 페이지 (`/dream-result/[order-id]`)**
   - 꿈 해석 및 이미지 확인, 공유(링크/SNS), (회원) 캘린더 연동.
5. **유저 마이페이지 (`/my-page`)**
   - (회원전용) 캘린더(하이라이트), 구매 내역 리스트, 프로필 수정.
6. **비회원 로그인 (`/guest-login`)**
   - 비회원 조회용 전화번호/비밀번호 입력 폼.
7. **비회원 주문 조회 페이지 (`/guest-check`)**
   - 비회원 구매 내역 리스트.
8. **꿈 해몽 피드 페이지 (`/feeds`)**
   - 무한 스크롤 피드 (해몽 결과 공유), 텍스트/이미지 카드형 UI.
9. **회원 로그인 페이지 (`/auth`)**
   - 소셜 로그인(구글/카카오) 및 가입 처리.

## 6. Admin UX Flow & Layout (관리자 페이지)

### 6.1. Admin Global Layout
1. **Layout Structure**
   - **좌측 네비게이션 패널 (LNB)**:
     - `대시보드` (매출 등).
     - `주문 내역` (Order List).
     - `회원 관리` (User List).
   - **Body**: 페이지별 콘텐츠 영역.

### 6.2. Admin Page Details
1. **관리자 메인 페이지 (`/admin`)**
   - **Dashboard**: 기간별 매출 통계 그래프, 신규 가입자 수, 결제 건수 요약.
2. **주문 내역 리스트 (`/admin/order-list`)**
   - 결제 완료된 모든 주문 건 테이블(Table) 표시.
   - 상세 보기 클릭 시 해당 주문의 `상세 내역 페이지`로 이동.
3. **상세 주문 내역 (`/admin/order-list/[order-id]`)**
   - 주문 정보: 회원/비회원 구분, 유저 정보, 결제 상태.
   - 꿈 데이터: 유저 입력 꿈 (`Input`), AI 해석 (`Output`), 생성 이미지.
   - **Action**: `LLM 해몽 재생성 요청` (오류 시 수동 트리거).
4. **유저 리스트 (`/admin/user-list`)**
   - 전체 회원 및 비회원 리스트 테이블.
   - Filters: 회원/비회원 필터링.
   - Columns: 닉네임/ID, 가입일, 결제 횟수/여부 등.

## 7. 운영 및 정책 (Operations & Policy)

### 7.1. 예외 및 실패 처리 (Failure Handling)
- **AI 생성 실패**:
    - 결제 후 AI 응답 지연/오류 발생 시 `자동 재시도(1회)` 로직 수행.
    - 최종 실패 시: 사용자에게 '시스템 오류' 안내 모달 표시 및 `결제 자동 취소` 또는 `무료 재시도 쿠폰` 발급.
- **결제 이탈**: 결제창 진입 후 구매하지 않고 이탈한 유저 로그 수집.

### 7.2. 데이터 및 보안 정책 (Data & Safety)
- **Content Safety**: OpenAI Moderation API 등을 통해 유해성 필터링.
- **비회원 데이터**: 주문 내역 `30일` 보관 후 마스킹/삭제.
- **개인정보**: 피드 공유 시 닉네임 외 개인 식별 정보 노출 금지.
