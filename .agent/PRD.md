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
| **공통 (Common)**           | 라우팅 접근 제어 (Auth)              | - Next.js Middleware를 활용한 `/admin/*` 라우트 보호 기능.<br>- DB `profiles` 테이블에서 `role === 'ADMIN'`인 계정만 접근 허용 검증.                                                        | Middleware / DB Check                                                       | ✅ 완료   | ⬜️ 대기    |
| **통계 (Stats)**            | 대시보드 API                         | - 요청 기간 내 신규 가입자(users/guests) 수 계산 쿼리.<br>- 기간 내 총 결제 완료 건수(orders) 및 합계 금액 쿼리.<br>- 일자별 매출 데이터를 어그리게이션(Aggregation)하여 응답.              | `GET /api/admin/stats`                                                      | ✅ 완료   | ⬜️ 대기    |
| **주문/결제 관리 (Orders)** | 주문 목록 조회 API                   | - `orders`와 `dreams` 테이블을 조인(Join)하여 주문 상세 요약 반환.<br>- offset/limit 기반 서버 사이드 페이지네이션(Pagination) 처리 지원.                                                   | `GET /api/admin/orders`                                                     | ✅ 완료   | ⬜️ 대기    |
|                             | 주문 상세 내용 API                   | - 단일 `orderId`를 기반으로 결제 정보, 연동 회원정보, 꿈 입력 및 해몽 데이터 등 일체 조회 응답.                                                                                             | `GET /api/admin/orders/[id]`                                                | ✅ 완료   | ⬜️ 대기    |
|                             | CS 보상 로직 (AI 재생성 / 결제 취소) | - AI 재수행: 기존 `dreams.content`를 넘겨받아 `gemini sdk` 프롬프트 트리거 호출 및 재수행 후 DB 업데이트.<br>- 결제 취소/환불: `Toss Payments Cancel API` 연동 및 `orders.status` 업데이트. | `POST /api/admin/orders/[id]/retry`<br>`POST /api/admin/orders/[id]/cancel` | ✅ 완료   | ⬜️ 대기    |
| **회원 관리 (Users)**       | 회원 목록 조회 API                   | - `profiles` 테이블(가입 회원) 및 `guests` 테이블(비회원) 정보 다중 쿼리 후 배열 통합 응답.<br>- Request URL Param(`?type=user` 또는 `guest`)에 따른 조건부 DB 반환 로직.                   | `GET /api/admin/users`                                                      | ✅ 완료   | ⬜️ 대기    |
| **콘텐츠 관리 (Content)**   | 정책 위반 피드 제어 API              | - 퍼블릭 피드 전체 조회 쿼리(관리자용 필터 없는 raw 데이터 조회).<br>- 특정 꿈의 공개 상태(`is_public`)를 강제로 `false`로 변환시키는 상태 업데이트(Patch) 오퍼레이션.                      | `GET /api/admin/dreams/public`<br>`PATCH /api/admin/dreams/[id]/visibility` | ✅ 완료   | ⬜️ 대기    |

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

| ID        | Method | Endpoint                       | Scenario                              | Expected Status | Implementation Status |
| :-------- | :----- | :----------------------------- | :------------------------------------ | :-------------- | :-------------------- |
| API-AD-01 | GET    | `/api/admin/stats`             | 대시보드 통계 조회 성공 (Admin)       | 200 OK          | ⬜️ Pending            |
| API-AD-02 | GET    | `/api/admin/stats`             | 일반 유저의 대시보드 데이터 접근 시도 | 403 Forbidden   | ⬜️ Pending            |
| API-AD-03 | GET    | `/api/admin/orders`            | 전체 주문 리스트 조회 성공 (Admin)    | 200 OK          | ⬜️ Pending            |
| API-AD-04 | GET    | `/api/admin/orders/[id]`       | 특정 주문 상세 정보 조회 성공 (Admin) | 200 OK          | ⬜️ Pending            |
| API-AD-05 | POST   | `/api/admin/orders/[id]/retry` | AI 응답 생성 실패 건 재시도 요청 성공 | 200 OK          | ⬜️ Pending            |
| API-AD-06 | POST   | `/api/admin/orders/[id]/retry` | 완료된 주문에 대한 불필요한 재시도    | 400 Bad Request | ⬜️ Pending            |
| API-AD-07 | GET    | `/api/admin/users`             | 전체 회원 및 비회원 리스트 목록 조회  | 200 OK          | ⬜️ Pending            |
