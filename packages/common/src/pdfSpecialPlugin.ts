import { Plugin } from "./types";

export const pdfSpecialPlugin: Plugin = ({ x }) => {
  const [name] = x.match(/^(?:pdf:(.*?) )/) || [null];
  const isEqual = (x: unknown) => x === name;

  if (name === null) {
    return null;
  }

  if (aka.ann.some(isEqual)) {
    return null;
  }

  return null;
};

const aka = {
  ann: ["ann", "annot", "annotate", "annotation"],
  bann: ["bann", "bannot", "beginann"],
  eann: ["eann", "eannot", "endann"],
};
