import { decodeAscii85 } from "./decodeAscii85";
import { parseNumber } from "./parseNumber";
import { Tokenizer } from "./types";
import { unescape } from "./unescape";

const irregularCharactersRegExp = /[()<>{}[\]/%\s]/;

export const tokenizer: Tokenizer<string> = async function* (code) {
  while (true) {
    code = code.trim();

    if (code.length === 0) {
      break;
    }

    if (code.startsWith("<~")) {
      const i = code.indexOf("~>");

      if (i === -1) {
        throw new Error();
      }

      const value = decodeAscii85(code.slice(2, i));

      if (value === null) {
        throw new Error();
      }

      yield { type: "STRING", value };
      code = code.slice(i + 2);
      continue;
    }

    switch (code[0]) {
      case "%": {
        code = code.slice(1);
        const i = code.indexOf("\n");

        if (i === -1) {
          yield { type: "COMMENT", value: code };
          return;
        }

        yield { type: "COMMENT", value: code.slice(0, i) };
        code = code.slice(i + 1);
        continue;
      }

      case "(": {
        code = code.slice(1);
        let value = "";

        for (let k = 1; k > 0; ) {
          const i = code.search(/[()]/);

          if (i === -1) {
            throw new Error();
          }

          if (i === 0 || code[i - 1] !== "\\") {
            k += code[i] === ")" ? -1 : 1;
          }

          value += code.slice(0, i + 1);
          code = code.slice(i + 1);
        }

        yield { type: "STRING", value: unescape(value.slice(0, -1)) };
        continue;
      }

      case "<": {
        code = code.slice(1);
        let value = "";

        while (code[0] !== ">") {
          if (/\s/.test(code[0])) {
            code = code.slice(1);
            continue;
          }

          const firstChar = code[0];
          code = code.slice(1);

          while (/\s/.test(code[0])) {
            code = code.slice(1);
          }

          if (code[0] === ">") {
            value += String.fromCharCode(parseInt(`${firstChar}0`, 16));
            break;
          }

          value += String.fromCharCode(parseInt(firstChar + code[0], 16));
          code = code.slice(1);
        }

        yield { type: "STRING", value };
        code = code.slice(1);
        continue;
      }

      case "/": {
        code = code.slice(1);
        const i = code.search(irregularCharactersRegExp);

        if (i === -1) {
          yield { type: "LITERAL_NAME", value: code };
          return;
        }

        yield { type: "LITERAL_NAME", value: code.slice(0, i) };
        code = code.slice(i);
        continue;
      }

      case "[": {
        yield { type: "OPEN_SQUARE_BRACKET" };
        code = code.slice(1);
        continue;
      }

      case "]": {
        yield { type: "CLOSE_SQUARE_BRACKET" };
        code = code.slice(1);
        continue;
      }

      case "{": {
        yield { type: "OPEN_CURLY_BRACKET" };
        code = code.slice(1);
        continue;
      }

      case "}": {
        yield { type: "CLOSE_CURLY_BRACKET" };
        code = code.slice(1);
        continue;
      }
    }

    const i = code.search(irregularCharactersRegExp);

    if (i === -1) {
      const number = parseNumber(code);
      yield number === null
        ? { type: "EXECUTABLE_NAME", value: code }
        : { type: "NUMBER", value: number };
      return;
    }

    const literal = code.slice(0, i);
    const number = parseNumber(literal);
    yield number === null
      ? { type: "EXECUTABLE_NAME", value: literal }
      : { type: "NUMBER", value: number };
    code = code.slice(i);
  }
};
