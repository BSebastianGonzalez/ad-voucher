const COLOMBIA_COUNTRY_CODE = '57';
const COLOMBIA_NATIONAL_LENGTH = 10;
const COLOMBIA_FULL_LENGTH = 12;

export interface PhoneNormalizationResult {
  isValid: boolean;
  /** 12-digit Colombian number (`57` + 10 digits) when valid, otherwise cleaned digits. */
  normalized: string;
  error?: string;
}

/**
 * Strips non-digit characters, prepends `57` if omitted, and validates 12 digits for Colombia.
 */
export function normalizeColombianPhone(raw: string): PhoneNormalizationResult {
  const digits = raw.replace(/\D/g, '');

  if (!digits) {
    return {
      isValid: false,
      normalized: '',
      error: 'Ingresa el celular del cliente',
    };
  }

  let withCountryCode = digits;
  if (!digits.startsWith(COLOMBIA_COUNTRY_CODE) && digits.length === COLOMBIA_NATIONAL_LENGTH) {
    withCountryCode = `${COLOMBIA_COUNTRY_CODE}${digits}`;
  }

  const isValid =
    withCountryCode.startsWith(COLOMBIA_COUNTRY_CODE) &&
    withCountryCode.length === COLOMBIA_FULL_LENGTH;

  if (!isValid) {
    return {
      isValid: false,
      normalized: digits,
      error: 'Revisa el número: debe tener 10 dígitos',
    };
  }

  return {
    isValid: true,
    normalized: withCountryCode,
  };
}

/**
 * Formats a 10-digit Colombian phone number as `300 123 4567` for display inside the receipt.
 */
export function formatPhoneForMessage(raw: string): string {
  const result = normalizeColombianPhone(raw);
  if (!result.isValid) {
    return raw.trim();
  }
  const national = result.normalized.slice(COLOMBIA_COUNTRY_CODE.length);
  return `${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
}
