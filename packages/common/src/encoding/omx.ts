import type { Encoding } from "./types";

/*\
 * 以下は texucsmapping Package (https:// github.com/zr-tex8r/texucsmapping) の
 * ファイル /bx-omx.txt を基に，一部改変を加えて作成した．
\*/

export const omx: Readonly<Encoding> = {
  0x00: 0x0028, // (parenleft)LEFT PARENTHESIS
  0x01: 0x0029, // (parenright)RIGHT PARENTHESIS
  0x02: 0x005b, // (bracketleft)LEFT SQUARE BRACKET
  0x03: 0x005d, // (bracketright)RIGHT SQUARE BRACKET
  0x04: 0x230a, // LEFT FLOOR
  0x05: 0x230b, // RIGHT FLOOR
  0x06: 0x2308, // LEFT CEILING
  0x07: 0x2309, // RIGHT CEILING
  0x08: 0x007b, // (braceleft)LEFT CURLY BRACKET
  0x09: 0x007d, // (braceright)RIGHT CURLY BRACKET
  0x0a: 0x2329, // (angleleft)LEFT-POINTING ANGLE BRACKET
  0x0b: 0x232a, // (angleright)RIGHT-POINTING ANGLE BRACKET
  0x0c: 0x2223, // DIVIDES
  0x0d: 0x2225, // PARALLEL TO
  0x0e: 0x002f, // (slash)SOLIDUS
  0x0f: 0x005c, // (backslash)REVERSE SOLIDUS
  0x3a: 0x27ee, // MATHEMATICAL LEFT FLATTENED PARENTHESIS
  0x3b: 0x27ef, // MATHEMATICAL RIGHT FLATTENED PARENTHESIS
  0x3c: 0xe9a2, // (arrowvert)<PUA>
  0x3d: 0xe9a3, // (Arrowvert)<PUA>
  0x3e: 0xe9a4, // (bracevert)<PUA>
  0x3f: 0x2195, // (arrowupdn)UP DOWN ARROW
  0x40: 0x23b0, // UPPER LEFT OR LOWER RIGHT CURLY BRACKET SECTION
  0x41: 0x23b1, // UPPER RIGHT OR LOWER LEFT CURLY BRACKET SECTION
  0x46: 0x2a06, // N-ARY SQUARE UNION OPERATOR
  0x48: 0x222e, // CONTOUR INTEGRAL
  0x4a: 0x2a00, // N-ARY CIRCLED DOT OPERATOR
  0x4c: 0x2a01, // N-ARY CIRCLED PLUS OPERATOR
  0x4e: 0x2a02, // N-ARY CIRCLED TIMES OPERATOR
  0x50: 0x2211, // (summation)N-ARY SUMMATION
  0x51: 0x220f, // (product)N-ARY PRODUCT
  0x52: 0x222b, // (integral)INTEGRAL
  0x53: 0x22c3, // N-ARY UNION
  0x54: 0x22c2, // N-ARY INTERSECTION
  0x55: 0x2a04, // N-ARY UNION OPERATOR WITH PLUS
  0x56: 0x22c0, // N-ARY LOGICAL AND
  0x57: 0x22c1, // N-ARY LOGICAL OR
  0x60: 0x2210, // N-ARY COPRODUCT
  0x70: 0x221a, // (radical)SQUARE ROOT
  0x77: 0x21d5, // UP DOWN DOUBLE ARROW
  0x78: 0x2191, // (arrowup)UPWARDS ARROW
  0x79: 0x2193, // (arrowdown)DOWNWARDS ARROW
  0x7e: 0x21d1, // (arrowdblup)UPWARDS DOUBLE ARROW
  0x7f: 0x21d3, // (arrowdbldown)DOWNWARDS DOUBLE ARROW
};
