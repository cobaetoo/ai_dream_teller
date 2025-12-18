"use server";

export async function guestLoginAction(prevState: any, formData: FormData) {
  // TODO: Implement actual guest login logic with Supabase
  // This is a placeholder action
  const phone = formData.get("phone");
  const password = formData.get("password");

  if (!phone || !password) {
    return { success: false, message: "전화번호와 비밀번호를 입력해주세요." };
  }

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock success for testing (only if phone is '01012345678')
  if (phone === "01012345678" && password === "1234") {
    return { success: true, message: "로그인 성공" };
  }

  return { success: false, message: "일치하는 정보가 없습니다." };
}
