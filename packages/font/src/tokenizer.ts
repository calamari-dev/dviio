import { decodeAscii85 } from "./decodeAscii85";
import { parseNumber } from "./parseNumber";
import { Tokenizer } from "./types";
import { unescape } from "./unescape";

const irregularCharactersRegExp = /[()<>{}[\]/%\s]/;

export const tokenizer: Tokenizer<string> = async function* (program) {
  while (true) {
    program = program.trim();

    if (program.length === 0) {
      break;
    }

    if (program.startsWith("<~")) {
      const i = program.indexOf("~>");

      if (i === -1) {
        throw new Error();
      }

      const value = decodeAscii85(program.slice(2, i));

      if (value === null) {
        throw new Error();
      }

      yield { type: "STRING", value };
      program = program.slice(i + 2);
      continue;
    }

    switch (program[0]) {
      case "%": {
        program = program.slice(1);
        const i = program.indexOf("\n");

        if (i === -1) {
          yield { type: "COMMENT", value: program };
          return;
        }

        yield { type: "COMMENT", value: program.slice(0, i) };
        program = program.slice(i + 1);
        continue;
      }

      case "(": {
        program = program.slice(1);
        let value = "";

        for (let k = 1; k > 0; ) {
          const i = program.search(/[()]/);

          if (i === -1) {
            throw new Error();
          }

          if (i === 0 || program[i - 1] !== "\\") {
            k += program[i] === ")" ? -1 : 1;
          }

          value += program.slice(0, i + 1);
          program = program.slice(i + 1);
        }

        yield { type: "STRING", value: unescape(value.slice(0, -1)) };
        continue;
      }

      case "<": {
        program = program.slice(1);
        let value = "";

        while (program[0] !== ">") {
          if (/\s/.test(program[0])) {
            program = program.slice(1);
            continue;
          }

          const firstChar = program[0];
          program = program.slice(1);

          while (/\s/.test(program[0])) {
            program = program.slice(1);
          }

          if (program[0] === ">") {
            value += String.fromCharCode(parseInt(`${firstChar}0`, 16));
            break;
          }

          value += String.fromCharCode(parseInt(firstChar + program[0], 16));
          program = program.slice(1);
        }

        program = program.slice(1);
        yield { type: "STRING", value };
        continue;
      }

      case "/": {
        program = program.slice(1);
        const i = program.search(irregularCharactersRegExp);

        if (i === -1) {
          yield { type: "LITERAL_NAME", value: program };
          return;
        }

        yield { type: "LITERAL_NAME", value: program.slice(0, i) };
        program = program.slice(i);
        continue;
      }

      case "[": {
        program = program.slice(1);
        yield { type: "OPEN_SQUARE_BRACKET" };
        continue;
      }

      case "]": {
        program = program.slice(1);
        yield { type: "CLOSE_SQUARE_BRACKET" };
        continue;
      }

      case "{": {
        program = program.slice(1);
        yield { type: "OPEN_CURLY_BRACKET" };
        continue;
      }

      case "}": {
        program = program.slice(1);
        yield { type: "CLOSE_CURLY_BRACKET" };
        continue;
      }

      default: {
        const i = program.search(irregularCharactersRegExp);

        if (i === -1) {
          const number = parseNumber(program);
          yield number === null
            ? { type: "EXECUTABLE_NAME", value: program }
            : { type: "NUMBER", value: number };
          return;
        }

        const literal = program.slice(0, i);
        const number = parseNumber(literal);
        yield number === null
          ? { type: "EXECUTABLE_NAME", value: literal }
          : { type: "NUMBER", value: number };
        program = program.slice(i);
        continue;
      }
    }
  }
};
