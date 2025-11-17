/**
 * ✅ SECURITY FIX: HTML sanitization helper
 * XSS va HTML injection hujumlaridan himoya qilish uchun
 * 
 * NOTE: Production uchun 'sanitize-html' kutubxonasini o'rnatish tavsiya etiladi:
 * npm install sanitize-html
 * npm install --save-dev @types/sanitize-html
 */

/**
 * HTML kontentni sanitize qilish - xavfli taglar va attributelarni olib tashlash
 * @param html - Sanitize qilinadigan HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let sanitized = html;

  // Xavfli script taglarini olib tashlash
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Xavfli event handlerlarni olib tashlash (onerror, onclick, onload, va h.k.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // javascript: protokollarni olib tashlash
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // data: protokollardagi xavfli kontentlarni tekshirish
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  // iframe taglarini olib tashlash (agar kerak bo'lsa)
  // sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Object va embed taglarini olib tashlash
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  
  // Style taglaridagi expression() va javascript: ni olib tashlash
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  
  return sanitized.trim();
}

/**
 * Text fieldlarni sanitize qilish - HTML taglarini olib tashlash
 * @param text - Sanitize qilinadigan text
 * @returns Plain text
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Barcha HTML taglarini olib tashlash
  return text.replace(/<[^>]*>/g, '').trim();
}

