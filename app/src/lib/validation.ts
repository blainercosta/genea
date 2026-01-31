/**
 * Validation utilities for Genea
 */

/**
 * List of common disposable email domains to block
 */
const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "throwaway.email",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "trashmail.com",
  "yopmail.com",
  "getnada.com",
];

/**
 * Common typos in email domains and their corrections
 */
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "hotmai.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "outloo.com": "outlook.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "iclou.com": "icloud.com",
  "icoud.com": "icloud.com",
  "icloud.con": "icloud.com",
};

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

/**
 * Validates an email address with comprehensive checks
 *
 * Checks performed:
 * - Basic format validation (RFC 5322 simplified)
 * - Domain has at least one dot
 * - TLD is at least 2 characters
 * - No consecutive dots
 * - Local part not empty
 * - Domain not empty
 * - Not a disposable email domain
 * - Suggests corrections for common typos
 */
export function validateEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  // Empty check
  if (!trimmed) {
    return { isValid: false, error: "Email é obrigatório" };
  }

  // Basic structure check
  if (!trimmed.includes("@")) {
    return { isValid: false, error: "Email deve conter @" };
  }

  const parts = trimmed.split("@");
  if (parts.length !== 2) {
    return { isValid: false, error: "Email inválido - muitos @" };
  }

  const [localPart, domain] = parts;

  // Local part validation
  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: "Email inválido - falta nome antes do @" };
  }

  if (localPart.length > 64) {
    return { isValid: false, error: "Email inválido - nome muito longo" };
  }

  // Check for invalid characters in local part
  const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  if (!localPartRegex.test(localPart)) {
    return { isValid: false, error: "Email contém caracteres inválidos" };
  }

  // Check for consecutive dots in local part
  if (localPart.includes("..")) {
    return { isValid: false, error: "Email inválido - pontos consecutivos" };
  }

  // Check local part doesn't start or end with dot
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return { isValid: false, error: "Email inválido - não pode começar ou terminar com ponto" };
  }

  // Domain validation
  if (!domain || domain.length === 0) {
    return { isValid: false, error: "Email inválido - falta domínio" };
  }

  // Domain must have at least one dot
  if (!domain.includes(".")) {
    return { isValid: false, error: "Email inválido - domínio incompleto" };
  }

  // Check for consecutive dots in domain
  if (domain.includes("..")) {
    return { isValid: false, error: "Email inválido - pontos consecutivos no domínio" };
  }

  // Extract TLD
  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];

  // TLD must be at least 2 characters
  if (tld.length < 2) {
    return { isValid: false, error: "Email inválido - domínio incompleto" };
  }

  // TLD should only contain letters
  if (!/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, error: "Email inválido - domínio inválido" };
  }

  // Domain parts should only contain valid characters
  const domainPartRegex = /^[a-zA-Z0-9-]+$/;
  for (const part of domainParts) {
    if (!domainPartRegex.test(part)) {
      return { isValid: false, error: "Email contém caracteres inválidos no domínio" };
    }
    // Parts shouldn't start or end with hyphen
    if (part.startsWith("-") || part.endsWith("-")) {
      return { isValid: false, error: "Email inválido - hífen mal posicionado no domínio" };
    }
  }

  // Check for disposable email domains
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { isValid: false, error: "Por favor, use um email permanente" };
  }

  // Check for common typos and suggest correction
  if (DOMAIN_TYPOS[domain]) {
    const correctedEmail = `${localPart}@${DOMAIN_TYPOS[domain]}`;
    return {
      isValid: true,
      suggestion: `Você quis dizer ${correctedEmail}?`,
    };
  }

  return { isValid: true };
}

/**
 * Simple email check for quick validation
 * Returns true if email passes basic validation
 */
export function isValidEmail(email: string): boolean {
  return validateEmail(email).isValid;
}

/**
 * Validates Brazilian CPF
 * Returns true if valid, false otherwise
 */
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) {
    return false;
  }

  // Check for all same digits
  if (/^(\d)\1+$/.test(cleaned)) {
    return false;
  }

  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let checkDigit = (sum * 10) % 11;
  if (checkDigit === 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleaned[9])) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  checkDigit = (sum * 10) % 11;
  if (checkDigit === 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleaned[10])) {
    return false;
  }

  return true;
}

/**
 * Validates Brazilian phone number
 * Accepts formats: (XX) XXXXX-XXXX, XX XXXXX-XXXX, XXXXXXXXXXX
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");

  // Must be 10 or 11 digits
  if (cleaned.length < 10 || cleaned.length > 11) {
    return false;
  }

  // If 11 digits, first digit of phone should be 9 (mobile)
  if (cleaned.length === 11 && cleaned[2] !== "9") {
    return false;
  }

  // DDD should be between 11 and 99
  const ddd = parseInt(cleaned.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return false;
  }

  return true;
}

/**
 * PIX Key validation result
 */
export interface PixKeyValidationResult {
  isValid: boolean;
  type?: "cpf" | "email" | "phone" | "random" | "cnpj";
  error?: string;
}

/**
 * Validates a PIX key
 * Supports: CPF, CNPJ, Email, Phone, Random key (EVP)
 */
export function validatePixKey(key: string): PixKeyValidationResult {
  const trimmed = key.trim();

  if (!trimmed) {
    return { isValid: false, error: "Chave PIX é obrigatória" };
  }

  // Max length for PIX keys is 77 characters
  if (trimmed.length > 77) {
    return { isValid: false, error: "Chave PIX muito longa" };
  }

  // Check for email format
  if (trimmed.includes("@")) {
    if (isValidEmail(trimmed)) {
      return { isValid: true, type: "email" };
    }
    return { isValid: false, error: "Email inválido como chave PIX" };
  }

  // Check for random key (EVP) - UUID format
  const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  if (uuidRegex.test(trimmed)) {
    return { isValid: true, type: "random" };
  }

  // Clean numeric-only input
  const cleaned = trimmed.replace(/\D/g, "");

  // Check for CPF (11 digits)
  if (cleaned.length === 11) {
    if (isValidCPF(cleaned)) {
      return { isValid: true, type: "cpf" };
    }
    // Could also be a phone number
    if (isValidPhone(cleaned)) {
      return { isValid: true, type: "phone" };
    }
    return { isValid: false, error: "CPF ou telefone inválido" };
  }

  // Check for CNPJ (14 digits)
  if (cleaned.length === 14) {
    if (isValidCNPJ(cleaned)) {
      return { isValid: true, type: "cnpj" };
    }
    return { isValid: false, error: "CNPJ inválido" };
  }

  // Check for phone (10 digits - landline)
  if (cleaned.length === 10) {
    if (isValidPhone(cleaned)) {
      return { isValid: true, type: "phone" };
    }
    return { isValid: false, error: "Telefone inválido" };
  }

  return { isValid: false, error: "Formato de chave PIX não reconhecido" };
}

/**
 * Simple PIX key validation check
 */
export function isValidPixKey(key: string): boolean {
  return validatePixKey(key).isValid;
}

/**
 * Validates Brazilian CNPJ
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, "");

  if (cleaned.length !== 14) {
    return false;
  }

  // Check for all same digits
  if (/^(\d)\1+$/.test(cleaned)) {
    return false;
  }

  // Validate first check digit
  let sum = 0;
  let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * weight[i];
  }
  let checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (checkDigit !== parseInt(cleaned[12])) {
    return false;
  }

  // Validate second check digit
  sum = 0;
  weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned[i]) * weight[i];
  }
  checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (checkDigit !== parseInt(cleaned[13])) {
    return false;
  }

  return true;
}
