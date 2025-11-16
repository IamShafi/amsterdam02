export function generateBookingId(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WEB-${timestamp}-${randomString}`;
}
