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
   - **(Desktop)**: 전체 메뉴 노출.
   - **(Mobile)**: 우측 상단 `햄버거 메뉴` 아이콘 노출, 클릭 시 드로어(Drawer) 메뉴 활성화.
   - **(비회원)**: `로그인`, `비회원 주문 조회`.
   - **(회원)**: `마이페이지`.
2. **Body**: 각 페이지 별 주요 내용 렌더링.
3. **Footer**: 사업자 정보, `이용약관` 링크, `개인정보처리 방침` 링크, `문의하기`.
4. **Head & Meta**: SEO, Open Graph, GA4 등 Analytics 설정.

### 5.2. Page Details (페이지별 상세 구성)

1. **메인 랜딩페이지 (`/`)**
   - **Hero Section**: "무의식이 보내는 신호, 꿈을 해석해드립니다." (심리학적 접근 강조), CTA ("내 무의식 분석하기").
   - **Feature Section**: 프로이트/융 이론 기반의 전문적 분석, 내면의 불안/욕구 해소, 시각화, 비밀 보장.
   - **Social Proof**: "해석을 통해 내 진짜 속마음을 알게 되었어요" 등 자아 성찰과 인사이트 중심의 후기.

2. **프로덕트 상세 페이지 (`/dream-teller`)**
   - 사용법 안내, 전문가(프로이트 등) 선택, 꿈 입력, 풀이 요청, 구매 옵션(기본/이미지).
   - 주의사항: 생성 시간(3분), 의학적 진단 대체 불가 안내.

3. **결제 페이지 (`/payments`)**
   - **UI**: 영수증 컨셉의 카드 디자인 (Receipt Style).
   - **Function**: `기본/프리미엄` 플랜 스위처 (탭), 토스페이먼츠(Payment Widget) 연동.
   - **Logic**: URL Query Parameter(`?plan=`)와 연동된 상품 가격 업데이트, 비동기 결제 요청.

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

### 5.3. E2E Test Checklist (Current Implementation)

현재 구현된 UX Flow의 정상 작동을 검증하기 위한 테스트 시나리오입니다.

| 구분                     | 테스트 대상    | 테스트 시나리오                                                               | 상태    | 특이사항                                                                      |
| :----------------------- | :------------- | :---------------------------------------------------------------------------- | :------ | :---------------------------------------------------------------------------- |
| **Landing & Navigation** | `Home (/)`     | 헤더 네비게이션(데스크탑/모바일) 작동 확인                                    | ✅ Pass | 로고/메뉴 정상 작동                                                           |
|                          | `Home (/)`     | Hero Section 및 "내 무의식 분석하기" CTA 버튼 클릭 시 반응 확인               | ✅ Pass | `/dream-teller` 리다이렉트 정상                                               |
|                          | `Footer`       | 이용약관/개인정보처리방침 링크 작동 확인                                      | ✅ Pass | `/terms`, `/privacy` 링크 연결 완료                                           |
| **Authentication**       | `Guest Login`  | `/guest-login` 접속 -> 비회원 전화번호/비밀번호 입력 -> 로그인 성공/실패 처리 | ✅ Pass | Mock Data (010-1234-5678 / 1234) 적용 완료                                    |
|                          | `User Login`   | (Mock) 소셜 로그인 버튼 클릭 -> 로그인 세션 생성 확인                         | ✅ Pass | 버튼 클릭 시 `/my-page` 이동 처리 완료                                        |
| **My Page (User)**       | `Profile`      | 닉네임 수정 기능(인라인 편집) 작동 및 저장 확인                               | ✅ Pass | AutoFocus 적용 및 상태 업데이트 로직 검증 완료                                |
|                          | `Logout`       | 로그아웃 버튼 클릭 시 alert 노출 및 리다이렉트 확인                           | ✅ Pass | 명시적 로그아웃 알림(alert) 적용 완료                                         |
|                          | `Dashboard`    | 최근 해석 기록 리스트 렌더링 확인                                             | ✅ Pass | Mock Data 리스트 렌더링 정상                                                  |
|                          | `Calendar`     | 꿈 기록 캘린더 렌더링 및 하이드레이션 오류 여부 확인                          | ✅ Pass | 오류 없이 렌더링 정상                                                         |
| **Guest Features**       | `Guest Check`  | `/guest-check` 접속 -> 비회원 주문 내역 리스트 조회 확인                      | ✅ Pass | Mock Data 리스트 렌더링 정상                                                  |
| **Dream & Payment**      | `Request Flow` | 꿈 해몽 요청 -> `/payments` 진입 확인                                         | ✅ Pass | 쿼리 파라미터 전달 및 이동 정상                                               |
|                          | `Payment Page` | 결제 페이지(영수증 UI) 렌더링 및 토스 페이먼츠 위젯 로드 확인                 | ✅ Pass | 토스 페이먼츠 API 인증키 수정 및 연동 완료                                    |
|                          | `Payment Flow` | 카드 결제 시뮬레이션 -> 성공 페이지(`/payments/success`) 검증                 | ✅ Pass | API 키 정상 인식 및 `/api/payments/confirm` 연동을 통한 결제 성공 플로우 완비 |
|                          | `Dream Result` | `/dream-result/[id]` 접속 -> DB 연동 및 실제 AI 해몽 완료 데이터 렌더링 검증  | ✅ Pass | Mock 데이터 제거 및 DB 기반 해몽 내용 및 해시태그 렌더링 정상 완료 확인       |
| **Community**            | `Feeds`        | `/feeds` 접속 -> 공개된 꿈 해몽 카드 리스트 및 전문가별 필터링 작동 확인      | ✅ Pass | 더미 텍스트 제거, 실제 DB 데이터 렌더링 및 `?expert=` 필터링 쿼리 작동 정상   |

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

### 6.3. Admin Requirements - Frontend (프론트엔드 구현 사항)

관리자 페이지 화면을 구성하기 위한 프론트엔드 관점의 요구사항입니다.

| 구분                        | 페이지/컴포넌트명                   | 구현 내용 및 요구사항                                                                                                                                                                                                                                              | 사용 API                                                                                                    | 구현 여부 | E2E 테스트 |
| :-------------------------- | :---------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- | :-------- | :--------- |
| **공통 (Common)**           | 레이아웃 (Layout)                   | - 좌측 LNB (대시보드, 주문/결제, 회원, 콘텐츠 관리) 네비게이션 드로어/사이드바 구현.<br>- 페이지 공유 헤더 및 Breadcrumb 네비게이션.<br>- 권한 부족 시 렌더링 되지 않는 Protected Route 컴포넌트 처리.                                                             | -                                                                                                           | ✅ 완료   | ✅ 완료    |
| **통계 (Stats)**            | 대시보드 (`/admin`)                 | - 핵심 지표 카드(Summary Widget): 신규 회원/결제 건수 전시.<br>- 매출 차트(Chart): Recharts 등을 활용한 시계열 매출 추이 그래프 시각화.                                                                                                                            | `GET /api/admin/stats`                                                                                      | ✅ 완료   | ✅ 완료    |
| **주문/결제 관리 (Orders)** | 주문 목록 (`/admin/order-list`)     | - 결제 완료 주문 테이블(Table) 구현.<br>- 테이블 행(Row) 클릭 시 `router.push('/admin/order-list/[id]')` 연동.<br>- 페이지네이션(Pagination) 기능.                                                                                                                 | `GET /api/admin/orders`                                                                                     | ✅ 완료   | ✅ 완료    |
|                             | 주문 상세 (`/.../[id]`)             | - 주문 기본 정보 섹션: 회원/비회원 정보, 결제 상태, 금액.<br>- 꿈 상세 데이터 섹션: 사용자 입력 텍스트와 AI 출력 텍스트, 생성된 이미지 전시.<br>- **(CS용 액션)**: Re-try (AI 해몽 재시도) 버튼, Payment Cancel (결제 취소/환불) 버튼 액션 및 결과 모달/토스트 UI. | `GET /api/admin/orders/[id]`<br>`POST /api/admin/orders/[id]/retry`<br>`POST /api/admin/orders/[id]/cancel` | ✅ 완료   | ✅ 완료    |
| **회원 관리 (Users)**       | 유저 목록 (`/admin/user-list`)      | - 전체 회원 및 비회원 하이브리드 통합 테이블 목록.<br>- 노출 데이터: 닉네임/ID(연락처), 생성일, 결제 건수 등.                                                                                                                                                      | `GET /api/admin/users`                                                                                      | ✅ 완료   | ✅ 완료    |
|                             | 유저 필터바 (Filters)               | - 회원/비회원을 선택할 수 있는 탭(Tabs) 또는 셀렉트 박스 구비.<br>- 선택 시 API URL 쿼리(Querystring) 리패치 처리.                                                                                                                                                 | `GET /api/admin/users?type=...`                                                                             | ✅ 완료   | ✅ 완료    |
| **콘텐츠 관리 (Content)**   | 공개 피드 관리 (`/admin/feed-list`) | - `is_public=true` 로 설정된 꿈 해석 리스트 모니터링 뷰.<br>- 악성 콘텐츠/규정 위반 게시글 강제 숨김(Hide) 처리 토글 버튼 UI 제공.                                                                                                                                 | `GET /api/admin/dreams/public`<br>`PATCH /api/admin/dreams/[id]/visibility`                                 | ✅ 완료   | ✅ 완료    |

### 6.4. Admin Requirements - Backend (백엔드 구현 사항)

관리자 페이지 API 제공 및 데이터베이스 통신을 위한 백엔드 관점의 요구사항입니다.

| 구분                        | 기능/API 분류                        | 구현 내용 및 요구사항                                                                                                                                                                       | Route 경로                                                                  | 구현 여부 | E2E 테스트 |
| :-------------------------- | :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- | :-------- | :--------- |
| **공통 (Common)**           | 라우팅 접근 제어 (Auth)              | - Next.js Middleware를 활용한 `/admin/*` 라우트 보호 기능.<br>- DB `profiles` 테이블에서 `role === 'ADMIN'`인 계정만 접근 허용 검증.                                                        | Middleware / DB Check                                                       | ✅ 완료   | ✅ 완료    |
| **통계 (Stats)**            | 대시보드 API                         | - 요청 기간 내 신규 가입자(users/guests) 수 계산 쿼리.<br>- 기간 내 총 결제 완료 건수(orders) 및 합계 금액 쿼리.<br>- 일자별 매출 데이터를 어그리게이션(Aggregation)하여 응답.              | `GET /api/admin/stats`                                                      | ✅ 완료   | ✅ 완료    |
| **주문/결제 관리 (Orders)** | 주문 목록 조회 API                   | - `orders`와 `dreams` 테이블을 조인(Join)하여 주문 상세 요약 반환.<br>- offset/limit 기반 서버 사이드 페이지네이션(Pagination) 처리 지원.                                                   | `GET /api/admin/orders`                                                     | ✅ 완료   | ✅ 완료    |
|                             | 주문 상세 내용 API                   | - 단일 `orderId`를 기반으로 결제 정보, 연동 회원정보, 꿈 입력 및 해몽 데이터 등 일체 조회 응답.                                                                                             | `GET /api/admin/orders/[id]`                                                | ✅ 완료   | ✅ 완료    |
|                             | CS 보상 로직 (AI 재생성 / 결제 취소) | - AI 재수행: 기존 `dreams.content`를 넘겨받아 `gemini sdk` 프롬프트 트리거 호출 및 재수행 후 DB 업데이트.<br>- 결제 취소/환불: `Toss Payments Cancel API` 연동 및 `orders.status` 업데이트. | `POST /api/admin/orders/[id]/retry`<br>`POST /api/admin/orders/[id]/cancel` | ✅ 완료   | ✅ 완료    |
| **회원 관리 (Users)**       | 회원 목록 조회 API                   | - `profiles` 테이블(가입 회원) 및 `guests` 테이블(비회원) 정보 다중 쿼리 후 배열 통합 응답.<br>- Request URL Param(`?type=user` 또는 `guest`)에 따른 조건부 DB 반환 로직.                   | `GET /api/admin/users`                                                      | ✅ 완료   | ✅ 완료    |
| **콘텐츠 관리 (Content)**   | 정책 위반 피드 제어 API              | - 퍼블릭 피드 전체 조회 쿼리(관리자용 필터 없는 raw 데이터 조회).<br>- 특정 꿈의 공개 상태(`is_public`)를 강제로 `false`로 변환시키는 상태 업데이트(Patch) 오퍼레이션.                      | `GET /api/admin/dreams/public`<br>`PATCH /api/admin/dreams/[id]/visibility` | ✅ 완료   | ✅ 완료    |

## 7. 운영 및 정책 (Operations & Policy)

### 7.1. 예외 및 실패 처리 (Failure Handling)

- 결제 후 AI 응답 지연/오류 발생 시 `자동 재시도(1회)` 로직 수행.
- 최종 실패 시: 사용자에게 '시스템 오류' 안내 모달 표시 및 `결제 자동 취소` 또는 `무료 재시도 쿠폰` 발급.
- **결제 이탈**: 결제창 진입 후 구매하지 않고 이탈한 유저 로그 수집.

### 7.2. 데이터 및 보안 정책 (Data & Safety)

- **Content Safety**: OpenAI Moderation API 등을 통해 유해성 필터링.
- **비회원 데이터**: 주문 내역 `30일` 보관 후 마스킹/삭제.
- **개인정보**: 피드 공유 시 닉네임 외 개인 식별 정보 노출 금지.

## 8. API Specification (Server Architecture)

API 디자인은 **Next.js Route Handlers**를 기반으로 하며, RESTful 원칙을 준수합니다.

### 8.1. Auth & Users (인증 및 유저)

| Method    | Endpoint           | Description                              | Access      |
| :-------- | :----------------- | :--------------------------------------- | :---------- |
| **POST**  | `/api/auth/guest`  | 비회원 로그인 및 세션 발급 (전화번호/PW) | Public      |
| **POST**  | `/api/auth/logout` | 로그아웃 (쿠키 만료)                     | User, Guest |
| **GET**   | `/api/users/me`    | 현재 세션 유저 정보 조회                 | User        |
| **PATCH** | `/api/users/me`    | 유저 프로필 정보 수정                    | User        |

### 8.2. Dreams (꿈 해몽 및 데이터)

| Method     | Endpoint               | Description                                        | Access          |
| :--------- | :--------------------- | :------------------------------------------------- | :-------------- |
| **POST**   | `/api/dreams`          | 꿈 데이터 생성 및 해몽 요청 (Pending 상태 생성)    | User, Guest     |
| **POST**   | `/api/dreams/generate` | 내부망(Internal) 통신용 AI 분석 진행 및 저장       | Internal Server |
| **GET**    | `/api/dreams`          | 꿈 리스트 조회 (Query: `?type=feed` or `?type=my`) | Public/User     |
| **GET**    | `/api/dreams/[id]`     | 개별 꿈 상세 조회                                  | Owner, Public   |
| **PATCH**  | `/api/dreams/[id]`     | 꿈 상태 수정 (공개 여부, 삭제 등)                  | Owner           |
| **DELETE** | `/api/dreams/[id]`     | 꿈 데이터 삭제                                     | Owner           |

### 8.3. Payments (결제 처리)

| Method   | Endpoint                  | Description                              | Access           |
| :------- | :------------------------ | :--------------------------------------- | :--------------- |
| **POST** | `/api/payments/confirm`   | 토스페이먼츠 결제 승인 요청 및 완료 처리 | User, Guest      |
| **GET**  | `/api/payments/[orderId]` | 주문 결제 상태 확인                      | Owner            |
| **POST** | `/api/webhooks/toss`      | 결제 상태 변경 비동기 통보 (웹훅)        | Public (IP 제한) |

### 8.4. Admin Features (관리자 기능)

URL Prefix: `/api/admin/...` (Admin 미들웨어 적용)

| Method   | Endpoint                       | Description                      | Access |
| :------- | :----------------------------- | :------------------------------- | :----- |
| **GET**  | `/api/admin/stats`             | 대시보드 KPI 데이터 조회         | Admin  |
| **GET**  | `/api/admin/orders`            | 전체 주문 리스트 조회            | Admin  |
| **GET**  | `/api/admin/orders/[id]`       | 특정 주문 상세 정보 조회         | Admin  |
| **POST** | `/api/admin/orders/[id]/retry` | 실패한 꿈 해몽(AI) 재시도 트리거 | Admin  |
| **GET**  | `/api/admin/users`             | 전체 회원 리스트 조회            | Admin  |

## 9. DB Schema Specification (Supabase)

Supabase의 Postgres DB를 사용하여 데이터 무결성과 관계형 구조를 최대한 활용합니다. (NN: Not Null)

### 9.1. Entity Map

**1. users (Supabase Auth)**

- `auth.users` 테이블을 그대로 사용하며, 회원 인증을 담당합니다.

**2. public.profiles (회원 정보)**

- `auth.users`와 1:1 매핑되어 회원 전용 부가 정보를 저장합니다.

| Column       | Type          | Null   | Description                         |
| :----------- | :------------ | :----- | :---------------------------------- |
| `id`         | `uuid`        | **NN** | PK, References `auth.users.id`      |
| `nickname`   | `text`        | **NN** | 유저 닉네임                         |
| `role`       | `text`        | **NN** | 'USER' or 'ADMIN' (Default: 'USER') |
| `created_at` | `timestamptz` | **NN** | 가입 일시                           |

**3. public.guests (비회원 정보)**

- 비회원 식별을 위한 테이블로, 전화번호와 비밀번호로 관리됩니다.

| Column          | Type          | Null   | Description                       |
| :-------------- | :------------ | :----- | :-------------------------------- |
| `id`            | `uuid`        | **NN** | PK (Default: `gen_random_uuid()`) |
| `phone`         | `text`        | **NN** | 전화번호 (Unique Index)           |
| `password_hash` | `text`        | **NN** | 비밀번호 (Bcrypt)                 |
| `created_at`    | `timestamptz` | **NN** | 생성 일시                         |

**4. public.dreams (꿈 해몽 데이터)**

- 핵심 데이터 테이블로, 회원 또는 비회원에 의해 생성됩니다.

| Column            | Type          | Null   | Description                                |
| :---------------- | :------------ | :----- | :----------------------------------------- |
| `id`              | `uuid`        | **NN** | PK (Default: `gen_random_uuid()`)          |
| `user_id`         | `uuid`        | Null   | FK `profiles.id` (회원인 경우)             |
| `guest_id`        | `uuid`        | Null   | FK `guests.id` (비회원인 경우)             |
| `content`         | `text`        | **NN** | 꿈 내용 (Input)                            |
| `expert_type`     | `text`        | **NN** | 선택한 전문가 유형 ('FREUD', 'JUNG'...)    |
| `status`          | `text`        | **NN** | `PENDING`, `COMPLETED`, `FAILED`           |
| `analysis_result` | `jsonb`       | Null   | AI 해몽 결과 (JSON 구조, 완료 시 생성)     |
| `image_url`       | `text`        | Null   | 생성된 이미지 URL                          |
| `is_public`       | `boolean`     | **NN** | 공개 여부 (Feed 노출 여부, Default: false) |
| `created_at`      | `timestamptz` | **NN** | 생성 일시                                  |

**5. public.orders (주문 및 결제)**

- 결제 정보를 저장하며, `dreams` 테이블과 1:1 관계를 가집니다.

| Column        | Type          | Null   | Description                          |
| :------------ | :------------ | :----- | :----------------------------------- |
| `id`          | `text`        | **NN** | PK (Toss Order ID)                   |
| `dream_id`    | `uuid`        | **NN** | FK `dreams.id` (Unique)              |
| `amount`      | `integer`     | **NN** | 결제 금액                            |
| `payment_key` | `text`        | Null   | Toss Payment Key (결제 완료 후 저장) |
| `status`      | `text`        | **NN** | `READY`, `DONE`, `CANCELED`          |
| `approved_at` | `timestamptz` | Null   | 결제 승인 시각                       |
| `created_at`  | `timestamptz` | **NN** | 주문 생성 시각                       |

## 10. API E2E Test Scenarios

### 10.1. Auth & Users API

| ID       | Method | Endpoint           | Scenario                                 | Expected Status  | Implementation Status |
| :------- | :----- | :----------------- | :--------------------------------------- | :--------------- | :-------------------- |
| API-A-01 | POST   | `/api/auth/guest`  | 비회원 로그인 성공 (Valid Phone/PW)      | 200 OK           | ✅ Pass               |
| API-A-02 | POST   | `/api/auth/guest`  | 비회원 로그인 실패 (Invalid Credentials) | 401 Unauthorized | ✅ Pass               |
| API-A-03 | POST   | `/api/auth/logout` | 로그아웃 (Cookie/Session Clear)          | 200 OK           | ✅ Pass               |
| API-A-04 | GET    | `/api/users/me`    | 내 정보 조회 (Authenticated User/Guest)  | 200 OK           | ✅ Pass               |
| API-A-05 | GET    | `/api/users/me`    | 내 정보 조회 (Unauthenticated)           | 401 Unauthorized | ✅ Pass               |
| API-A-06 | PATCH  | `/api/users/me`    | 프로필 수정 성공 (Valid Nickname)        | 200 OK           | ✅ Pass               |
| API-A-07 | PATCH  | `/api/users/me`    | 프로필 수정 실패 (Invalid Data)          | 400 Bad Request  | ✅ Pass               |

### 10.2. Dreams API (꿈 해몽 및 데이터 검증 완료)

| ID       | Method | Endpoint               | Scenario                                          | Expected Status  | Implementation Status |
| :------- | :----- | :--------------------- | :------------------------------------------------ | :--------------- | :-------------------- |
| API-D-01 | POST   | `/api/dreams`          | 꿈 데이터 생성 및 해몽 요청 (정상)                | 201 Created      | ✅ Pass               |
| API-D-02 | POST   | `/api/dreams`          | 필수 파라미터(content 등) 누락 시 에러            | 400 Bad Request  | ✅ Pass               |
| API-D-03 | GET    | `/api/dreams`          | 피드 목록 조회 (`?type=feed`)                     | 200 OK           | ✅ Pass               |
| API-D-04 | GET    | `/api/dreams`          | 내 꿈 목록 조회 (`?type=my`, 인증됨)              | 200 OK           | ✅ Pass               |
| API-D-05 | GET    | `/api/dreams`          | 권한 없는 상태에서 내 꿈 목록 조회 시도           | 401 Unauthorized | ✅ Pass               |
| API-D-06 | GET    | `/api/dreams/[id]`     | 개별 꿈 상세 조회 성공                            | 200 OK           | ✅ Pass               |
| API-D-07 | GET    | `/api/dreams/[id]`     | 존재하지 않는 꿈 조회 시도                        | 404 Not Found    | ✅ Pass               |
| API-D-08 | PATCH  | `/api/dreams/[id]`     | 꿈 상태 수정 성공 (공개 여부 변경 등)             | 200 OK           | ✅ Pass               |
| API-D-09 | PATCH  | `/api/dreams/[id]`     | 권한이 없는 꿈 무단 수정 시도                     | 403 Forbidden    | ✅ Pass               |
| API-D-10 | DELETE | `/api/dreams/[id]`     | 개별 꿈 데이터 삭제 성공                          | 200 OK           | ✅ Pass               |
| API-D-11 | DELETE | `/api/dreams/[id]`     | 권한이 없는 꿈 무단 삭제 시도                     | 403 Forbidden    | ✅ Pass               |
| API-D-12 | POST   | `/api/dreams/generate` | 내부망(Internal) 결제 완료 후 AI 생성 요청 처리   | 200 OK           | ✅ Pass               |
| API-D-13 | POST   | `/api/dreams/generate` | 꿈 해석 완료 후 텔레그램 알림 발송                | 200 OK           | ✅ Pass               |
| API-D-14 | POST   | `/api/dreams/generate` | 꿈 해석 실패 또는 서버 오류 발생 시 텔레그램 발송 | 500 / 400 등     | ✅ Pass               |

### 10.3. Payments API (결제 처리 검증 완료)

| ID       | Method | Endpoint                  | Scenario                                   | Expected Status | Implementation Status |
| :------- | :----- | :------------------------ | :----------------------------------------- | :-------------- | :-------------------- |
| API-P-01 | POST   | `/api/payments/confirm`   | 결제 승인 요청 성공 (유효한 paymentKey 등) | 200 OK          | ✅ Pass               |
| API-P-02 | POST   | `/api/payments/confirm`   | 결제 금액이 일치하지 않을 때의 승인 실패   | 400 Bad Request | ✅ Pass               |
| API-P-03 | POST   | `/api/payments/confirm`   | 잘못된 paymentKey 나 orderId 로 승인 요청  | 400 / 401       | ✅ Pass               |
| API-P-04 | GET    | `/api/payments/[orderId]` | 결제 상태 및 주문 확인 성공                | 200 OK          | ✅ Pass               |
| API-P-05 | GET    | `/api/payments/[orderId]` | 존재하지 않는 주문 정보 조회               | 404 Not Found   | ✅ Pass               |
| API-P-06 | POST   | `/api/webhooks/toss`      | 토스페이먼츠 웹훅 정상 수신 및 처리        | 200 OK          | ✅ Pass               |
| API-P-07 | POST   | `/api/webhooks/toss`      | 인증되지 않은 IP/소스의 웹훅 무시          | 403 / 401       | ✅ Pass               |
| API-P-08 | POST   | `/api/payments/confirm`   | 결제 성공 후 텔레그램 알림 발송            | 200 OK          | ✅ Pass               |
| API-P-09 | POST   | `/api/payments/confirm`   | 결제 API 또는 서버 오류 시 텔레그램 발송   | 400 / 500       | ✅ Pass               |

### 10.4. Admin Features API (관리자 기능)

| ID        | Method | Endpoint                            | Scenario                              | Expected Status | Implementation Status |
| :-------- | :----- | :---------------------------------- | :------------------------------------ | :-------------- | :-------------------- |
| API-AD-01 | GET    | `/api/admin/stats`                  | 대시보드 통계 및 매출 데이터 조회     | 200 OK          | ✅ Pass               |
| API-AD-02 | GET    | `/api/admin/orders`                 | 전체 결제/주문 리스트 목록 조회       | 200 OK          | ✅ Pass               |
| API-AD-03 | GET    | `/api/admin/orders/[id]`            | 특정 주문 및 연관 꿈 상세 정보 조회   | 200 OK          | ✅ Pass               |
| API-AD-04 | POST   | `/api/admin/orders/[id]/retry`      | 실패/대기 중인 꿈 해몽 재요청 트리거  | 200 OK          | ✅ Pass               |
| API-AD-05 | POST   | `/api/admin/orders/[id]/cancel`     | 완료된 주문에 대해 토스 결제 취소요청 | 200 OK          | ✅ Pass               |
| API-AD-06 | GET    | `/api/admin/users`                  | 전체 회원(User) 및 비회원(Guest) 조회 | 200 OK          | ✅ Pass               |
| API-AD-07 | GET    | `/api/admin/dreams/public`          | 퍼블릭으로 설정된 전체 피드 조회      | 200 OK          | ✅ Pass               |
| API-AD-08 | PATCH  | `/api/admin/dreams/[id]/visibility` | 특정 피드를 숨김/공개 상태로 토글     | 200 OK          | ✅ Pass               |
| API-AD-09 | N/A    | `/api/admin/*`                      | 권한 없는 엑세스 시 401/403 응답 차단 | 401 / 403       | ✅ Pass               |

## 11. Security Checklist (보안 점검 사항)

서비스의 안전하고 신뢰성 있는 운영을 위해 웹/모바일 애플리케이션 및 인프라 전반에서 반드시 준수하고 점검해야 하는 보안 사항을 MECE(Mutually Exclusive, Collectively Exhaustive) 관점으로 분류했습니다.

### 11.1 Identity & Access Management (인증 및 인가 보안)

- **Supabase Row Level Security (RLS)**: `users`, `profiles`, `guests`, `dreams`, `orders` 각 테이블에 대해 명확한 RLS 정책을 적용했는지 점검 (자신의 데이터만 CRUD 가능, ADMIN 제외한 타인의 데이터 접근 차단).
- **API 권한 제어 및 세션 관리 (Next.js Middleware)**: `/api/admin/*`, `/api/users/me` 접근 시 세션/토큰 내 권한 변조 여부 검사 및 쿠키 SameSite/Secure 옵션 설정을 통한 세션 탈취/고정 공격 예방.
- **비회원 비밀번호 및 식별 정보 암호화**: 비회원의 `phone` 등 중요 정보 접근 시 마스킹 처리 및 `password`는 단방향 해시(Bcrypt 등) 및 솔트(Salt)를 이용해 저장.

### 11.2 Application & Data Security (데이터 및 비즈니스 로직 보안)

- **Internal API Protection (비즈니스 로직 우회 차단)**: `/api/dreams/generate`와 같은 내부 생성 API를 브라우저 등 외부에서 강제로 직접 호출하여 과금을 회피하는 행위를 차단하기 위해, 서버 간 통신 전용 Secret 인증 로직 구현.
- **Data Encrypt & Error Handling 방어**: 모든 데이터 통신시 HTTPS 강제 적용 및, 서버 내부 예외(Exception) 처리 시 클라이언트 응답에 DB 쿼리 문이나 시스템 내부의 Stack Trace 정보가 노출되지 않도록 전역 에러 핸들러 통제.
- **Sensitive Log Masking**: 애플리케이션 접속 및 결제(웹훅 처리 등) 관련 로그 파싱 시 메모리에 위치한 `지갑/결제 키`, `비밀번호`, `휴대폰 번호(PII)` 등이 평문으로 파일이나 모니터링 콘솔에 장기 저장되지 않도록 철저한 로거 마스킹.

### 11.3 AI & Input Validation (AI 및 입력값/콘텐츠 보안)

- **System Prompt Injection 방어**: 비정상적인 사용자 입력으로 시스템 프롬프트(System Prompt)가 오염되거나, AI 엔진 리소스를 남용하게 만드는 공격을 차단하기 위해 입력 글자 수 제한 및 특수 문자 패턴 일차 필터링.
- **XSS (Cross-Site Scripting) 차단**: 사용자가 임의 기재한 해몽 내역(댓글, 생성물)과 가입 닉네임을 피드(`FeedPreviews` 등) 화면에 출력할 때 HTML 태그와 스크립트 실행이 불가하도록 React 내장 Escape 기능 활용 및 서버 Sanitize 처리.

### 11.4 Payment Integrations Security (연동 결제 시스템 보안)

- **결제 금액/상품 위변조 방지**: 클라이언트 브라우저는 변조가 용이함을 상정, 결제 승인 요청(`/api/payments/confirm`) 시 백엔드의 '상품 실원가'와 무조건 2차 비교하여 금액 일치 시에만 승인하도록 구현.
- **Webhook 신뢰성 검증**: 비동기 상태의 결제 완료 처리를 악용한 호출을 막기 위해 `/api/webhooks/toss` 엔드포인트 수신 시에 접근 요청 IP의 Toss 공식 범위 인증과 함께 Body Secret Key 위변조 검증.
- **결제 멱등성 보장 (Idempotency)**: 일시적 네트워크 단절, 클라이언트 측 중복 결제 클릭 등으로 인한 동일 `orderId` 무한 호출 시 중복 결제가 되지 않게끔 DB Lock 또는 상태 변환(READY->DONE) 멱등성 보장 로직 작성.

### 11.5 Infrastructure & Ops Guardrails (운영/인프라 가용성 보안)

- **DoS / Brute Force 공격 방어**: 비회원 로그인 시도나 신규 결제/생성 요청 등 자원 소모형 로직에는 동일 IP/단말에서의 연속 다수 요청 탐지 및 쓰로틀링(Rate Limiting - HTTP 429) 메커니즘을 설치하여 과금 예방 및 리소스 고갈 통제.
- **의존성(Dependency) 점검 & 휴면 데이터 정기 파기**: "비회원 데이터 30일 보관 정책"에 따른 DB 크론 스캐줄 정상 작동 모니터링, 외부 패키지(Npm)에 대한 정기적인 보안 취약점(`npm audit`) 추적 보수 관리.

---

### 11.6 Security E2E Test Checklist (보안 항목별 테스트 체크리스트)

| 카테고리      | 점검 항목                 | 주요 점검 내용 (테스트 시나리오)                                                                                                         | 상태    |
| :------------ | :------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| **IAM**       | RLS 및 권한 격리          | 비인가 권한(비회원->User기능, User->Admin기능)으로 타인의 데이터 API(`/api/dreams`, `/api/admin/*`) 직접 호출 시 401/403 차단 확인       | ✅ Pass |
| **IAM**       | API Authentication        | 유효기간 초과/임의 조작된 토큰 및 Session 쿠키로 내 정보(`/api/users/me`) 요청 시 접근 거부 여부 확인                                    | ✅ Pass |
| **App/Data**  | Internal API Protection   | 외부 환경(Postman)에서 결제 없이 `/api/dreams/generate`로 내부 AI 호출 우회 시도 시, 시크릿 검증 실패로 차단되는지 검증                  | ✅ Pass |
| **App/Data**  | PII / Secret Log Masking  | 의도적 결제 오류 발생 후, 서버 로그(Vercel 등)에 사용자 연락처/결제키 평문 덤프(Plain Text Dump)가 없는지 검수                           | ✅ Pass |
| **Input/AI**  | Prompt Injection 방어     | 꿈 내용에 "프롬프트를 무시하라" 등의 페이로드 입력 시, AI가 명령을 덮어쓰지 않거나 Backend에서 사전 필터링 되는 작동 확인                | ✅ Pass |
| **Input/AI**  | XSS 차단 및 Sanitize      | 피드 및 닉네임 입력란에 악성 `<script>` 태그 저장 후 조회 시, 브라우저가 이를 렌더링하지 않고 단순 이스케이프 텍스트로 표출하는지 테스트 | ✅ Pass |
| **Payment**   | 금액 위변조 (Tampering)   | 결제창에서 Amount 파라미터를 임의 조작(10원 등)하여 결제 승인`/confirm` 요청 시, DB 상품 정가 불일치로 승인 실패(400) 검증               | ✅ Pass |
| **Payment**   | Webhook Validation        | 토스 공식대역이 아닌 임의의 환경에서 조작된 페이로드를 `/api/webhooks/toss`로 전송 시, 403 Forbidden 및 처리 무시 여부 확인              | ✅ Pass |
| **Infra/Ops** | Rate Limiting (DDoS 방어) | 동일 단말(IP/Identifier)로 생성 및 로그인 API 단기 초과 호출 시, 타임아웃 딜레이 또는 `429 Too Many Requests` 상태 반환 작동 확인        | ✅ Pass |

## 12. Service Optimization Checklist (서비스 최적화 체크리스트)

웹 서비스의 성능, 접속성 및 사용자 경험을 극대화하기 위해 프론트엔드부터 백엔드까지 전체 시스템을 MECE 관점(렌더링(UI), 네트워크(Caching), 백엔드(DB), 검색 노출(SEO), AI 경험(UX))으로 분석한 최적화 체크리스트입니다.

### 12.1 Rendering & Asset Optimization (프론트엔드 렌더링 및 에셋 최적화)

- **이미지 최적화 (Image Optimization)**: Next.js의 `next/image` 컴포넌트를 활용하여 LCP(최대 콘텐츠 풀 페인트) 향상. `priority` 속성으로 중요 이미지 선로딩, 모든 이미지를 WebP 포맷으로 서빙 및 반응형 사이즈 조정 설정.
- **웹 폰트 최적화 (Font Optimization)**: `next/font`를 통해 구글 폰트나 로컬 폰트를 빌드 타임에 다운로드 및 자체 호스팅. 외부 네트워크 연결 최소화 및 레이아웃 시프트(CLS) 방지(`display: swap`).
- **스크립트 지연 로딩 (Script Optimization)**: 구글 애널리틱스 등 서드파티 스크립트 로드 시 `next/script`의 `strategy="afterInteractive"` 또는 `lazyOnload` 속성을 사용하여 메인 스레드 차단(Main Thread Blocking) 회피.
- **Client Component 최소화 (Bundle Size)**: 상호작용이 필요한 하위(Leaf) 노드에만 `"use client"` 적용하고, 나머지는 Server Component를 유지해 브라우저로 전송되는 자바스크립트 번들 사이즈 감축.
- **Prefetching & Priority (렌더링 흐름 최적화)**: `next/link` 요소의 디폴트 prefetch에 더하여 Hover 등 의도된 인텐트가 강한 상호작용 지점에 대한 프리패칭 및 Viewport 상단 요소에 대한 렌더링 최적화.

### 12.2 Network & Core Web Vitals (네트워크 및 페이로드 최적화)

- **데이터 캐싱 메커니즘 (Data / Route Caching)**: `fetch(url, { next: { revalidate: 시간 } })` 또는 `unstable_cache`를 활용하여 실시간성이 덜 중요한 공용 리소스(예: 전역 피드 조회 등)의 응답 캐싱화 적용.
- **Web Vitals 모니터링 체계 (Monitoring)**: Vercel Analytics 내장 기능 또는 `useReportWebVitals` 훅을 통합하여 LCP, INP, CLS 등의 주요 코어 웹 바이탈 지표를 지속적으로 추적.
- **Edge 로케이팅 지원 (Edge Execution)**: 무거운 연산이 아닌 자주 접근하는 Middleware 등의 권한 검증 로직을 엣지(Edge) 런타임 환경에서 실행시켜 TTFB(Time to First Byte) 지연 시간을 축소.
- **페이로드 포맷 최소화 (Payload Minification)**: 비대 파일(예: Date 라이브러리)을 경량화하고 Next.js 내장 Gzip/Brotli 압축을 활용하여 초기 로딩 속도 유지.

### 12.3 Backend & Database Performance (백엔드 및 데이터베이스 성능)

- **인덱싱 최적화 (Indexing)**: Supabase `orders`, `dreams` 테이블에서 빈번한 조회 조건으로 활용되는 `user_id`, `guest_id`, `status`, `is_public` 컬럼에 대한 복합 인덱스(B-Tree Indexes) 구성 여부 확인.
- **Connection Pooling**: 짧은 수명의 Vercel Serverless Function 특성 상 빈번한 커넥션 재연결 발생. 데이터베이스 연결 병목(Connection Exhaustion) 방지를 위해 PgBouncer 또는 Supavisor를 거쳐 데이터베이스 연동.
- **Cursor 기반 페이지네이션 (Pagination)**: 피드(`/feeds`)에서의 무한 스크롤 조회 시, 기존 `offset`보다 성능상 유리한 `cursor` (예: `created_at` 또는 `id` 기준) 기반의 쿼리 조회(Keyset Pagination)로 변경 검토.
- **N+1 Query 억제 (효율적 Data Fetching)**: 외래 키(Foreign Key) 프로필 정보 매칭 시 DB Join (`select("..., profiles(*)")`)을 통해 N+1 쿼리 병목을 예방.

### 12.4 SEO & Discoverability (검색 엔진 및 공유 최적화)

- **동적 메타데이터 (Dynamic Metadata)**: `/dream-result/[id]` 페이지에 대한 `generateMetadata` 설정으로 개별 꿈 해몽 결과에 매칭되는 Open Graph(OG) 이미지 및 메타 타이틀 동적 생성 확인 (URL 공유 시 최적화 목적).
- **Sitemap & Robots (크롤링 가이드)**: `app/sitemap.ts` 파일 및 `robots.txt`를 동적으로 생성하여 구글 등 검색 로봇이 피드 목록과 메인 페이지를 효율적으로 크롤링(SEO Indexing) 할 수 있도록 환경 구성.
- **시맨틱 마크업 (Semantic HTML & a11y)**: 각 페이지가 H1 단독 사용 기준을 준수하고, 인터랙티브 요소에 `aria-` 속성을 부여하여 스크린 리더 및 접근성 가이드라인(A11y) 확보.

### 12.5 AI Response UX Optimization (AI 체감 성능 및 사용자 경험 최적화)

- **Streaming AI Response**: 평균 3분 가량 소요될 수 있는 생성 시간의 체감 대기시간을 줄이기 위해, Next.js와 Vercel AI SDK를 활용해 텍스트 생성 경과를 실시간(Stream/Chunk)으로 화면에 출력 검토 (결제 완료 직후 로딩 애니메이션 제공 외에도 UX 개선).
- **Optimistic UI (낙관적 렌더링)**: '좋아요' 취소/설정, 사용자 닉네임 수정(프로필 저장) 등의 인터랙션 발생 시 결과를 서버 응답 전에 화면에 선행 렌더링하고, 백그라운드에서 상태 검증을 수행하는 패턴(Optimistic Updates) 차용.
- **Debouncing & Throttling (결제 및 생성 보호)**: 과금 또는 AI 노드 호출을 수반하는 트리거 버튼 클릭 시 디바운싱(Debounce) 처리를 통해 실수로 인한 중복 요청 및 불필요한 과금을 방지.

### 12.6 E2E Optimization Test Checklist (항목별 성능 테스트 점검표)

| 카테고리      | 최적화/점검 항목                | 테스트 대상 / 시나리오                                                                                                | 검증 상태 |
| :------------ | :------------------------------ | :-------------------------------------------------------------------------------------------------------------------- | :-------- |
| **Rendering** | `next/image` 및 WebP 변환       | 피드 목록(`/feeds`) 등에서 이미지가 WebP로 서빙되며, 지연로딩(Lazy loading)이 제대로 동작하는지 Network 탭 검증       | ✅ Pass   |
| **Rendering** | Client Bundle 최적화            | `/dream-teller` 메인 페이지 접근 시 JS 번들 크기가 비대하지 않은지, `use client` 누수가 없는지 빌드 통계 확인         | ✅ Pass   |
| **Network**   | 리소스 캐싱 검증                | 전문가 필터링(`/feeds?expert=`) 조회 시, Route Cache 또는 `fetch` 캐시가 재활용되어 DB 패치를 생략하는지 확인         | ✅ Pass   |
| **Database**  | 커서 기반 페이지네이션 (Cursor) | 피드(`/feeds`) 무한스크롤 시 데이터 로드 요청이 TimeOut 없이 `limit` 개수 단위로 즉각 응답하는지 점검                 | ✅ Pass   |
| **Database**  | 복합 인덱스 & N+1 차단          | 유저의 꿈 목록(`/my-page`) 호출 속도가 느리지 않으며, 회원 프로필 Join 구조로 인해 N+1 쿼리가 잡히지 않는지 점검      | ✅ Pass   |
| **SEO**       | 동적 Meta/OG 태그 삽입          | 개별 꿈 결과 페이지(`/dream-result/[id]`) 소스코드 조회 시 동적 title 및 og:image 태그가 정상적으로 치환되었는지 검증 | ⬜ 대기   |
| **UX/AI**     | Streaming Response 확인         | 결제 완료 직후 AI 프롬프트가 실행될 때 브라우저가 행(Hang)에 걸리지 않고 텍스트를 스트리밍해 주는지 확인              | ⬜ 대기   |
| **UX/AI**     | 중복 제출 방지 (디바운싱)       | 결제 폼 또는 프로필 저장 버튼 더블클릭/다중클릭 시 API 다중 호출이 무시되고 단일 호출만 전달되는지 검증               | ⬜ 대기   |
