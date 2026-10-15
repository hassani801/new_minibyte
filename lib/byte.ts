/**
 * Utility functions for binary bit conversion for the minibyte brand identity.
 * 
 * Brand logic:
 * - The mark is ONE BYTE that spells the letter "m" (ASCII 109 = 01101101).
 * - 8 dots = 8 bits. Bit 1 = LARGE dot, bit 0 = SMALL dot.
 * - The name "minibyte" has 8 letters = one letter per bit (8x8 bit grid).
 */

/**
 * Converts a number (0-255) into an array of 8 booleans (MSB first).
 * @param value Byte value between 0 and 255.
 * @returns Array of 8 booleans representing bits from MSB (index 0) to LSB (index 7).
 */
export function toBits(value: number): boolean[] {
  const normalized = Math.max(0, Math.min(255, Math.floor(value)));
  const bits: boolean[] = [];
  for (let i = 7; i >= 0; i--) {
    bits.push(((normalized >> i) & 1) === 1);
  }
  return bits;
}

/**
 * Converts a single character into an 8-bit boolean array based on its ASCII code.
 * @param ch The character to convert.
 * @returns Array of 8 booleans for the character's ASCII byte.
 */
export function charBits(ch: string): boolean[] {
  return toBits(ch.charCodeAt(0));
}

/**
 * Brand name string consisting of exactly 8 letters.
 */
export const NAME = "minibyte";

/**
 * 8x8 bit matrix for each character of "minibyte".
 * Rows:
 * - m: 01101101 (109)
 * - i: 01101001 (105)
 * - n: 01101110 (110)
 * - i: 01101001 (105)
 * - b: 01100010 (98)
 * - y: 01111001 (121)
 * - t: 01110100 (116)
 * - e: 01100101 (101)
 */
export const NAME_BITS: boolean[][] = NAME.split("").map(charBits);
