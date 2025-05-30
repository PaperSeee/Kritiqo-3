export function isValidUUID(str: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export function validateUserId(userId: string | undefined): string {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  return userId;
}
