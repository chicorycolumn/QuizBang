const strip = (s, modifiers) => {
  if (modifiers.ignorePunctuation) {
    return s || s === 0
      ? s
          .toString()
          .toLowerCase()
          .split("")
          .filter((char) => /\p{Script=Latin}/u.test(char))
          .join("")
          .trim()
      : "";
  }

  if (modifiers.ignorePunctuationAndDiacritics) {
    return s || s === 0
      ? s
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split("")
          .filter((char) => /\p{Script=Latin}/u.test(char))
          .join("")
          .trim()
      : "";
  }

  if (modifiers.ignorePunctuationAndDiacritics) {
    if (typeof s === "string") {
      if (s.split("").includes("(")) {
        let cleaned = "";
        let ignoring = false;
        s.split("").forEach((char) => {
          if (!ignoring && !"()".includes(char)) {
            cleaned += char;
          }
          if (char === "(") {
            ignoring = true;
          }
          if (ignoring && char === ")") {
            ignoring = false;
          }
        });
        s = cleaned;
      }
    }

    return s || s === 0
      ? s
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split("")
          .filter((char) => /\p{Script=Latin}/u.test(char))
          .join("")
          .trim()
      : "";
  }

  return s || s === 0 ? s.toString().toLowerCase().trim() : "";
};

export const validateAnswer = (
  proposedStr,
  correctArr,
  halfCorrectArr,
  modifiers
) => {
  proposedStr = strip(proposedStr, modifiers);

  if (correctArr.map((c) => strip(c, modifiers)).includes(proposedStr)) {
    return 1;
  }

  if (
    halfCorrectArr &&
    halfCorrectArr.map((c) => strip(c, modifiers)).includes(proposedStr)
  ) {
    return 0.5;
  }

  return 0;
};
