export function getUserIdFromToken(token: string): string | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.sub || decodedPayload.userId || null;
  } catch (err) {
    console.error("JWT 파싱 실패:", err);
    return null;
  }
}
