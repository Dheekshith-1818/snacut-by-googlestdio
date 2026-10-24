export interface CreditState {
  dailyLimit: number;
  dailyUsed: number;
  purchasedCredits: number;
  reservedCredits: number;
}

export interface ReservationResult {
  allowed: boolean;
  source?: 'daily_quota' | 'purchased_credits';
  newDailyUsed?: number;
  newPurchasedCredits?: number;
  newReservedCredits?: number;
  error?: string;
}

/**
 * Pure credit reservation logic
 * Checks daily limit first, then purchased credit pool, locking a reservation
 */
export function reserveCredit(state: CreditState): ReservationResult {
  const dailyRemaining = Math.max(0, state.dailyLimit - state.dailyUsed);

  // If daily quota remains, reserve against daily quota
  if (dailyRemaining > 0) {
    return {
      allowed: true,
      source: 'daily_quota',
      newDailyUsed: state.dailyUsed,
      newPurchasedCredits: state.purchasedCredits,
      newReservedCredits: state.reservedCredits + 1,
    };
  }

  // Otherwise, attempt to reserve against purchased credits
  const availablePurchased = state.purchasedCredits - state.reservedCredits;
  if (availablePurchased > 0) {
    return {
      allowed: true,
      source: 'purchased_credits',
      newDailyUsed: state.dailyUsed,
      newPurchasedCredits: state.purchasedCredits,
      newReservedCredits: state.reservedCredits + 1,
    };
  }

  return {
    allowed: false,
    error: 'INSUFFICIENT_CREDITS',
  };
}

/**
 * Pure commit logic upon successful job completion
 */
export function commitCredit(
  state: CreditState,
  source: 'daily_quota' | 'purchased_credits'
): CreditState {
  if (source === 'daily_quota') {
    return {
      ...state,
      dailyUsed: state.dailyUsed + 1,
      reservedCredits: Math.max(0, state.reservedCredits - 1),
    };
  }

  return {
    ...state,
    purchasedCredits: Math.max(0, state.purchasedCredits - 1),
    reservedCredits: Math.max(0, state.reservedCredits - 1),
  };
}

/**
 * Pure release logic upon job failure
 */
export function releaseCredit(state: CreditState): CreditState {
  return {
    ...state,
    reservedCredits: Math.max(0, state.reservedCredits - 1),
  };
}

/**
 * Pure file validation rules
 */
export function validateImageFileMetadata(params: {
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedMimeTypes.includes(params.mimeType.toLowerCase())) {
    return { valid: false, error: 'INVALID_MIME_TYPE' };
  }

  const maxBytes = 10 * 1024 * 1024; // 10MB
  if (params.sizeBytes > maxBytes) {
    return { valid: false, error: 'FILE_TOO_LARGE' };
  }

  if (params.width && params.width > 5000) {
    return { valid: false, error: 'WIDTH_EXCEEDS_5000' };
  }

  if (params.height && params.height > 5000) {
    return { valid: false, error: 'HEIGHT_EXCEEDS_5000' };
  }

  return { valid: true };
}
