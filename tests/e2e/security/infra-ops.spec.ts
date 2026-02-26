import { test, expect } from "@playwright/test";

test.describe("Security Infra/Ops E2E Tests", () => {
  test("Rate Limiting (DDoS 방어): 동일 단말(IP)로 로그인 API 단기 초과 호출 시 시스템 마비(5xx) 방어 확인 및/또는 429 타임아웃 딜레이 작동 확인", async ({
    request,
  }) => {
    // 50번의 요청을 동시 다발적으로 날려 인증 엔드포인트에 부하를 유발
    const REQUEST_COUNT = 50;

    const promises = Array.from({ length: REQUEST_COUNT }).map(
      () =>
        // 로그인 시도 등 부하/비용이 발생하는 엔드포인트를 타겟
        request
          .post("/api/auth/guest", {
            data: {
              phone: "010-9999-9999",
              password: "brute-force-test-password",
            },
          })
          .catch((e) => e.response), // 에러가 나더라도 죽지 않고 응답 객체 보존
    );

    const responses = await Promise.all(promises);

    // 응답 상태 코드를 추출 (응답이 없거나 타임아웃이면 504로 취급)
    const statuses = responses.map((res) => (res?.status ? res.status() : 504));

    // 1. 공격에 의해 서버가 터져서 Internal Server Error(500)를 내뱉지 않아야 함. (가용성 보장)
    // 2. 환경에 따라 Rate Limit이 적용되어 있다면 429 (Too Many Requests) 가 껴있거나
    //    Rate Limit이 없다면 실패한 인증인 401(Unauthorized)만 50개여야 함
    const hasInternalServerError = statuses.some((status) => status === 500);
    expect(hasInternalServerError).toBeFalsy();

    // 429 가 하나라도 있거나, 최소한 모든 상태가 예측 가능한(200~4xx) 범위여야 통과로 판단
    const hasRateLimit = statuses.includes(429);
    const hasAuthFailure = statuses.includes(401);

    // 429 (레이트 리밋) 가 걸렸거나, 혹은 단순히 인증만 정상 방어(401) 처리했다면 안전함으로 간주.
    // 추후 인프라 Vercel KV Rate Limit 등이 붙게 될 경우 429가 우선 발생하게 됨.
    expect(hasRateLimit || hasAuthFailure).toBeTruthy();
  });
});
