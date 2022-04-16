export const unescape = (escaped: string): string => {
  return escaped
    .replace(/\\\n/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\([0-7]{1,3})/g, (_, x) => String.fromCharCode(parseInt(x, 8)))
    .replace(/\\/g, "\\");
};
