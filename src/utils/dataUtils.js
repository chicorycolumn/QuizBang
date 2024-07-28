const strip = (s) => {
  return s || s === 0
    ? s
        .toString()
        .toLowerCase()
        // .split("").filter((char) => /\p{Script=Latin}/u.test(char)).join("")
        .trim()
    : "";
};

export const validateAnswer = (proposedStr, correctArr, halfCorrectArr) => {
  proposedStr = strip(proposedStr);

  if (correctArr.map((c) => strip(c)).includes(proposedStr)) {
    return 1;
  }

  if (
    halfCorrectArr &&
    halfCorrectArr.map((c) => strip(c)).includes(proposedStr)
  ) {
    return 0.5;
  }

  return 0;
};
