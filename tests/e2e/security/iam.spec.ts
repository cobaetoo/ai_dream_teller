import { test, expect } from "@playwright/test";

test.describe("Security IAM (Identity & Access Management) E2E Tests", () => {
  test("RLS & 권한 격리: 비인가 권한(비로그인)으로 내 꿈 조회 API(/api/dreams?type=my) 호출 시 401 차단", async ({
    request,
  }) => {
    // API 직접 호출
    const response = await request.get("/api/dreams?type=my");

    // Next.js 라우트 핸들러 설계에 따라 401 Unauthorized 또는 권한 없음에 대한 에러 코드를 반환해야 합니다.
    expect(response.status()).toBe(401);
  });

  test("RLS & 권한 격리: 비인가 권한으로 관리자 데이터 API(/api/admin/stats) 호출 시 401/403 차단", async ({
    request,
  }) => {
    const response = await request.get("/api/admin/stats");

    // 관리자 엔드포인트는 Unauthorized(401) 혹은 Forbidden(403) 되어야 함
    expect([401, 403, 404]).toContain(response.status());
  });

  test("API Authentication: 조작된 쿠키/토큰으로 내 정보 API(/api/users/me) 호출 시 접근 거부 확인", async ({
    request,
  }) => {
    // 잘못된(조작된) 세션 쿠키 삽입
    const response = await request.get("/api/users/me", {
      headers: {
        Cookie: "sb-auth-token=fake-manipulated-token-data-12345",
      },
    });

    // 유효하지 않은 토큰이므로 401 Unauthorized 이어야 함
    expect(response.status()).toBe(401);
  });
});
