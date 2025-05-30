/**
 * Validation stricte des UUIDs pour éviter les erreurs PostgreSQL
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Valide qu'une chaîne est un UUID valide
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Vérifie si une chaîne est un UUID valide (v4 ou autre)
 */
export function isUUID(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  return UUID_REGEX.test(str);
}

/**
 * Valide et retourne un UUID, lance une erreur si invalide
 */
export function validateUserId(userId: string | undefined): string {
  if (!userId) {
    throw new Error('User ID manquant')
  }
  
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error('User ID must be a non-empty string');
  }
  
  if (!isUUID(userId)) {
    throw new Error(`User ID invalide: ${userId}`)
  }
  
  return userId
}

export function validateOptionalUUID(id: string | undefined | null): string | null {
  if (!id) return null;
  if (!UUID_REGEX.test(id)) {
    throw new Error(`Invalid UUID format: ${id}`);
  }
  return id;
}

export class UUIDValidationError extends Error {
  constructor(invalidValue: any) {
    super(`Invalid UUID format: ${invalidValue}. Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`);
    this.name = 'UUIDValidationError';
  }
}
