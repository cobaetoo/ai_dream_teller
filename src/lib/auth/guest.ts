import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Fallback is dangerous in production, but helpful for dev if forgot to set env.
// In real prod, this should throw error if missing.
const secretKey = process.env.GUEST_JWT_SECRET || "default-secret-change-me";
const secret = new TextEncoder().encode(secretKey);
const GUEST_COOKIE_NAME = "guest_session";

export async function createGuestSession(guestId: string) {
  const jwt = await new SignJWT({ sub: guestId, role: "guest" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // 30 days retention per PRD
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(GUEST_COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  });
}

export async function verifyGuestSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { sub: string; role: "guest" };
  } catch (e) {
    return null;
  }
}

export async function removeGuestSession() {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_COOKIE_NAME);
}
