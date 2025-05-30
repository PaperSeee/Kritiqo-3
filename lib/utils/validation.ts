export function isValidUUID(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export function validateUserId(userId: string | undefined): string {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error('User ID must be a non-empty string');
  }
  
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format - must be a valid UUID');
  }
  
  return userId;
}

export function validateOptionalUUID(id: string | undefined | null): string | null {
  if (!id) return null;
  if (!isValidUUID(id)) {
    throw new Error(`Invalid UUID format: ${id}`);
  }
  return id;
}
